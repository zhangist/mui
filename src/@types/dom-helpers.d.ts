/**
 * dom-helpers/activeElement
 */
declare module 'dom-helpers/activeElement' {
  export = activeElement
  function activeElement(arg?: any): any
}

/**
 * dom-helpers/class
 */
declare module 'dom-helpers/class/addClass' {
  export = addClass
  function addClass(element: any, className: any): any
}
declare module 'dom-helpers/class/hasClass' {
  export = hasClass
  function hasClass(element: any, className: any): any
}
declare module 'dom-helpers/class/removeClass' {
  export = removeClass
  function removeClass(element: any, className: any): any
}

/**
 * dom-helpers/events
 */
declare module 'dom-helpers/events/filterEvents' {
  export = filterEvents
  function filterEvents(selector: any, handler: any): any
}
declare module 'dom-helpers/events/listen' {
  export = listen
  function listen(node: any, eventName: any, handler: any, capture: any): any
}
declare module 'dom-helpers/events/off' {
  export = off
  function off(node: any, eventName: any, handler: any, capture?: any): any
}
declare module 'dom-helpers/events/on' {
  export = on
  function on(node: any, eventName: any, handler: any, capture?: any): any
}

/**
 * dom-helpers/ownerDocument
 */
declare module 'dom-helpers/ownerDocument' {
  export = ownerDocument
  function ownerDocument(arg: any): any
}

/**
 * dom-helpers/ownerWindow
 */
declare module 'dom-helpers/ownerWindow' {
  export = ownerWindow
  function ownerWindow(arg: any): any
}

/**
 * dom-helpers/query
 */
declare module 'dom-helpers/query/closest' {
  export = closest
  function closest(node: any, selector: any, context: any): any
}
declare module 'dom-helpers/query/contains' {
  export = contains
  function contains(context: any, node: any): any
}
declare module 'dom-helpers/query/height' {
  export = height
  function height(node: any, client: any): any
}
declare module 'dom-helpers/query/isWindow' {
  export = isWindow
  function isWindow(node: any): any
}
declare module 'dom-helpers/query/matches' {
  export = matches
  function matches(node: any, selector: any): any
}
declare module 'dom-helpers/query/offset' {
  export = offset
  function offset(node: any): any
}
declare module 'dom-helpers/query/offsetParent' {
  export = offsetParent
  function offsetParent(node: any): any
}
declare module 'dom-helpers/query/position' {
  export = position
  function position(node: any, offsetParent: any): any
}
declare module 'dom-helpers/query/querySelectorAll' {
  export = qsa
  function qsa(element: any, selector: any): any
}
declare module 'dom-helpers/query/scrollLeft' {
  export = scrollTop
  function scrollTop(node: any, val?: any): any
}
declare module 'dom-helpers/query/scrollParent' {
  export = scrollPrarent
  function scrollPrarent(node: any): any
}
declare module 'dom-helpers/query/scrollTop' {
  export = scrollTop
  function scrollTop(node: any, val?: any): any
}
declare module 'dom-helpers/query/width' {
  export = width
  function width(node: any, client?: any): any
}

/**
 * dom-helpers/requestAnimationFrame
 */
declare module 'dom-helpers/requestAnimationFrame' {
  export = requestAnimationFrame
  function requestAnimationFrame(arg: any): any
}

/**
 * dom-helpers/style
 */
declare module 'dom-helpers/style' {
  export = style
  function style(node: any, property: any, value?: any): any
}
declare module 'dom-helpers/style/getComputedStyle' {
  export = getComputedStyle
  function getComputedStyle(node: any): any
}
declare module 'dom-helpers/style/removeStyle' {
  export = removeStyle
  function removeStyle(node: any, key: any): any
}

/**
 * dom-helpers/transition
 */
declare module 'dom-helpers/transition/animate' {
  export = animate
  function animate(node: any, properties?: any, duration?: any, easing?: any, callback?: any): any
}
declare module 'dom-helpers/transition/end' {
  export = onEnd
  function onEnd(node: any, handler: any, duration?: any): any
}
declare module 'dom-helpers/transition/isTransform' {
  export = isTransform
  function isTransform(property?: any): any
}
declare module 'dom-helpers/transition/properties' {
  interface p {
    transform: string,
    end: string,
    property: string,
    timing: string,
    delay: string,
    duration: string
  }
  export = p
}

/**
 * dom-helpers/util
 */
declare module 'dom-helpers/util/camelize' {
  export = camelize
  function camelize(string: string): string
}
declare module 'dom-helpers/util/camelizeStyle' {
  export = camelizeStyleName
  function camelizeStyleName(string: string): string
}
declare module 'dom-helpers/util/hyphenate' {
  export = hyphenate
  function hyphenate(string: string): string
}
declare module 'dom-helpers/util/hyphenateStyle' {
  export = hyphenateStyleName
  function hyphenateStyleName(string: string): string
}
declare module 'dom-helpers/util/inDOM' {
  export = inDOM
  function inDOM(): boolean
}
declare module 'dom-helpers/util/requestAnimationFrame' {
  export = requestAnimationFrame
  function requestAnimationFrame(arg: any): any
}
declare module 'dom-helpers/util/scrollbarSize' {
  export = scrollbarSize
  function scrollbarSize(arg?: any): any
}
declare module 'dom-helpers/util/scrollTo' {
  export = scrollTo
  function scrollTo(selected: any, scrollParent?: any): any
}
