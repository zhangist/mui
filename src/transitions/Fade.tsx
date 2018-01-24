// @inheritedComponent Transition

import * as React from 'react'
import Transition from 'react-transition-group/Transition'

const reflow = (node: any) => node.scrollTop

interface Props {
  /**
   * @ignore
   */
  appear?: boolean,
  /**
   * A single child content element.
   */
  children: any,
  /**
   * If `true`, the component will transition in.
   */
  in?: boolean,
  /**
   * @ignore
   */
  onEnter?: (node: any) => any,
  /**
   * @ignore
   */
  onEntering?: (node: any) => any,
  /**
   * @ignore
   */
  onExit?: (node: any) => any,
  /**
   * @ignore
   */
  onExited?: (node: any) => any,
  /**
   * @ignore
   */
  style?: {},
  /**
   * The duration for the transition, in milliseconds.
   * You may specify a single timeout for all transitions, or individually with an object.
   */
  timeout?: number|{ enter?: number, exit?: number },
}

/**
 * The Fade transition is used by the Modal component.
 * It's using [react-transition-group](https://github.com/reactjs/react-transition-group) internally.
 */
class Fade extends React.Component<Props, {}> {
  public static defaultProps = {
    appear: true,
    timeout: {
      enter: 200,
      exit: 200,
    },
  }

  public state = {
    mounted: false,
  }

  public componentDidMount() {
    this.setState({ mounted: true })
  }

  public handleEnter = (node: any) => {
    node.style.opacity = '0'
    reflow(node)

    if (this.props.onEnter) {
      this.props.onEnter(node)
    }
  }

  public handleEntering = (node: any) => {
    const { timeout } = this.props
    if (timeout) {
      node.style.transition = 'opacity ' + (typeof timeout === 'number' ? timeout : timeout.enter)
        + 'ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
      node.style.webkitTransition = 'opacity ' + (typeof timeout === 'number' ? timeout : timeout.enter)
        + 'ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
      node.style.opacity = '1'
    }

    if (this.props.onEntering) {
      this.props.onEntering(node)
    }
  }

  public handleExit = (node: any) => {
    const { timeout } = this.props
    if (timeout) {
      node.style.transition = 'opacity ' + (typeof timeout === 'number' ? timeout : timeout.exit) + 'ms'
      node.style.webkitTransition = 'opacity ' + (typeof timeout === 'number' ? timeout : timeout.exit) + 'ms'
      node.style.opacity = '0'
    }

    if (this.props.onExit) {
      this.props.onExit(node)
    }
  }

  public handleExited = (node: any) => {
    node.style.transition = ''
    node.style.webkitTransition = ''

    if (this.props.onExited) {
      this.props.onExited(node)
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
      ...other,
    } = this.props

    let style: React.CSSProperties = {}

    // For server side rendering.
    if (!this.props.in && !this.state.mounted && appear) {
      style.opacity = 0
    }

    style = {
      ...style,
      ...styleProp,
      ...(React.isValidElement(children) ? (children.props as any).style : {}),
    }

    const fadeTimeout = timeout ? timeout : 200

    return (
      <Transition
        appear={appear}
        onEnter={this.handleEnter}
        onEntering={this.handleEntering}
        onExit={this.handleExit}
        onExited={this.handleExited}
        style={style}
        timeout={fadeTimeout}
        {...other}
      >
        {children}
      </Transition>
    )
  }
}

export default Fade
