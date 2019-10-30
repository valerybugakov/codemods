import util from '../utils/main'

/**
 * Convert default export of class into named one.
 *
 * Converts:
 *   class MyPage extends Component {}
 *
 *   export default MyPage
 *
 * Into:
 *   export class MyPage extends Component {}
 *
 */
export default function classDefaultExportToNamed(file, api, options) {
  const j = api.jscodeshift
  const root = j(file.source)

  // Find export default
  const [exportRef] = root.find(j.ExportDefaultDeclaration).paths()

  // Find related class declaration
  const [classRef] = root
    .find(j.ClassDeclaration, {
      id: {
        name: exportRef.value.declaration.name
      }
    })
    .paths()

  // Wrap class declaration into named export
  const updatedClassDeclaration = j.exportNamedDeclaration(classRef.value)
  j(classRef).replaceWith(updatedClassDeclaration)

  // Remove export default
  j(exportRef).remove()

  return root.toSource(util.getRecastConfig(options))
}
