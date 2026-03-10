/** Given nested arrays (layout), will return what is at a specific location
 * 
 * layout: nested arrays
 * location: array of indexes that can be followed to the desired location
 */

const getAtLocation = (layout, location) => {
    try {
      return location.reduce(
        (acc, cur) => (Array.isArray(acc) ? acc[cur] : acc.children[cur]),
        layout
      )
    } catch (e) {
      return ''
    }
}

return getAtLocation