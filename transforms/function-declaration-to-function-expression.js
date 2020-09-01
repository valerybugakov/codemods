import util from '../utils/main'

/**
 * Convert function declaration component into arrow-function component.
 *
 * Converts:
 *   export function MyComponent(props: TProps) {
 *      ...
 *   }
 *
 * Into:
 *   export const MyComponent = (props: TProps) => {
 *      ...
 *   }
 *
 */
export default function functionDeclarationToFunctionExpression(file, api, options) {
  const j = api.jscodeshift

  return j(file.source)
    .find(j.ExportNamedDeclaration)
    .find(j.FunctionDeclaration)
    .filter(
      (componentDeclaration) =>
        componentDeclaration.value.params.length &&
        componentDeclaration.value.params[0].name === 'props'
    )
    .replaceWith((componentDeclaration) => {
      const { id, params, body } = componentDeclaration.value

      const componentArrowFunctionDeclaration = j.arrowFunctionExpression(params, body)

      return j.variableDeclaration('const', [
        j.variableDeclarator(id, componentArrowFunctionDeclaration),
      ])
    })
    .toSource(util.getRecastConfig(options))
}
