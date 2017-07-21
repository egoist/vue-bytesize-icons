const fs = require('fs')
const path = require('path')
const pascalCase = require('pascal-case')
const mkdir = require('mkdirp')

const iconsPath = './node_modules/bytesize-icons/dist/icons'
const icons = fs.readdirSync(iconsPath)

const componentTemplate = ({
  name,
  content
}) => `
export const ${getComponentName(name)} = {
  name: '${getComponentName(name)}',
  functional: true,
  render(h, ctx) {
    return ${content.replace(/<svg([^>]+)>/, '<svg$1 {...ctx.data}>')}
  }
}
`

const component = icons.map(name => componentTemplate({
  name,
  content: fs.readFileSync(path.join(iconsPath, name), 'utf8')
})).join('\n')

console.log(component)
mkdir.sync('./src')
fs.writeFileSync('./src/index.js', component, 'utf8')

function getComponentName(v) {
  return pascalCase(v.replace(/\.[a-z]+$/, 'Icon'))
}
