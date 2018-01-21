import * as classnames from 'classnames'
import * as React from 'react'
import Transition from 'react-transition-group/Transition'

export interface Props {
  pulsate?: boolean,
  rippleSize: number,
  rippleX: number,
  rippleY: number,
  timeout: number | { enter?: number, exit?: number }
}

export default class Ripple extends React.Component<Props, any> {
  public getInitialProps = {
    pulsate: false,
  }
  public state = {
    rippleVisible: false,
    rippleLeaving: false,
  }

  public handleEnter() {
    this.setState({
      rippleVisible: true,
    })
  }

  public handleExit() {
    this.setState({
      rippleLeaving: true,
    })
  }

  public render() {
    const {
      pulsate,
      rippleX,
      rippleY,
      rippleSize,
      timeout,
      ...other,
    } = this.props
    const { rippleVisible, rippleLeaving } = this.state

    const className = classnames('Sui_Ripple-wrapper', {
      'Sui_Ripple-wrapper-leaving': rippleLeaving,
      'Sui_Ripple-wrapper-pulsating': pulsate,
    })
    const rippleClassName = classnames('Sui_Ripple-ripple', {
      'Sui_Ripple-ripple-visible': rippleVisible,
      'Sui_Ripple-ripple-fast': pulsate,
    })

    const rippleStyles = {
      width: rippleSize,
      height: rippleSize,
      top: -(rippleSize / 2) + rippleY,
      left: -(rippleSize / 2) + rippleX,
    }

    return (
      <Transition onEnter={() => this.handleEnter()} onExit={() => this.handleExit()} timeout={timeout} {...other}>
        <span className={className}>
          <span className={rippleClassName} style={rippleStyles} />
        </span>
      </Transition>
    )
  }
}
