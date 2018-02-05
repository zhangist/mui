import * as React from 'react'
import HiddenCss from './HiddenCss'
import HiddenJs from './HiddenJs'

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
  only: 'xs'|'sm'|'md'|'lg'|'xl'|['xs']|['sm']|['md']|['lg']|['xl'],
  /**
   * If true, screens this size and down will be hidden.
   */
  smDown?: boolean,
  /**
   * If true, screens this size and up will be hidden.
   */
  smUp?: boolean,
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
 * Responsively hides children based on the selected implementation.
 */
const Hidden: React.SFC<Props> = (props) => {
  const { implementation, ...other } = props

  if (implementation === 'js') {
    return <HiddenJs {...other} />
  }

  return <HiddenCss {...other} />
}

Hidden.defaultProps = {
  implementation: 'js',
  lgDown: false,
  lgUp: false,
  mdDown: false,
  mdUp: false,
  smDown: false,
  smUp: false,
  xlDown: false,
  xlUp: false,
  xsDown: false,
  xsUp: false,
}

export default Hidden
