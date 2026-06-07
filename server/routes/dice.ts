import { getRandomInt } from '../utils/random'

export default defineEventHandler((event) => {
  const query = getQuery(event)

  const minParam = query.min
  const maxParam = query.max

  let min = 1
  let max = 6

  if (minParam !== undefined) {
    const parsed = Number(minParam)
    if (!Number.isInteger(parsed)) {
      setResponseStatus(event, 400)
      return 'Invalid min parameter'
    }
    min = parsed
  }

  if (maxParam !== undefined) {
    const parsed = Number(maxParam)
    if (!Number.isInteger(parsed)) {
      setResponseStatus(event, 400)
      return 'Invalid max parameter'
    }
    max = parsed
  }

  if (min > max) {
    setResponseStatus(event, 400)
    return 'min cannot be greater than max'
  }

  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  return String(getRandomInt(min, max))
})
