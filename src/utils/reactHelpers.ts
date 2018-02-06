// @flow
/* eslint-disable import/prefer-default-export */

import { Children, cloneElement, isValidElement } from 'react'

export function cloneChildrenWithClassName(children: Node, className: string) {
  return (Children.map(children, (child: any) => {
    return (
      isValidElement(child) &&
      cloneElement(child as any, {
        className: child.props.hasOwnProperty('className')
          ? `${(child.props as any).className} ${className}`
          : className,
      })
    )
  }) as any) // ? any -> for tsc build error
}

export function isMuiElement(element: any, muiNames: string[]) {
  return isValidElement(element) && muiNames.indexOf((element.type as any).muiName) !== -1
}

export function isMuiComponent(element: any, muiNames: string[]) {
  return muiNames.indexOf(element.muiName) !== -1
}
