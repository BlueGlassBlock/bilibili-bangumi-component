import type { HttpRequest } from '@azure/functions'
import { app } from '@azure/functions'
import { parseSearchParams } from '../../bilibili-bangumi-component/src/shared/utils'
import { handler as bilibili } from './bilibili'
import { handler as bgm } from './bgm'
import { handleQuery } from './shared/utils'
import { customHandler } from './shared'

function setCORS(res: Response) {
  res.headers.set('Access-Control-Allow-Origin', '*')
  res.headers.set('Access-Control-Max-Age', '86400')
  return res
}

async function fetch(request: HttpRequest, env: NodeJS.ProcessEnv) {
  const url = new URL(request.url)
  const query = handleQuery(parseSearchParams(url))

  let customSource = {}
  try {
    customSource = customData
  }
  catch {

  }

  if (url.pathname.endsWith('bilibili'))
    return setCORS(await bilibili(query, env))
  else if (url.pathname.endsWith('bgm'))
    return setCORS(await bgm(query, env))
  else if (url.pathname.endsWith('custom'))
    return setCORS(customHandler(query, customSource))

  return Response.json({
    code: 404,
    message: 'not found',
    data: {},
  }, { status: 404 })
}

app.http('bangumi-component-backend', {
  methods: ['GET'],
  route: 'bangumi/{name}',
  authLevel: 'anonymous',
  handler: async (request: HttpRequest) => {
    return await fetch(request, process.env)
  },
})
