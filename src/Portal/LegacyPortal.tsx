import ownerDocument = require('dom-helpers/ownerDocument')
import * as React from 'react'
import * as ReactDOM from 'react-dom'

function getContainer(container: any, defaultContainer: any) {
  container = typeof container === 'function' ? container() : container
  return ReactDOM.findDOMNode(container) || defaultContainer
}

function getOwnerDocument(element: any) {
  return ownerDocument(ReactDOM.findDOMNode(element))
}

export interface Props {
  children: any,
  container?: any,
  onRendered?: () => any,
}

/**
 * @ignore - internal component.
 *
 * This module will soon be gone. We should drop it as soon as React@15.x support stop.
 */
class LegacyPortal extends React.Component<Props, any> {
  public mounted: boolean
  public overlayTarget: any
  public mountNode: any
  public overlayInstance: any

  public componentDidMount() {
    this.mounted = true
    this.renderOverlay()
  }

  public componentWillReceiveProps(nextProps: any) {
    if (this.overlayTarget && nextProps.container !== this.props.container) {
      this.mountNode.removeChild(this.overlayTarget)
      this.mountNode = getContainer(nextProps.container, getOwnerDocument(this).body)
      this.mountNode.appendChild(this.overlayTarget)
    }
  }

  public componentDidUpdate() {
    this.renderOverlay()
  }

  public componentWillUnmount() {
    this.mounted = false
    this.unrenderOverlay()
    this.unmountOverlayTarget()
  }

  /**
   * @public
   */
  public getMountNode = () => {
    return this.mountNode
  }

  public mountOverlayTarget = () => {
    if (!this.overlayTarget) {
      this.overlayTarget = document.createElement('div')
      this.mountNode = getContainer(this.props.container, getOwnerDocument(this).body)
      this.mountNode.appendChild(this.overlayTarget)
    }
  }

  public unmountOverlayTarget = () => {
    if (this.overlayTarget) {
      this.mountNode.removeChild(this.overlayTarget)
      this.overlayTarget = null
    }
    this.mountNode = null
  }

  public unrenderOverlay = () => {
    if (this.overlayTarget) {
      ReactDOM.unmountComponentAtNode(this.overlayTarget)
      this.overlayInstance = null
    }
  }

  public renderOverlay = () => {
    const overlay = this.props.children
    this.mountOverlayTarget()
    const initialRender = !this.overlayInstance
    this.overlayInstance = ReactDOM.unstable_renderSubtreeIntoContainer(
      this,
      overlay,
      this.overlayTarget,
      () => {
        if (initialRender && this.props.onRendered) {
          this.props.onRendered()
        }
      },
    )
  }

  public render() {
    return null
  }
}

export default LegacyPortal
