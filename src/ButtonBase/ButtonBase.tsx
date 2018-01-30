import * as classNames from 'classnames'
import * as keycode from 'keycode'
import * as React from 'react'
import { findDOMNode } from 'react-dom'
import { detectKeyboardFocus, focusKeyPressed, listenForFocusKeys } from '../utils/keyboardFocus'
import createRippleHandler from './createRippleHandler'
import TouchRipple from './TouchRipple'

export interface Props {
  /**
   * If `true`, the ripples will be centered.
   * They won't start at the cursor interaction position.
   */
  centerRipple?: boolean,
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
   * The default value is a `button`.
   */
  component?: any,
  /**
   * If `true`, the base button will be disabled.
   */
  disabled?: boolean,
  /**
   * If `true`, the ripple effect will be disabled.
   */
  disableRipple?: boolean,
  /**
   * If `true`, the base button will have a keyboard focus ripple.
   * `disableRipple` must also be `false`.
   */
  focusRipple?: boolean,
  /**
   * The CSS class applied while the component is keyboard focused.
   */
  keyboardFocusedClassName?: string,
  /**
   * @ignore
   */
  onBlur?: (arg?: any) => any,
  /**
   * @ignore
   */
  onClick?: (arg?: any) => any,
  /**
   * @ignore
   */
  onFocus?: (arg?: any) => any,
  /**
   * Callback fired when the component is focused with a keyboard.
   * We trigger a `onFocus` callback too.
   */
  onKeyboardFocus?: (arg?: any) => any,
  /**
   * @ignore
   */
  onKeyDown?: (arg?: any) => any,
  /**
   * @ignore
   */
  onKeyUp?: (arg?: any) => any,
  /**
   * @ignore
   */
  onMouseDown?: (arg?: any) => any,
  /**
   * @ignore
   */
  onMouseLeave?: (arg?: any) => any,
  /**
   * @ignore
   */
  onMouseUp?: (arg?: any) => any,
  /**
   * @ignore
   */
  onTouchEnd?: (arg?: any) => any,
  /**
   * @ignore
   */
  onTouchMove?: (arg?: any) => any,
  /**
   * @ignore
   */
  onTouchStart?: (arg?: any) => any,
  /**
   * @ignore
   */
  role?: string,
  /**
   * Use that property to pass a ref callback to the root component.
   */
  rootRef?: (arg?: any) => any,
  /**
   * @ignore
   */
  tabIndex?: number|string,
  /**
   * @ignore
   */
  type?: string,
}

class ButtonBase extends React.Component<Props, any> {
  public static defaultProps = {
    centerRipple: false,
    disableRipple: false,
    focusRipple: false,
    tabIndex: 0,
    type: 'button',
  }
  public ripple: any = null
  public keyDown = false // Used to help track keyboard activation keyDown
  public button: any = null
  public keyboardFocusTimeout: any = null
  public keyboardFocusCheckTime = 50
  public keyboardFocusMaxCheckTimes = 5

  public handleMouseDown = createRippleHandler(this, 'MouseDown', 'start', () => {
    clearTimeout(this.keyboardFocusTimeout)
    focusKeyPressed(false)
    if (this.state.keyboardFocused) {
      this.setState({ keyboardFocused: false })
    }
  })

  public handleMouseUp = createRippleHandler(this, 'MouseUp', 'stop')

  public handleMouseLeave = createRippleHandler(this, 'MouseLeave', 'stop', (event: any) => {
    if (this.state.keyboardFocused) {
      event.preventDefault()
    }
  })

  public handleTouchStart = createRippleHandler(this, 'TouchStart', 'start')

  public handleTouchEnd = createRippleHandler(this, 'TouchEnd', 'stop')

  public handleTouchMove = createRippleHandler(this, 'TouchEnd', 'stop')

  public handleBlur = createRippleHandler(this, 'Blur', 'stop', () => {
    clearTimeout(this.keyboardFocusTimeout)
    focusKeyPressed(false)
    this.setState({ keyboardFocused: false })
  })

  public state = {
    keyboardFocused: false,
  }

  public componentDidMount() {
    this.button = findDOMNode(this)
    listenForFocusKeys()
  }

  public componentWillReceiveProps(nextProps: any) {
    // The blur won't fire when the disabled state is set on a focused input.
    // We need to book keep the focused state manually.
    if (!this.props.disabled && nextProps.disabled && this.state.keyboardFocused) {
      this.setState({
        keyboardFocused: false,
      })
    }
  }

