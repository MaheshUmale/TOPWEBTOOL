export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // Markdown negotiation: only serve markdown when a real .md sibling exists.
  if (url.pathname.endsWith('.html') && request.headers.get('Accept')?.includes('text/markdown')) {
    const mdPath = url.pathname.replace(/\.html$/, '.md');
    try {
      const mdResp = await fetch(new Request(url.origin + mdPath, request));
      if (mdResp.ok) {
        const headers = new Headers(mdResp.headers);
        headers.set('Content-Type', 'text/markdown; charset=utf-8');
        return new Response(mdResp.body, { status: mdResp.status, statusText: mdResp.statusText, headers });
      }
    } catch (e) {
      // fall through to static asset
    }
  }

  return context.next();
}
