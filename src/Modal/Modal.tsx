import * as classNames from 'classnames'
import ownerDocument = require('dom-helpers/ownerDocument')
import css = require('dom-helpers/style')
import getScrollbarSize = require('dom-helpers/util/scrollbarSize')
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Transition from 'react-transition-group/Transition'
import RefHolder from '../internal/RefHolder'
import Portal from '../Portal'
import Fade from '../transitions/Fade'
import { createChainedFunction } from '../utils/helpers'
import isOverflowing from './isOverflowing'
import ModalManager from './ModalManager'

const DURATION = 300

function getContainer(container: any, defaultContainer: any) {
  container = typeof container === 'function' ? container() : container
  return ReactDOM.findDOMNode(container) || defaultContainer
}

function getOwnerDocument(element: any) {
  return ownerDocument(ReactDOM.findDOMNode(element))
}

function getHasTransition(props: any) {
  return props.children ? props.children.props.hasOwnProperty('in') : false
}

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

export interface Props {
  children: any,
  closable?: boolean,
  container?: any,
  disableBackdropClick?: false,
  manager?: ModalManager,
  onClose?: (arg: any, arg2?: any) => any,
  onBackdropClick?: (arg: any) => any,
  handleRendered?: () => any,
  open: boolean,
}

export default class Modal extends React.Component<Props, any> {
  public static defaultProps = {
    manager: new ModalManager(),
    container: document.body,
  }

  public modalNode: any = null
  public mountNode: any = null
  public dialogNode: any = null
  public mounted: boolean = false
  public data = {
    overflowing: false,
    prevPaddings: [],
  }

  public state = {
    exited: !this.props.open,
  }

  public componentDidMount() {
    this.mounted = true
    if (this.props.open) {
      this.handleOpen()
    }
  }

  public componentWillReceiveProps(nextProps: any) {
    if (nextProps.open) {
      this.setState({ exited: false })
    } else if (!getHasTransition(nextProps)) {
      // Otherwise let handleExited take care of marking exited.
      this.setState({ exited: true })
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

  public componentDidUpdate(prevProps: any) {
    if (prevProps.open && !this.props.open) {
      // Otherwise handleExited will call this.
      this.handleClose()
    } else if (!prevProps.open && this.props.open) {
      this.handleOpen()
    }
  }

  public componentWillUnmount() {
    this.mounted = false
    if (this.props.open || (getHasTransition(this.props) && !this.state.exited)) {
      this.handleClose()
    }
  }

  public handleOpen = () => {
    const doc = getOwnerDocument(this)
    const container = getContainer(this.props.container, doc.body)

    if (this.props.manager) {
      this.props.manager.add(this, container)
    }
  }

  public handleClose = () => {
    if (this.props.manager) {
      this.props.manager.remove(this)
    }
  }

  public handleExited = () => {
    this.setState({ exited: true })
    this.handleClose()
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

  public render() {
    const {
      children,
      open,
    } = this.props
    const {
      exited,
    } = this.state
    const hasTransition = getHasTransition(this.props)
    const childProps: any = {}

    if (!open && (exited)) {
      return null
    }

    // It's a Transition like component
    if (hasTransition) {
      childProps.onExited = createChainedFunction(this.handleExited, children.props.onExited)
    }

    const modalRootClassName = classNames('Sui_Modal-root', {
      'Sui_Modal-hidden': exited,
    })

    return (
      <Portal
        ref={(node: any) => {
          this.mountNode = node ? node.getMountNode() : node
        }}
        container={this.props.container}
        onRendered={this.props.handleRendered}
      >
        <div className={modalRootClassName}>
          <Fade appear in={open} timeout={DURATION}>
            <div className="Sui_Backdrop-root"  onClick={this.handleBackdropClick}></div>
          </Fade>
          <RefHolder
            ref={(node: any) => {
              this.dialogNode = node
            }}
          >
            {React.cloneElement(children, childProps)}
          </RefHolder>
        </div>
      </Portal>
    )
  }
}
