#!/usr/bin/env node

/**
 * Simple baseline updater for PostgREST-js Type Inference Benchmarks
 * Updates baselines.json with current benchmark results
 */

const { execSync } = require('child_process')
const { writeFileSync, readFileSync } = require('fs')
const { join } = require('path')

const baselinesPath = join(__dirname, 'baselines.json')

function updateBaselines() {
    console.log('🔄 Updating PostgREST-js Type Inference Baselines')
    console.log('='.repeat(60))

    try {
        // Run the benchmark and capture output
        console.log('📊 Running benchmarks...')
        const output = execSync('npx tsx test/types-benchmark/benchmarks.ts', {
            cwd: process.cwd(),
            encoding: 'utf-8',
            stdio: 'pipe'
        })

        // Parse results
        const baselines = {}
        const lines = output.split('\n')

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i]
            if (line.includes('🏌️')) {
                const nameMatch = line.match(/🏌️\s+(.+?)$/)
                const nextLine = lines[i + 1]
                const instantiationsMatch = nextLine?.match(/⛳ Result:\s+(\d+)\s+instantiations/)

                if (nameMatch && instantiationsMatch) {
                    const name = nameMatch[1].trim()
                    const instantiations = parseInt(instantiationsMatch[1])
                    baselines[name] = instantiations
                }
            }
        }

        // Save baselines
        writeFileSync(baselinesPath, JSON.stringify(baselines, null, 2))

        console.log(`\n💾 Updated ${Object.keys(baselines).length} baselines:`)
        Object.entries(baselines).forEach(([name, value]) => {
            console.log(`  ${name}: ${value} instantiations`)
        })

        console.log('\n✅ Baselines updated successfully!')
        console.log('Run npm run benchmark:types to compare against new baselines')

    } catch (error) {
        console.error('❌ Failed to update baselines:', error.message)
        process.exit(1)
    }
}

function showBaselines() {
    try {
        const baselines = JSON.parse(readFileSync(baselinesPath, 'utf-8'))
        console.log('📊 Current Baselines')
        console.log('='.repeat(60))

        Object.entries(baselines).forEach(([name, value]) => {
            console.log(`${name}: ${value} instantiations`)
        })

        console.log(`\n📈 Total: ${Object.keys(baselines).length} benchmarks`)
    } catch (error) {
        console.log('❌ No baselines file found. Run with --update to create baselines.')
    }
}

// CLI interface
const args = process.argv.slice(2)

if (args.includes('--update') || args.includes('-u')) {
    updateBaselines()
} else if (args.includes('--show') || args.includes('-s')) {
    showBaselines()
} else {
    console.log(`
PostgREST-js Type Inference Baseline Manager

Usage:
  node update-baselines.js --update    Update all baselines with current values
  node update-baselines.js --show      Show current baseline values
  
Options:
  -u, --update    Update baselines (like vitest --update)  
  -s, --show      Show current baselines
`)
}
