// @inheritedComponent Portal

import * as classNames from 'classnames'
import activeElement = require('dom-helpers/activeElement')
import ownerDocument = require('dom-helpers/ownerDocument')
import contains = require('dom-helpers/query/contains')
import inDOM = require('dom-helpers/util/inDOM')
import * as keycode from 'keycode'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as warning from 'warning'
import RefHolder from '../internal/RefHolder'
import Portal from '../Portal'
import addEventListener from '../utils/addEventListener'
import { createChainedFunction } from '../utils/helpers'
import Backdrop from './Backdrop'
import ModalManager from './ModalManager'

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

export interface ModalProps {
  /**
   * A backdrop component. Useful for custom backdrop rendering.
   */
  BackdropComponent?: any,
  /**
   * Properties applied to the `Backdrop` element.
   */
  BackdropProps?: {[key: string]: any},
  /**
   * A single child content element.
   */
  children?: any,
  /**
   * @ignore
   */
  className?: string,
  /**
   * A node, component instance, or function that returns either.
   * The `container` will have the portal children appended to it.
   */
  container?: any,
  /**
   * If `true`, the modal will not automatically shift focus to itself when it opens, and
   * replace it to the last focused element when it closes.
   * This also works correctly with any modal children that have the `disableAutoFocus` prop.
   *
   * Generally this should never be set to `true` as it makes the modal less
   * accessible to assistive technologies, like screen readers.
   */
  disableAutoFocus?: boolean,
  /**
   * If `true`, clicking the backdrop will not fire any callback.
   */
  disableBackdropClick?: boolean,
  /**
   * If `true`, the modal will not prevent focus from leaving the modal while open.
   *
   * Generally this should never be set to `true` as it makes the modal less
   * accessible to assistive technologies, like screen readers.
   */
  disableEnforceFocus?: boolean,
  /**
   * If `true`, hitting escape will not fire any callback.
   */
  disableEscapeKeyDown?: boolean,
  /**
   * If `true`, the modal will not restore focus to previously focused element once
   * modal is hidden.
   */
  disableRestoreFocus?: boolean,
  /**
   * If `true`, the backdrop is not rendered.
   */
  hideBackdrop?: boolean,
  /**
   * Always keep the children in the DOM.
   * This property can be useful in SEO situation or
   * when you want to maximize the responsiveness of the Modal.
   */
  keepMounted?: boolean,
  /**
   * A modal manager used to track and manage the state of open
   * Modals. Useful when customizing how modals interact within a container.
   */
  manager?: ModalManager,
  /**
   * Callback fired when the backdrop is clicked.
   */
  onBackdropClick?: (arg?: any) => any,
  /**
   * Callback fired when the component requests to be closed.
   * The `reason` parameter can optionally be used to control the response to `onClose`.
   *
   * @param {object} event The event source of the callback
   * @param {string} reason Can be:`"escapeKeyDown"`, `"backdropClick"`
   */
  onClose?: (arg?: any, arg2?: any) => any,
  /**
   * Callback fired when the escape key is pressed,
   * `disableEscapeKeyDown` is false and the modal is in focus.
   */
  onEscapeKeyDown?: (arg?: any) => any,
  /**
   * Callback fired once the children has been mounted into the `container`.
   * It signals that the `open={true}` property took effect.
   */
  onRendered?: (arg?: any) => any,
  /**
   * If `true`, the modal is open.
   */
  open: boolean,
  role?: string,
}

class Modal extends React.Component<ModalProps, any> {
  // ? any -> for tsc build error TS4023 https://stackoverflow.com/questions/43900035
  public static defaultProps: any = {
    disableAutoFocus: false,
    disableBackdropClick: false,
    disableEnforceFocus: false,
    disableEscapeKeyDown: false,
    disableRestoreFocus: false,
    hideBackdrop: false,
    keepMounted: false,
    // Modals don't open on the server so this won't conflict with concurrent requests.
    manager: new ModalManager(),
    BackdropComponent: Backdrop,
  }

  public dialogNode: any = null
  public modalNode = null
  public mounted = false
  public mountNode = null
  public lastFocus: any = null
  public onDocumentKeydownListener: any = null
  public onFocusinListener: any = null

