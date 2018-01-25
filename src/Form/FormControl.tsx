import * as classNames from 'classnames'
import * as React from 'react'
import { isAdornedStart, isDirty } from '../Input/Input'
import { isMuiElement } from '../utils/reactHelpers'

export interface Props {
  /**
   * The contents of the form control.
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
   * If `true`, the label, input and helper text should be displayed in a disabled state.
   */
  disabled?: boolean,
  /**
   * If `true`, the label should be displayed in an error state.
   */
  error?: boolean,
  /**
   * If `true`, the component, as well as its children,
   * will take up the full width of its container.
   */
  fullWidth?: boolean,
  /**
   * If `dense` or `normal`, will adjust vertical spacing of this and contained components.
   */
  margin?: 'none'|'dense'|'normal',
  /**
   * @ignore
   */
  onBlur?: (arg?: any) => any,
  /**
   * @ignore
   */
  onFocus?: (arg?: any) => any,
  /**
   * If `true`, the label will indicate that the input is required.
   */
  required?: boolean,
}

export interface ChildContextTypes {
  muiFormControl: any,
}

/**
 * Provides context such as dirty/focused/error/required for form inputs.
 * Relying on the context provides high flexibilty and ensures that the state always stay
 * consitent across the children of the `FormControl`.
 * This context is used by the following components:
 *  - FormLabel
 *  - FormHelperText
 *  - Input
 *  - InputLabel
 */
class FormControl extends React.Component<Props, {}> {
  public state = {
    adornedStart: false,
    dirty: false,
    focused: false,
  }

  constructor(props: Props, context: ChildContextTypes) {
    super(props, context)

    // We need to iterate through the children and find the Input in order
    // to fully support server side rendering.
    const { children } = this.props
    if (children) {
      React.Children.forEach(children, (child: any) => {
        if (isMuiElement(child, ['Input', 'Select']) && isDirty(child.props, true)) {
          this.state.dirty = true
        }
        if (isMuiElement(child, ['Input']) && isAdornedStart(child.props)) {
          this.state.adornedStart = true
        }
      })
    }
  }

  public getChildContext() {
    const { disabled, error, required = false, margin } = this.props
    const { adornedStart, dirty, focused } = this.state

    return {
      muiFormControl: {
        adornedStart,
        dirty,
        disabled,
        error,
        focused,
        margin,
        required,
        onDirty: this.handleDirty,
        onClean: this.handleClean,
        onFocus: this.handleFocus,
        onBlur: this.handleBlur,
      },
    }
  }

  public handleFocus = (event: any) => {
    if (this.props.onFocus) {
      this.props.onFocus(event)
    }
    if (!this.state.focused) {
      this.setState({ focused: true })
    }
  }

  public handleBlur = (event: any) => {
    // The event might be undefined.
    // For instance, a child component might call this hook
    // when an input is disabled but still having the focus.
    if (this.props.onBlur && event) {
      this.props.onBlur(event)
    }
    if (this.state.focused) {
      this.setState({ focused: false })
    }
  }

  public handleDirty = () => {
    if (!this.state.dirty) {
      this.setState({ dirty: true })
    }
  }

  public handleClean = () => {
    if (this.state.dirty) {
      this.setState({ dirty: false })
    }
  }

  public render() {
    const {
      children,
      className,
      component: ComponentProp = 'div',
      disabled = false,
      error = false,
      fullWidth = false,
      margin = 'none',
      ...other,
    } = this.props

    return (
      <ComponentProp
        className={classNames(
          'Sui_FormControl-root',
          {
            'Sui_FormControl-margin-normal': margin === 'normal',
            'Sui_FormControl-margin-dense': margin === 'dense',
            'Sui_FormControl-full-width': fullWidth,
          },
          className,
        )}
        {...other}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
      >
        {children}
      </ComponentProp>
    )
  }
}

export default FormControl
