// @inheritedComponent FormControl

import * as React from 'react'
import * as warning from 'warning'
import FormControl from '../Form/FormControl'
import FormHelperText from '../Form/FormHelperText'
import Input, { InputLabel } from '../Input'
import Select from '../Select/Select'

export interface Props {
  /**
   * This property helps users to fill forms faster, especially on mobile devices.
   * The name can be confusing, as it's more like an autofill.
   * You can learn more about it here:
   * https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill
   */
  autoComplete?: string,
  /**
   * If `true`, the input will be focused during the first mount.
   */
  autoFocus?: boolean,
  /**
   * @ignore
   */
  children?: any,
  /**
   * @ignore
   */
  className?: string,
  /**
   * The default value of the `Input` element.
   */
  defaultValue?: string,
  /**
   * If `true`, the input will be disabled.
   */
  disabled?: boolean,
  /**
   * If `true`, the label will be displayed in an error state.
   */
  error?: boolean,
  /**
   * Properties applied to the `FormHelperText` element.
   */
  FormHelperTextProps?: object,
  /**
   * If `true`, the input will take up the full width of its container.
   */
  fullWidth?: boolean,
  /**
   * The helper text content.
   */
  helperText?: any,
  /**
   * The CSS class name of the helper text element.
   */
  helperTextClassName?: string,
  /**
   * The id of the `input` element.
   * Use that property to make `label` and `helperText` accessible for screen readers.
   */
  id?: string,
  /**
   * Properties applied to the `InputLabel` element.
   */
  InputLabelProps?: object,
  /**
   * Properties applied to the `Input` element.
   */
  InputProps?: object,
  /**
   * Properties applied to the native `input` element.
   */
  inputProps?: object,
  /**
   * Use that property to pass a ref callback to the native input component.
   */
  inputRef?: (arg?: any) => any,
  /**
   * The label content.
   */
  label?: any,
  /**
   * The CSS class name of the label element.
   */
  labelClassName?: string,
  /**
   * If `dense` or `normal`, will adjust vertical spacing of this and contained components.
   */
  margin?: 'none'|'dense'|'normal',
  /**
   * If `true`, a textarea element will be rendered instead of an input.
   */
  multiline?: boolean,
  /**
   * Name attribute of the `input` element.
   */
  name?: string,
  /**
   * Callback fired when the value is changed.
   *
   * @param {object} event The event source of the callback
   */
  onChange?: (arg?: any) => any,
  /**
   * The short hint displayed in the input before the user enters a value.
   */
  placeholder?: string,
  /**
   * If `true`, the label is displayed as required.
   */
  required?: boolean,
  /**
   * Use that property to pass a ref callback to the root component.
   */
  rootRef?: (arg?: any) => any,
  /**
   * Number of rows to display when multiline option is set to true.
   */
  rows?: string|number,
  /**
   * Maximum number of rows to display when multiline option is set to true.
   */
  rowsMax?: string|number,
  /**
   * Render a `Select` element while passing the `Input` element to `Select` as `input` parameter.
   * If this option is set you must pass the options of the select as children.
   */
  select?: boolean,
  /**
   * Properties applied to the `Select` element.
   */
  SelectProps?: object,
  /**
   * Type attribute of the `Input` element. It should be a valid HTML5 input type.
   */
  type?: string,
  /**
   * The value of the `Input` element, required for a controlled component.
   */
  value?: string|number|string[]|number[],
}

/**
 * The `TextField` is a convenience wrapper for the most common cases (80%).
 * It cannot be all things to all people, otherwise the API would grow out of control.
 *
 * ## Advanced Configuration
 *
 * It's important to understand that the text field is a simple abstraction
 * on top of the following components:
 * - [FormControl](/api/form-control)
 * - [InputLabel](/api/input-label)
 * - [Input](/api/input)
 * - [FormHelperText](/api/form-helper-text)
 *
 * If you wish to alter the properties applied to the native input, you can do as follow:
 *
 * ```jsx
 * const inputProps = {
 *   step: 300,
 * }
 *
 * return <TextField id="time" type="time" inputProps={inputProps} />
 * ```
 *
 * For advanced cases, please look at the source of TextField by clicking on the
 * "Edit this page" button above. Consider either:
 * - using the upper case props for passing values direct to the components.
 * - using the underlying components directly as shown in the demos.
 */
function TextField(props: Props) {
  const {
    autoComplete,
    autoFocus,
    children,
    className,
    defaultValue,
    disabled,
    error,
    FormHelperTextProps,
    fullWidth,
    helperText,
    helperTextClassName,
    id,
    InputLabelProps,
    inputProps,
    InputProps,
    inputRef,
    label,
    labelClassName,
    multiline,
    name,
    onChange,
    placeholder,
    required = false,
    rootRef,
    rows,
    rowsMax,
    select = false,
    SelectProps,
    type,
    value,
    ...other,
  } = props

  warning(
    !select || Boolean(children),
    'Material-UI: `children` must be passed when using the `TextField` component with `select`.',
  )

  const helperTextId = helperText && id ? `${id}-helper-text` : undefined
  const InputComponent = (
    <Input
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      defaultValue={defaultValue}
      disabled={disabled}
      multiline={multiline}
      name={name}
      rows={rows}
      rowsMax={rowsMax}
      type={type}
      value={value}
      id={id}
      inputRef={inputRef}
      onChange={onChange}
      placeholder={placeholder}
      inputProps={inputProps}
      {...InputProps}
    />
  )

  return (
    <FormControl
      aria-describedby={helperTextId}
      className={className}
      error={error}
      fullWidth={fullWidth}
      ref={rootRef}
      required={required}
      {...other}
    >
      {label && (
        <InputLabel htmlFor={id} className={labelClassName} {...InputLabelProps}>
          {label}
        </InputLabel>
      )}
      {select ? (
        <Select value={value} input={InputComponent} {...SelectProps}>
          {children}
        </Select>
      ) : (
        InputComponent
      )}
      {helperText && (
        <FormHelperText className={helperTextClassName} id={helperTextId} {...FormHelperTextProps}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  )
}

export default TextField