  public componentWillUpdate(nextProps: any, nextState: any) {
    if (
      this.props.focusRipple &&
      nextState.keyboardFocused &&
      !this.state.keyboardFocused &&
      !this.props.disableRipple
    ) {
      this.ripple.pulsate()
    }
  }

  public componentWillUnmount() {
    this.button = null
    clearTimeout(this.keyboardFocusTimeout)
  }

  public onKeyboardFocusHandler = (event: any) => {
    this.keyDown = false
    this.setState({ keyboardFocused: true })

    if (this.props.onKeyboardFocus) {
      this.props.onKeyboardFocus(event)
    }
  }

  public handleKeyDown = (event: any) => {
    const { component, focusRipple, onKeyDown, onClick } = this.props
    const key = keycode(event)

    // Check if key is already down to avoid repeats being counted as multiple activations
    if (focusRipple && !this.keyDown && this.state.keyboardFocused && key === 'space') {
      this.keyDown = true
      event.persist()
      this.ripple.stop(event, () => {
        this.ripple.start(event)
      })
    }

    if (onKeyDown) {
      onKeyDown(event)
    }

    // Keyboard accessibility for non interactive elements
    if (
      event.target === this.button &&
      onClick &&
      component &&
      component !== 'a' &&
      component !== 'button' &&
      (key === 'space' || key === 'enter')
    ) {
      event.preventDefault()
      onClick(event)
    }
  }

  public handleKeyUp = (event: any) => {
    if (this.props.focusRipple && keycode(event) === 'space' && this.state.keyboardFocused) {
      this.keyDown = false
      event.persist()
      this.ripple.stop(event, () => this.ripple.pulsate(event))
    }
    if (this.props.onKeyUp) {
      this.props.onKeyUp(event)
    }
  }

  public handleFocus = (event: any) => {
    if (this.props.disabled) {
      return
    }

    // Fix for https://github.com/facebook/react/issues/7769
    if (!this.button) {
      this.button = event.currentTarget
    }

    event.persist()
    detectKeyboardFocus(this, this.button, () => {
      this.onKeyboardFocusHandler(event)
    })

    if (this.props.onFocus) {
      this.props.onFocus(event)
    }
  }

  public render() {
    const {
      centerRipple,
      children,
      className: classNameProp,
      component,
      disabled,
      disableRipple,
      focusRipple,
      keyboardFocusedClassName,
      onBlur,
      onFocus,
      onKeyboardFocus,
      onKeyDown,
      onKeyUp,
      onMouseDown,
      onMouseLeave,
      onMouseUp,
      onTouchEnd,
      onTouchMove,
      onTouchStart,
      rootRef,
      tabIndex,
      type,
      ...other,
    } = this.props

    const className = classNames(
      'Sui_ButtonBase_root',
      {
        'Sui_ButtonBase_disabled': disabled,
        [keyboardFocusedClassName || '']: this.state.keyboardFocused,
      },
      classNameProp,
    )

    const buttonProps: any = {}

    let ComponentProp = component

    if (!ComponentProp) {
      if ((other as any).href) {
        ComponentProp = 'a'
      } else {
        ComponentProp = 'button'
      }
    }

    if (ComponentProp === 'button') {
      buttonProps.type = type || 'button'
    }

    if (ComponentProp !== 'a') {
      buttonProps.role = buttonProps.role || 'button'
      buttonProps.disabled = disabled
    }

    return (
      <ComponentProp
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        onKeyDown={this.handleKeyDown}
        onKeyUp={this.handleKeyUp}
        onMouseDown={this.handleMouseDown}
        onMouseLeave={this.handleMouseLeave}
        onMouseUp={this.handleMouseUp}
        onTouchEnd={this.handleTouchEnd}
        onTouchMove={this.handleTouchMove}
        onTouchStart={this.handleTouchStart}
        tabIndex={disabled ? -1 : tabIndex}
        className={className}
        {...buttonProps}
        ref={rootRef}
        {...other}
      >
        {children}
        {!disableRipple && !disabled ? (
          <TouchRipple
            ref={(node: any) => {
              this.ripple = node
            }}
            center={centerRipple}
          />
        ) : null}
      </ComponentProp>
    )
  }
}

export default ButtonBase
