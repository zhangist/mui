import * as classNames from 'classnames'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import ButtonBase from '../ButtonBase'
import { isMuiElement } from '../utils/reactHelpers'

export interface Props {
  /**
   * If `true`, the ListItem will be a button.
   */
  button?: boolean,
  /**
   * The content of the component.
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
   * If `true`, compact vertical padding designed for keyboard and mouse input will be used.
   */
  dense?: boolean,
  /**
   * @ignore
   */
  disabled?: boolean,
  /**
   * If `true`, the left and right padding is removed.
   */
  disableGutters?: boolean,
  /**
   * If `true`, a 1px light border is added to the bottom of the list item.
   */
  divider?: boolean,
  role?: string,
  tabIndex?: number,
}

class ListItem extends React.Component<Props, any> {
  public static contextTypes = {
    dense: PropTypes.bool,
  }

  public static childContextTypes = {
    dense: PropTypes.bool,
  }

  public static defaultProps = {
    button: false,
    component: 'li',
    dense: false,
    disabled: false,
    disableGutters: false,
    divider: false,
  }

  public getChildContext() {
    return {
      dense: this.props.dense || this.context.dense || false,
    }
  }

  public render() {
    const {
      button,
      children: childrenProp,
      className: classNameProp,
      component: componentProp,
      dense,
      disabled,
      disableGutters,
      divider,
      ...other,
    } = this.props
    const isDense = dense || this.context.dense || false
    const children = React.Children.toArray(childrenProp)

    const hasAvatar = children.some((value: any) => isMuiElement(value, ['ListItemAvatar']))
    const hasSecondaryAction: any = children.length
      && isMuiElement(children[children.length - 1], ['ListItemSecondaryAction'])

    const className = classNames(
      'Sui_ListItem_root',
      {
        'Sui_ListItem_gutters': !disableGutters,
        'Sui_ListItem_divider': divider,
        'Sui_ListItem_disabled': disabled,
        'Sui_ListItem_button': button,
        'Sui_ListItem_secondary-action': hasSecondaryAction,
        'Sui_ListItem_dense': (isDense || hasAvatar),
        'Sui_ListItem_default': !(isDense || hasAvatar),
      },
      classNameProp,
    )

    const listItemProps: any = { className, disabled, ...other }
    let ComponentMain = componentProp

    if (button) {
      ComponentMain = ButtonBase
      listItemProps.component = componentProp
      listItemProps.keyboardFocusedClassName = 'Sui_ListItem_keyboard-focused'
    }

    if (hasSecondaryAction) {
      return (
        <div className="Sui_ListItem_container">
          <ComponentMain {...listItemProps}>{children}</ComponentMain>
          {children.pop()}
        </div>
      )
    }

    return <ComponentMain {...listItemProps}>{children}</ComponentMain>
  }
}

export default ListItem
