// @inheritedComponent CSSTransition

import * as React from 'react'
import * as CSSTransition from 'react-transition-group/CSSTransition'

// Only exported for tests.
export function getScale(value: number) {
  return `scale(${value}, ${value ** 2})`
}

function getAutoHeightDuration(height: number) {
  if (!height) {
    return 0
  }

  const constant = height / 36

  // https://www.wolframalpha.com/input/?i=(4+%2B+15+*+(x+%2F+36+)+**+0.25+%2B+(x+%2F+36)+%2F+5)+*+10
  return Math.round((4 + 15 * Math.pow(constant, 0.25) + constant / 5) * 10)
}

export interface Props {
  /**
   * @ignore
   */
  appear?: boolean,
  /**
   * A single child content element.
   */
  children?: any,
  /**
   * If `true`, show the component triggers the enter or exit animation.
   */
  in?: boolean,
  /**
   * @ignore
   */
  onEnter?: (arg?: any) => any,
  /**
   * @ignore
   */
  onEntered?: (arg?: any) => any,
  /**
   * @ignore
   */
  onEntering?: (arg?: any) => any,
  /**
   * @ignore
   */
  onExit?: (arg?: any) => any,
  /**
   * @ignore
   */
  onExited?: (arg?: any) => any,
  /**
   * @ignore
   */
  onExiting?: (arg?: any) => any,
  /**
   * @ignore
   */
  style?: any,
  /**
   * The duration for the transition, in milliseconds.
   * You may specify a single timeout for all transitions, or individually with an object.
   *
   * Set to 'auto' to automatically calculate transition time based on height.
   */
  timeout?: number|{ enter?: number, exit?: number }|'auto',
  /**
   * The animation classNames applied to the component as it enters or exits.
   * This property is a direct binding to [`CSSTransition.classNames`]
   * (https://reactcommunity.org/react-transition-group/#CSSTransition-prop-classNames).
   */
  transitionClasses: {
    appear?: string,
    appearActive?: string,
    enter?: string,
    enterActive?: string,
    exit?: string,
    exitActive?: string,
  },
}

/**
 * The Grow transition is used by the Popover component.
 * It's using [react-transition-group](https://github.com/reactjs/react-transition-group) internally.
 */
class Grow extends React.Component<Props, any> {
  public static defaultProps = {
    appear: true,
    timeout: 'auto',
  }
  public autoTimeout: any = undefined

  public handleEnter = (node: HTMLElement) => {
    node.style.opacity = '0'
    node.style.transform = getScale(0.75)

    if (this.props.onEnter) {
      this.props.onEnter(node)
    }
  }

  public handleEntering = (node: HTMLElement) => {
    const { timeout } = this.props
    let duration = 0

    if (timeout === 'auto') {
      duration = getAutoHeightDuration(node.clientHeight)
      this.autoTimeout = duration
    } else if (typeof timeout === 'number') {
      duration = timeout
    } else if (timeout && typeof timeout.enter === 'number') {
      duration = timeout.enter
    } else {
      // The propType will warn in this case.
    }

    node.style.transition = [
      'opacity ' + duration + 'ms',
      'transform ' + duration * 0.666 + 'ms',
    ].join(',')

    node.style.opacity = '1'
    node.style.transform = getScale(1)

    if (this.props.onEntering) {
      this.props.onEntering(node)
    }
  }

  public handleExit = (node: HTMLElement) => {
    const { timeout } = this.props
    let duration = 0

    if (timeout === 'auto') {
      duration = getAutoHeightDuration(node.clientHeight)
      this.autoTimeout = duration
    } else if (typeof timeout === 'number') {
      duration = timeout
    } else if (timeout && typeof timeout.exit === 'number') {
      duration = timeout.exit
    } else {
      // The propType will warn in this case.
    }

    node.style.transition = [
      'opacity' + duration + 'ms',
      'transform' + duration * 0.666 + 'ms' + duration * 0.333 + 'ms',
    ].join(',')

    node.style.opacity = '0'
    node.style.transform = getScale(0.75)

    if (this.props.onExit) {
      this.props.onExit(node)
    }
  }

  public addEndListener = (node: any, next: (arg?: any) => any) => {
    if (this.props.timeout === 'auto') {
      setTimeout(next, this.autoTimeout || 0)
    }
  }

  public render() {
    const {
      appear,
      children,
      onEnter,
      onEntering,
      onExit,
      style: styleProp,
      timeout,
      transitionClasses = {},
      ...other,
    } = this.props

    let style: any = {}

    // For server side rendering.
    if (!this.props.in || appear) {
      style.opacity = '0'
    }

    style = {
      ...style,
      ...styleProp,
      ...(React.isValidElement(children) ? (children.props as any).style : {}),
    }

    const growTimeout: any = (timeout === 'auto') ? undefined : timeout

    return (
      <CSSTransition
        classNames={transitionClasses}
        onEnter={this.handleEnter}
        onEntering={this.handleEntering}
        onExit={this.handleExit}
        addEndListener={this.addEndListener}
        appear={appear}
        style={style}
        timeout={growTimeout}
        {...other}
      >
        {children}
      </CSSTransition>
    )
  }
}

export default Grow
