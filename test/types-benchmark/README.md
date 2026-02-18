# PostgREST-js Type Inference Benchmarks

Type inference performance benchmarks using [@ark/attest](https://github.com/arktypeio/arktype/tree/main/ark/attest) based on the approach from [An approach to optimizing TypeScript type checking performance](https://www.geldata.com/blog/an-approach-to-optimizing-typescript-type-checking-performance).

## Quick Start

```bash
# Run benchmarks and see performance vs baseline
npm run benchmark:types

# Update baselines (like vitest --update)
npm run benchmark:update-baselines

# Show current baselines
npm run benchmark:show-baselines
```

## Files

- **`benchmarks.ts`** - Core PostgREST operations (select, update, insert, RPC)
- **`baselines.json`** - Current baseline values for all benchmarks
- **`update-baselines.js`** - Baseline management utility
- **`tsconfig.json`** - TypeScript configuration for benchmarks

## Understanding Results

- **📊 Delta: 0.00%** - Performance is stable (no change)
- **📈 Exceeded baseline by X%** - Performance degraded (more instantiations)
- **📉 Under baseline by X%** - Performance improved (fewer instantiations)

## Updating Baselines

When you make intentional changes that affect type inference performance:

```bash
npm run benchmark:update-baselines
```

This captures current performance as the new baseline, similar to `vitest --update` for snapshots.

## Current Baseline Values

- **Simple Select: Basic**: 1,935 instantiations
- **Simple Select: Single Column**: 3,044 instantiations
- **Simple Update: Basic**: 108 instantiations
- **Simple Insert: Basic**: 108 instantiations
- **Simple RPC: Basic**: 53 instantiations
