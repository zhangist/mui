const fse = require('fs-extra')
const path = require('path')

// package.json
fse.copySync(
  path.resolve(__dirname, '../package.json'),
  path.resolve(__dirname, '../build/package.json'),
)

// README.md
fse.copySync(
  path.resolve(__dirname, '../README.md'),
  path.resolve(__dirname, '../build/README.md'),
)
