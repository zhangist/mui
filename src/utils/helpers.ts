// @flow weak

import * as warning from 'warning'

export function capitalizeFirstLetter(str: any) {
  warning(
    typeof str === 'string',
    'Material-UI: capitalizeFirstLetter(string) expects a string argument.',
  )

  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function contains(obj: any, pred: any) {
  return Object.keys(pred).every((key: any) => {
    return obj.hasOwnProperty(key) && obj[key] === pred[key]
  })
}

export function findIndex(arr: any[], pred: any) {
  const predType = typeof pred
  for (let i = 0; i < arr.length; i += 1) {
    if (predType === 'function' && !!pred(arr[i], i, arr) === true) {
      return i
    }
    if (predType === 'object' && contains(arr[i], pred)) {
      return i
    }
    if (['string', 'number', 'boolean'].indexOf(predType) !== -1) {
      return arr.indexOf(pred)
    }
  }
  return -1
}

export function find(arr: any[], pred: any) {
  const index = findIndex(arr, pred)
  return index > -1 ? arr[index] : undefined
}

/**
 * Safe chained function
 *
 * Will only create a new function if needed,
 * otherwise will pass back existing functions or null.
 *
 * @param {function} functions to chain
 * @returns {function|null}
 */
export function createChainedFunction(...funcs: any[]) {
  return funcs.filter((func: any) => func != null).reduce(
    (acc, func) => {
      warning(
        typeof func === 'function',
        'Material-UI: invalid Argument Type, must only provide functions, undefined, or null.',
      )

      return function chainedFunction({...args}) {
        acc.apply(null, args)
        func.apply(null, args)
      }
    },
  )
}
