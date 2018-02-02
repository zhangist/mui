// @inheritedComponent Paper

import * as classNames from 'classnames'
import * as React from 'react'
import Paper from '../Paper'
import { capitalizeFirstLetter } from '../utils/helpers'

export interface Props {
  /**
   * The content of the component.
   */
  children: React.ReactNode,
  /**
   * @ignore
   */
  className?: string,
  /**
   * The color of the component. It's using the theme palette when that makes sense.
   */
  color?: 'inherit'|'primary'|'secondary'|'default',
  /**
   * The positioning type.
   */
  position?: 'static'|'fixed'|'absolute',
}

function AppBar(props: Props) {
  const {
    children,
    className: classNameProp,
    color = 'primary',
    position = 'fixed',
    ...other,
  } = props

  const className = classNames(
    'Sui_AppBar_root',
    'Sui_AppBar_position-' + position,
    {
      ['Sui_AppBar_color-' + color]: color !== 'inherit',
      'mui-fixed': position === 'fixed', // Useful for the Dialog
    },
    classNameProp,
  )

  return (
    <Paper square component="header" elevation={4} className={className} {...other}>
      {children}
    </Paper>
  )
}

export default AppBar
