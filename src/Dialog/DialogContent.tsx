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

function DialogContent(props: Props) {
  const {
    children,
    className,
    ...other,
  } = props

  return (
    <div className={classNames('Sui_DialogContent_root', className)} {...other}>
      {children}
    </div>
  )
}

export default DialogContent
