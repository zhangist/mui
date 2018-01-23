import * as React from 'react'

/**
 * @ignore - internal component.
 *
 * Internal helper component to allow attaching a ref to a
 * child element that may not accept refs (functional component).
 */
class RefHolder extends React.Component {
  public render() {
    return this.props.children
  }
}

export default RefHolder
