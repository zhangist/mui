// @inheritedComponent ButtonBase

import * as classNames from 'classnames'
import * as React from 'react'
import ButtonBase , { Props as ButtonBaseProps } from '../ButtonBase/ButtonBase'

export interface Props {
  /**
   * The content of the button.
   */
  children: any,
  /**
   * @ignore
   */
  className?: string,
  /**
   * The color of the component. It's using the theme palette when that makes sense.
   */
  color?: 'default'|'inherit'|'primary'|'accent'|'contrast',
  /**
   * The component used for the root node.
   * Either a string to use a DOM element or a component.
   * The default value is a `button`.
   */
  component?: any,
  /**
   * Uses a smaller minWidth, ideal for things like card actions.
   */
  dense?: boolean,
  /**
   * If `true`, the button will be disabled.
   */
  disabled?: boolean,
  /**
   * If `true`, the  keyboard focus ripple will be disabled.
   * `disableRipple` must also be true.
   */
  disableFocusRipple?: boolean,
  /**
   * If `true`, the ripple effect will be disabled.
   */
  disableRipple?: boolean,
  /**
   * If `true`, will use floating action button styling.
   */
  fab?: boolean,
  /**
   * If `true`, the button will take up the full width of its container.
   */
  fullWidth?: boolean,
  /**
   * The URL to link to when the button is clicked.
   * If defined, an `a` element will be used as the root node.
   */
  href?: string,
  /**
   * If `true`, and `fab` is `true`, will use mini floating action button styling.
   */
  mini?: boolean,
  /**
   * If `true`, the button will use raised styling.
   */
  raised?: boolean,
  /**
   * @ignore
   */
  type?: string,
}

class Button extends React.Component<Props & ButtonBaseProps, any> {
  public render() {
    const {
      children,
      className: classNameProp,
      color = 'default',
      dense = false,
      disabled = false,
      disableFocusRipple = false,
      disableRipple = false,
      fab = false,
      fullWidth = false,
      mini = false,
      raised = false,
      type = 'button',
      ...other,
    } = this.props

    const flat = !raised && !fab
    const className = classNames(
      'Sui_Button_root',
      {
        'Sui_Button_raised': raised || fab,
        'Sui_Button_fab': fab,
        'Sui_Button_mini': fab && mini,
        'Sui_Button_color-inherit': color === 'inherit',
        'Sui_Button_flat-primary': flat && color === 'primary',
        'Sui_Button_flat-accent': flat && color === 'accent',
        'Sui_Button_flat-contrast': flat && color === 'contrast',
        'Sui_Button_raised-primary': !flat && color === 'primary',
        'Sui_Button_raised-accent': !flat && color === 'accent',
        'Sui_Button_raised-contrast': !flat && color === 'contrast',
        'Sui_Button_dense': dense,
        'Sui_Button_disabled': disabled,
        'Sui_Button_full-width': fullWidth,
      },
      classNameProp,
    )

    return (
      <ButtonBase
        className={className}
        disabled={disabled}
        disableRipple={disableRipple}
        focusRipple={!disableFocusRipple}
        keyboardFocusedClassName="Sui_Button_keyboard-focused"
        type={type}
        {...other}
      >
        <span className="Sui_Button_label">{children}</span>
      </ButtonBase>
    )
  }
}

export default Button
