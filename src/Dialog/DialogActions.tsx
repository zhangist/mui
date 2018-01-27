import * as classNames from 'classnames'
import * as React from 'react'
import '../Button' // So we don't have any override priority issue.

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

function DialogActions(props: Props) {
  const {
    children,
    className,
    ...other,
  } = props

  return (
    <div className={classNames('Sui_DialogActions_root', className)} {...other}>
      {React.Children.map(children, (child: any) => {
        if (!React.isValidElement(child)) {
          return null
        }

        return (
          <div className="Sui_DialogActions_action">
            {React.cloneElement((child as any), {
              className: classNames('Sui_DialogActions_button', (child.props as any).className),
            })}
          </div>
        )
      })}
    </div>
  )
}

export default DialogActions
