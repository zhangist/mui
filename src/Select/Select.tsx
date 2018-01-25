// @inheritedComponent Input

import * as React from 'react'
import Input from '../Input' // Import to enforce the CSS injection order
import SelectInput from './SelectInput'

export interface Props {
  /**
   * If true, the width of the popover will automatically be set according to the items inside the
   * menu, otherwise it will be at least the width of the select input.
   */
  autoWidth?: boolean,
  /**
   * The option elements to populate the select with.
   * Can be some `MenuItem` when `native` is false and `option` when `native` is true.
   */
  children?: any,
  /**
   * If `true`, the selected item is displayed even if its value is empty.
   * You can only use it when the `native` property is `false` (default).
   */
  displayEmpty?: boolean,
  /**
   * An `Input` element does not have to be a material-ui specific `Input`.
   */
  input?: any,
  /**
   * Properties applied to the `Menu` element.
   */
  MenuProps?: any,
  /**
   * If true, `value` must be an array and the menu will support multiple selections.
   * You can only use it when the `native` property is `false` (default).
   */
  multiple?: boolean,
  /**
   * If `true`, the component will be using a native `select` element.
   */
  native?: boolean,
  /**
   * Callback function fired when a menu item is selected.
   *
   * @param {object} event The event source of the callback
   * @param {object} child The react element that was selected
   */
  onChange?: (arg?: any) => any,
  /**
   * Callback fired when the component requests to be closed.
   * Useful in controlled mode (see open).
   *
   * @param {object} event The event source of the callback
   */
  onClose?: (arg?: any) => any,
  /**
   * Callback fired when the component requests to be opened.
   * Useful in controlled mode (see open).
   *
   * @param {object} event The event source of the callback
   */
  onOpen?: (arg?: any) => any,
  /**
   * Control `select` open state.
   * You can only use it when the `native` property is `false` (default).
   */
  open?: boolean,
  /**
   * Render the selected value.
   * You can only use it when the `native` property is `false` (default).
   */
  renderValue?: (arg?: any) => any,
  /**
   * The input value, required for a controlled component.
   */
  value?: string|number|string[]|number[],
}

function Select(props: Props) {
  const {
    autoWidth = false,
    children,
    displayEmpty = false,
    input = <Input />,
    MenuProps,
    multiple = false,
    native = false,
    onClose,
    onOpen,
    open,
    renderValue,
    ...other,
  } = props

  return React.cloneElement(input, {
    // Most of the logic is implemented in `SelectInput`.
    // The `Select` component is a simple API wrapper to expose something better to play with.
    inputComponent: SelectInput,
    ...other,
    inputProps: {
      ...(input ? input.props.inputProps : {}),
      autoWidth,
      children,
      displayEmpty,
      MenuProps,
      multiple,
      native,
      onClose,
      onOpen,
      open,
      renderValue,
    },
  })
}

(Select as any).muiName = 'Select'

export default Select
