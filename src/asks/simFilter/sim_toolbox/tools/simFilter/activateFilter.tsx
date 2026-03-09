tags.activeFilter = true;
await os.registerApp(tags.simID, thisBot);
const App = thisBot.filterApp();
await os.compileApp(tags.simID, <App/>);

const app = document.getElementById("app");

document.body.replaceChildren(app);

thisBot.modifyIframe();