const relativePath = that;

const url = new URL(links.remember.tags.abCasualCatalogURL);
const env = links.remember.tags.abCasualCatalogEnv;

url.pathname = relativePath;

if (env && env !== 'prod') {
    url.searchParams.set('env', env);
}

return url.href;