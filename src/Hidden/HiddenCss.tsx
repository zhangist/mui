import * as PropTypes from 'prop-types'
import * as React from 'react'
import * as warning from 'warning'
import { capitalizeFirstLetter } from '../utils/helpers'

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
function HiddenCss(props: Props) {
  const {
    children,
    lgDown,
    lgUp,
    mdDown,
    mdUp,
    only,
    smDown,
    smUp,
    xlDown,
    xlUp,
    xsDown,
    xsUp,
    ...other,
  } = props

  warning(
    Object.keys(other).length === 0 ||
      (Object.keys(other).length === 1 && other.hasOwnProperty('ref')),
    `Material-UI: unsupported properties received ${Object.keys(other).join(
      ', ',
    )} by \`<Hidden />\`.`,
  )

  const className: any = []

  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < breakpointKeys.length; i += 1) {
    const breakpoint = breakpointKeys[i]
    const breakpointUp = (props as any)[`${breakpoint}Up`]
    const breakpointDown = (props as any)[`${breakpoint}Down`]

    if (breakpointUp) {
      className.push(`Sui_HiddenCss_${breakpoint}-up`)
    }
    if (breakpointDown) {
      className.push(`Sui_HiddenCss_${breakpoint}-down`)
    }
  }

  if (only) {
    const onlyBreakpoints = Array.isArray(only) ? only : [only]
    onlyBreakpoints.forEach((breakpoint: string) => {
      className.push(`Sui_HiddenCss_only-${breakpoint}`)
    })
  }

  return <div className={className}>{children}</div>
}

export default HiddenCss
