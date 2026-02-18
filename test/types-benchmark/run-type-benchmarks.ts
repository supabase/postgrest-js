#!/usr/bin/env tsx

/**
 * Type Inference Benchmark Runner for PostgREST-js
 *
 * This script runs comprehensive type inference benchmarks using @ark/attest
 * and generates performance reports to help identify performance regressions
 * and optimization opportunities.
 *
 * Based on the approach from:
 * https://www.geldata.com/blog/an-approach-to-optimizing-typescript-type-checking-performance
 */

import { execSync } from 'child_process'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

interface BenchmarkResult {
  name: string
  instantiations: number
  delta?: number
  status: 'passed' | 'failed' | 'regression'
}

interface BenchmarkSuite {
  name: string
  results: BenchmarkResult[]
  totalInstantiations: number
  averageInstantiations: number
}

class TypeBenchmarkRunner {
  private results: BenchmarkSuite[] = []
  private outputDir = join(__dirname, 'benchmark-results')

  constructor() {
    this.setupOutputDirectory()
  }

  private setupOutputDirectory() {
    try {
      mkdirSync(this.outputDir, { recursive: true })
    } catch (error) {
      console.warn('Could not create output directory:', error)
    }
  }

  /**
   * Run all benchmark suites
   */
  async runAllBenchmarks() {
    console.log('🚀 Starting PostgREST-js Type Inference Benchmarks')
    console.log('='.repeat(60))

    const suites = ['type-inference-benchmarks.ts', 'type-inference-benchmark-suite.ts']

    for (const suite of suites) {
      await this.runBenchmarkSuite(suite)
    }

    this.generateReport()
  }

  /**
   * Run a specific benchmark suite using attest
   */
  private async runBenchmarkSuite(suiteFile: string) {
    console.log(`\n📊 Running benchmark suite: ${suiteFile}`)

    try {
      // Use attest to run the benchmark suite
      const command = `npx attest ${join(__dirname, suiteFile)}`
      const output = execSync(command, {
        cwd: process.cwd(),
        encoding: 'utf-8',
        stdio: 'pipe',
      })

      this.parseBenchmarkOutput(output, suiteFile)
    } catch (error) {
      console.error(`❌ Failed to run benchmark suite ${suiteFile}:`, error)
    }
  }

  /**
   * Parse attest benchmark output and extract results
   */
  private parseBenchmarkOutput(output: string, suiteFile: string) {
    try {
      const lines = output.split('\n')
      const suite: BenchmarkSuite = {
        name: suiteFile.replace('.ts', ''),
        results: [],
        totalInstantiations: 0,
        averageInstantiations: 0,
      }

      let currentBenchmark: BenchmarkResult | null = null

      for (const line of lines) {
        if (line.includes('🏌️') && line.includes('instantiations')) {
          // Extract benchmark name and instantiations
          const match = line.match(/🏌️\s+(.+?)\s+⛳\s+Result:\s+(\d+)\s+instantiations/)
          if (match) {
            if (currentBenchmark) {
              suite.results.push(currentBenchmark)
            }
            currentBenchmark = {
              name: match[1].trim(),
              instantiations: parseInt(match[2]),
              status: 'passed',
            }
          }
        } else if (line.includes('📊 Delta:') && currentBenchmark) {
          // Extract delta percentage
          const deltaMatch = line.match(/📊\s+Delta:\s+([+-]?\d+\.?\d*)%/)
          if (deltaMatch) {
            currentBenchmark.delta = parseFloat(deltaMatch[1])
            if (Math.abs(currentBenchmark.delta) > 20) {
              currentBenchmark.status = currentBenchmark.delta > 0 ? 'regression' : 'passed'
            }
          }
        } else if (line.includes('❌') && currentBenchmark) {
          currentBenchmark.status = 'failed'
        }
      }

      if (currentBenchmark) {
        suite.results.push(currentBenchmark)
      }

      // Calculate totals
      suite.totalInstantiations = suite.results.reduce((sum, r) => sum + r.instantiations, 0)
      suite.averageInstantiations = suite.totalInstantiations / suite.results.length

      this.results.push(suite)
      this.printSuiteResults(suite)
    } catch (error) {
      console.error('❌ Failed to parse benchmark output:', error)
    }
  }

  /**
   * Print results for a benchmark suite
   */
  private printSuiteResults(suite: BenchmarkSuite) {
    console.log(`\n📈 Results for ${suite.name}:`)
    console.log(`   Total Instantiations: ${suite.totalInstantiations}`)
    console.log(`   Average Instantiations: ${suite.averageInstantiations.toFixed(2)}`)
    console.log(`   Number of Tests: ${suite.results.length}`)

    const regressions = suite.results.filter((r) => r.status === 'regression')
    const failures = suite.results.filter((r) => r.status === 'failed')

    if (regressions.length > 0) {
      console.log(`   ⚠️  Performance Regressions: ${regressions.length}`)
      regressions.forEach((r) => {
        console.log(`      - ${r.name}: +${r.delta}% (${r.instantiations} instantiations)`)
      })
    }

    if (failures.length > 0) {
      console.log(`   ❌ Failures: ${failures.length}`)
      failures.forEach((r) => {
        console.log(`      - ${r.name}`)
      })
    }

    if (regressions.length === 0 && failures.length === 0) {
      console.log(`   ✅ All tests passed`)
    }
  }

