import * as classNames from 'classnames'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import { isMuiComponent } from '../utils/reactHelpers'
import Textarea from './Textarea'

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
   * The CSS class name of the wrapper element.
   */
  className?: string,
  /**
   * The default input value, useful when not controlling the component.
   */
  defaultValue?: string|number,
  /**
   * If `true`, the input will be disabled.
   */
  disabled?: boolean,
  /**
   * If `true`, the input will not have an underline.
   */
  disableUnderline?: boolean,
  /**
   * End `InputAdornment` for this component.
   */
  endAdornment?: any,
  /**
   * If `true`, the input will indicate an error. This is normally obtained via context from
   * FormControl.
   */
  error?: boolean,
  /**
   * If `true`, the input will take up the full width of its container.
   */
  fullWidth?: boolean,
  /**
   * The id of the `input` element.
   */
  id?: string,
  /**
   * The component used for the native input.
   * Either a string to use a DOM element or a component.
   */
  inputComponent?: string|((arg?: any) => any),
  /**
   * Properties applied to the `input` element.
   */
  inputProps?: any|object,
  /**
   * Use that property to pass a ref callback to the native input component.
   */
  inputRef?: (arg?: any) => any,
  /**
   * If `dense`, will adjust vertical spacing. This is normally obtained via context from
   * FormControl.
   */
  margin?: 'dense'|'none',
  /**
   * If `true`, a textarea element will be rendered.
   */
  multiline?: boolean,
  /**
   * Name attribute of the `input` element.
   */
  name?: string,
  /**
   * @ignore
   */
  onBlur?: (arg?: any) => any,
  /**
   * Callback fired when the value is changed.
   *
   * @param {object} event The event source of the callback
   */
  onChange?: (arg?: any) => any,
  /**
   * TODO
   */
  onClean?: (arg?: any) => any,
  /**
   * TODO
   */
  onDirty?: (arg?: any) => any,
  /**
   * @ignore
   */
  onFocus?: (arg?: any) => any,
  /**
   * @ignore
   */
  onKeyDown?: (arg?: any) => any,
  /**
   * @ignore
   */
  onKeyUp?: (arg?: any) => any,
  /**
   * The short hint displayed in the input before the user enters a value.
   */
  placeholder?: string,
  /**
   * @ignore
   */
  readOnly?: boolean,
  /**
   * Number of rows to display when multiline option is set to true.
   */
  rows?: string|number,
  /**
   * Maximum number of rows to display when multiline option is set to true.
   */
  rowsMax?: string|number,
  /**
   * Start `InputAdornment` for this component.
   */
  startAdornment?: any,
  /**
   * Type of the input element. It should be a valid HTML5 input type.
   */
  type?: string,
  /**
   * The input value, required for a controlled component.
   */
  value?: string|number|string[]|number[],
}

// Supports determination of isControlled().
// Controlled input accepts its current value as a prop.
//
// @see https://facebook.github.io/react/docs/forms.html#controlled-components
// @param value
// @returns {boolean} true if string (including '') or number (including zero)
export function hasValue(value: any) {
  return value != null && !(Array.isArray(value) && value.length === 0)
}

// Determine if field is dirty (a.k.a. filled).
//
// Response determines if label is presented above field or as placeholder.
//
// @param obj
// @param SSR
// @returns {boolean} False when not present or empty string.
//                    True when any number or string with length.
export function isDirty(obj: any, SSR = false) {
  return (
    obj &&
    ((hasValue(obj.value) && obj.value !== '') ||
      (SSR && hasValue(obj.defaultValue) && obj.defaultValue !== ''))
  )
}

// Determine if an Input is adorned on start.
// It's corresponding to the left with LTR.
//
// @param obj
// @returns {boolean} False when no adornments.
//                    True when adorned at the start.
export function isAdornedStart(obj: any) {
  return obj.startAdornment
}

function formControlState(props: any, context: any) {
  let disabled = props.disabled
  let error = props.error
  let margin = props.margin

  if (context.muiFormControl) {
    if (typeof disabled === 'undefined') {
      disabled = context.muiFormControl.disabled
    }

    if (typeof error === 'undefined') {
      error = context.muiFormControl.error
    }

    if (typeof margin === 'undefined') {
      margin = context.muiFormControl.margin
    }
  }

  return {
    disabled,
    error,
    margin,
  }
}

class Input extends React.Component<Props, {}> {
  public static contextTypes = {
    muiFormControl: PropTypes.object,
  }

  public static defaultProps = {
    disableUnderline: false,
    fullWidth: false,
    multiline: false,
    type: 'text',
  }

  public isControlled: any = null
  public muiName = 'Input'
  // Holds the input reference
  public input: any = null
  public state = {
    focused: false,
  }

  public componentWillMount() {
    this.isControlled = this.props.value != null

    if (this.isControlled) {
      this.checkDirty(this.props)
    }
  }

  public componentDidMount() {
    if (!this.isControlled) {
      this.checkDirty(this.input)
    }
  }

