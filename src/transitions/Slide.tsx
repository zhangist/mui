// @inheritedComponent Transition
import debounce = require('lodash/debounce')
import * as React from 'react'
import { findDOMNode } from 'react-dom'
import EventListener from 'react-event-listener'
import Transition from 'react-transition-group/Transition'

const GUTTER = 24

// Translate the node so he can't be seen on the screen.
// Later, we gonna translate back the node to his original location
// with `translate3d(0, 0, 0)`.`
function getTranslateValue(props: any, node: any) {
  const { direction } = props
  const rect = node.getBoundingClientRect()

  let transform

  if (node.fakeTransform) {
    transform = node.fakeTransform
  } else {
    const computedStyle = window.getComputedStyle(node)
    transform =
      computedStyle.getPropertyValue('-webkit-transform') ||
      computedStyle.getPropertyValue('transform')
  }

  let offsetX = 0
  let offsetY = 0

  if (transform && transform !== 'none' && typeof transform === 'string') {
    const transformValues = transform
      .split('(')[1]
      .split(')')[0]
      .split(',')
    offsetX = parseInt(transformValues[4], 10)
    offsetY = parseInt(transformValues[5], 10)
  }

  if (direction === 'left') {
    return `translateX(100vw) translateX(-${rect.left - offsetX}px)`
  } else if (direction === 'right') {
    return `translateX(-${rect.left + rect.width + GUTTER - offsetX}px)`
  } else if (direction === 'up') {
    return `translateY(100vh) translateY(-${rect.top - offsetY}px)`
  }

  // direction === 'down
  return `translate3d(0, ${0 - (rect.top + rect.height)}px, 0)`
}

export function setTranslateValue(props: any, node: any) {
  const transform = getTranslateValue(props, node)

  if (transform) {
    node.style.transform = transform
    node.style.webkitTransform = transform
  }
}

const reflow = (node: any) => node.scrollTop

export interface Props {
  /**
   * A single child content element.
   */
  children: any,
  /**
   * Direction the child node will enter from.
   */
  direction?: 'left'|'right'|'up'|'down',
  /**
   * If `true`, show the component triggers the enter or exit animation.
   */
  in?: boolean,
  /**
   * @ignore
   */
  onEnter?: (arg: any) => any,
  /**
   * @ignore
   */
  onEntered?: (arg: any) => any,
  /**
   * @ignore
   */
  onEntering?: (arg: any) => any,
  /**
   * @ignore
   */
  onExit?: (arg: any) => any,
  /**
   * @ignore
   */
  onExited?: (arg: any) => any,
  /**
   * @ignore
   */
  onExiting?: (arg: any) => any,
  /**
   * @ignore
   */
  style?: any,
  /**
   * The duration for the transition, in milliseconds.
   * You may specify a single timeout for all transitions, or individually with an object.
   */
  timeout?: number|{ enter?: number, exit?: number },
}

class Slide extends React.Component<Props, any> {
  public static defaultProps = {
    timeout: {
      enter: 200,
      exit: 200,
    },
  }

  public transition: any = null
  public handleResize = debounce(() => {
    // Skip configuration where the position is screen size invariant.
    if (this.props.in || this.props.direction === 'down' || this.props.direction === 'right') {
      return
    }

    const node = findDOMNode(this.transition)
    if (node instanceof HTMLElement) {
      setTranslateValue(this.props, node)
    }
  }, 166)

  public state = {
    mounted: false,
  }

  public componentDidMount() {
    // state.mounted handle SSR, once the component is mounted, we need
    // to properly hide it.
    if (!this.props.in) {
      // We need to set initial translate values of transition element
      // otherwise component will be shown when in=false.
      this.updatePosition()
    }
  }

  public componentWillReceiveProps() {
    this.setState({
      mounted: true,
    })
  }

  public componentDidUpdate(prevProps: any) {
    if (prevProps.direction !== this.props.direction && !this.props.in) {
      // We need to update the position of the drawer when the direction change and
      // when it's hidden.
      this.updatePosition()
    }
  }

  public componentWillUnmount() {
    this.handleResize.cancel()
  }

  public updatePosition() {
    const element = findDOMNode(this.transition)
    if (element instanceof HTMLElement) {
      element.style.visibility = 'inherit'
      setTranslateValue(this.props, element)
    }
  }

  public handleEnter = (node: any) => {
    setTranslateValue(this.props, node)
    reflow(node)

    if (this.props.onEnter) {
      this.props.onEnter(node)
    }
  }

  public handleEntering = (node: any) => {
    const { timeout } = this.props
    if (timeout) {
      node.style.transition = 'transform ' + (typeof timeout === 'number' ? timeout : timeout.enter) + 'ms'
      node.style.webkitTransition = 'transform ' + (typeof timeout === 'number' ? timeout : timeout.enter) + 'ms'
      node.style.transform = 'translate3d(0, 0, 0)'
      node.style.webkitTransform = 'translate3d(0, 0, 0)'
    }
    if (this.props.onEntering) {
      this.props.onEntering(node)
    }
  }

  public handleExit = (node: any) => {
    const { timeout } = this.props
    if (timeout) {
      node.style.transition = 'transform ' + (typeof timeout === 'number' ? timeout : timeout.exit) + 'ms'
      node.style.webkitTransition = 'transform ' + (typeof timeout === 'number' ? timeout : timeout.exit) + 'ms'
    }
    setTranslateValue(this.props, node)
    if (this.props.onExit) {
      this.props.onExit(node)
    }
  }

  public handleExited = (node: any) => {
    // No need for transitions when the component is hidden
    node.style.transition = ''
    node.style.webkitTransition = ''

    if (this.props.onExited) {
      this.props.onExited(node)
    }
  }

  public render() {
    const {
      children,
      onEnter,
      onEntering,
      onExit,
      onExited,
      style: styleProp,
      timeout,
      ...other,
    } = this.props

    let style: any = {}

    // We use this state to handle the server-side rendering.
    // We don't know the width of the children ahead of time.
    // We need to render it.
    if (!this.props.in && !this.state.mounted) {
      style.visibility = 'hidden'
    }

    style = {
      ...style,
      ...styleProp,
      ...(React.isValidElement(children) ? (children.props as any).style : {}),
    }

    const myTimeout = timeout ? timeout : 200

    return (
      <EventListener target="window" onResize={this.handleResize}>
        <Transition
          onEnter={this.handleEnter}
          onEntering={this.handleEntering}
          onExit={this.handleExit}
          onExited={this.handleExited}
          appear
          timeout={myTimeout}
          style={style}
          ref={(node: any) => {
            this.transition = node
          }}
          {...other}
        >
          {children}
        </Transition>
      </EventListener>
    )
  }
}

export default Slide
