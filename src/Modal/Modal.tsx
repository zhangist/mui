import * as classNames from 'classnames'
import css = require('dom-helpers/style')
import getScrollbarSize = require('dom-helpers/util/scrollbarSize')
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Transition from 'react-transition-group/Transition'
import Fade from '../transitions/Fade'
import isOverflowing from './isOverflowing'

const DURATION = 300

const defaultStyle = {
  transition: `opacity ${DURATION}ms ease-out`, // cubic-bezier(0.4, 0, 0.2, 1) 0ms
  opacity: 0.8,
}

const transitionStyles: any = {
  entering: { opacity: 0.8 },
  entered: { opacity: 1 },
}

function getPaddingRight(node: any) {
  return parseInt(css(node, 'paddingRight') || 0, 10)
}

function setContainerStyle(data: any, container: any) {
  const style: any = { overflow: 'hidden' }

  // We are only interested in the actual `style` here because we will override it.
  data.style = {
    overflow: container.style.overflow,
    paddingRight: container.style.paddingRight,
  }

  if (data.overflowing) {
    const scrollbarSize = getScrollbarSize()

    // Use computed style, here to get the real padding to add our scrollbar width.
    style.paddingRight = `${getPaddingRight(container) + scrollbarSize}px`

    // .mui-fixed is a global helper.
    const fixedNodes: any = document.querySelectorAll('.sui-fixed')
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < fixedNodes.length; i += 1) {
      const paddingRight = getPaddingRight(fixedNodes[i])
      data.prevPaddings.push(paddingRight)
      fixedNodes[i].style.paddingRight = `${paddingRight + scrollbarSize}px`
    }
  }

  Object.keys(style).forEach((key: string) => {
    container.style[key] = style[key]
  })
}

function removeContainerStyle(data: any, container: any) {
  Object.keys(data.style).forEach((key: string) => {
    container.style[key] = data.style[key]
  })

  const fixedNodes: any = document.querySelectorAll('.sui-fixed')
  for (let i = 0; i < fixedNodes.length; i += 1) {
    fixedNodes[i].style.paddingRight = `${data.prevPaddings[i]}px`
  }
}

export interface Props {
  children: any,
  closable?: boolean,
  disableBackdropClick?: false,
  fullHeight?: boolean,
  height?: number|string,
  onClose?: (arg: any, arg2?: any) => any,
  onBackdropClick?: (arg: any) => any,
  open: boolean,
  width?: number|string,
}

export default class Modal extends React.Component<Props, any> {
  public overflow = document.body.style.overflow
  public container = document.body
  public data = {
    overflowing: false,
    prevPaddings: [],
  }

  public state = {
    openBackdrop: false,
  }

  public componentDidMount() {
    this.data.overflowing = isOverflowing(this.container)
    if (this.props.open) {
      this.handleOpen()
    }
  }

  public componentDidUpdate(prevProps: any) {
    if (prevProps.open && !this.props.open) {
      // Otherwise handleExited will call this.
      this.handleClose()
    } else if (!prevProps.open && this.props.open) {
      this.handleOpen()
    }
  }

  public componentWillUpdate(nextProps: any, nextState: any) {
    if (!this.props.open && nextProps.open) {
      // document.body.style.overflow = 'hidden'
      this.setState({
        openBackdrop: true,
      })
    }
    if (this.props.open && !nextProps.open) {
      // document.body.style.overflow = this.overflow
      this.setState({
        openBackdrop: false,
      })
    }
  }

  public componentWillUnmount() {
    // document.body.style.overflow = this.overflow
    this.setState({
      openBackdrop: false,
    })
    if (this.props.open) {
      this.handleClose()
    }
  }

  public handleOpen = () => {
    setContainerStyle(this.data, this.container)
  }

  public handleClose = () => {
    removeContainerStyle(this.data, this.container)
  }

  public handleBackdropClick = (event: any) => {
    if (event.target !== event.currentTarget) {
      return
    }

    if (this.props.onBackdropClick) {
      this.props.onBackdropClick(event)
    }

    if (!this.props.disableBackdropClick && this.props.onClose) {
      this.props.onClose(event, 'backdropClick')
    }
  }

  public renderModal() {
    const {
      fullHeight,
      height,
      width,
    } = this.props
    const {
      openBackdrop,
    } = this.state

    const backdropClassName = classNames('Sui_Backdrop-root', {
      'Sui_Backdrop-entered': openBackdrop,
    })
    const modalBodyClassName = classNames('Sui_Modal-body', {
      'Sui_Modal-body-full-height': fullHeight,
    })

    return (
      <div className="Sui_Modal-root">
        {/* <Transition in={openBackdrop} appear timeout={DURATION}>
          {(state: any) => (
            <div className="Sui_Backdrop-root" onClick={() => this.setState({openBackdrop: true})} style={{
              ...defaultStyle,
              ...transitionStyles[state],
            }}></div>)}
        </Transition> */}
        {/* <div className={backdropClassName}></div> */}
        <Fade appear in={openBackdrop} timeout={DURATION}>
          <div className="Sui_Backdrop-root"  onClick={this.handleBackdropClick}></div>
        </Fade>
        <div className={modalBodyClassName} style={{
          width: width ? '100%' : null,
          maxWidth: width ? width : null,
          height: height ? '100%' : null,
          maxHeight: height ? height : null,
        }}>{this.props.children}</div>
      </div>
    )
  }

  public render() {
    const {
      open,
    } = this.props
    return open ? ReactDOM.createPortal(
      this.renderModal(),
      this.container,
    ) : null
  }
}
