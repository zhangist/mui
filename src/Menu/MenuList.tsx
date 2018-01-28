// @inheritedComponent List

import activeElement = require('dom-helpers/activeElement')
import ownerDocument = require('dom-helpers/ownerDocument')
import contains = require('dom-helpers/query/contains')
import * as keycode from 'keycode'
import * as React from 'react'
import { findDOMNode } from 'react-dom'
import List from '../List'

export interface Props {
  /**
   * MenuList contents, normally `MenuItem`s.
   */
  children?: any,
  /**
   * @ignore
   */
  className?: string,
  /**
   * @ignore
   */
  onBlur?: (arg?: any) => any,
  /**
   * @ignore
   */
  onKeyDown?: (arg?: any, arg2?: any) => any,
}

class MenuList extends React.Component<Props, any> {
  public list: any = undefined
  public selectedItem: any = undefined
  public blurTimer: any = undefined
  public state = {
    currentTabIndex: undefined,
  }

  public componentDidMount() {
    this.resetTabIndex()
  }

  public componentWillUnmount() {
    clearTimeout(this.blurTimer)
  }

  public setTabIndex(index: any) {
    this.setState({ currentTabIndex: index })
  }

  public handleBlur = (event: any) => {
    this.blurTimer = setTimeout(() => {
      if (this.list) {
        const list = findDOMNode(this.list)
        const currentFocus = activeElement(ownerDocument(list))
        if (!contains(list, currentFocus)) {
          this.resetTabIndex()
        }
      }
    }, 30)

    if (this.props.onBlur) {
      this.props.onBlur(event)
    }
  }

  public handleKeyDown = (event: any) => {
    const list: any = findDOMNode(this.list)
    const key = keycode(event)
    const currentFocus = activeElement(ownerDocument(list))

    if (
      (key === 'up' || key === 'down') &&
      (!currentFocus || (currentFocus && !contains(list, currentFocus)))
    ) {
      if (this.selectedItem) {
        (findDOMNode(this.selectedItem) as any).focus()
      } else {
        list.firstChild.focus()
      }
    } else if (key === 'down') {
      event.preventDefault()
      if (currentFocus.nextElementSibling) {
        currentFocus.nextElementSibling.focus()
      }
    } else if (key === 'up') {
      event.preventDefault()
      if (currentFocus.previousElementSibling) {
        currentFocus.previousElementSibling.focus()
      }
    }

    if (this.props.onKeyDown) {
      this.props.onKeyDown(event, key)
    }
  }

  public handleItemFocus = (event: any) => {
    const list = findDOMNode(this.list)
    if (list) {
      for (let i = 0; i < list.children.length; i += 1) {
        if (list.children[i] === event.currentTarget) {
          this.setTabIndex(i)
          break
        }
      }
    }
  }

  public focus() {
    const { currentTabIndex } = this.state
    const list: any = findDOMNode(this.list)
    if (!list || !list.children || !list.firstChild) {
      return
    }

    if (currentTabIndex && currentTabIndex >= 0) {
      list.children[currentTabIndex].focus()
    } else {
      list.firstChild.focus()
    }
  }

  public resetTabIndex() {
    const list: any = findDOMNode(this.list)
    const currentFocus = activeElement(ownerDocument(list))
    // const items = [...list.children] <- this line error
    const items = Array().concat(list.children)
    const currentFocusIndex = items.indexOf(currentFocus)

    if (currentFocusIndex !== -1) {
      return this.setTabIndex(currentFocusIndex)
    }

    if (this.selectedItem) {
      return this.setTabIndex(items.indexOf(findDOMNode(this.selectedItem)))
    }

    return this.setTabIndex(0)
  }

  public render() {
    const {
      children,
      className,
      onBlur,
      onKeyDown,
      ...other,
    } = this.props

    return (
      <List
        data-mui-test="MenuList"
        role="menu"
        ref={(node: any) => {
          this.list = node
        }}
        className={className}
        onKeyDown={this.handleKeyDown}
        onBlur={this.handleBlur}
        {...other}
      >
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) {
            return null
          }

          return React.cloneElement((child as any), {
            tabIndex: index === this.state.currentTabIndex ? 0 : -1,
            ref: (child.props as any).selected
              ? (node: any) => {
                  this.selectedItem = node
                }
              : undefined,
            onFocus: this.handleItemFocus,
          })
        })}
      </List>
    )
  }
}

export default MenuList
