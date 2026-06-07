import { randomUUID } from 'node:crypto'

export default defineEventHandler((event) => {
  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  return randomUUID()
})
