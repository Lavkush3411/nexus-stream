/** Hosts allowed through the embed proxy (prevents open-proxy abuse). */
export const EMBED_ALLOWED_HOSTS = new Set([
  "vidsrcme.su",
  "vidsrc.me",
  "vidsrc-embed.ru",
  "vidsrc-embed.su",
  "vsrc.su",
  "vsembed.ru",
  "vidsrc.to",
  "vidsrc.in",
  "vidsrc.net",
  "cloudorchestranova.com",
  "cloudnestra.com",
  "whisperingauroras.com",
]);

export function isAllowedEmbedUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return EMBED_ALLOWED_HOSTS.has(hostname.replace(/^www\./, ""));
  } catch {
    return false;
  }
}

/**
 * Rewrite relative asset URLs to absolute against the upstream origin.
 * We intentionally do NOT inject a <base> tag — that breaks our /api/embed-proxy paths.
 */
export function rewriteRelativeUrls(html: string, upstreamOrigin: string): string {
  return html
    .replace(
      /(\s(?:src|href|action)=["'])(\/(?!\/)[^"']*)(["'])/gi,
      `$1${upstreamOrigin}$2$3`
    )
    .replace(
      /(\s(?:src|href|action)=["'])(\/\/[^"']*)(["'])/gi,
      `$1https:$2$3`
    );
}

/** Strip known ad / anti-devtool / tracker scripts from proxied HTML. */
export function stripAggressiveScripts(html: string): string {
  return html
    .replace(/<script[^>]*disable-devtool[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(
      /<script[^>]*src=["'][^"']*disable-devtool[^"']*["'][^>]*>\s*<\/script>/gi,
      ""
    )
    .replace(/<script[^>]*histats[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<div[^>]*id=["']AdWidgetContainer["'][^>]*>[\s\S]*?<\/div>/gi, "")
    .replace(/<div[^>]*id=["']ad720["'][^>]*>[\s\S]*?<\/div>/gi, "")
    .replace(/<div[^>]*id=["']onexbet["'][^>]*>[\s\S]*?<\/div>/gi, "")
    .replace(
      /<script[^>]*src=["'][^"']*\/sbx\.js[^"']*["'][^>]*>\s*<\/script>/gi,
      ""
    );
}

/**
 * Lightweight in-page guard — blocks popups and hijack clicks only.
 * Does NOT wrap fetch/XHR (that broke Cloudflare rum + player API calls).
 */
export function buildEmbedGuardScript(upstreamOrigin: string): string {
  const upstream = JSON.stringify(upstreamOrigin);

  return `<script>(function(){
if(window.__nexusGuard)return;window.__nexusGuard=true;
var upstream=${upstream};
function isAdOrTracker(href){try{var p=new URL(href,location.href).pathname;return /\\/cdn-cgi\\//.test(p)||/rum|beacon|analytics|histats/i.test(href);}catch(e){return false;}}
function isExternal(href){try{var u=new URL(href,location.href);if(u.origin===location.origin)return false;if(u.origin===upstream)return false;if(isAdOrTracker(href))return true;return u.origin!==upstream;}catch(e){return true;}}
var fakeWin={closed:false,close:function(){this.closed=true;},focus:function(){},blur:function(){},postMessage:function(){},moveTo:function(){},resizeTo:function(){},location:{href:'about:blank',assign:function(){},replace:function(){},reload:function(){}},document:{write:function(){},writeln:function(){},open:function(){return fakeWin;},close:function(){}},history:{back:function(){},forward:function(){},go:function(){}}};
window.open=function(){return fakeWin;};
var _submit=HTMLFormElement.prototype.submit;
HTMLFormElement.prototype.submit=function(){var t=(this.getAttribute('target')||'').toLowerCase();if(t==='_blank'||t==='_top'||t==='_parent')return;return _submit.apply(this,arguments);};
document.addEventListener('click',function(e){var el=e.target;while(el&&el!==document){if(el.tagName==='A'&&el.href){var t=(el.getAttribute('target')||'').toLowerCase();if(t==='_blank'||t==='_top'||t==='_parent'){e.preventDefault();e.stopImmediatePropagation();return;}if(isExternal(el.href)&&!el.closest('#the_frame,#player_iframe,.servers')){e.preventDefault();e.stopImmediatePropagation();return;}}el=el.parentElement;}},true);
try{var _assign=location.assign&&location.assign.bind(location);var _replace=location.replace&&location.replace.bind(location);if(_assign)location.assign=function(u){if(!isExternal(u))_assign(u);};if(_replace)location.replace=function(u){if(!isExternal(u))_replace(u);};}catch(e){}
})();</script>`;
}

export const EMBED_GUARD_CSS = `<style id="nexus-guard-css">
#AdWidgetContainer,#ad720,#onexbet,#top_buttons_parent,.ad_container{display:none!important;visibility:hidden!important;pointer-events:none!important;height:0!important;overflow:hidden!important;}
</style>`;

export function toProxiedEmbedUrl(embedUrl: string): string {
  return `/api/embed-proxy?url=${encodeURIComponent(embedUrl)}`;
}
