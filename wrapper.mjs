import { default as PostgrestClient } from '../cjs/PostgrestClient.js'
import { default as PostgrestQueryBuilder } from '../cjs/PostgrestQueryBuilder.js'
import { default as PostgrestFilterBuilder } from '../cjs/PostgrestFilterBuilder.js'
import { default as PostgrestTransformBuilder } from '../cjs/PostgrestTransformBuilder.js'
import { default as PostgrestBuilder } from '../cjs/PostgrestBuilder.js'

export {
  PostgrestBuilder,
  PostgrestClient,
  PostgrestFilterBuilder,
  PostgrestQueryBuilder,
  PostgrestTransformBuilder,
}

// compatibility with CJS output
export default {
  PostgrestClient,
  PostgrestQueryBuilder,
  PostgrestFilterBuilder,
  PostgrestTransformBuilder,
  PostgrestBuilder,
}
