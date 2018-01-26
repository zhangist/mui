// @inheritedComponent Modal

import contains = require('dom-helpers/query/contains')
import debounce = require('lodash/debounce')
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import EventListener from 'react-event-listener'
import * as warning from 'warning'
import Modal from '../Modal'
import Paper from '../Paper'
import Grow from '../transitions/Grow'

function getOffsetTop(rect: any, vertical: any) {
  let offset = 0

  if (typeof vertical === 'number') {
    offset = vertical
  } else if (vertical === 'center') {
    offset = rect.height / 2
  } else if (vertical === 'bottom') {
    offset = rect.height
  }

  return offset
}

function getOffsetLeft(rect: any, horizontal: any) {
  let offset = 0

  if (typeof horizontal === 'number') {
    offset = horizontal
  } else if (horizontal === 'center') {
    offset = rect.width / 2
  } else if (horizontal === 'right') {
    offset = rect.width
  }

  return offset
}

function getTransformOriginValue(transformOrigin: any) {
  return [transformOrigin.horizontal, transformOrigin.vertical]
    .map((n: any) => {
      return typeof n === 'number' ? `${n}px` : n
    })
    .join(' ')
}

// Sum the scrollTop between two elements.
function getScrollParent(parent: any, child: any) {
  let element = child
  let scrollTop = 0

  while (element && element !== parent) {
    element = element.parentNode
    scrollTop += element.scrollTop
  }
  return scrollTop
}

export interface Props {
  /**
   * This is callback property. It's called by the component on mount.
   * This is useful when you want to trigger an action programmatically.
   * It currently only supports updatePosition() action.
   *
   * @param {object} actions This object contains all posible actions
   * that can be triggered programmatically.
   */
  action?: (arg?: any) => any,
  /**
   * This is the DOM element that may be used
   * to set the position of the popover.
   */
  anchorEl?: any,
  /**
   * This is the point on the anchor where the popover's
   * `anchorEl` will attach to. This is not used when the
   * anchorReference is 'anchorPosition'.
   *
   * Options:
   * vertical: [top, center, bottom]
   * horizontal: [left, center, right].
   */
  anchorOrigin?: {
    horizontal?: number|'left'|'center'|'right',
    vertical?: number|'top'|'center'|'bottom',
  },
  /**
   * This is the position that may be used
   * to set the position of the popover.
   * The coordinates are relative to
   * the application's client area.
   */
  anchorPosition?: {
    top?: number,
    left?: number,
  },
  /*
   * This determines which anchor prop to refer to to set
   * the position of the popover.
   */
  anchorReference?: 'anchorEl'|'anchorPosition',
  /**
   * The content of the component.
   */
  children?: any,
  /**
   * The elevation of the popover.
   */
  elevation?: number,
  /**
   * This function is called in order to retrieve the content anchor element.
   * It's the opposite of the `anchorEl` property.
   * The content anchor element should be an element inside the popover.
   * It's used to correctly scroll and set the position of the popover.
   * The positioning strategy tries to make the content anchor element just above the
   * anchor element.
   */
  getContentAnchorEl?: (arg?: any) => any,
  /**
   * Specifies how close to the edge of the window the popover can appear.
   */
  marginThreshold?: number,
  /**
   * Callback fired when the component requests to be closed.
   *
   * @param {object} event The event source of the callback.
   */
  onClose?: (arg?: any) => any,
  /**
   * Callback fired before the component is entering.
   */
  onEnter?: (arg?: any) => any,
  /**
   * Callback fired when the component has entered.
   */
  onEntered?: (arg?: any) => any,
  /**
   * Callback fired when the component is entering.
   */
  onEntering?: (arg?: any) => any,
  /**
   * Callback fired before the component is exiting.
   */
  onExit?: (arg?: any) => any,
  /**
   * Callback fired when the component has exited.
   */
  onExited?: (arg?: any) => any,
  /**
   * Callback fired when the component is exiting.
   */
  onExiting?: (arg?: any) => any,
  /**
   * If `true`, the popover is visible.
   */
  open: boolean,
  /**
   * Properties applied to the `Paper` element.
   */
  PaperProps?: any,
  /**
   * @ignore
   */
  role?: string,
  /**
   * This is the point on the popover which
   * will attach to the anchor's origin.
   *
   * Options:
   * vertical: [top, center, bottom, x(px)]
   * horizontal: [left, center, right, x(px)].
   */
  transformOrigin?: {
    horizontal?: number|'left'|'center'|'right',
    vertical?: number|'top'|'center'|'bottom',
  },
  /**
   * Transition component.
   */
  transition?: any,
  /**
   * Set to 'auto' to automatically calculate transition time based on height.
   */
  transitionDuration?: number|{ enter?: number, exit?: number }|'auto',
}

