addEventListener('fetch', event => {
  event.respondWith(handle(event.request))
})

async function handle(request) {
  const url = new URL(request.url)
  const accept = request.headers.get('Accept') || ''

  if (accept.includes('text/markdown')) {
    const res = await fetch(request.url)
    const contentType = res.headers.get('Content-Type') || ''
    if (contentType.includes('text/html')) {
      const html = await res.text()
      if (html) {
        return new Response(htmlToMarkdown(html, url.href), {
          status: 200,
          headers: { 'Content-Type': 'text/markdown; charset=utf-8' }
        })
      }
    }
    return res
  }
  return fetch(request)
}

function decode(html) {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/tr>/gi, '\n')
    .replace(/<\/td>/gi, ' | ')
    .replace(/<\/th>/gi, ' | ')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&rarr;/g, '→')
    .replace(/&larr;/g, '←')
    .replace(/&middot;/g, '·')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&hellip;/g, '…')
}

function clean(text) {
  return text
    .replace(/[ \t]+/g, ' ')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .join('\n')
}

function htmlToMarkdown(html, url) {
  const title =
    decode((html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '')
      .replace(/\s*\|\s*TopWebTool\s*$/i, '')
      .trim() || 'TopWebTool'
  const description = clean(
    decode((html.match(/<meta name="description" content="([\s\S]*?)"\s*\/?>/) || [])[1] || '')
  )

  let body = html
    .replace(/<head[\s\S]*?<\/head>/gi, ' ')
    .replace(/<header[\s\S]*?<\/header>/gi, ' ')
    .replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
    .replace(/<nav[\s\S]*?<\/nav>/gi, ' ')
    .replace(/<aside[\s\S]*?<\/aside>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<ins[\s\S]*?<\/ins>/gi, ' ')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, ' ')
    .replace(/<form[\s\S]*?<\/form>/gi, ' ')
    .replace(/<input[^>]*>/gi, ' ')
    .replace(/<label[^>]*>([\s\S]*?)<\/label>/gi, ' ')
    .replace(/<button[^>]*>([\s\S]*?)<\/button>/gi, ' ')
    .replace(/<select[\s\S]*?<\/select>/gi, ' ')
    .replace(/<textarea[\s\S]*?<\/textarea>/gi, ' ')
    .replace(/<img[^>]*>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<div[^>]*id="ad-slot[^>]*>[\s\S]*?<\/div>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')

  body = body.replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, (m, level, inner) => {
    const text = decode(inner).replace(/\s+/g, ' ').trim()
    return '\n\n' + '#'.repeat(Number(level)) + ' ' + text + '\n\n'
  })

  body = body.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (m, inner) => {
    const text = clean(decode(inner))
    return text ? '- ' + text + '\n' : '\n'
  })

  body = body.replace(/<t[hr][^>]*>[\s\S]*?<\/t[hr]>/gi, (m) => decode(m))

  const text = clean(decode(body))
    .split('\n')
    .filter(line => !/^(Advertisement|Waiting for input[.…]*|[.…]{1,}|—+)$/.test(line))
    .join('\n')

  let md = '# ' + title + '\n\n'
  if (description) md += description + '\n\n'
  md += 'Source: ' + url + '\n\n'
  md += '---\n\n'
  md += text
  return md
}
