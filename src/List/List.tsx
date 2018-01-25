import * as classNames from 'classnames'
import * as React from 'react'

export interface Props {
  /**
   * The content of the component.
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
   * If `true`, compact vertical padding designed for keyboard and mouse input will be used for
   * the list and list items. The property is available to descendant components as the
   * `dense` context.
   */
  dense?: boolean,
  /**
   * If `true`, vertical padding will be removed from the list.
   */
  disablePadding?: boolean,
  /**
   * The content of the subheader, normally `ListSubheader`.
   */
  subheader?: any,
  onKeyDown?: (arg?: any) => any,
  onBlur?: (arg?: any) => any,
  role?: string,
}

export interface ChildContextTypes {
  dense?: boolean,
}

class List extends React.Component<Props, {}> {
  public static defaultProps = {
    component: 'ul',
    dense: false,
    disablePadding: false,
  }

  public getChildContext() {
    return {
      dense: this.props.dense,
    }
  }

  public render() {
    const {
      children,
      className: classNameProp,
      component: ComponentProp,
      dense,
      disablePadding,
      subheader,
      ...other,
    } = this.props
    const className = classNames(
      'Sui_List-root',
      {
        'Sui_List-dense': dense && !disablePadding,
        'Sui_List-padding': !disablePadding,
        'Sui_List-subheader': subheader,
      },
      classNameProp,
    )

    return (
      <ComponentProp className={className} {...other}>
        {subheader}
        {children}
      </ComponentProp>
    )
  }
}

export default List
