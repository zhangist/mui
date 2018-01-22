declare module 'dom-helpers/activeElement' {
  export = activeElement
  function activeElement(arg?: any): any
}

declare module 'dom-helpers/ownerDocument' {
  export = ownerDocument
  function ownerDocument(arg: any): any
}

declare module 'dom-helpers/query/contains' {
  export = contains
  function contains(arg: any, arg1: any): boolean
}

declare module 'dom-helpers/util/inDOM' {
  export = inDOM
  function inDOM(arg: any): any
}

declare module 'dom-helpers/util/scrollbarSize' {
  export = scrollbarSize
  function scrollbarSize(): any
}
