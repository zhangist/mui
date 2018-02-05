// A grid component using the following libs as inspiration.
//
// For the implementation:
// - http://v4-alpha.getbootstrap.com/layout/flexbox-grid/
// - https://github.com/kristoferjoseph/flexboxgrid/blob/master/src/css/flexboxgrid.css
// - https://github.com/roylee0704/react-flexbox-grid
// - https://material.angularjs.org/latest/layout/introduction
//
// Follow this flexbox Guide to better understand the underlying model:
// - https://css-tricks.com/snippets/css/a-guide-to-flexbox/

import * as classNames from 'classnames'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import Hidden from '../Hidden'
import requirePropFactory from '../utils/requirePropFactory'

const defaultProps: any = {
  alignContent: 'stretch',
  alignItems: 'stretch',
  component: 'div',
  container: false,
  direction: 'row',
  item: false,
  justify: 'flex-start',
  zeroMinWidth: false,
  spacing: 16,
  wrap: 'wrap',
}

export interface Props {
  /**
   * Defines the `align-content` style property.
   * It's applied for all screen sizes.
   */
  alignContent?: 'stretch'|'center'|'flex-start'|'flex-end'|'space-between'|'space-around',
  /**
   * Defines the `align-items` style property.
   * It's applied for all screen sizes.
   */
  alignItems?: 'flex-start'|'center'|'flex-end'|'stretch'|'baseline',
  /**
   * The content of the component.
   */
  children?: React.ReactNode,
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
   * If `true`, the component will have the flex *container* behavior.
   * You should be wrapping *items* with a *container*.
   */
  container?: boolean,
  /**
   * Defines the `flex-direction` style property.
   * It is applied for all screen sizes.
   */
  direction?: 'row'|'row-reverse'|'column'|'column-reverse',
  /**
   * If provided, will wrap with [Hidden](/api/hidden) component and given properties.
   */
  hidden?: any,
  /**
   * If `true`, the component will have the flex *item* behavior.
   * You should be wrapping *items* with a *container*.
   */
  item?: boolean,
  /**
   * Defines the `justify-content` style property.
   * It is applied for all screen sizes.
   */
  justify?: 'flex-start'|'center'|'flex-end'|'space-between'|'space-around',
  /**
   * Defines the number of grids the component is going to use.
   * It's applied for the `lg` breakpoint and wider screens if not overridden.
   */
  lg?: true|1|2|3|4|5|6|7|8|9|10|11|12,
  /**
   * Defines the number of grids the component is going to use.
   * It's applied for the `md` breakpoint and wider screens if not overridden.
   */
  md?: true|1|2|3|4|5|6|7|8|9|10|11|12,
  /**
   * Defines the number of grids the component is going to use.
   * It's applied for the `sm` breakpoint and wider screens if not overridden.
   */
  sm?: true|1|2|3|4|5|6|7|8|9|10|11|12,
  /**
   * Defines the space between the type `item` component.
   * It can only be used on a type `container` component.
   */
  spacing?: 0|8|16|24|40,
  /**
   * Defines the `flex-wrap` style property.
   * It's applied for all screen sizes.
   */
  wrap?: 'nowrap'|'wrap'|'wrap-reverse',
  /**
   * Defines the number of grids the component is going to use.
   * It's applied for the `xl` breakpoint and wider screens.
   */
  xl?: true|1|2|3|4|5|6|7|8|9|10|11|12,
  /**
   * Defines the number of grids the component is going to use.
   * It's applied for all the screen sizes with the lowest priority.
   */
  xs?: true|1|2|3|4|5|6|7|8|9|10|11|12,
  /**
   * If `true`, it sets `min-width: 0` on the item.
   * Refer to the limitations section of the documentation to better understand the use case.
   */
  zeroMinWidth?: boolean,
}

const Grid: React.SFC<Props> = (props) => {
  const {
    alignContent,
    alignItems,
    className: classNameProp,
    component: Component,
    container,
    direction,
    hidden,
    item,
    justify,
    lg,
    md,
    zeroMinWidth,
    sm,
    spacing,
    wrap,
    xl,
    xs,
    ...other,
  } = props

  const className = classNames(
    {
      'Sui_Grid_type-container': container,
      'Sui_Grid_type-item': item,
      'Sui_Grid_zeroMinWidth': zeroMinWidth,
      ['Sui_Grid_spacing-xs-' + String(spacing)]: container && spacing !== 0,
      ['Sui_Grid_direction-xs-' + String(direction)]: direction !== defaultProps.direction,
      ['Sui_Grid_wrap-xs-' + String(wrap)]: wrap !== defaultProps.wrap,
      ['Sui_Grid_align-items-xs-' + String(alignItems)]: alignItems !== defaultProps.alignItems,
      ['Sui_Grid_align-content-xs-' + String(alignContent)]: alignContent !== defaultProps.alignContent,
      ['Sui_Grid_justify-xs-' + String(justify)]: justify !== defaultProps.justify,
      'Sui_Grid_grid-xs': xs === true,
      ['Sui_Grid_grid-xs-' + String(xs)]: xs && xs !== true,
      'Sui_Grid_grid-sm': sm === true,
      ['Sui_Grid_grid-sm-' + String(sm)]: sm && sm !== true,
      'Sui_Grid_grid-md': md === true,
      ['Sui_Grid_grid-md-' + String(md)]: md && md !== true,
      'Sui_Grid_grid-lg': lg === true,
      ['Sui_Grid_grid-lg-' + String(lg)]: lg && lg !== true,
      'Sui_Grid_grid-xl': xl === true,
      ['Sui_Grid_grid-xl-' + String(xl)]: xl && xl !== true,
    },
    classNameProp,
  )
  const gridProps = { className, ...other }

  if (hidden) {
    return (
      <Hidden {...hidden}>
        <Component {...gridProps} />
      </Hidden>
    )
  }

  return <Component {...gridProps} />
}

Grid.defaultProps = defaultProps

// Add a wrapper component to generate some helper messages in the development
// environment.
/* eslint-disable react/no-multi-comp */
// eslint-disable-next-line import/no-mutable-exports
let GridWrapper = Grid

if (process.env.NODE_ENV !== 'production') {
  GridWrapper = (props: any) => <Grid {...props} />

  const requireProp = requirePropFactory('Grid')
  GridWrapper.propTypes = {
    alignContent: requireProp('container'),
    alignItems: requireProp('container'),
    direction: requireProp('container'),
    justify: requireProp('container'),
    lg: requireProp('item'),
    md: requireProp('item'),
    sm: requireProp('item'),
    spacing: requireProp('container'),
    wrap: requireProp('container'),
    xs: requireProp('item'),
    zeroMinWidth: requireProp('zeroMinWidth'),
  }
}

export default GridWrapper
