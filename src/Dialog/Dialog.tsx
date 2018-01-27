// @inheritedComponent Modal

import * as classNames from 'classnames'
import * as React from 'react'
import Modal from '../Modal'
import Paper from '../Paper'
import Fade from '../transitions/Fade'
import { capitalizeFirstLetter } from '../utils/helpers'

export interface Props {
  /**
   * Dialog children, usually the included sub-components.
   */
  children: any,
  /**
   * @ignore
   */
  className?: string,
  /**
   * If `true`, clicking the backdrop will not fire the `onClose` callback.
   */
  disableBackdropClick?: boolean,
  /**
   * If `true`, hitting escape will not fire the `onClose` callback.
   */
  disableEscapeKeyDown?: boolean,
  /**
   * If `true`, it will be full-screen
   */
  fullScreen?: boolean,
  /**
   * If specified, stretches dialog to max width.
   */
  fullWidth?: boolean,
  /**
   * Determine the max width of the dialog.
   * The dialog width grows with the size of the screen, this property is useful
   * on the desktop where you might need some coherent different width size across your
   * application. Set to `false` to disable `maxWidth`.
   */
  maxWidth?: 'xs'|'sm'|'md'|false,
  /**
   * Callback fired when the backdrop is clicked.
   */
  onBackdropClick?: (arg?: any) => any,
  /**
   * Callback fired when the component requests to be closed.
   *
   * @param {object} event The event source of the callback
   */
  onClose?: (arg?: any) => any,
  /**
   * Callback fired before the dialog enters.
   */
  onEnter?: (arg?: any) => any,
  /**
   * Callback fired when the dialog has entered.
   */
  onEntered?: (arg?: any) => any,
  /**
   * Callback fired when the dialog is entering.
   */
  onEntering?: (arg?: any) => any,
  /**
   * Callback fired when the escape key is pressed,
   * `disableKeyboard` is false and the modal is in focus.
   */
  onEscapeKeyDown?: (arg?: any) => any,
  /**
   * Callback fired before the dialog exits.
   */
  onExit?: (arg?: any) => any,
  /**
   * Callback fired when the dialog has exited.
   */
  onExited?: (arg?: any) => any,
  /**
   * Callback fired when the dialog is exiting.
   */
  onExiting?: (arg?: any) => any,
  /**
   * If `true`, the Dialog is open.
   */
  open: boolean,
  /**
   * Transition component.
   */
  transition?: string|((arg?: any) => any),
  /**
   * The duration for the transition, in milliseconds.
   * You may specify a single timeout for all transitions, or individually with an object.
   */
  transitionDuration?: number|{ enter?: number, exit?: number },
  fullHeight?: boolean,
  width?: string|number,
  height?: string|number,
}

/**
 * Dialogs are overlaid modal paper based components with a backdrop.
 */
function Dialog(props: Props) {
  const {
    children,
    className,
    fullScreen = false,
    fullWidth = false,
    fullHeight,
    disableBackdropClick = false,
    disableEscapeKeyDown  = false,
    height,
    maxWidth = 'sm',
    onBackdropClick,
    onClose,
    onEnter,
    onEntered,
    onEntering,
    onEscapeKeyDown,
    onExit,
    onExited,
    onExiting,
    open,
    transition: TransitionProp = Fade,
    transitionDuration = { enter: 200, exit: 200 },
    width,
    ...other,
  } = props

  return (
    <Modal
      className={classNames('Sui_Dialog_root', className)}
      BackdropProps={{
        transitionDuration,
      }}
      disableBackdropClick={disableBackdropClick}
      disableEscapeKeyDown={disableEscapeKeyDown}
      onBackdropClick={onBackdropClick}
      onEscapeKeyDown={onEscapeKeyDown}
      onClose={onClose}
      open={open}
      role="dialog"
      {...other}
    >
      <TransitionProp
        appear
        in={open}
        timeout={transitionDuration}
        onEnter={onEnter}
        onEntering={onEntering}
        onEntered={onEntered}
        onExit={onExit}
        onExiting={onExiting}
        onExited={onExited}
      >
        <Paper
          data-mui-test="Dialog"
          elevation={24}
          className={classNames('Sui_Dialog_paper', {
            'Sui_Dialog_paper-width-xs': maxWidth === 'xs',
            'Sui_Dialog_paper-width-sm': maxWidth === 'sm',
            'Sui_Dialog_paper-width-md': maxWidth === 'md',
            'Sui_Dialog_full-screen': fullScreen,
            'Sui_Dialog_full-width': fullWidth,
          })}
        >
          {children}
        </Paper>
      </TransitionProp>
    </Modal>
  )
}

export default Dialog
