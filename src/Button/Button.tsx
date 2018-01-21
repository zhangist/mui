import * as classnames from 'classnames'
import * as keycode from 'keycode'
import * as React from 'react'
import { findDOMNode } from 'react-dom'
import TouchRipple from '../TouchRipple'
import { detectKeyboardFocus, focusKeyPressed, listenForFocusKeys } from '../utils/keyboardFocus'
import createRippleHandler from './createRippleHandler'

export interface Props {
  centerRipple?: boolean,
  color?: string,
  component?: React.ReactType<Button>,
  disableRipple?: boolean,
  focusRipple?: boolean,
  keyboardFocusedClassName?: string,
  mini?: boolean,
  onKeyboardFocus?: React.FocusEventHandler<any>,
  rootRef?: React.Ref<any>,
}

export default class Button extends React.Component<Props
  & React.AnchorHTMLAttributes<HTMLElement>
  & React.ButtonHTMLAttributes<HTMLElement>, any> {

  public button: null|Element = null
  public ripple: null|any = null
  // Used to help track keyboard activation keyDown
  public keyDown = false
  // public keyboardFocusTimeout = null
  public keyboardFocusCheckTime = 50
  public keyboardFocusMaxCheckTimes = 5

  public handleMouseDown = createRippleHandler(this, 'MouseDown', 'start', () => {
    // clearTimeout(this.keyboardFocusTimeout)
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
    // clearTimeout(this.keyboardFocusTimeout)
    focusKeyPressed(false)
    this.setState({ keyboardFocused: false })
  })

  public state = {
    keyboardFocused: false,
  }

  public componentDidMount() {
    this.button = findDOMNode(this)
  }

  public componentWillUnmount() {
    this.button = null
  }

  public componentWillReceiveProps(nextProps: any) {
    if (!this.props.disabled && nextProps.disabled) {
      this.setState({
        keyboardFocused: false,
      })
    }
  }

  public onKeyboardFocusHandler(event: any) {
    this.keyDown = false
    this.setState({ keyboardFocused: true })

    if (this.props.onKeyboardFocus) {
      this.props.onKeyboardFocus(event)
    }
  }

  public handleKeyDown(event: any) {
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

  public handleKeyUp(event: any) {
    if (this.props.focusRipple && keycode(event) === 'space' && this.state.keyboardFocused) {
      this.keyDown = false
      event.persist()
      this.ripple.stop(event, () => this.ripple.pulsate(event))
    }
    if (this.props.onKeyUp) {
      this.props.onKeyUp(event)
    }
  }

  public handleFocus(event: any) {
    if (this.props.disabled) {
      return false
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
      color,
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

    const buttonProps: any = {}

    let Root = 'button'

    if (!component) {
      if (other.href) {
        Root = 'a'
      }
    }

    if (component === 'button') {
      buttonProps.type = type || 'button'
    }

    if (component !== 'a') {
      buttonProps.role = buttonProps.role || 'button'
      buttonProps.disabled = disabled
    }

    const rootClassName = classnames('Sui_Button-root')
    const labelClassName = classnames('Sui_Button-label')

    return (
      <Root
        className={rootClassName}
        onBlur={(e: any) => this.handleBlur(e)}
        onFocus={(e: any) => this.handleFocus(e)}
        onKeyDown={(e: any) => this.handleKeyDown(e)}
        onKeyUp={(e: any) => this.handleKeyUp(e)}
        onMouseDown={(e: any) => this.handleMouseDown(e)}
        onMouseLeave={(e: any) => this.handleMouseLeave(e)}
        onMouseUp={(e: any) => this.handleMouseUp(e)}
        onTouchEnd={(e: any) => this.handleTouchEnd(e)}
        onTouchMove={(e: any) => this.handleTouchMove(e)}
        onTouchStart={(e: any) => this.handleTouchStart(e)}
        tabIndex={disabled ? -1 : tabIndex}
        ref={rootRef}
        {...buttonProps}
        {...other}
      >
        <span className={labelClassName}>{children}</span>
        {!disableRipple && !disabled ? (
          <TouchRipple
            ref={(node: any) => {
              this.ripple = node
            }}
            center={centerRipple}
          />
        ) : null}
      </Root>
    )
  }
}