class Popover extends React.Component<Props, any> {
  public static defaultProps = {
    anchorReference: 'anchorEl',
    anchorOrigin: {
      vertical: 'top',
      horizontal: 'left',
    },
    elevation: 8,
    marginThreshold: 16,
    transformOrigin: {
      vertical: 'top',
      horizontal: 'left',
    },
    transition: Grow,
    transitionDuration: 'auto',
  }

  public transitionEl: any = undefined
  public handleGetOffsetTop = getOffsetTop
  public handleGetOffsetLeft = getOffsetLeft

  public handleResize = debounce(() => {
    const element = ReactDOM.findDOMNode(this.transitionEl)
    this.setPositioningStyles(element)
  }, 166)

  public componentDidMount() {
    if (this.props.action) {
      this.props.action({
        updatePosition: this.handleResize,
      })
    }
  }

  public componentWillUnmount() {
    this.handleResize.cancel()
  }

  public setPositioningStyles = (element: any) => {
    if (element && element.style) {
      const positioning = this.getPositioningStyle(element)
      element.style.top = positioning.top
      element.style.left = positioning.left
      element.style.transformOrigin = positioning.transformOrigin
    }
  }

  public getPositioningStyle = (element: any) => {
    const { marginThreshold } = this.props

    // Check if the parent has requested anchoring on an inner content node
    const contentAnchorOffset = this.getContentAnchorOffset(element)
    // Get the offset of of the anchoring element
    const anchorOffset: any = this.getAnchorOffset(contentAnchorOffset)

    const elemRect = {
      width: element.clientWidth,
      height: element.clientHeight,
    }
    // Get the transform origin point on the element itself
    const transformOrigin = this.getTransformOrigin(elemRect, contentAnchorOffset)

    // Calculate element positioning
    let top = anchorOffset.top - transformOrigin.vertical
    let left = anchorOffset.left - transformOrigin.horizontal
    const bottom = top + elemRect.height
    const right = left + elemRect.width

    // Window thresholds taking required margin into account
    const heightThreshold = window.innerHeight - (marginThreshold || 0)
    const widthThreshold = window.innerWidth - (marginThreshold || 0)

    // Check if the vertical axis needs shifting
    if (top < (marginThreshold || 0)) {
      const diff = top - (marginThreshold || 0)
      top -= diff
      transformOrigin.vertical += diff
    } else if (bottom > heightThreshold) {
      const diff = bottom - heightThreshold
      top -= diff
      transformOrigin.vertical += diff
    }

    warning(
      elemRect.height < heightThreshold || !elemRect.height || !heightThreshold,
      [
        'Material-UI: the popover component is too tall.',
        `Some part of it can not be seen on the screen (${elemRect.height - heightThreshold}px).`,
        'Please consider adding a `max-height` to improve the user-experience.',
      ].join('\n'),
    )

    // Check if the horizontal axis needs shifting
    if (left < (marginThreshold || 0)) {
      const diff = left - (marginThreshold || 0)
      left -= diff
      transformOrigin.horizontal += diff
    } else if (right > widthThreshold) {
      const diff = right - widthThreshold
      left -= diff
      transformOrigin.horizontal += diff
    }

    return {
      top: `${top}px`,
      left: `${left}px`,
      transformOrigin: getTransformOriginValue(transformOrigin),
    }
  }

