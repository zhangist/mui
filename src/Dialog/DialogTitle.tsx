import * as classNames from 'classnames'
import * as React from 'react'
import Typography from '../Typography'

export interface Props {
  /**
   * The content of the component.
   */
  children: React.ReactNode,
  /**
   * @ignore
   */
  className?: string,
  /**
   * If `true`, the children won't be wrapped by a typography component.
   * For instance, this can be useful to render an h4 instead of the default h2.
   */
  disableTypography?: boolean,
}

function DialogTitle(props: Props) {
  const {
    children,
    className,
    disableTypography = false,
    ...other,
  } = props

  return (
    <div data-mui-test="DialogTitle" className={classNames('Sui_DialogTitle_root', className)} {...other}>
      {disableTypography ? children : <Typography type="title">{children}</Typography>}
    </div>
  )
}

export default DialogTitle
