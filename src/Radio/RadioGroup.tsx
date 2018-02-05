// @inheritedComponent FormGroup

import * as React from 'react'
import FormGroup from '../Form/FormGroup'
import { find } from '../utils/helpers'

export interface Props {
  /**
   * The content of the component.
   */
  children?: React.ReactNode,
  /**
   * The name used to reference the value of the control.
   */
  name?: string,
  /**
   * @ignore
   */
  onBlur?: (arg?: any) => any,
  /**
   * Callback fired when a radio button is selected.
   *
   * @param {object} event The event source of the callback
   * @param {string} value The `value` of the selected radio button
   */
  onChange?: (arg?: any, arg2?: any) => any,
  /**
   * @ignore
   */
  onKeyDown?: (arg?: any) => any,
  /**
   * Value of the selected radio button.
   */
  value?: string,
}

class RadioGroup extends React.Component<Props, {}> {
  public radios: any[] = []

  public focus = () => {
    if (!this.radios || !this.radios.length) {
      return
    }

    const focusRadios = this.radios.filter((n: any) => !n.disabled)

    if (!focusRadios.length) {
      return
    }

    const selectedRadio = find(focusRadios, (n: any) => n.checked)

    if (selectedRadio) {
      selectedRadio.focus()
      return
    }

    focusRadios[0].focus()
  }

  public handleRadioChange = (event: any, checked: any) => {
    if (checked && this.props.onChange) {
      this.props.onChange(event, event.target.value)
    }
  }

  public render() {
    const {
      children,
      name,
      value,
      onChange,
      ...other,
    } = this.props

    this.radios = []

    return (
      <FormGroup data-mui-test="RadioGroup" role="radiogroup" {...other}>
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) {
            return null
          }

          return React.cloneElement((child as any), {
            key: index,
            name,
            inputRef: (node: any) => {
              if (node) {
                this.radios.push(node)
              }
            },
            checked: value === (child.props as any).value,
            onChange: this.handleRadioChange,
          })
        })}
      </FormGroup>
    )
  }
}

export default RadioGroup
