// Check that the ESM build works as expected (namely has the same exports as the CJS build when imported via ESM).
const assert = require("node:assert");
const postgrestjs = require("@supabase/postgrest-js");

assert(typeof postgrestjs.PostgrestClient === "function");
assert(typeof postgrestjs.PostgrestQueryBuilder === "function");
assert(typeof postgrestjs.PostgrestFilterBuilder === "function");
assert(typeof postgrestjs.PostgrestTransformBuilder === "function");
assert(typeof postgrestjs.PostgrestBuilder === "function");
assert(typeof postgrestjs.default === 'object');
assert(typeof postgrestjs.default.PostgrestClient === 'function');
assert(typeof postgrestjs.default.PostgrestQueryBuilder === 'function');
assert(typeof postgrestjs.default.PostgrestFilterBuilder === 'function');
assert(typeof postgrestjs.default.PostgrestTransformBuilder === 'function');
assert(typeof postgrestjs.default.PostgrestBuilder === 'function');