  constructor(props: ModalProps, context: any) {
    super(props, context)
    this.state = {
      exited: !this.props.open,
    }
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

  public componentWillUpdate(nextProps: any) {
    if (!this.props.open && nextProps.open) {
      this.checkForFocus()
    }
  }

  public componentDidUpdate(prevProps: any) {
    if (prevProps.open && !this.props.open && !getHasTransition(this.props)) {
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

  public getDialogElement() {
    return ReactDOM.findDOMNode(this.dialogNode)
  }

  public handleRendered = () => {
    this.autoFocus()

    if (this.props.onRendered) {
      this.props.onRendered()
    }
  }

  public handleOpen = () => {
    const doc = getOwnerDocument(this)
    const container = getContainer(this.props.container, doc.body)

    if (this.props.manager) {
      this.props.manager.add(this, container)
    }
    this.onDocumentKeydownListener = addEventListener(doc, 'keydown', this.handleDocumentKeyDown)
    this.onFocusinListener = addEventListener(document, 'focus', this.enforceFocus, true)
  }

  public handleClose = () => {
    if (this.props.manager) {
      this.props.manager.remove(this)
    }
    this.onDocumentKeydownListener.remove()
    this.onFocusinListener.remove()
    this.restoreLastFocus()
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

  public handleDocumentKeyDown = (event: any) => {
    if (!this.isTopModal() || keycode(event) !== 'esc') {
      return
    }

    if (this.props.onEscapeKeyDown) {
      this.props.onEscapeKeyDown(event)
    }

    if (!this.props.disableEscapeKeyDown && this.props.onClose) {
      this.props.onClose(event, 'escapeKeyDown')
    }
  }

  public checkForFocus = () => {
    if (inDOM) {
      this.lastFocus = activeElement()
    }
  }

  public autoFocus() {
    if (this.props.disableAutoFocus) {
      return
    }

    const dialogElement: any = this.getDialogElement()
    const currentActiveElement = activeElement(getOwnerDocument(this))

    if (dialogElement && !contains(dialogElement, currentActiveElement)) {
      this.lastFocus = currentActiveElement

      if (!dialogElement.hasAttribute('tabIndex')) {
        warning(
          false,
          [
            'Material-UI: the modal content node does not accept focus.',
            'For the benefit of assistive technologies, ' +
              'the tabIndex of the node is being set to "-1".',
          ].join('\n'),
        )
        dialogElement.setAttribute('tabIndex', -1)
      }

      dialogElement.focus()
    }
  }

  public restoreLastFocus() {
    if (this.props.disableRestoreFocus) {
      return
    }

    if (this.lastFocus) {
      this.lastFocus.focus()
      this.lastFocus = null
    }
  }

  public enforceFocus = () => {
    if (this.props.disableEnforceFocus || !this.mounted || !this.isTopModal()) {
      return
    }

    const dialogElement: any = this.getDialogElement()
    const currentActiveElement = activeElement(getOwnerDocument(this))

    if (dialogElement && !contains(dialogElement, currentActiveElement)) {
      dialogElement.focus()
    }
  }

  public isTopModal() {
    if (this.props.manager) {
      return this.props.manager.isTopModal(this)
    }
  }

  public render() {
    const {
      BackdropComponent,
      BackdropProps,
      children,
      className,
      container,
      disableAutoFocus,
      disableBackdropClick,
      disableEnforceFocus,
      disableEscapeKeyDown,
      disableRestoreFocus,
      hideBackdrop,
      keepMounted,
      onBackdropClick,
      onClose,
      onEscapeKeyDown,
      onRendered,
      open,
      manager,
      ...other,
    } = this.props
    const { exited } = this.state
    const hasTransition = getHasTransition(this.props)
    const childProps: any = {}

    if (!keepMounted && !open && (!hasTransition || exited)) {
      return null
    }

    // It's a Transition like component
    if (hasTransition) {
      childProps.onExited = createChainedFunction(this.handleExited, children.props.onExited)
    }

    if (children.props.role === undefined) {
      childProps.role = children.props.role || 'document'
    }

    if (children.props.tabIndex === undefined) {
      childProps.tabIndex = children.props.tabIndex || '-1'
    }

    return (
      <Portal
        ref={(node: any) => {
          this.mountNode = node ? node.getMountNode() : node
        }}
        container={container}
        onRendered={this.handleRendered}
      >
        <div
          data-mui-test="Modal"
          ref={(node: any) => {
            this.modalNode = node
          }}
          className={classNames('Sui_Modal_root', className, {
            'Sui_Modal_hidden': exited,
          })}
          {...other}
        >
          {hideBackdrop ? null : (
            <BackdropComponent open={open} onClick={this.handleBackdropClick} {...BackdropProps} />
          )}
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

export default Modal
