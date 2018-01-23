import * as ReactDOM from 'react-dom'
import LegacyPortal from './LegacyPortal'
import Portal from './Portal'

export default (ReactDOM.createPortal ? Portal : LegacyPortal)
