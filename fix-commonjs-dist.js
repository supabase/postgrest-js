import * as fs from 'fs'

fs.writeFileSync('./dist/main/package.json', '{"type": "commonjs"}')
