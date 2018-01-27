import * as classNames from 'classnames'
import * as React from 'react'
import * as warning from 'warning'

export interface Props {
  /**
   * @ignore
   */
  children?: any,
  /**
   * @ignore
   */
  className?: string,
  /**
   * The component used for the root node.
   * Either a string to use a DOM element or a component.
   */
  component?: any,
  /**
   * Shadow depth, corresponds to `dp` in the spec.
   * It's accepting values between 0 and 24 inclusive.
   */
  elevation?: number,
  /**
   * If `true`, rounded corners are disabled.
   */
  square?: boolean,
}

function Paper(props: Props) {
  const {
    className: classNameProp,
    component: ComponentProp = 'div',
    square = false,
    elevation = 2,
    ...other,
  } = props

  warning(
    elevation >= 0 && elevation < 25,
    `Material-UI: this elevation \`${elevation}\` is not implemented.`,
  )

  const className = classNames(
    'Sui_Paper_root',
    'Sui_Paper_shadow-' + (elevation >= 0 ? elevation : 0),
    {
      'Sui_Paper_rounded': !square,
    },
    classNameProp,
  )

  return <ComponentProp className={className} {...other} />
}

export default Paper
