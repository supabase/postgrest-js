import { PostgrestClient } from '../src/index'
import { Database } from './types.override'
import { expectType } from 'tsd'
import { TypeEqual } from 'ts-expect'

const REST_URL = 'http://localhost:3000'
export const postgrest = new PostgrestClient<Database>(REST_URL)

export const RPC_NAME = 'get_username_and_status'

test('rpc', async () => {
  const res = await postgrest.rpc('get_status', { name_param: 'supabot' })
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": "ONLINE",
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
})

test('rpc returns void', async () => {
  const res = await postgrest.rpc('void_func')
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": null,
      "error": null,
      "status": 204,
      "statusText": "No Content",
    }
  `)
})

test("rpc with count: 'exact'", async () => {
  const res = await postgrest.rpc('get_status', { name_param: 'supabot' }, { count: 'exact' })
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": 1,
      "data": "ONLINE",
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
})

test('rpc with head:true, count:exact', async () => {
  const res = await postgrest.rpc(
    'get_status',
    { name_param: 'supabot' },
    { head: true, count: 'exact' }
  )
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": 1,
      "data": null,
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
})

test('rpc with get:true, count:exact', async () => {
  const res = await postgrest.rpc(
    'get_status',
    { name_param: 'supabot' },
    { get: true, count: 'exact' }
  )
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": 1,
      "data": "ONLINE",
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
})

test('rpc with get:true, optional param', async () => {
  const res = await postgrest.rpc(
    'function_with_optional_param',
    { param: undefined },
    { get: true }
  )
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": "",
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
})

test('rpc with get:true, array param', async () => {
  const res = await postgrest.rpc(
    'function_with_array_param',
    { param: ['00000000-0000-0000-0000-000000000000'] },
    { get: true }
  )
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": null,
      "error": null,
      "status": 204,
      "statusText": "No Content",
    }
  `)
})

test('RPC call with no params', async () => {
  const res = await postgrest.rpc(RPC_NAME, { name_param: 'supabot' }).select()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Array [
        Object {
          "status": "ONLINE",
          "username": "supabot",
        },
      ],
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
  // check our result types match the runtime result
  let result: Exclude<typeof res.data, null>
  let expected: Database['public']['Functions'][typeof RPC_NAME]['Returns']
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('RPC call with star select', async () => {
  const res = await postgrest.rpc(RPC_NAME, { name_param: 'supabot' }).select('*')
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Array [
        Object {
          "status": "ONLINE",
          "username": "supabot",
        },
      ],
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
  // check our result types match the runtime result
  let result: Exclude<typeof res.data, null>
  let expected: Database['public']['Functions'][typeof RPC_NAME]['Returns']
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('RPC call with single field select', async () => {
  const res = await postgrest.rpc(RPC_NAME, { name_param: 'supabot' }).select('username')
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Array [
        Object {
          "username": "supabot",
        },
      ],
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
  // check our result types match the runtime result
  let result: Exclude<typeof res.data, null>
  let expected: { username: string }[]
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('RPC call with multiple fields select', async () => {
  const res = await postgrest.rpc(RPC_NAME, { name_param: 'supabot' }).select('username, status')
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Array [
        Object {
          "status": "ONLINE",
          "username": "supabot",
        },
      ],
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
  // check our result types match the runtime result
  let result: Exclude<typeof res.data, null>
  let expected: Database['public']['Functions'][typeof RPC_NAME]['Returns']
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('RPC call with field aliasing', async () => {
  const res = await postgrest.rpc(RPC_NAME, { name_param: 'supabot' }).select('name:username')
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Array [
        Object {
          "name": "supabot",
        },
      ],
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
  // check our result types match the runtime result
  let result: Exclude<typeof res.data, null>
  let expected: { name: string }[]
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('RPC call with field casting', async () => {
  const res = await postgrest.rpc(RPC_NAME, { name_param: 'supabot' }).select('status::text')
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Array [
        Object {
          "status": "ONLINE",
        },
      ],
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
  // check our result types match the runtime result
  let result: Exclude<typeof res.data, null>
  let expected: { status: string }[]
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})

test('RPC call with field aggregate', async () => {
  const res = await postgrest
    .rpc(RPC_NAME, { name_param: 'supabot' })
    .select('username.count(), status')
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Array [
        Object {
          "count": 1,
          "status": "ONLINE",
        },
      ],
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
  // check our result types match the runtime result
  let result: Exclude<typeof res.data, null>
  let expected: { count: number; status: 'ONLINE' | 'OFFLINE' }[]
  expectType<TypeEqual<typeof result, typeof expected>>(true)
})
