// Compiling the app with an empty root value is a workaround that allows the
// previous components to perform their unmounting code properly.
await os.compileApp("messageApp", <></>);
await os.unregisterApp("tags.system");