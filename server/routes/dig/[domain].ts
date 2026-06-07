import { exec } from 'node:child_process'
import { promisify } from 'node:util'

const execAsync = promisify(exec)

const DOMAIN_REGEX = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

export default defineEventHandler(async (event) => {
  const domain = getRouterParam(event, 'domain')

  if (!domain || !DOMAIN_REGEX.test(domain) || domain.length > 253) {
    setResponseStatus(event, 400)
    return 'Invalid domain'
  }

  try {
    const { stdout, stderr } = await execAsync(`dig ${domain}`, { timeout: 10000 })
    setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
    return stdout || stderr
  } catch (error) {
    setResponseStatus(event, 500)
    return `Error executing dig: ${(error as Error).message}`
  }
})
