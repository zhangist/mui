// @inheritedComponent Popover

import getScrollbarSize = require('dom-helpers/util/scrollbarSize')
import * as React from 'react'
import { findDOMNode } from 'react-dom'
import Popover from '../Popover'
import MenuList from './MenuList'

const RTL_ORIGIN: any = {
  vertical: 'top',
  horizontal: 'right',
}

const LTR_ORIGIN: any = {
  vertical: 'top',
  horizontal: 'left',
}

export interface Props {
  /**
   * The DOM element used to set the position of the menu.
   */
  anchorEl?: any,
  /**
   * Menu contents, normally `MenuItem`s.
   */
  children?: any,
  /**
   * Properties applied to the `MenuList` element.
   */
  MenuListProps?: any,
  /**
   * Callback fired when the component requests to be closed.
   *
   * @param {object} event The event source of the callback
   */
  onClose?: (arg?: any) => any,
  /**
   * Callback fired before the Menu enters.
   */
  onEnter?: (arg?: any) => any,
  /**
   * Callback fired when the Menu has entered.
   */
  onEntered?: (arg?: any) => any,
  /**
   * Callback fired when the Menu is entering.
   */
  onEntering?: (arg?: any) => any,
  /**
   * Callback fired before the Menu exits.
   */
  onExit?: (arg?: any) => any,
  /**
   * Callback fired when the Menu has exited.
   */
  onExited?: (arg?: any) => any,
  /**
   * Callback fired when the Menu is exiting.
   */
  onExiting?: (arg?: any) => any,
  /**
   * If `true`, the menu is visible.
   */
  open: boolean,
  /**
   * @ignore
   */
  PaperProps?: any,
  /**
   * `classes` property applied to the `Popover` element.
   */
  PopoverClasses?: any,
  /**
   * The length of the transition in `ms`, or 'auto'
   */
  transitionDuration?: number|{ enter?: number, exit?: number }|'auto',
  direction?: 'rtl'|'ltr',
}

class Menu extends React.Component<Props, any> {
  public static defaultProps = {
    transitionDuration: 'auto',
    direction: 'rtl',
  }

  public menuList: any = undefined

  public componentDidMount() {
    if (this.props.open) {
      this.focus()
    }
  }

  public getContentAnchorEl = () => {
    if (!this.menuList || !this.menuList.selectedItem) {
      return findDOMNode(this.menuList).firstChild
    }

    return findDOMNode(this.menuList.selectedItem)
  }

  public focus = () => {
    if (this.menuList && this.menuList.selectedItem) {
      (findDOMNode(this.menuList.selectedItem) as any).focus()
      return
    }

    const menuList = findDOMNode(this.menuList)
    if (menuList && menuList.firstChild) {
      (menuList.firstChild as any).focus()
    }
  }

  public handleEnter = (element: any) => {
    const menuList: any = findDOMNode(this.menuList)

    // Focus so the scroll computation of the Popover works as expected.
    this.focus()

    // Let's ignore that piece of logic if users are already overriding the width
    // of the menu.
    if (menuList && element.clientHeight < menuList.clientHeight && !menuList.style.width) {
      const size = `${getScrollbarSize()}px`
      menuList.style[this.props.direction === 'rtl' ? 'paddingLeft' : 'paddingRight'] = size
      menuList.style.width = `calc(100% + ${size})`
    }

    if (this.props.onEnter) {
      this.props.onEnter(element)
    }
  }

  public handleListKeyDown = (event: any, key: any) => {
    if (key === 'tab') {
      event.preventDefault()

      if (this.props.onClose) {
        this.props.onClose(event)
      }
    }
  }

  public render() {
    const {
      children,
      MenuListProps,
      onEnter,
      PaperProps = {},
      PopoverClasses,
      direction,
      ...other,
    } = this.props

    return (
      <Popover
        getContentAnchorEl={this.getContentAnchorEl}
        onEnter={this.handleEnter}
        anchorOrigin={direction === 'rtl' ? RTL_ORIGIN : LTR_ORIGIN}
        transformOrigin={direction === 'rtl' ? RTL_ORIGIN : LTR_ORIGIN}
        PaperProps={{
          ...PaperProps,
          classes: {
            ...PaperProps.classes,
            // root: classes.paper,
          },
        }}
        {...other}
      >
        <MenuList
          data-mui-test="Menu"
          role="menu"
          onKeyDown={this.handleListKeyDown}
          {...MenuListProps}
          ref={(node: any) => {
            this.menuList = node
          }}
        >
          {children}
        </MenuList>
      </Popover>
    )
  }
}

export default Menu
