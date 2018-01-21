const fse = require('fs-extra')
const path = require('path')

fse.copySync(
  path.resolve(__dirname, '../package.json'),
  path.resolve(__dirname, '../build/package.json'),
)
