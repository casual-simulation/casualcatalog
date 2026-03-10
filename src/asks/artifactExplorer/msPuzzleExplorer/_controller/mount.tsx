const App = thisBot.App(that.message);

console.log("app prop: ", that)

await os.registerApp("messageApp", thisBot);
await os.compileApp("messageApp", <App/>)