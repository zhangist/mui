import * as classNames from 'classnames'
import * as React from 'react'
import { capitalizeFirstLetter } from '../utils/helpers'

export interface Props {
  /**
   * The name of the icon font ligature.
   */
  children?: React.ReactNode,
  /**
   * @ignore
   */
  className?: string,
  /**
   * The color of the component. It's using the theme palette when that makes sense.
   */
  color?: 'inherit'|'secondary'|'action'|'disabled'|'error'|'primary',
}

function Icon(props: Props) {
  const {
    children,
    className: classNameProp,
    color = 'inherit',
    ...other,
  } = props

  const className = classNames(
    'material-icons',
    'Sui_Icon_root',
    {
      ['Sui_Icon_color-' + color]: color !== 'inherit',
    },
    classNameProp,
  )

  return (
    <span className={className} aria-hidden="true" {...other}>
      {children}
    </span>
  )
}

(Icon as any).muiName = 'Icon'

export default Icon