  // Returns the top/left offset of the position
  // to attach to on the anchor element (or body if none is provided)
  public getAnchorOffset(contentAnchorOffset: any) {
    const { anchorEl, anchorOrigin, anchorReference, anchorPosition } = this.props

    if (anchorReference === 'anchorPosition') {
      return anchorPosition
    }

    const anchorElement = anchorEl || document.body
    const anchorRect = anchorElement.getBoundingClientRect()
    const anchorVertical = contentAnchorOffset === 0 ? (anchorOrigin as any).vertical : 'center'

    return {
      top: anchorRect.top + this.handleGetOffsetTop(anchorRect, anchorVertical),
      left: anchorRect.left + this.handleGetOffsetLeft(anchorRect, (anchorOrigin as any).horizontal),
    }
  }

  // Returns the vertical offset of inner content to anchor the transform on if provided
  public getContentAnchorOffset(element: any) {
    const { getContentAnchorEl, anchorReference } = this.props
    let contentAnchorOffset = 0

    if (getContentAnchorEl && anchorReference === 'anchorEl') {
      const contentAnchorEl = getContentAnchorEl(element)

      if (contentAnchorEl && contains(element, contentAnchorEl)) {
        const scrollTop = getScrollParent(element, contentAnchorEl)
        contentAnchorOffset =
          contentAnchorEl.offsetTop + contentAnchorEl.clientHeight / 2 - scrollTop || 0
      }

      // != the default value
      warning(
        (this.props.anchorOrigin as any).vertical === 'top',
        [
          'Material-UI: you can not change the default `anchorOrigin.vertical` value ',
          'when also providing the `getContentAnchorEl` property to the popover component.',
          'Only use one of the two properties.',
          'Set `getContentAnchorEl` to null or left `anchorOrigin.vertical` unchanged.',
        ].join('\n'),
      )
    }

    return contentAnchorOffset
  }

  // Return the base transform origin using the element
  // and taking the content anchor offset into account if in use
  public getTransformOrigin(elemRect: any, contentAnchorOffset = 0) {
    const { transformOrigin } = this.props
    return {
      vertical: this.handleGetOffsetTop(elemRect, (transformOrigin as any).vertical) + contentAnchorOffset,
      horizontal: this.handleGetOffsetLeft(elemRect, (transformOrigin as any).horizontal),
    }
  }

  public handleEnter = (element: any) => {
    if (this.props.onEnter) {
      this.props.onEnter(element)
    }

    this.setPositioningStyles(element)
  }

  public render() {
    const {
      anchorEl,
      anchorOrigin,
      anchorPosition,
      anchorReference,
      children,
      elevation,
      getContentAnchorEl,
      marginThreshold,
      onEnter,
      onEntered,
      onEntering,
      onExit,
      onExited,
      onExiting,
      open,
      PaperProps,
      role,
      transformOrigin,
      transition: TransitionProp,
      transitionDuration,
      action,
      ...other,
    } = this.props

    const transitionProps: any = {}

    // The provided transition might not support the auto timeout value.
    if (TransitionProp === Grow) {
      transitionProps.timeout = transitionDuration
    }

    return (
      <Modal open={open} BackdropProps={{ invisible: true }} {...other}>
        <TransitionProp
          appear
          in={open}
          onEnter={this.handleEnter}
          onEntered={onEntered}
          onEntering={onEntering}
          onExit={onExit}
          onExited={onExited}
          onExiting={onExiting}
          role={role}
          ref={(node: any) => {
            this.transitionEl = node
          }}
          {...transitionProps}
        >
          <Paper
            className="Sui_Popover_paper"
            data-mui-test="Popover"
            elevation={elevation}
            {...PaperProps}
          >
            <EventListener target="window" onResize={this.handleResize} />
            {children}
          </Paper>
        </TransitionProp>
      </Modal>
    )
  }
}

export default Popover
