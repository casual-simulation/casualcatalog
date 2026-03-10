const packageBot = getBot('system', 'rc-differ._packageInfo');
configBot.tags.pageTitle = `RC AUX Differ v${packageBot.raw.version} (${configBot.tags.inst})`;

const url = new URL(configBot.tags.url);

const differParam = url.searchParams.get('differ');
if (differParam !== 'false') {
    thisBot.mount();
}
