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

  const containerArgsParent = exportRef.value.declaration.expression || exportRef.value.declaration
  const componentName = containerArgsParent.arguments[0].name
  const componentNameImported = `${componentName}Component`

  // Replace argument of the exported CallExpression with suffixed one
  const [_, containerArgument] = root.find(j.Identifier, { name: componentName }).paths()
  j(containerArgument).replaceWith(j.identifier(componentNameImported))

  // Convert default export into named export using component name
  const updatedExportDeclaration = j.exportNamedDeclaration(
    j.variableDeclaration('const', [
      j.variableDeclarator(j.identifier(componentName), exportRef.value.declaration)
    ])
  )

  // Find default import specifier using component name
  const [importRef] = root
    .find(j.ImportDefaultSpecifier, { local: { name: componentName } })
    .paths()
  const namedImport = j.importSpecifier(
    j.identifier(componentName),
    j.identifier(componentNameImported)
  )

  // Add named import specifier into import statement
  const importSpecifiers = importRef.parentPath.value
  importSpecifiers.push(namedImport)

  // Remove default import and replace export declaration with the updated one
  j(importRef).remove()
  j(exportRef).replaceWith(updatedExportDeclaration)

  return root.toSource(util.getRecastConfig(options))
}
