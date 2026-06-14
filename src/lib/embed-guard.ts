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

const AD_SCRIPT_RE =
  /ads?keeper|adsterra|effectivecpm|profitabledisplay|highperformanceformat|popunder|popads|doubleclick|googlesyndication|histats|disable-devtool|exoclick|clickadu|propellerads|onexbet|betting|casino|sbx\.js/i;

export function isAllowedEmbedUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return EMBED_ALLOWED_HOSTS.has(hostname.replace(/^www\./, ""));
  } catch {
    return false;
  }
}

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
  let out = html
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

  out = out.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, (tag) =>
    AD_SCRIPT_RE.test(tag) ? "" : tag
  );
  out = out.replace(
    /<script\b[^>]*src=["'][^"']+["'][^>]*>\s*<\/script>/gi,
    (tag) => (AD_SCRIPT_RE.test(tag) ? "" : tag)
  );

  return out;
}

export function buildEmbedGuardScript(upstreamOrigin: string): string {
  const upstream = JSON.stringify(upstreamOrigin);

  return `<script>(function(){
if(window.__nexusGuard)return;window.__nexusGuard=true;
var upstream=${upstream};
var adRe=${AD_SCRIPT_RE.toString()};
function isAdOrTracker(href){try{var u=new URL(href,location.href);if(adRe.test(href)||adRe.test(u.hostname))return true;var p=u.pathname;return /\\/cdn-cgi\\//.test(p)||/rum|beacon|analytics|histats/i.test(href);}catch(e){return true;}}
function isExternal(href){try{var u=new URL(href,location.href);if(u.origin===location.origin)return false;if(u.origin===upstream)return false;if(isAdOrTracker(href))return true;return u.origin!==upstream;}catch(e){return true;}}
var fakeWin={closed:false,close:function(){this.closed=true;},focus:function(){},blur:function(){},postMessage:function(){},moveTo:function(){},resizeTo:function(){},location:{href:'about:blank',assign:function(){},replace:function(){},reload:function(){}},document:{write:function(){},writeln:function(){},open:function(){return fakeWin;},close:function(){}},history:{back:function(){},forward:function(){},go:function(){}}};
var _open=window.open;window.open=function(url,target,features){if(url&&isExternal(String(url)))return fakeWin;return _open? _open.apply(window,arguments):fakeWin;};
var _createElement=document.createElement.bind(document);
document.createElement=function(tag){var el=_createElement(tag);if(String(tag).toLowerCase()==='iframe'){var _set=el.setAttribute.bind(el);el.setAttribute=function(n,v){if(n==='src'&&isExternal(v))return;return _set(n,v);};}return el;};
var _submit=HTMLFormElement.prototype.submit;
HTMLFormElement.prototype.submit=function(){var t=(this.getAttribute('target')||'').toLowerCase();if(t==='_blank'||t==='_top'||t==='_parent')return;return _submit.apply(this,arguments);};
document.addEventListener('click',function(e){var el=e.target;while(el&&el!==document){if(el.tagName==='A'&&el.href){var t=(el.getAttribute('target')||'').toLowerCase();if(t==='_blank'||t==='_top'||t==='_parent'){e.preventDefault();e.stopImmediatePropagation();return;}if(isExternal(el.href)&&!el.closest('#the_frame,#player_iframe,.servers,.server-btn,[class*="server"]')){e.preventDefault();e.stopImmediatePropagation();return;}}el=el.parentElement;}},true);
document.addEventListener('mousedown',function(e){var el=e.target;while(el&&el!==document){if(el.tagName==='IFRAME'&&el.src&&isExternal(el.src)){e.preventDefault();e.stopImmediatePropagation();return;}if(el.classList&&(adRe.test(el.className)||/popup|overlay|banner|bet/i.test(el.className))&&!el.closest('#the_frame,#player_iframe')){e.preventDefault();e.stopImmediatePropagation();return;}el=el.parentElement;}},true);
try{var _assign=location.assign&&location.assign.bind(location);var _replace=location.replace&&location.replace.bind(location);if(_assign)location.assign=function(u){if(!isExternal(u))_assign(u);};if(_replace)location.replace=function(u){if(!isExternal(u))_replace(u);};}catch(e){}
var obs=new MutationObserver(function(muts){muts.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType!==1)return;var el=n;if(adRe.test(el.id||'')||adRe.test(el.className||'')||el.id==='AdWidgetContainer'||el.id==='ad720'){try{el.remove();}catch(e){}}});});});
obs.observe(document.documentElement,{childList:true,subtree:true});
})();</script>`;
}

export const EMBED_GUARD_CSS = `<style id="nexus-guard-css">
#AdWidgetContainer,#ad720,#onexbet,#top_buttons_parent,.ad_container,[class*="ad-banner"],[class*="popup-ad"],[id*="popunder"],iframe[src*="ads"],iframe[src*="doubleclick"],iframe[src*="effectivecpm"],iframe[src*="profitabledisplay"]{display:none!important;visibility:hidden!important;pointer-events:none!important;height:0!important;width:0!important;overflow:hidden!important;opacity:0!important;}
</style>`;

export function toProxiedEmbedUrl(embedUrl: string): string {
  return `/api/embed-proxy?url=${encodeURIComponent(embedUrl)}`;
}
