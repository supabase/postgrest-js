# ⚠️ REPOSITORY DEPRECATED - MOVED TO MONOREPO

> **🚨 This repository has been moved and will be archived on October 10, 2025**
>
> **All development has moved to the [Supabase JS Monorepo](https://github.com/supabase/supabase-js)**
>
> **If you're looking for the README of `postgrest-js`, you can find it at:**  
> **https://github.com/supabase/supabase-js/tree/master/packages/core/postgrest-js**
>
> ### What happened?
> This repository was merged into the main Supabase JS monorepo for better coordination, testing, and releases.
>
> ### What you need to do:
> - **📖 For documentation**: Visit the [new postgrest-js location](https://github.com/supabase/supabase-js/tree/master/packages/core/postgrest-js)
> - **🐛 For issues**: Create them in the [supabase-js repository](https://github.com/supabase/supabase-js/issues)
> - **🔧 For contributions**: See the [Contributing Guide](https://github.com/supabase/supabase-js/blob/master/CONTRIBUTING.md)
> - **📚 For migration help**: Read the [Migration Guide](https://github.com/supabase/supabase-js/blob/master/docs/MIGRATION.md)
>
> ### If you have open work:
> - **Uncommitted changes**: Manually transport your work to the monorepo (file structure is the same under `packages/core/postgrest-js/`)
> - **Open PRs**: Tag a maintainer in your PR and we'll help you migrate it
> - **Issues**: Will be transported to the supabase-js repository
>
> **⚠️ This is the old repository. Please use the [supabase-js monorepo](https://github.com/supabase/supabase-js) going forward.**

---

# `postgrest-js` (DEPRECATED - USE MONOREPO)

[![Build](https://github.com/supabase/postgrest-js/workflows/CI/badge.svg)](https://github.com/supabase/postgrest-js/actions?query=branch%3Amaster)
[![Package](https://img.shields.io/npm/v/@supabase/postgrest-js)](https://www.npmjs.com/package/@supabase/postgrest-js)
[![License: MIT](https://img.shields.io/npm/l/@supabase/postgrest-js)](#license)
[![pkg.pr.new](https://pkg.pr.new/badge/supabase/postgrest-js)](https://pkg.pr.new/~/supabase/postgrest-js)


Isomorphic JavaScript client for [PostgREST](https://postgrest.org). The goal of this library is to make an "ORM-like" restful interface.

Full documentation can be found [here](https://supabase.github.io/postgrest-js/v2).

### Quick start

Install

```bash
npm install @supabase/postgrest-js
```

Usage

```js
import { PostgrestClient } from '@supabase/postgrest-js'

const REST_URL = 'http://localhost:3000'
const postgrest = new PostgrestClient(REST_URL)
```

- select(): https://supabase.com/docs/reference/javascript/select
- insert(): https://supabase.com/docs/reference/javascript/insert
- update(): https://supabase.com/docs/reference/javascript/update
- delete(): https://supabase.com/docs/reference/javascript/delete

#### Custom `fetch` implementation

`postgrest-js` uses the [`cross-fetch`](https://www.npmjs.com/package/cross-fetch) library to make HTTP requests, but an alternative `fetch` implementation can be provided as an option. This is most useful in environments where `cross-fetch` is not compatible, for instance Cloudflare Workers:

```js
import { PostgrestClient } from '@supabase/postgrest-js'

const REST_URL = 'http://localhost:3000'
const postgrest = new PostgrestClient(REST_URL, {
  fetch: (...args) => fetch(...args),
})
```

## License

This repo is licensed under MIT License.

## Sponsors

We are building the features of Firebase using enterprise-grade, open source products. We support existing communities wherever possible, and if the products don’t exist we build them and open source them ourselves. Thanks to these sponsors who are making the OSS ecosystem better for everyone.

[![New Sponsor](https://user-images.githubusercontent.com/10214025/90518111-e74bbb00-e198-11ea-8f88-c9e3c1aa4b5b.png)](https://github.com/sponsors/supabase)
