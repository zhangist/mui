import * as classNames from 'classnames'
import * as keycode from 'keycode'
import * as React from 'react'
import * as warning from 'warning'
import { isDirty } from '../Input/Input'
import ArrowDropDownIcon from '../internal/svg-icons/ArrowDropDown'
import Menu from '../Menu/Menu'

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
   * The CSS class name of the select element.
   */
  className?: string,
  /**
   * If `true`, the select will be disabled.
   */
  disabled?: boolean,
  /**
   * If `true`, the selected item is displayed even if its value is empty.
   * You can only use it when the `native` property is `false` (default).
   */
  displayEmpty?: boolean,
  /**
   * Properties applied to the `Menu` element.
   */
  MenuProps?: any,
  /**
   * If true, `value` must be an array and the menu will support multiple selections.
   * You can only use it when the `native` property is `false` (default).
   */
  multiple: boolean,
  /**
   * Name attribute of the `select` or hidden `input` element.
   */
  name?: string,
  /**
   * If `true`, the component will be using a native `select` element.
   */
  native?: boolean,
  /**
   * @ignore
   */
  onBlur?: (arg?: any) => any,
  /**
   * Callback function fired when a menu item is selected.
   *
   * @param {object} event The event source of the callback
   * @param {object} child The react element that was selected
   */
  onChange?: (arg?: any, arg2?: any) => any,
  /**
   * Callback fired when the component requests to be closed.
   * Useful in controlled mode (see open).
   *
   * @param {object} event The event source of the callback
   */
  onClose?: (arg?: any) => any,
  /**
   * @ignore
   */
  onFocus?: (arg?: any) => any,
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
   * @ignore
   */
  readOnly?: boolean,
  /**
   * Render the selected value.
   * You can only use it when the `native` property is `false` (default).
   */
  renderValue?: (arg?: any) => any,
  /**
   * Use that property to pass a ref callback to the native select element.
   */
  selectRef?: (arg?: any) => any,
  /**
   * The value of the component, required for a controlled component.
   */
  value?: string|number|string[],
}

/**
 * @ignore - internal component.
 */
class SelectInput extends React.Component<Props, {}> {
  public state = {
    anchorEl: null,
    open: false,
  }

  public ignoreNextBlur = false

  public isControlled = this.props.open !== undefined

  public update = this.isControlled
    ? ({ event, open, anchorEl }: any) => {
        if (open) {
          if (this.props.onOpen) {
            this.props.onOpen(event)
          }
        } else {
          if (this.props.onClose) {
            this.props.onClose(event)
          }
        }
        this.setState({ anchorEl })
      }
    : ({ open, anchorEl }: any) => this.setState({ open, anchorEl })

  public handleClick = (event: any) => {
    // Opening the menu is going to blur the. It will be focused back when closed.
    this.ignoreNextBlur = true
    this.update({
      open: true,
      anchorEl: event.currentTarget,
      event,
    })
  }

  public handleClose = (event: any) => {
    this.update({
      open: false,
      event,
    })
  }

  public handleItemClick = (child: any) => (event: any) => {
    if (!this.props.multiple) {
      this.update({
        open: false,
        event,
      })
    }

    if (this.props.onChange) {
      const { onChange, name } = this.props
      let value
      let target

      if (event.target) {
        target = event.target
      }

      if (this.props.multiple) {
        value = Array.isArray(this.props.value) ? [...this.props.value] : []
        const itemIndex = value.indexOf(child.props.value)
        if (itemIndex === -1) {
          value.push(child.props.value)
        } else {
          value.splice(itemIndex, 1)
        }
      } else {
        value = child.props.value
      }

      event.persist()
      event.target = { ...target, value, name }

      onChange(event, child)
    }
  }

  public handleBlur = (event: any) => {
    if (this.ignoreNextBlur === true) {
      // The parent components are relying on the bubbling of the event.
      event.stopPropagation()
      this.ignoreNextBlur = false
      return
    }

    if (this.props.onBlur) {
      this.props.onBlur(event)
    }
  }

  public handleKeyDown = (event: any) => {
    if (this.props.readOnly) {
      return
    }

    if (['space', 'up', 'down'].indexOf(keycode(event)) > -1) {
      event.preventDefault()
      // Opening the menu is going to blur the. It will be focused back when closed.
      this.ignoreNextBlur = true
      this.update({
        open: true,
        anchorEl: event.currentTarget,
        event,
      })
    }
  }

  public handleSelectRef = (node: any) => {
    if (!this.props.selectRef) {
      return
    }

    this.props.selectRef({
      node,
      // By pass the native input as we expose a rich object (array).
      value: this.props.value,
    })
  }

