import { PostgrestClient } from '../src/index'

const REST_URL = 'http://localhost:3001'
const postgrest = new PostgrestClient(REST_URL)

test('503 temporarily failure - retried and successful', async () => {
  const res = await postgrest.from('temporary503failure').select()
  expect(res).toMatchSnapshot()
})

test('generic failure table - not retried', async () => {
  const res = await postgrest.from('generic500failure').select()
  expect(res).toMatchSnapshot()
})

test('bad request - not retried', async () => {
  const res = await postgrest.from('badrequest').select()
  expect(res).toMatchSnapshot()
})

test('524 failure - cf timeout - retried', async () => {
  const res = await postgrest.from('timeout524failure').select()
  expect(res).toMatchSnapshot()
})
