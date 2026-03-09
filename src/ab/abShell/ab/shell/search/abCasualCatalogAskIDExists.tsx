const askID = that?.askID;
const url = links.learn.abBuildCasualCatalogURL(`/asks/${askID}.aux`);

let exists;
let response;

try {
    response = await web.hook({
        method: 'HEAD',
        url,
    })

    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] response:`, response);
    }
} catch (e) {
    // Call to casual catalog has failed, the ask id does not exist there.
    // NOTE: It would be nice if the Casual Catalog endpoint returned a 404 Not Found status code just so we can rule out actual server errors.
    if (tags.debug) {
        console.error(`[${tags.system}.${tagName}] caught an error:`, e);
    }

    exists = false;
}

if (response && response.status === 200) {
    exists = true;
} else {
    exists = false;
}

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] askID '${askID}' exists in casual catalog?`, exists);
}

return exists;
