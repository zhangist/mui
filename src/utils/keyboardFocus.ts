import contains = require('dom-helpers/query/contains')
import * as keycode from 'keycode'
import * as warning from 'warning'
import addEventListener from '../utils/addEventListener'

const internal = {
  listening: false,
  focusKeyPressed: false,
}

export function focusKeyPressed(pressed?: any) {
  if (typeof pressed !== 'undefined') {
    internal.focusKeyPressed = Boolean(pressed)
  }

  return internal.focusKeyPressed
}

export function detectKeyboardFocus(instance: any, element: any, callback: any, attempt = 1) {
  warning(instance.keyboardFocusCheckTime, 'Material-UI: missing instance.keyboardFocusCheckTime')
  warning(
    instance.keyboardFocusMaxCheckTimes,
    'Material-UI: missing instance.keyboardFocusMaxCheckTimes',
  )

  instance.keyboardFocusTimeout = setTimeout(() => {
    if (
      focusKeyPressed() &&
      (document.activeElement === element || contains(element, document.activeElement))
    ) {
      callback()
    } else if (attempt < instance.keyboardFocusMaxCheckTimes) {
      detectKeyboardFocus(instance, element, callback, attempt + 1)
    }
  }, instance.keyboardFocusCheckTime)
}

const FOCUS_KEYS = ['tab', 'enter', 'space', 'esc', 'up', 'down', 'left', 'right']

function isFocusKey(event: any) {
  return FOCUS_KEYS.indexOf(keycode(event)) !== -1
}

export function listenForFocusKeys() {
  // It's a singleton, we only need to listen once.
  // Also, this logic is client side only, we don't need a teardown.
  if (!internal.listening) {
    addEventListener(window, 'keyup', (event: any) => {
      if (isFocusKey(event)) {
        internal.focusKeyPressed = true
      }
    })
    internal.listening = true
  }
}
