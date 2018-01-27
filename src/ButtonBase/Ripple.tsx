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

  public handleEnter = () => {
    this.setState({
      rippleVisible: true,
    })
  }

  public handleExit = () => {
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

    const wrapperClassName = classnames(
      'Sui_Ripple_wrapper',
      {
        'Sui_Ripple_wrapper-leaving': rippleLeaving,
        'Sui_Ripple_wrapper-pulsating': pulsate,
      },
    )
    const rippleClassName = classnames(
      'Sui_Ripple_ripple',
      {
        'Sui_Ripple_ripple-visible': rippleVisible,
        'Sui_Ripple_ripple-fast': pulsate,
      },
    )

    const rippleStyles = {
      width: rippleSize,
      height: rippleSize,
      top: -(rippleSize / 2) + rippleY,
      left: -(rippleSize / 2) + rippleX,
    }

    return (
      <Transition onEnter={this.handleEnter} onExit={this.handleExit} timeout={timeout} {...other}>
        <span className={wrapperClassName}>
          <span className={rippleClassName} style={rippleStyles} />
        </span>
      </Transition>
    )
  }
}
