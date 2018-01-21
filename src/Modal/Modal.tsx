import * as classNames from 'classnames'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Transition from 'react-transition-group/Transition'

const DURATION = 300

const defaultStyle = {
  transition: `opacity ${DURATION}ms ease-out`, // cubic-bezier(0.4, 0, 0.2, 1) 0ms
  opacity: 0.8,
}

const transitionStyles: any = {
  entering: { opacity: 0.8 },
  entered: { opacity: 1 },
}

export interface Props {
  children: any,
  closable?: boolean,
  fullHeight?: boolean,
  height?: number|string,
  open: boolean,
  width?: number|string,
}

export default class Modal extends React.Component<Props, any> {
  public overflow = document.body.style.overflow

  public state = {
    openBackdrop: false,
  }

  public componentWillUpdate(nextProps: any, nextState: any) {
    if (!this.props.open && nextProps.open) {
      document.body.style.overflow = 'hidden'
      this.setState({
        openBackdrop: true,
      })
    }
    if (this.props.open && !nextProps.open) {
      document.body.style.overflow = this.overflow
      this.setState({
        openBackdrop: false,
      })
    }
  }

  public componentWillUnmount() {
    document.body.style.overflow = this.overflow
    this.setState({
      openBackdrop: false,
    })
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
        <Transition in={openBackdrop} appear timeout={DURATION}>
          {(state: any) => (
            <div className="Sui_Backdrop-root" onClick={() => this.setState({openBackdrop: true})} style={{
              ...defaultStyle,
              ...transitionStyles[state],
            }}></div>)}
        </Transition>
        {/* <div className={backdropClassName}></div> */}
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
      document.body,
    ) : null
  }
}
