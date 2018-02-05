// @inheritedComponent ButtonBase

import * as classNames from 'classnames'
import * as React from 'react'
import ButtonBase from '../ButtonBase'
import Icon from '../Icon'
import '../SvgIcon' // Ensure CSS specificity
import { capitalizeFirstLetter } from '../utils/helpers'
import { isMuiElement } from '../utils/reactHelpers'

export interface Props {
  /**
   * Use that property to pass a ref callback to the native button component.
   */
  buttonRef?: (arg?: any) => any,
  /**
   * The icon element.
   * If a string is provided, it will be used as an icon font ligature.
   */
  children?: React.ReactNode,
  /**
   * @ignore
   */
  className?: string,
  /**
   * The color of the component. It's using the theme palette when that makes sense.
   */
  color?: 'default'|'inherit'|'primary'|'secondary',
  /**
   * If `true`, the button will be disabled.
   */
  disabled?: boolean,
  /**
   * If `true`, the ripple will be disabled.
   */
  disableRipple?: boolean,
  /**
   * Use that property to pass a ref callback to the root component.
   */
  rootRef?: (arg?: any) => any,
  component?: string,
  role?: string,
}

/**
 * Refer to the [Icons](/style/icons) section of the documentation
 * regarding the available icon options.
 */
function IconButton(props: Props) {
  const {
    buttonRef,
    children,
    className,
    color = 'default',
    disabled = false,
    disableRipple = false,
    rootRef,
    ...other,
  } = props

  return (
    <ButtonBase
      className={classNames(
        'Sui_IconButton_root',
        {
          ['Sui_IconButton_color' + color]: color !== 'default',
          'Sui_IconButton_disabled': disabled,
        },
        className,
      )}
      centerRipple
      focusRipple
      disabled={disabled}
      disableRipple={disableRipple}
      rootRef={buttonRef}
      ref={rootRef}
      {...other}
    >
      <span className="Sui_IconButton_label">
        {typeof children === 'string' ? (
          <Icon className="Sui_IconButton_icon">{children}</Icon>
        ) : (
          React.Children.map(children, (child: any) => {
            if (isMuiElement(child, ['Icon', 'SvgIcon'])) {
              return React.cloneElement(child, {
                className: classNames('Sui_IconButton_icon', child.props.className),
              })
            }

            return child
          })
        )}
      </span>
    </ButtonBase>
  )
}

export default IconButton
