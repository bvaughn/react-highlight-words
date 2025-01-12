import { createRoot } from 'react-dom/client'

/**
 * Helper method for testing components that may use Portal and thus require cleanup.
 * This helper method renders components to a transient node that is destroyed after the test completes.
 * Note that rendering twice within the same test method will update the same element (rather than recreate it).
 */
export function render (markup) {
  if (!render._root) {
    const div = document.createElement('div')
    document.body.appendChild(div)
    const root = createRoot(div)
    render._root = root
    render._mountNode = div

    afterEach(render.unmount)
  }

  render._root.render(markup)
}

/**
 * The render() method auto-unmounts components after each test has completed.
 * Use this method manually to test the componentWillUnmount() lifecycle method.
 */
render.unmount = function () {
  if (render._root) {
    render._root.unmount()
    document.body.removeChild(render._mountNode)
    render._root = null
    render._mountNode = null
  }
}
