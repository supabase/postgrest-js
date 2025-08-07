import { expect } from 'tstyche'

export function expectType<T>(expression: T) {
  return expect(expression).type.toBe<T>()
}
