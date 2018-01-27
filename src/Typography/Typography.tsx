import * as classNames from 'classnames'
import * as React from 'react'
import { capitalizeFirstLetter } from '../utils/helpers'

export interface Props {
  /**
   * Set the text-align on the component.
   */
  align?: 'inherit'|'left'|'center'|'right'|'justify',
  /**
   * The content of the component.
   */
  children?: React.ReactNode,
  /**
   * @ignore
   */
  className?: string,
  /**
   * The color of the component. It's using the theme palette when that makes sense.
   */
  color?: 'inherit'|'primary'|'textSecondary'|'secondary'|'error'|'default',
  /**
   * The component used for the root node.
   * Either a string to use a DOM element or a component.
   * By default, it maps the type to a good default headline component.
   */
  component?: any,
  /**
   * If `true`, the text will have a bottom margin.
   */
  gutterBottom?: boolean,
  /**
   * We are empirically mapping the type property to a range of different DOM element type.
   * For instance, h1 to h6. If you wish to change that mapping, you can provide your own.
   * Alternatively, you can use the `component` property.
   */
  headlineMapping?: any,
  /**
   * If `true`, the text will not wrap, but instead will truncate with an ellipsis.
   */
  noWrap?: boolean,
  /**
   * If `true`, the text will have a bottom margin.
   */
  paragraph?: boolean,
  /**
   * Applies the theme typography styles.
   */
  type?: 'display4'|'display3'|'display2'|'display1'|'headline'|'title'|'subheading'|'body2'|'body1'|'caption'|'button',
}

function Typography(props: Props) {
  const {
    align = 'inherit',
    className: classNameProp,
    component: componentProp,
    color = 'default',
    gutterBottom = false,
    headlineMapping = {
      display4: 'h1',
      display3: 'h1',
      display2: 'h1',
      display1: 'h1',
      headline: 'h1',
      title: 'h2',
      subheading: 'h3',
      body2: 'aside',
      body1: 'p',
    },
    noWrap = false,
    paragraph = false,
    type = 'body1',
    ...other,
  } = props

  const className = classNames(
    'Sui_Typography_root',
    {
      'Sui_Typography_display4': type === 'display4',
      'Sui_Typography_display3': type === 'display3',
      'Sui_Typography_display2': type === 'display2',
      'Sui_Typography_display1': type === 'display1',
      'Sui_Typography_headline': type === 'headline',
      'Sui_Typography_title': type === 'title',
      'Sui_Typography_subheading': type === 'subheading',
      'Sui_Typography_body2': type === 'body2',
      'Sui_Typography_body1': type === 'body1',
      'Sui_Typography_caption': type === 'caption',
      'Sui_Typography_button': type === 'button',
      'Sui_Typography_color-inherit': color === 'inherit',
      'Sui_Typography_color-primary': color === 'primary',
      'Sui_Typography_color-text-secondary': color === 'textSecondary',
      'Sui_Typography_color-secondary': color === 'secondary',
      'Sui_Typography_color-error': color === 'error',
      'Sui_Typography_no-wrap': noWrap,
      'Sui_Typography_gutter-bottom': gutterBottom,
      'Sui_Typography_paragraph': paragraph,
      'Sui_Typography_align-left': align === 'left',
      'Sui_Typography_align-center': align === 'center',
      'Sui_Typography_align-right': align === 'right',
      'Sui_Typography_align-justify': align === 'justify',
    },
    classNameProp,
  )

  const Component = componentProp || (paragraph ? 'p' : headlineMapping[type]) || 'span'

  return <Component className={className} {...other} />
}

export default Typography
