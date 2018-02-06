import * as React from 'react'
import RadioButtonCheckedIcon from '../internal/svg-icons/RadioButtonChecked'
import RadioButtonUncheckedIcon from '../internal/svg-icons/RadioButtonUnchecked'
import SwitchBase from '../internal/SwitchBase'

export interface Props {
  /**
   * If `true`, the component is checked.
   */
  checked?: boolean|string,
  /**
   * The icon to display when the component is checked.
   * If a string is provided, it will be used as a font ligature.
   */
  checkedIcon?: React.ReactNode,
  /**
   * @ignore
   */
  className?: string,
  /**
   * @ignore
   */
  defaultChecked?: boolean,
  /**
   * If `true`, the switch will be disabled.
   */
  disabled?: boolean,
  /**
   * If `true`, the ripple effect will be disabled.
   */
  disableRipple?: boolean,
  /**
   * The icon to display when the component is unchecked.
   * If a string is provided, it will be used as a font ligature.
   */
  icon?: React.ReactNode,
  /**
   * Properties applied to the `input` element.
   */
  inputProps?: any,
  /**
   * Use that property to pass a ref callback to the native input component.
   */
  inputRef?: (arg?: any) => any,
  /**
   * The input component property `type`.
   */
  inputType?: string,
  /*
   * @ignore
   */
  name?: string,
  /**
   * Callback fired when the state is changed.
   *
   * @param {object} event The event source of the callback
   * @param {boolean} checked The `checked` value of the switch
   */
  onChange?: (arg?: any) => any,
  /**
   * @ignore
   */
  tabIndex?: number|string,
  /**
   * The value of the component.
   */
  value?: string,
}

function Radio(props: Props) {
  return (
    <SwitchBase
      inputType="radio"
      icon={<RadioButtonUncheckedIcon />}
      checkedIcon={<RadioButtonCheckedIcon />}
      classNameDefault="Sui_Radio_default"
      classNameChecked="Sui_Radio_checked"
      classNameDisabled="Sui_Radio_disabled"
      {...props}
    />
  )
}

export default Radio
