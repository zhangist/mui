import * as classNames from 'classnames'
import * as React from 'react'
import Modal from '../Modal'
import Fade from '../transitions/Fade'

const DURATION = 200

export interface Props {
  fullHeight?: boolean,
  height?: number|string,
  onClose?: (arg?: any) => any,
  open: boolean,
  width?: number|string,
}

class Dialog extends React.Component<Props, any> {
  public render() {
    const {
      fullHeight,
      height,
      open,
      width,
      ...other,
    } = this.props

    const dialogRootClassName = classNames(
      'Sui_Dialog_root',
      {
        'Sui_Dialog_full-height': fullHeight,
      },
    )

    return (
      <Modal
        open={open}
        rootStyle={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
        {...other}
      >
        <Fade appear in={open} timeout={DURATION}>
          <div className={dialogRootClassName} style={{
            width: width ? '100%' : null,
            maxWidth: width ? width : null,
            height: height ? '100%' : null,
            maxHeight: height ? height : null,
          }}>
            {this.props.children}
          </div>
        </Fade>
      </Modal>
    )
  }
}

export default Dialog
