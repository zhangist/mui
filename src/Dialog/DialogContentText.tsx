import * as classNames from 'classnames'
import * as React from 'react'

export interface Props {
  /**
   * The content of the component.
   */
  children?: React.ReactNode,
  /**
   * @ignore
   */
  className?: string,
}

function DialogContentText(props: Props) {
  const {
    children,
    className,
    ...other,
  } = props

  return (
    <p className={classNames('Sui_DialogContentText_root', className)} {...other}>
      {children}
    </p>
  )
}

export default DialogContentText
