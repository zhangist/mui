import * as React from 'react'
import { pure } from 'recompose'
import SvgIcon from '../../SvgIcon'

/**
 * @ignore - internal component.
 */
let KeyboardArrowLeft: any = (props: any) => (
  <SvgIcon {...props}>
    <path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z" />
  </SvgIcon>
)
KeyboardArrowLeft = pure(KeyboardArrowLeft)
KeyboardArrowLeft.muiName = 'SvgIcon'

export default KeyboardArrowLeft
