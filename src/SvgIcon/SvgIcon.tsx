import * as classNames from 'classnames'
import * as React from 'react'
import { capitalizeFirstLetter } from '../utils/helpers'

export interface Props {
  /**
   * Node passed into the SVG element.
   */
  children: any,
  /**
   * @ignore
   */
  className?: string,
  /**
   * The color of the component. It's using the theme palette when that makes sense.
   * You can use the `nativeColor` property to apply a color attribute to the SVG element.
   */
  color?: 'inherit'|'accent'|'action'|'contrast'|'disabled'|'error'|'primary',
  /**
   * Applies a color attribute to the SVG element.
   */
  nativeColor?: string,
  /**
   * Provides a human-readable title for the element that contains it.
   * https://www.w3.org/TR/SVG-access/#Equivalent
   */
  titleAccess?: string,
  /**
   * Allows you to redefine what the coordinates without units mean inside an SVG element.
   * For example, if the SVG element is 500 (width) by 200 (height),
   * and you pass viewBox="0 0 50 20",
   * this means that the coordinates inside the SVG will go from the top left corner (0,0)
   * to bottom right (50,20) and each unit will be worth 10px.
   */
  viewBox?: string,
}

function SvgIcon(props: Props) {
  const {
    children,
    className: classNameProp,
    color = 'inherit',
    nativeColor,
    titleAccess,
    viewBox = '0 0 24 24',
    ...other,
  } = props

  const className = classNames(
    'Sui_SvgIcon-root',
    {
      'Sui_SvgIcon-color-accent': color === 'accent',
      'Sui_SvgIcon-color-action': color === 'action',
      'Sui_SvgIcon-color-contrast': color === 'contrast',
      'Sui_SvgIcon-color-disabled': color === 'disabled',
      'Sui_SvgIcon-color-error': color === 'error',
      'Sui_SvgIcon-color-primary': color === 'primary',
    },
    classNameProp,
  )

  return (
    <svg
      className={className}
      focusable="false"
      viewBox={viewBox}
      color={nativeColor}
      aria-hidden={titleAccess ? 'false' : 'true'}
      {...other}
    >
      {titleAccess ? <title>{titleAccess}</title> : null}
      {children}
    </svg>
  )
}

(SvgIcon as any).muiName = 'SvgIcon'

export default SvgIcon
