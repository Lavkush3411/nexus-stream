/**
 * Embed proxy — fetches VidSrc pages server-side, injects ad-guard scripts,
 * and rewrites asset URLs. Prevents popup/tab hijacks from escaping the iframe.
 *
 * Security: strict host allowlist — never proxy arbitrary URLs.
 */

import { NextRequest, NextResponse } from "next/server";
import {
  isAllowedEmbedUrl,
  rewriteRelativeUrls,
  stripAggressiveScripts,
  buildEmbedGuardScript,
  EMBED_GUARD_CSS,
} from "@/lib/embed-guard";

export async function GET(request: NextRequest) {
  const target = request.nextUrl.searchParams.get("url");

  if (!target || !isAllowedEmbedUrl(target)) {
    return NextResponse.json(
      { error: "Invalid or disallowed embed URL" },
      { status: 400 }
    );
  }

  let upstream: URL;
  try {
    upstream = new URL(target);
  } catch {
    return NextResponse.json({ error: "Malformed URL" }, { status: 400 });
  }

  try {
    const res = await fetch(upstream.href, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
        Referer: `${upstream.origin}/`,
      },
      redirect: "follow",
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream returned ${res.status}` },
        { status: 502 }
      );
    }

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) {
      return new NextResponse(res.body, {
        status: res.status,
        headers: { "Content-Type": contentType },
      });
    }

    const finalOrigin = res.url ? new URL(res.url).origin : upstream.origin;
    let html = await res.text();

    html = stripAggressiveScripts(html);
    html = rewriteRelativeUrls(html, finalOrigin);

    const guard = buildEmbedGuardScript(finalOrigin);
    const injection = `${guard}${EMBED_GUARD_CSS}`;

    // Do NOT inject <base href> — it breaks /api/embed-proxy resolution on our origin.
    if (html.includes("<head>")) {
      html = html.replace("<head>", `<head>${injection}`);
    } else if (/<head[\s>]/i.test(html)) {
      html = html.replace(/<head([^>]*)>/i, `<head$1>${injection}`);
    } else {
      html = `${injection}${html}`;
    }

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "private, max-age=300",
        "X-Frame-Options": "SAMEORIGIN",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Proxy fetch failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

/** Cloudflare RUM beacons POST to /cdn-cgi/rum — swallow silently when misrouted. */
export async function POST(request: NextRequest) {
  const target = request.nextUrl.searchParams.get("url");
  if (target?.includes("/cdn-cgi/")) {
    return new NextResponse(null, { status: 204 });
  }
  return NextResponse.json({ error: "POST not supported" }, { status: 405 });
}
