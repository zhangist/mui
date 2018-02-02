import * as classNames from 'classnames'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import Typography from '../Typography'

export interface Props {
  /**
   * If `true`, the component appears selected.
   */
  checked?: boolean|string,
  /**
   * @ignore
   */
  className?: string,
  /**
   * A control element. For instance, it can be be a `Radio`, a `Switch` or a `Checkbox`.
   */
  control?: any,
  /**
   * If `true`, the control will be disabled.
   */
  disabled?: boolean,
  /**
   * Use that property to pass a ref callback to the native input component.
   */
  inputRef?: (arg?: any) => any,
  /**
   * The text to be used in an enclosing label element.
   */
  label?: React.ReactNode,
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
   * The value of the component.
   */
  value?: string,
}

/**
 * Drop in replacement of the `Radio`, `Switch` and `Checkbox` component.
 * Use this component if you want to display an extra label.
 */
const FormControlLabel: React.SFC<Props> = (props, context) => {
  const {
    checked,
    className: classNameProp,
    control,
    disabled: disabledProp,
    inputRef,
    label,
    name,
    onChange,
    value,
    ...other,
  } = props

  const { muiFormControl } = context
  let disabled = disabledProp

  if (typeof control.props.disabled !== 'undefined') {
    if (typeof disabled === 'undefined') {
      disabled = control.props.disabled
    }
  }

  if (muiFormControl) {
    if (typeof disabled === 'undefined') {
      disabled = muiFormControl.disabled
    }
  }

  const className = classNames(
    'Sui_FormControlLabel_root',
    {
      'Sui_FormControlLabel_disabled': disabled,
    },
    classNameProp,
  )

  return (
    <label className={className} {...other}>
      {React.cloneElement(control, {
        disabled,
        checked: typeof control.props.checked === 'undefined' ? checked : control.props.checked,
        name: control.props.name || name,
        onChange: control.props.onChange || onChange,
        value: control.props.value || value,
        inputRef: control.props.inputRef || inputRef,
      })}
      <Typography component="span" className="Sui_FormControlLabel_label">
        {label}
      </Typography>
    </label>
  )
}

FormControlLabel.contextTypes = {
  muiFormControl: PropTypes.object,
}

export default FormControlLabel
