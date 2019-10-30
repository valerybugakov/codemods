import util from '../utils/main'

/**
 * Convert default component import into named one.
 *
 * Converts:
 *   import MyPage, { TMyPageProps } from './MyPage'
 *
 *   export default withRouter<TMyPageProps>(MyPage)
 *
 * Into:
 *   import { MyPage as MyPageComponent, TMyPageProps } from './MyPage'
 *
 *   export const MyPage = withRouter(MyPageComponent)
 *
 */
export default function containerComponentDefaultImportToNamed(file, api, options) {
  const j = api.jscodeshift
  const root = j(file.source)

  // Find export default
  const [exportRef] = root.find(j.ExportDefaultDeclaration).paths()

  if (!exportRef) return

  debugger

  const containerArgsParent = exportRef.value.declaration.expression || exportRef.value.declaration
  const componentName = containerArgsParent.arguments[0].name
  const componentNameImported = `${componentName}Component`

  const [_, containerArgument] = root.find(j.Identifier, { name: componentName }).paths()
  j(containerArgument).replaceWith(j.identifier(componentNameImported))

  // Wrap class declaration into named export
  const updatedExportDeclaration = j.exportNamedDeclaration(
    j.variableDeclaration('const', [
      j.variableDeclarator(j.identifier(componentName), exportRef.value.declaration)
    ])
  )

  const [importRef] = root
    .find(j.ImportDefaultSpecifier, { local: { name: componentName } })
    .paths()
  const namedImport = j.importSpecifier(
    j.identifier(componentName),
    j.identifier(componentNameImported)
  )

  const importSpecifiers = importRef.parentPath.value
  importSpecifiers.push(namedImport)

  // Update export argument name
  j(importRef).remove()
  j(exportRef).replaceWith(updatedExportDeclaration)

  return root.toSource(util.getRecastConfig(options))
}
