const BLACKLIST = ['template', 'script', 'style']

function isHidable(node: any) {
  return node.nodeType === 1 && BLACKLIST.indexOf(node.tagName.toLowerCase()) === -1
}

function siblings(container: any, mount: any, callback: any) {
  mount = Array().concat(mount)
  Array().forEach.call(container.children, (node: any) => {
    if (mount.indexOf(node) === -1 && isHidable(node)) {
      callback(node)
    }
  })
}

export function ariaHidden(show: any, node: any) {
  if (!node) {
    return
  }
  if (show) {
    node.setAttribute('aria-hidden', 'true')
  } else {
    node.removeAttribute('aria-hidden')
  }
}

export function hideSiblings(container: any, mountNode: any) {
  siblings(container, mountNode, (node: any) => ariaHidden(true, node))
}

export function showSiblings(container: any, mountNode: any) {
  siblings(container, mountNode, (node: any) => ariaHidden(false, node))
}
