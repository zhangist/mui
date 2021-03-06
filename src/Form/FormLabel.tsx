import * as classNames from 'classnames'
import * as PropTypes from 'prop-types'
import * as React from 'react'

export interface Props {
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
  component?: string|((arg?: any) => any),
  /**
   * If `true`, the label should be displayed in a disabled state.
   */
  disabled?: boolean,
  /**
   * If `true`, the label should be displayed in an error state.
   */
  error?: boolean,
  /**
   * If `true`, the input of this label is focused (used by `FormGroup` components).
   */
  focused?: boolean,
  /**
   * If `true`, the label will indicate that the input is required.
   */
  required?: boolean,
}

const FormLabel: React.SFC<Props> = (props, context) => {
  const {
    children,
    className: classNameProp,
    component: Component = 'label',
    disabled: disabledProp,
    error: errorProp,
    focused: focusedProp,
    required: requiredProp,
    ...other,
  } = props

  const { muiFormControl } = context

  let required = requiredProp
  let focused = focusedProp
  let disabled = disabledProp
  let error = errorProp

  if (muiFormControl) {
    if (typeof required === 'undefined') {
      required = muiFormControl.required
    }
    if (typeof focused === 'undefined') {
      focused = muiFormControl.focused
    }
    if (typeof disabled === 'undefined') {
      disabled = muiFormControl.disabled
    }
    if (typeof error === 'undefined') {
      error = muiFormControl.error
    }
  }

  const className = classNames(
    'Sui_FormLabel_root',
    {
      'Sui_FormLabel_focused': focused,
      'Sui_FormLabel_disabled': disabled,
      'Sui_FormLabel_error': error,
    },
    classNameProp,
  )

  const asteriskClassName = classNames({
    'Sui_FormLabel_error': error,
  })

  return (
    <Component className={className} {...other}>
      {children}
      {required && (
        <span className={asteriskClassName} data-mui-test="FormLabelAsterisk">
          {'\u2009*'}
        </span>
      )}
    </Component>
  )
}

FormLabel.contextTypes = {
  muiFormControl: PropTypes.object,
}

export default FormLabel
