import * as classNames from 'classnames'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import Icon from '../Icon'
import IconButton from '../IconButton'
import CheckBoxIcon from '../internal/svg-icons/CheckBox'
import CheckBoxOutlineBlankIcon from '../internal/svg-icons/CheckBoxOutlineBlank'

// NB: If changed, please update Checkbox, Switch and Radio
// so that the API documentation is updated.
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
   * If `true`, the component appears indeterminate.
   */
  indeterminate?: boolean,
  /**
   * The icon to display when the component is indeterminate.
   * If a string is provided, it will be used as a font ligature.
   */
  indeterminateIcon?: React.ReactNode,
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
  onChange?: (arg?: any, arg2?: any) => any,
  /**
   * @ignore
   */
  tabIndex?: number|string,
  /**
   * The value of the component.
   */
  value?: string,
}

/**
 * @ignore - internal component.
 */
class SwitchBase extends React.Component<Props, {}> {
  public static contextTypes = {
    muiFormControl: PropTypes.object,
  }

  public static defaultProps = {
    checkedIcon: <CheckBoxIcon />,
    disableRipple: false,
    icon: <CheckBoxOutlineBlankIcon />,
    inputType: 'checkbox',
  }

  public state = {
    checked: false,
  }

  public input: any = null
  public isControlled: any = null

  public componentWillMount() {
    const { props } = this

    this.isControlled = props.checked != null

    if (!this.isControlled) {
      // not controlled, use internal state
      this.setState({
        checked: props.defaultChecked !== undefined ? props.defaultChecked : false,
      })
    }
  }

  public handleInputChange = (event: any) => {
    const checked = event.target.checked

    if (!this.isControlled) {
      this.setState({ checked })
    }

    if (this.props.onChange) {
      this.props.onChange(event, checked)
    }
  }

  public render() {
    const {
      checked: checkedProp,
      checkedIcon,
      className: classNameProp,
      disabled: disabledProp,
      icon: iconProp,
      inputProps,
      inputRef,
      inputType,
      name,
      onChange,
      tabIndex,
      value,
      ...other,
    } = this.props

    const { muiFormControl } = this.context
    let disabled = disabledProp

    if (muiFormControl) {
      if (typeof disabled === 'undefined') {
        disabled = muiFormControl.disabled
      }
    }

    const checked: any = this.isControlled ? checkedProp : this.state.checked
    const className = classNames('Sui_SwitchBase_root', 'Sui_SwitchBase_default', classNameProp, {
      'Sui_SwitchBase_checked': checked,
      'Sui_SwitchBase_disabled': disabled,
    })

    let icon = checked ? checkedIcon : iconProp

    if (typeof icon === 'string') {
      icon = <Icon>{icon}</Icon>
    }

    return (
      <IconButton
        data-mui-test="SwitchBase"
        component="span"
        className={className}
        disabled={disabled}
        role={undefined}
        {...other}
      >
        {icon}
        <input
          type={inputType}
          name={name}
          checked={checkedProp}
          onChange={this.handleInputChange}
          className="Sui_SwitchBase_input"
          disabled={disabled}
          tabIndex={tabIndex}
          value={value}
          ref={inputRef}
          {...inputProps}
        />
      </IconButton>
    )
  }
}

export default SwitchBase
