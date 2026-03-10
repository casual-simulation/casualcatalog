// imports the d3-force-3d library for use in casual
const d3 = await import('https://cdn.jsdelivr.net/npm/d3-force-3d@3.0.5/+esm');

// sets the library as a global variable
globalThis.d3 = d3;

// confirms that the library has been imported in the console
console.log('[d3f3d] d3 imported');
console.log(d3);