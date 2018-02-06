import hoistNonReactStatics = require('hoist-non-react-statics')
import { debounce } from 'lodash'
import * as React from 'react'
import EventListener from 'react-event-listener'
import { wrapDisplayName } from 'recompose'

const breakpointKeys = ['xs', 'sm', 'md', 'lg', 'xl']
const breakpointValues: any = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
}

// By default, returns true if screen width is the same or greater than the given breakpoint.
export const isWidthUp = (breakpoint: string, width: string, inclusive = true) => {
  if (inclusive) {
    return breakpointKeys.indexOf(breakpoint) <= breakpointKeys.indexOf(width)
  }
  return breakpointKeys.indexOf(breakpoint) < breakpointKeys.indexOf(width)
}

// By default, returns true if screen width is the same or less than the given breakpoint.
export const isWidthDown = (breakpoint: string, width: string, inclusive = true) => {
  if (inclusive) {
    return breakpointKeys.indexOf(width) <= breakpointKeys.indexOf(breakpoint)
  }
  return breakpointKeys.indexOf(width) < breakpointKeys.indexOf(breakpoint)
}

export interface Props {
  /**
   * As `window.innerWidth` is unavailable on the server,
   * we default to rendering an empty componenent during the first mount.
   * In some situation you might want to use an heristic to approximate
   * the screen width of the client browser screen width.
   *
   * For instance, you could be using the user-agent or the client-hints.
   * http://caniuse.com/#search=client%20hint
   */
  initialWidth?: 'xs'|'sm'|'md'|'lg'|'xl',
  /**
   * Bypass the width calculation logic.
   */
  width?: 'xs'|'sm'|'md'|'lg'|'xl',
}

const withWidth = (options: any = {}) => (Component: any) => {
  const {
    resizeInterval = 166, // Corresponds to 10 frames at 60 Hz.
    withTheme: withThemeOption = false,
  } = options

  class WithWidth extends React.Component<Props, {}> {
    public state = {
      width: undefined,
    }

    private handleResize = debounce(() => {
      this.updateWidth(window.innerWidth)
    }, resizeInterval)

    public componentDidMount() {
      this.updateWidth(window.innerWidth)
    }

    public componentWillUnmount() {
      this.handleResize.cancel()
    }

    public updateWidth(innerWidth: number) {
      // const breakpoints = this.props.theme.breakpoints
      let width = null

      /**
       * Start with the slowest value as low end devices often have a small screen.
       *
       * innerWidth |xs      sm      md      lg      xl
       *            |-------|-------|-------|-------|------>
       * width      |  xs   |  sm   |  md   |  lg   |  xl
       */
      let index = 1
      while (width === null && index < breakpointKeys.length) {
        const currentWidth = breakpointKeys[index]

        // @media are inclusive, so reproduce the behavior here.
        if (innerWidth < breakpointValues[currentWidth]) {
          width = breakpointKeys[index - 1]
          break
        }

        index += 1
      }

      width = width || 'xl'

      if (width !== this.state.width) {
        this.setState({
          width,
        })
      }
    }

    public render() {
      const {
        initialWidth,
        width,
        ...other,
      } = this.props
      const props = {
        width: width || this.state.width || initialWidth,
        ...other,
      }
      const more = {}

      // When rendering the component on the server,
      // we have no idea about the client browser screen width.
      // In order to prevent blinks and help the reconciliation of the React tree
      // we are not rendering the child component.
      //
      // An alternative is to use the `initialWidth` property.
      if (props.width === undefined) {
        return null
      }

      return (
        <EventListener target="window" onResize={this.handleResize}>
          <Component {...more} {...props} />
        </EventListener>
      )
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    (WithWidth as any).displayName = wrapDisplayName(Component, 'WithWidth')
  }

  hoistNonReactStatics(WithWidth, Component)

  return (WithWidth as any) // ? any -> for tsc build error
}

export default withWidth
