import * as classNames from 'classnames'
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
   * If `true`, the helper text should be displayed in a disabled state.
   */
  disabled?: boolean,
  /**
   * If `true`, helper text should be displayed in an error state.
   */
  error?: boolean,
  /**
   * If `dense`, will adjust vertical spacing. This is normally obtained via context from
   * FormControl.
   */
  margin?: 'dense',
  id?: string,
}

export interface ContextTypes {
  muiFormControl?: any,
}

function FormHelperText(props: Props, context: ContextTypes) {
  const {
    children,
    className: classNameProp,
    disabled: disabledProp,
    error: errorProp,
    margin: marginProp,
    ...other,
  } = props
  const { muiFormControl } = context

  let disabled = disabledProp
  let error = errorProp
  let margin = marginProp

  if (muiFormControl) {
    if (typeof disabled === 'undefined') {
      disabled = muiFormControl.disabled
    }

    if (typeof error === 'undefined') {
      error = muiFormControl.error
    }

    if (typeof margin === 'undefined') {
      margin = muiFormControl.margin
    }
  }

  const className = classNames(
    'Sui_FormHelperText_root',
    {
      'Sui_FormHelperText_disabled': disabled,
      'Sui_FormHelperText_error': error,
      'Sui_FormHelperText_dense': margin === 'dense',
    },
    classNameProp,
  )

  return (
    <p className={className} {...other}>
      {children}
    </p>
  )
}

export default FormHelperText
