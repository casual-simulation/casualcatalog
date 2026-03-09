const relativePath = that;

const url = new URL(links.remember.tags.casualCatalogURL);
const env = links.remember.tags.casualCatalogEnv;

url.pathname = relativePath;

if (env && env !== 'prod') {
    url.searchParams.set('env', env);
}

return url.href;