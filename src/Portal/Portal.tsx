import ownerDocument = require('dom-helpers/ownerDocument')
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import exactProp from '../utils/exactProp'

function getContainer(container: any, defaultContainer: any) {
  container = typeof container === 'function' ? container() : container
  return ReactDOM.findDOMNode(container) || defaultContainer
}

function getOwnerDocument(element: any) {
  return ownerDocument(ReactDOM.findDOMNode(element))
}

export interface Props {
  /**
   * The children to render into the `container`.
   */
  children: any,
  /**
   * A node, component instance, or function that returns either.
   * The `container` will have the portal children appended to it.
   * By default, it's using the body of the the top-level document object,
   * so it's simply `document.body` most of the time.
   */
  container?: any,
  /**
   * Callback fired once the children has been mounted into the `container`.
   */
  onRendered?: () => any,
}

/**
 * This component shares many concepts with
 * [react-overlays](https://react-bootstrap.github.io/react-overlays/#portals)
 * But has been fork in order to fix some bugs, reduce the number of dependencies
 * and take the control of our destiny.
 */
class Portal extends React.Component<Props, {}> {
  public mountNode: any

  public componentDidMount() {
    this.setContainer(this.props.container)
    this.forceUpdate(this.props.onRendered)
  }

  public componentWillReceiveProps(nextProps: any) {
    if (nextProps.container !== this.props.container) {
      this.setContainer(nextProps.container)
    }
  }

  public componentWillUnmount() {
    this.mountNode = null
  }

  public setContainer(container: any) {
    this.mountNode = getContainer(container, getOwnerDocument(this).body)
  }

  /**
   * @public
   */
  public getMountNode = () => {
    return this.mountNode
  }

  public render() {
    const { children } = this.props

    return this.mountNode ? ReactDOM.createPortal(children, this.mountNode) : null
  }
}

export default Portal
