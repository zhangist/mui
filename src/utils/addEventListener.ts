export default function(node: any, event: string, handler: any, capture?: boolean) {
  node.addEventListener(event, handler, capture)
  return {
    remove() {
      node.removeEventListener(event, handler, capture)
    },
  }
}
