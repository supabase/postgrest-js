/**
 * Remove whitespaces except when quoted
 *
 * @param columns Columns that will be "cleaned"
 */
export const cleanColumns = (columns: string) => {
  let quoted = false
  return columns
    .split('')
    .map((c) => {
      if (/\s/.test(c) && !quoted) {
        return ''
      }
      if (c === '"') {
        quoted = !quoted
      }
      return c
    })
    .join('')
}