  /**
   * Generate comprehensive benchmark report
   */
  private generateReport() {
    console.log('\n📋 Generating Benchmark Report')
    console.log('='.repeat(60))

    const report = this.generateMarkdownReport()
    const jsonReport = this.generateJsonReport()

    const reportPath = join(this.outputDir, 'benchmark-report.md')
    const jsonPath = join(this.outputDir, 'benchmark-results.json')

    writeFileSync(reportPath, report)
    writeFileSync(jsonPath, JSON.stringify(jsonReport, null, 2))

    console.log(`📄 Report generated: ${reportPath}`)
    console.log(`📊 JSON data: ${jsonPath}`)

    this.printSummary()
  }

  /**
   * Generate markdown report
   */
  private generateMarkdownReport(): string {
    const timestamp = new Date().toISOString()
    const totalSuites = this.results.length
    const totalTests = this.results.reduce((sum, suite) => sum + suite.results.length, 0)
    const totalRegressions = this.results.reduce(
      (sum, suite) => sum + suite.results.filter((r) => r.status === 'regression').length,
      0
    )

    let report = `# PostgREST-js Type Inference Benchmark Report\n\n`
    report += `**Generated:** ${timestamp}\n`
    report += `**Total Suites:** ${totalSuites}\n`
    report += `**Total Tests:** ${totalTests}\n`
    report += `**Performance Regressions:** ${totalRegressions}\n\n`

    report += `## Summary\n\n`
    if (totalRegressions === 0) {
      report += `✅ **All benchmarks passed!** No performance regressions detected.\n\n`
    } else {
      report += `⚠️ **${totalRegressions} performance regressions detected.**\n\n`
    }

    report += `## Detailed Results\n\n`

    this.results.forEach((suite) => {
      report += `### ${suite.name}\n\n`
      report += `- **Total Instantiations:** ${suite.totalInstantiations}\n`
      report += `- **Average Instantiations:** ${suite.averageInstantiations.toFixed(2)}\n`
      report += `- **Number of Tests:** ${suite.results.length}\n\n`

      const regressions = suite.results.filter((r) => r.status === 'regression')
      if (regressions.length > 0) {
        report += `#### Performance Regressions\n\n`
        regressions.forEach((r) => {
          report += `- **${r.name}:** +${r.delta}% (${r.instantiations} instantiations)\n`
        })
        report += `\n`
      }

      report += `#### All Results\n\n`
      report += `| Test Name | Instantiations | Delta | Status |\n`
      report += `|-----------|----------------|-------|--------|\n`

      suite.results.forEach((r) => {
        const delta = r.delta ? `${r.delta > 0 ? '+' : ''}${r.delta}%` : '-'
        const status = r.status === 'regression' ? '⚠️' : r.status === 'failed' ? '❌' : '✅'
        report += `| ${r.name} | ${r.instantiations} | ${delta} | ${status} |\n`
      })

      report += `\n`
    })

    report += `## Recommendations\n\n`
    if (totalRegressions > 0) {
      report += `- Investigate the ${totalRegressions} performance regressions listed above\n`
      report += `- Consider optimizing the most expensive type inference operations\n`
      report += `- Review recent changes that might have impacted type performance\n`
    } else {
      report += `- Type inference performance is stable\n`
      report += `- Continue monitoring for future regressions\n`
    }

    return report
  }

  /**
   * Generate JSON report for programmatic access
   */
  private generateJsonReport() {
    return {
      timestamp: new Date().toISOString(),
      summary: {
        totalSuites: this.results.length,
        totalTests: this.results.reduce((sum, suite) => sum + suite.results.length, 0),
        totalRegressions: this.results.reduce(
          (sum, suite) => sum + suite.results.filter((r) => r.status === 'regression').length,
          0
        ),
        totalInstantiations: this.results.reduce(
          (sum, suite) => sum + suite.totalInstantiations,
          0
        ),
      },
      suites: this.results,
    }
  }

  /**
   * Print final summary
   */
  private printSummary() {
    const totalRegressions = this.results.reduce(
      (sum, suite) => sum + suite.results.filter((r) => r.status === 'regression').length,
      0
    )

    console.log('\n🎯 Benchmark Summary')
    console.log('='.repeat(60))
    console.log(`Total Suites: ${this.results.length}`)
    console.log(
      `Total Tests: ${this.results.reduce((sum, suite) => sum + suite.results.length, 0)}`
    )
    console.log(`Performance Regressions: ${totalRegressions}`)

    if (totalRegressions === 0) {
      console.log('\n✅ All benchmarks passed! No performance regressions detected.')
    } else {
      console.log(`\n⚠️  ${totalRegressions} performance regressions detected.`)
      console.log('Check the detailed report for more information.')
    }
  }
}

// Run benchmarks if this file is executed directly
if (require.main === module) {
  const runner = new TypeBenchmarkRunner()
  runner.runAllBenchmarks().catch(console.error)
}

export { TypeBenchmarkRunner }
