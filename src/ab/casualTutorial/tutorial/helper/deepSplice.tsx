/** Splices items in nested arrays
 * 
 * layout: nested arrays
 * location: array of indexes that can be followed to reach the desired location
 * deleteCount: how many children at the location should be deleted
 * toBeInserted: what should be spliced into the array
 */

const deepSplice = (layout, location, deleteCount, ...toBeInserted) => {
    const _location = [...location]
    const last = _location.pop()
    const finalItems = _location.reduce(
      (acc, cur) => (Array.isArray(acc) ? acc[cur] : acc.children[cur]),
      layout
    )
    Array.isArray(finalItems)
      ? finalItems.splice(last, deleteCount, ...toBeInserted)
      : finalItems.children.splice(last, deleteCount, ...toBeInserted)
    return layout
}

return deepSplice