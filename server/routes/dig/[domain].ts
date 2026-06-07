import { promises as dns } from 'node:dns'

const DOMAIN_REGEX = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

async function resolveRecord<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn()
  } catch {
    return null
  }
}

export default defineEventHandler(async (event) => {
  const domain = getRouterParam(event, 'domain')

  if (!domain || !DOMAIN_REGEX.test(domain) || domain.length > 253) {
    setResponseStatus(event, 400)
    return 'Invalid domain'
  }

  const [a, aaaa, mx, txt, ns, cname, soa] = await Promise.all([
    resolveRecord(() => dns.resolve4(domain)),
    resolveRecord(() => dns.resolve6(domain)),
    resolveRecord(() => dns.resolveMx(domain)),
    resolveRecord(() => dns.resolveTxt(domain)),
    resolveRecord(() => dns.resolveNs(domain)),
    resolveRecord(() => dns.resolveCname(domain)),
    resolveRecord(() => dns.resolveSoa(domain)),
  ])

  const lines: string[] = [`; DNS lookup for ${domain}`, '']

  if (a) {
    lines.push(';; A RECORDS')
    a.forEach(ip => lines.push(`${domain}.\tA\t${ip}`))
    lines.push('')
  }

  if (aaaa) {
    lines.push(';; AAAA RECORDS')
    aaaa.forEach(ip => lines.push(`${domain}.\tAAAA\t${ip}`))
    lines.push('')
  }

  if (cname) {
    lines.push(';; CNAME RECORDS')
    cname.forEach(c => lines.push(`${domain}.\tCNAME\t${c}`))
    lines.push('')
  }

  if (mx) {
    lines.push(';; MX RECORDS')
    mx.sort((x, y) => x.priority - y.priority)
      .forEach(r => lines.push(`${domain}.\tMX\t${r.priority} ${r.exchange}`))
    lines.push('')
  }

  if (ns) {
    lines.push(';; NS RECORDS')
    ns.forEach(n => lines.push(`${domain}.\tNS\t${n}`))
    lines.push('')
  }

  if (txt) {
    lines.push(';; TXT RECORDS')
    txt.forEach(t => lines.push(`${domain}.\tTXT\t"${t.join('')}"`))
    lines.push('')
  }

  if (soa) {
    lines.push(';; SOA RECORD')
    lines.push(`${domain}.\tSOA\t${soa.nsname} ${soa.hostmaster} ${soa.serial} ${soa.refresh} ${soa.retry} ${soa.expire} ${soa.minttl}`)
    lines.push('')
  }

  if (!a && !aaaa && !mx && !txt && !ns && !cname && !soa) {
    lines.push(';; NO RECORDS FOUND')
  }

  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  return lines.join('\n')
})
