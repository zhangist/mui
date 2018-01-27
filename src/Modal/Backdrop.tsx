import * as classNames from 'classnames'
import * as React from 'react'
import Fade from '../transitions/Fade'

export interface Props {
  /**
   * If `true`, the backdrop is invisible.
   * It can be used when rendering a popover or a custom select component.
   */
  invisible?: boolean,
  /**
   * If `true`, the backdrop is open.
   */
  open: boolean,
  /**
   * The duration for the transition, in milliseconds.
   * You may specify a single timeout for all transitions, or individually with an object.
   */
  transitionDuration?: number|{ enter?: number, exit?: number },
}

function Backdrop(props: Props) {
  const {
    invisible = false,
    open,
    transitionDuration,
    ...other,
  } = props

  const className = classNames(
    'Sui_Backdrop_root',
    {
      'Sui_Backdrop_invisible': invisible,
    },
  )

  return (
    <Fade appear in={open} timeout={transitionDuration} {...other}>
      <div data-mui-test="Backdrop" className={className} aria-hidden="true" />
    </Fade>
  )
}

export default Backdrop
