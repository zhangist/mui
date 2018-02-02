import * as classNames from 'classnames'
import * as React from 'react'
import { capitalizeFirstLetter } from '../utils/helpers'

const SIZE = 50

function getRelativeValue(value: number, min: number, max: number) {
  const clampedValue = Math.min(Math.max(min, value), max)
  return (clampedValue - min) / (max - min)
}

export interface Props {
  /**
   * @ignore
   */
  className?: string,
  /**
   * The color of the component. It's using the theme palette when that makes sense.
   */
  color?: 'primary'|'secondary'|'inherit',
  /**
   * The max value of progress in determinate mode.
   */
  max?: number,
  /**
   * The min value of progress in determinate mode.
   */
  min?: number,
  /**
   * The mode of show your progress. Indeterminate
   * for when there is no value for progress.
   * Determinate for controlled progress value.
   */
  mode?: 'determinate'|'indeterminate',
  /**
   * The size of the circle.
   */
  size?: number|string,
  /**
   * @ignore
   */
  style?: any,
  /**
   * The thickness of the circle.
   */
  thickness?: number,
  /**
   * The value of progress in determinate mode.
   */
  value?: number,
}

function CircularProgress(props: Props) {
  const {
    className,
    color = 'primary',
    max = 100,
    min = 0,
    mode = 'indeterminate',
    size = 40,
    style,
    thickness = 3.6,
    value = 0,
    ...other,
  } = props

  const rootProps: any = {}
  const circleStyle: any = {}

  if (mode === 'determinate') {
    const relVal = getRelativeValue(value, min, max) * 100
    const circumference = 2 * Math.PI * (SIZE / 2 - 5)

    circleStyle.strokeDashoffset = `${Math.round((100 - relVal) / 100 * circumference * 1000) / 1000}px`
    circleStyle.strokeDasharray = Math.round(circumference * 1000) / 1000

    rootProps['aria-valuenow'] = value
    rootProps['aria-valuemin'] = min
    rootProps['aria-valuemax'] = max
  }

  return (
    <div
      className={classNames(
        'Sui_CircularProgress_root',
        {
          ['Sui_CircularProgress_color-' + color]: color !== 'inherit',
        },
        className,
      )}
      style={{ width: size, height: size, ...style }}
      role="progressbar"
      {...rootProps}
      {...other}
    >
      <svg
        className={classNames({
          'Sui_CircularProgress_svg-indeterminate': mode === 'indeterminate',
          'Sui_CircularProgress_svg-determinate': mode === 'determinate',
        })}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
      >
        <circle
          className={classNames('Sui_CircularProgress_circle', {
            'Sui_CircularProgress_circle-indeterminate': mode === 'indeterminate',
          })}
          style={circleStyle}
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={SIZE / 2 - 5}
          fill="none"
          strokeWidth={thickness}
        />
      </svg>
    </div>
  )
}

export default CircularProgress
