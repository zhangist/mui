import * as classNames from 'classnames'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import * as warning from 'warning'

const TRANSITION_DURATION = 4 // 400ms

export interface Props {
  /**
   * @ignore
   */
  className?: string,
  /**
   * The color of the component. It's using the theme palette when that makes sense.
   */
  color?: 'primary'|'secondary',
  /**
   * The mode of show your progress, indeterminate
   * for when there is no value for progress.
   */
  mode?: 'determinate'|'indeterminate'|'buffer'|'query',
  /**
   * The value of progress, only works in determinate and buffer mode.
   * Value between 0 and 100.
   */
  value?: number,
  /**
   * The value of buffer, only works in buffer mode.
   * Value between 0 and 100.
   */
  valueBuffer?: number,
  rootStyle?: any,
}

function LinearProgress(props: Props) {
  const {
    className,
    color = 'primary',
    mode = 'indeterminate',
    value,
    valueBuffer,
    rootStyle,
    ...other,
  } = props

  const dashedClass = classNames('Sui_LinearProgress_dashed', {
    'Sui_LinearProgress_primary-dashed': color === 'primary',
    'Sui_LinearProgress_secondary-dashed': color === 'secondary',
  })

  const rootClassName = classNames(
    'Sui_LinearProgress_root',
    {
      'Sui_LinearProgress_primary-color': color === 'primary',
      'Sui_LinearProgress_secondary-color': color === 'secondary',
      'Sui_LinearProgress_root-buffer': mode === 'buffer',
      'Sui_LinearProgress_root-query': mode === 'query',
    },
    className,
  )
  const primaryClassName = classNames('Sui_LinearProgress_bar', {
    'Sui_LinearProgress_primary-color-bar': color === 'primary',
    'Sui_LinearProgress_secondary-color-bar': color === 'secondary',
    'Sui_LinearProgress_indeterminate-bar1': mode === 'indeterminate' || mode === 'query',
    'Sui_LinearProgress_determinate-bar1': mode === 'determinate',
    'Sui_LinearProgress_buffer-bar1': mode === 'buffer',
  })
  const secondaryClassName = classNames('Sui_LinearProgress_bar', {
    'Sui_LinearProgress_buffer-bar2': mode === 'buffer',
    'Sui_LinearProgress_primary-color-bar': color === 'primary' && mode !== 'buffer',
    'Sui_LinearProgress_primary-color': color === 'primary' && mode === 'buffer',
    'Sui_LinearProgress_secondary-color-bar': color === 'secondary' && mode !== 'buffer',
    'Sui_LinearProgress_secondary-color': color === 'secondary' && mode === 'buffer',
    'Sui_LinearProgress_indeterminate-bar2': mode === 'indeterminate' || mode === 'query',
  })
  const inlineStyles: any = { primary: {}, secondary: {} }
  const rootProps: any = {}

  if (mode === 'determinate') {
    if (value !== undefined) {
      inlineStyles.primary.transform = `scaleX(${value / 100})`
      rootProps['aria-valuenow'] = Math.round(value)
    } else {
      warning(
        false,
        'Material-UI: you need to provide a value property ' +
          'when LinearProgress is in determinate mode.',
      )
    }
  } else if (mode === 'buffer') {
    if (value !== undefined) {
      inlineStyles.primary.transform = `scaleX(${value / 100})`
      inlineStyles.secondary.transform = `scaleX(${(valueBuffer || 0) / 100})`
    } else {
      warning(
        false,
        'Material-UI: you need to provide a value property when LinearProgress is ' +
          'in buffer mode.',
      )
    }
  }

  return (
    <div className={rootClassName} {...rootProps} {...other} style={...rootStyle}>
      {mode === 'buffer' ? <div className={dashedClass} /> : null}
      <div className={primaryClassName} style={inlineStyles.primary} />
      {mode === 'determinate' ? null : (
        <div className={secondaryClassName} style={inlineStyles.secondary} />
      )}
    </div>
  )
}

export default LinearProgress
