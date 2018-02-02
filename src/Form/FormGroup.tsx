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
  /**
   * Display group of elements in a compact row.
   */
  row?: boolean,
}

/**
 * `FormGroup` wraps controls such as `Checkbox` and `Switch`.
 * It provides compact row layout.
 * For the `Radio`, you should be using the `RadioGroup` component instead of this one.
 */
function FormGroup(props: Props) {
  const {
    className,
    children,
    row = false,
    ...other,
  } = props

  const rootClassName = classNames(
    'Sui_FormGroup_root',
    {
      'Sui_FormGroup_row': row,
    },
    className,
  )

  return (
    <div className={rootClassName} {...other}>
      {children}
    </div>
  )
}

export default FormGroup
