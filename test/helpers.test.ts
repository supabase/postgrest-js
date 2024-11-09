import { resolveFetch } from '../src/lib/helpers'

describe('resolveFetch', () => {
  const TEST_URL = 'https://example.com'
  const TEST_OPTIONS = { method: 'GET' }

  beforeEach(() => {
    // Reset any mocks between tests
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('should use custom fetch if provided', async () => {
    const customFetch = jest.fn()
    const resolvedFetch = resolveFetch(customFetch)

    await resolvedFetch(TEST_URL, TEST_OPTIONS)

    expect(customFetch).toHaveBeenCalledTimes(1)
    expect(customFetch).toHaveBeenCalledWith(TEST_URL, TEST_OPTIONS)
  })

  it('should use global fetch if no custom fetch is provided', async () => {
    const globalFetch = jest.fn()
    global.fetch = globalFetch
    const resolvedFetch = resolveFetch()

    await resolvedFetch(TEST_URL, TEST_OPTIONS)

    expect(globalFetch).toHaveBeenCalledTimes(1)
    expect(globalFetch).toHaveBeenCalledWith(TEST_URL, TEST_OPTIONS)
  })

  it('should use node-fetch if global fetch is not available', async () => {
    const nodeFetch = jest.fn()
    jest.mock('@supabase/node-fetch', () => nodeFetch)

    global.fetch = undefined as any
    const resolvedFetch = resolveFetch()

    await resolvedFetch(TEST_URL, TEST_OPTIONS)

    expect(nodeFetch).toHaveBeenCalledTimes(1)
    expect(nodeFetch).toHaveBeenCalledWith(TEST_URL, TEST_OPTIONS)
  })
})
