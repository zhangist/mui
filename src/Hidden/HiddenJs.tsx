import * as warning from 'warning'
import withWidth, { isWidthDown, isWidthUp } from '../utils/withWidth'

const breakpointKeys = ['xs', 'sm', 'md', 'lg', 'xl']

export interface Props {
  /**
   * The content of the component.
   */
  children?: React.ReactNode,
  /**
   * @ignore
   */
  className?: string,
  /**
   * Specify which implementation to use.  'js' is the default, 'css' works better for server
   * side rendering.
   */
  implementation?: 'js'|'css',
  /**
   * You can use this property when choosing the `js` implementation with server side rendering.
   *
   * As `window.innerWidth` is unavailable on the server,
   * we default to rendering an empty componenent during the first mount.
   * In some situation you might want to use an heristic to approximate
   * the screen width of the client browser screen width.
   *
   * For instance, you could be using the user-agent or the client-hints.
   * http://caniuse.com/#search=client%20hint
   */
  initialWidth?: 'xs'|'sm'|'md'|'lg'|'xl',
  /**
   * If true, screens this size and down will be hidden.
   */
  lgDown?: boolean,
  /**
   * If true, screens this size and up will be hidden.
   */
  lgUp?: boolean,
  /**
   * If true, screens this size and down will be hidden.
   */
  mdDown?: boolean,
  /**
   * If true, screens this size and up will be hidden.
   */
  mdUp?: boolean,
  /**
   * Hide the given breakpoint(s).
   */
  only?: 'xs'|'sm'|'md'|'lg'|'xl'|['xs']|['sm']|['md']|['lg']|['xl'],
  /**
   * If true, screens this size and down will be hidden.
   */
  smDown?: boolean,
  /**
   * If true, screens this size and up will be hidden.
   */
  smUp?: boolean,
  /**
   * @ignore
   * width prop provided by withWidth decorator.
   */
  width: string,
  /**
   * If true, screens this size and down will be hidden.
   */
  xlDown?: boolean,
  /**
   * If true, screens this size and up will be hidden.
   */
  xlUp?: boolean,
  /**
   * If true, screens this size and down will be hidden.
   */
  xsDown?: boolean,
  /**
   * If true, screens this size and up will be hidden.
   */
  xsUp?: boolean,
}

/**
 * @ignore - internal component.
 */
function HiddenJs(props: Props) {
  const {
    children,
    lgDown,
    lgUp,
    mdDown,
    mdUp,
    only,
    smDown,
    smUp,
    width,
    xlDown,
    xlUp,
    xsDown,
    xsUp,
    ...other,
  } = props

  warning(
    Object.keys(other).length === 0,
    `Material-UI: unsupported properties received ${JSON.stringify(other)} by \`<Hidden />\`.`,
  )

  let visible = true

  // `only` check is faster to get out sooner if used.
  if (only) {
    if (Array.isArray(only)) {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < only.length; i += 1) {
        const breakpoint = only[i]
        if (width === breakpoint) {
          visible = false
          break
        }
      }
    } else if (only && width === only) {
      visible = false
    }
  }

  // Allow `only` to be combined with other props. If already hidden, no need to check others.
  if (visible) {
    // determine visibility based on the smallest size up
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < breakpointKeys.length; i += 1) {
      const breakpoint = breakpointKeys[i]
      const breakpointUp = (props as any)[`${breakpoint}Up`]
      const breakpointDown = (props as any)[`${breakpoint}Down`]
      if (
        (breakpointUp && isWidthUp(breakpoint, width)) ||
        (breakpointDown && isWidthDown(breakpoint, width))
      ) {
        visible = false
        break
      }
    }
  }

  if (!visible) {
    return null
  }

  return children
}

export default withWidth()(HiddenJs)
