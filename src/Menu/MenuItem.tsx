// @inheritedComponent ListItem

import * as classNames from 'classnames'
import * as React from 'react'
import ListItem from '../List/ListItem'

export interface Props {
  /**
   * Menu item contents.
   */
  children?: any,
  /**
   * @ignore
   */
  className?: string,
  /**
   * The component used for the root node.
   * Either a string to use a DOM element or a component.
   */
  component?: any,
  /**
   * @ignore
   */
  role?: string,
  /**
   * Use to apply selected styling.
   */
  selected?: boolean,
  value?: any,
}

function MenuItem(props: Props) {
  const {
    className: classNameProp,
    component,
    selected = false,
    role = 'menuitem',
    ...other,
  } = props

  const className = classNames(
    'Sui_MenuItem_root',
    {
      'Sui_MenuItem_selected': selected,
    },
    classNameProp,
  )

  return (
    <ListItem
      button
      role={role}
      tabIndex={-1}
      className={className}
      component={component}
      {...other}
    />
  )
}

export default MenuItem
