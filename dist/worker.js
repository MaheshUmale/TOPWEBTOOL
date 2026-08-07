addEventListener('fetch', event => {
  event.respondWith(handle(event.request))
})

async function handle(request) {
  const url = new URL(request.url)
  // Handle HTML pages
  if (url.pathname.endsWith('.html') && !url.pathname.startsWith('/.well-known')) {
    const response = await fetch(request)
    // If client accepts markdown, return markdown version
    if (request.headers.get('Accept')?.includes('text/markdown')) {
      const newHeaders = new Headers(response.headers)
      newHeaders.set('Content-Type', 'text/markdown; charset=utf-8')
      return new Response(response.text(), {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders
      })
    }
    return response
  }
  return fetch(request)
})