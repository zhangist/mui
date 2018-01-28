// @inheritedComponent Modal

import * as classNames from 'classnames'
import * as React from 'react'
import Modal from '../Modal'
import Paper from '../Paper'
import { duration } from '../styles/transitions'
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
  anchor: 'left'|'top'|'right'|'bottom',
  /**
   * The contents of the drawer.
   */
  children?: React.ReactNode,
  /**
   * @ignore
   */
  className?: string,
  /**
   * The elevation of the drawer.
   */
  elevation?: number,
  /**
   * Properties applied to the `Modal` element.
   */
  ModalProps?: any,
  /**
   * Callback fired when the component requests to be closed.
   *
   * @param {object} event The event source of the callback
   */
  onClose?: (arg?: any) => any,
  /**
   * If `true`, the drawer is open.
   */
  open?: boolean,
  /**
   * Properties applied to the `Slide` element.
   */
  SlideProps?: any,
  /**
   * The duration for the transition, in milliseconds.
   * You may specify a single timeout for all transitions, or individually with an object.
   */
  transitionDuration?: number|{ enter?: number, exit?: number },
  /**
   * The type of drawer.
   */
  type?: 'permanent'|'persistent'|'temporary',
  rootStyle?: any,
}

class Drawer extends React.Component<Props, any> {
  public static defaultProps = {
    anchor: 'left',
    elevation: 16,
    open: false,
    transitionDuration: { enter: duration.enteringScreen, exit: duration.leavingScreen },
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
      anchor: anchorProp,
      children,
      className,
      elevation,
      ModalProps,
      onClose,
      open,
      rootStyle,
      SlideProps,
      transitionDuration,
      type,
      ...other,
    } = this.props

    // let anchor = anchorProp
    // if (theme.direction === 'rtl' && ['left', 'right'].indexOf(anchor) > -1) {
    //   anchor = anchor === 'left' ? 'right' : 'left'
    // }
    const anchor = anchorProp

    const drawer = (
      <Paper
        elevation={type === 'temporary' ? elevation : 0}
        square
        className={classNames(
          'Sui_Drawer_paper',
          'Sui_Drawer_paper-anchor-' + anchor,
          {
            ['Sui_Drawer_paper-anchor-docked-' + anchor]: type !== 'temporary',
          },
        )}
        style={...rootStyle}
      >
        {children}
      </Paper>
    )

    if (type === 'permanent') {
      return (
        <div className={classNames('Sui_Drawer_docked', className)} {...other}>
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
        BackdropProps={{
          transitionDuration,
        }}
        className={classNames('Sui_Drawer_modal', className)}
        open={open}
        onClose={onClose}
        {...other}
        {...ModalProps}
      >
        {slidingDrawer}
      </Modal>
    )
  }
}

export default Drawer