  public componentWillReceiveProps(nextProps: any, nextContext: any) {
    // The blur won't fire when the disabled state is set on a focused input.
    // We need to book keep the focused state manually.
    if (
      !formControlState(this.props, this.context).disabled &&
      formControlState(nextProps, nextContext).disabled
    ) {
      this.setState({
        focused: false,
      })
    }
  }

  public componentWillUpdate(nextProps: any, nextState: any, nextContext: any) {
    if (this.isControlled) {
      this.checkDirty(nextProps)
    } // else performed in the onChange

    // Book keep the focused state.
    if (
      !formControlState(this.props, this.context).disabled &&
      formControlState(nextProps, nextContext).disabled
    ) {
      const { muiFormControl } = this.context
      if (muiFormControl && muiFormControl.onBlur) {
        muiFormControl.onBlur()
      }
    }
  }

  public handleFocus = (event: any) => {
    // Fix an bug with IE11 where the focus/blur events are triggered
    // while the input is disabled.
    if (formControlState(this.props, this.context).disabled) {
      event.stopPropagation()
      return
    }

    this.setState({ focused: true })
    if (this.props.onFocus) {
      this.props.onFocus(event)
    }
  }

  public handleBlur = (event: any) => {
    this.setState({ focused: false })
    if (this.props.onBlur) {
      this.props.onBlur(event)
    }
  }

  public handleChange = (event: any) => {
    if (!this.isControlled) {
      this.checkDirty(this.input)
    }

    // Perform in the willUpdate
    if (this.props.onChange) {
      this.props.onChange(event)
    }
  }

  public handleRefInput = (node: any) => {
    this.input = node
    if (this.props.inputRef) {
      this.props.inputRef(node)
    } else if (this.props.inputProps && this.props.inputProps.ref) {
      this.props.inputProps.ref(node)
    }
  }

  public checkDirty(obj: any) {
    const { muiFormControl } = this.context

    if (isDirty(obj)) {
      if (muiFormControl && muiFormControl.onDirty) {
        muiFormControl.onDirty()
      }
      if (this.props.onDirty) {
        this.props.onDirty()
      }
      return
    }

    if (muiFormControl && muiFormControl.onClean) {
      muiFormControl.onClean()
    }
    if (this.props.onClean) {
      this.props.onClean()
    }
  }

  public render() {
    const {
      autoComplete,
      autoFocus,
      className: classNameProp,
      defaultValue,
      disabled: disabledProp,
      disableUnderline,
      endAdornment,
      error: errorProp,
      fullWidth,
      id,
      inputComponent,
      inputProps: { className: inputPropsClassName = '', ...inputPropsProp } = {},
      inputRef,
      margin: marginProp,
      multiline,
      name,
      onBlur,
      onChange,
      onClean,
      onDirty,
      onFocus,
      onKeyDown,
      onKeyUp,
      placeholder,
      readOnly,
      rows,
      rowsMax,
      startAdornment,
      type,
      value,
      ...other,
    } = this.props

    const { muiFormControl } = this.context
    const { disabled, error, margin } = formControlState(this.props, this.context)

    const className = classNames(
      'Sui_Input_root',
      {
        'Sui_Input_disabled': disabled,
        'Sui_Input_error': error,
        'Sui_Input_full-width': fullWidth,
        'Sui_Input_focused': this.state.focused,
        'Sui_Input_form-control': muiFormControl,
        'Sui_Input_inkbar': !disableUnderline,
        'Sui_Input_multiline': multiline,
        'Sui_Input_underline': !disableUnderline,
      },
      classNameProp,
    )

    const inputClassName = classNames(
      'Sui_Input_input',
      {
        'Sui_Input_input-disabled': disabled,
        'Sui_Input_input-singleline': !multiline,
        'Sui_Input_input-multiline': multiline,
        'Sui_Input_input-search': type === 'search',
        'Sui_Input_input-dense': margin === 'dense',
      },
      inputPropsClassName,
    )

    const required = muiFormControl && muiFormControl.required === true

    let InputComponent: any = 'input'
    let inputProps = {
      ...inputPropsProp,
      ref: this.handleRefInput,
    }

    if (inputComponent) {
      InputComponent = inputComponent

      if (isMuiComponent(InputComponent, ['SelectInput'])) {
        inputProps = {
          selectRef: this.handleRefInput,
          ...inputProps,
          ref: null,
        }
      }
    } else if (multiline) {
      if (rows && !rowsMax) {
        InputComponent = 'textarea'
      } else {
        inputProps = {
          rowsMax,
          textareaRef: this.handleRefInput,
          ...inputProps,
          ref: null,
        }
        InputComponent = Textarea
      }
    }

    return (
      <div onBlur={this.handleBlur} onFocus={this.handleFocus} className={className} {...other}>
        {startAdornment}
        <InputComponent
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          className={inputClassName}
          onChange={this.handleChange}
          onKeyUp={onKeyUp}
          onKeyDown={onKeyDown}
          disabled={disabled}
          required={required ? true : undefined}
          value={value}
          id={id}
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          type={type}
          readOnly={readOnly}
          rows={rows}
          aria-required={required}
          aria-invalid={error}
          {...inputProps}
        />
        {endAdornment}
      </div>
    )
  }
}

export default Input
