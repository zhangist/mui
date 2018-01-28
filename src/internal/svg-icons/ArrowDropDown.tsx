import * as React from 'react'
import { pure } from 'recompose'
import SvgIcon from '../../SvgIcon'

/**
 * @ignore - internal component.
 */
let ArrowDropDown: any = (props: any) => (
  <SvgIcon {...props}>
    <path d="M7 10l5 5 5-5z" />
  </SvgIcon>
)

ArrowDropDown = pure(ArrowDropDown)
ArrowDropDown.muiName = 'SvgIcon'

export default ArrowDropDown
