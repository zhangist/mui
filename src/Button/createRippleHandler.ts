function createRippleHandler(instance: any, eventName: any, action: any, cb?: any) {
  return function handleEvent(event: any) {
    if (cb) {
      cb.call(instance, event)
    }

    if (event.defaultPrevented) {
      return false
    }

    if (instance.ripple) {
      instance.ripple[action](event)
    }

    if (instance.props && typeof instance.props[`on${eventName}`] === 'function') {
      instance.props[`on${eventName}`](event)
    }

    return true
  }
}

export default createRippleHandler