  public render() {
    const {
      autoWidth,
      children,
      className: classNameProp,
      disabled,
      displayEmpty,
      MenuProps = {},
      multiple,
      name,
      native,
      onBlur,
      onChange,
      onClose,
      onFocus,
      onOpen,
      open,
      readOnly,
      renderValue,
      selectRef,
      value,
      ...other,
    } = this.props

    if (native) {
      warning(
        multiple === false,
        'Material-UI: you can not use the `native` and `multiple` properties ' +
          'at the same time on a `Select` component.',
      )
      warning(
        !renderValue,
        'Material-UI: the `renderValue` property is not used by the native implementation.',
      )
      warning(
        !displayEmpty,
        'Material-UI: the `displayEmpty` property is not used by the native implementation.',
      )

      return (
        <div className="Sui_Select_root">
          <select
            className={classNames(
              'Sui_Select_select',
              {
                'Sui_Select_disabled': disabled,
              },
              classNameProp,
            )}
            name={name}
            disabled={disabled}
            onBlur={onBlur}
            onChange={onChange}
            onFocus={onFocus}
            value={value}
            ref={selectRef}
            {...other}
          >
            {children}
          </select>
          <ArrowDropDownIcon className="Sui_Select_icon" />
        </div>
      )
    }

    if (value === undefined) {
      throw new Error(
        'Material-UI: the `value` property is required ' +
          'when using the `Select` component with `native=false`.',
      )
    }

    let display
    let displaySingle = ''
    const displayMultiple: any[] = []
    let computeDisplay = false

    // No need to display any value if the field is empty.
    if (isDirty(this.props) || displayEmpty) {
      if (renderValue) {
        display = renderValue(value)
      } else {
        computeDisplay = true
      }
    }

    const items = React.Children.map(children, (child: any) => {
      if (!React.isValidElement(child)) {
        return null
      }
      let selected

      if (multiple) {
        if (!Array.isArray(value)) {
          throw new Error(
            'Material-UI: the `value` property must be an array ' +
              'when using the `Select` component with `multiple`.',
          )
        }

        selected = value.indexOf((child.props as any).value) !== -1
        if (selected && computeDisplay) {
          displayMultiple.push((child.props as any).children)
        }
      } else {
        selected = value === (child.props as any).value
        if (selected && computeDisplay) {
          displaySingle = (child.props as any).children
        }
      }

      return React.cloneElement((child as any), {
        role: 'option',
        selected,
        onClick: this.handleItemClick(child),
      })
    })

    if (computeDisplay) {
      display = multiple ? displayMultiple.join(', ') : displaySingle
    }

    const anchorEl: any = this.state.anchorEl ? this.state.anchorEl : {}
    const minimumMenuWidth =
      this.state.anchorEl != null && !autoWidth ? anchorEl.clientWidth : undefined

    return (
      <div className="Sui_Select_root">
        <div
          className={classNames(
            'Sui_Select_select',
            'Sui_Select_select-menu',
            {
              'Sui_Select_disabled': disabled,
            },
            classNameProp,
          )}
          data-mui-test="SelectDisplay"
          aria-pressed={this.state.open ? 'true' : 'false'}
          tabIndex={disabled ? undefined : 0}
          role="button"
          aria-owns={this.state.open ? `menu-${name || ''}` : null}
          aria-haspopup="true"
          onKeyDown={this.handleKeyDown}
          onBlur={this.handleBlur}
          onClick={disabled || readOnly ? undefined : this.handleClick}
          onFocus={onFocus}
        >
          {display}
        </div>
        <input
          value={Array.isArray(value) ? value.join(',') : value}
          name={name}
          readOnly={readOnly}
          ref={this.handleSelectRef}
          {...other}
          type="hidden"
        />
        <ArrowDropDownIcon className="Sui_Select_icon" />
        <Menu
          id={`menu-${name || ''}`}
          anchorEl={this.state.anchorEl}
          open={this.isControlled ? open : this.state.open}
          onClose={this.handleClose}
          {...MenuProps}
          MenuListProps={{
            ...MenuProps.MenuListProps,
            role: 'listbox',
          }}
          PaperProps={{
            ...MenuProps.PaperProps,
            style: {
              minWidth: minimumMenuWidth,
              ...(MenuProps.PaperProps != null ? MenuProps.PaperProps.style : null),
            },
          }}
        >
          {items}
        </Menu>
      </div>
    )
  }
}

(SelectInput as any).muiName = 'SelectInput'

export default SelectInput
