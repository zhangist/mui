// @inheritedComponent Modal
import * as classNames from 'classnames'
import * as React from 'react'
import Modal from '../Modal'
import Slide from '../transitions/Slide'
import { capitalizeFirstLetter } from '../utils/helpers'

function getSlideDirection(anchor: any) {
  if (anchor === 'left') {
    return 'right'
  } else if (anchor === 'right') {
    return 'left'
  } else if (anchor === 'top') {
    return 'down'
  }

  // (anchor === 'bottom')
  return 'up'
}

export interface Props {
  /**
   * Side from which the drawer will appear.
   */
  anchor?: 'left'|'top'|'right'|'bottom',
  /**
   * The contents of the drawer.
   */
  children: any,
  /**
   * @ignore
   */
  className?: string,
  /**
   * Properties applied to the `Modal` element.
   */
  ModalProps?: any,
  /**
   * Callback fired when the component requests to be closed.
   *
   * @param {object} event The event source of the callback
   */
  onClose?: (arg: any, arg2: any) => any,
  /**
   * If `true`, the drawer is open.
   */
  open?: boolean,
  rootStyle?: any,
  /**
   * Properties applied to the `Slide` element.
   */
  SlideProps?: any,
  /**
   * The duration for the transition, in milliseconds.
   * You may specify a single timeout for all transitions, or individually with an object.
   */
  transitionDuration?: number | { enter?: number, exit?: number },
  /**
   * The type of drawer.
   */
  type?: 'permanent'|'persistent'|'temporary',
}

class Drawer extends React.Component<Props, any> {
  public static defaultProps = {
    anchor: 'left',
    open: false,
    transitionDuration: { enter: 200, exit: 200 },
    type: 'temporary', // Mobile first.
  }

  public state = {
    // Let's assume that the Drawer will always be rendered on user space.
    // We use that state is order to skip the appear transition during the
    // initial mount of the component.
    firstMount: true,
  }

  public componentWillReceiveProps() {
    this.setState({
      firstMount: false,
    })
  }

  public render() {
    const {
      anchor,
      children,
      className,
      ModalProps,
      open,
      rootStyle,
      SlideProps,
      transitionDuration,
      type,
      ...other,
    } = this.props

    const rootClassName = classNames(
      'Sui_Drawer_root',
      {
        'Sui_Drawer_root-anchor-left': anchor === 'left',
        'Sui_Drawer_root-anchor-right': anchor === 'right',
        'Sui_Drawer_root-anchor-top': anchor === 'top',
        'Sui_Drawer_root-anchor-bottom': anchor === 'bottom',
        'Sui_Drawer_root-anchor-docked-left': anchor === 'left' && type !== 'temporary',
        'Sui_Drawer_root-anchor-docked-right': anchor === 'right' && type !== 'temporary',
        'Sui_Drawer_root-anchor-docked-top': anchor === 'top' && type !== 'temporary',
        'Sui_Drawer_root-anchor-docked-bottom': anchor === 'bottom' && type !== 'temporary',
      },
    )

    const drawer = (
      <div className={rootClassName} style={...rootStyle}>
        {children}
      </div>
    )

    if (type === 'permanent') {
      return (
        <div className={classNames('Sui_Drawer_docked', className)}>
          {drawer}
        </div>
      )
    }

    const slidingDrawer = (
      <Slide
        in={open}
        direction={getSlideDirection(anchor)}
        timeout={transitionDuration}
        appear={!this.state.firstMount}
        {...SlideProps}
      >
        {drawer}
      </Slide>
    )

    if (type === 'persistent') {
      return (
        <div className={classNames('Sui_Drawer_docked', className)} {...other}>
          {slidingDrawer}
        </div>
      )
    }

    // type === temporary
    return (
      <Modal
        open={open}
        {...other}
        {...ModalProps}
      >
        {slidingDrawer}
      </Modal>
    )
  }
}

export default Drawer
