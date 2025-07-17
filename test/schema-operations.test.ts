import { PostgrestClient } from '../src/index'
import { Database } from './types.override'

const REST_URL = 'http://localhost:3000'

test('switch schema', async () => {
  const postgrest = new PostgrestClient<Database, { PostgrestVersion: '12' }, 'personal'>(
    REST_URL,
    {
      schema: 'personal',
    }
  )
  const res = await postgrest.from('users').select()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Array [
        Object {
          "age_range": "[1,2)",
          "data": null,
          "status": "ONLINE",
          "username": "supabot",
        },
        Object {
          "age_range": "[25,35)",
          "data": null,
          "status": "OFFLINE",
          "username": "kiwicopple",
        },
        Object {
          "age_range": "[25,35)",
          "data": null,
          "status": "ONLINE",
          "username": "awailas",
        },
        Object {
          "age_range": "[20,30)",
          "data": null,
          "status": "ONLINE",
          "username": "dragarcia",
        },
        Object {
          "age_range": "[20,40)",
          "data": null,
          "status": "ONLINE",
          "username": "leroyjenkins",
        },
      ],
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
})

test('dynamic schema', async () => {
  const postgrest = new PostgrestClient<Database>(REST_URL)
  const res = await postgrest.schema('personal').from('users').select()
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": Array [
        Object {
          "age_range": "[1,2)",
          "data": null,
          "status": "ONLINE",
          "username": "supabot",
        },
        Object {
          "age_range": "[25,35)",
          "data": null,
          "status": "OFFLINE",
          "username": "kiwicopple",
        },
        Object {
          "age_range": "[25,35)",
          "data": null,
          "status": "ONLINE",
          "username": "awailas",
        },
        Object {
          "age_range": "[20,30)",
          "data": null,
          "status": "ONLINE",
          "username": "dragarcia",
        },
        Object {
          "age_range": "[20,40)",
          "data": null,
          "status": "ONLINE",
          "username": "leroyjenkins",
        },
      ],
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
})

test('rpc with dynamic schema', async () => {
  const postgrest = new PostgrestClient<Database>(REST_URL)
  const res = await postgrest.schema('personal').rpc('get_status', { name_param: 'kiwicopple' })
  expect(res).toMatchInlineSnapshot(`
    Object {
      "count": null,
      "data": "OFFLINE",
      "error": null,
      "status": 200,
      "statusText": "OK",
    }
  `)
})
