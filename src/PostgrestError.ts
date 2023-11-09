class PostgrestError extends Error {
  constructor(details: { message?: string } & Record<string, unknown>) {
    super(details.message ?? 'Unknown Postgrest error')
    Object.assign(this, details)
  }
}

export default PostgrestError
