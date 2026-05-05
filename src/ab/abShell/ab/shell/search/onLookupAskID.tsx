let askID = that?.askID;
if (tags.askAliases?.[askID]) {
    askID = tags.askAliases[askID];
}

const showIndicator = that?.showIndicator ?? true;
const autoHatch = that?.autoHatch ?? true;
const eggParameters = that?.eggParameters;
const sourceEvent = that?.sourceEvent;
const onPreprocessBeforeCreate = that?.onPreprocessBeforeCreate;
const ignoreReserved = that?.ignoreReserved;
const dataOnly = that?.dataOnly ?? false;

assert(typeof askID === 'string', `[${tags.system}.${tagName}] askID is a required string parameter.`);

let lookupAsk: ABLookupAskIDResult;
let busyIndicator;

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] that:`, {...that});
}

if (showIndicator) {
    if (!links.menu) {
        await links.learn.abAdapt('abInterface');
    }

    busyIndicator = await links.menu.abCreateMenuBusyIndicator({ abMenu: true, label: `looking up ${askID}` });
}

//Check for reserved keywords
if (links?.learn?.tags?.reservedAsks?.includes(askID) && !ignoreReserved && authBot) {
    if (!getBot("abIDOrigin", askID)) {
        lookupAsk = await thisBot.lookupFromStudio({...that, reserved: true, dataOnly });
        if (lookupAsk && lookupAsk.success == true) {
            if (busyIndicator) {
                destroy(busyIndicator);
            }
            if (tags.debug) {
                console.log(`[${tags.system}.${tagName}] returning reserved ask '${askID}' found in studio:`, lookupAsk);
            }
            return lookupAsk;
        }
    }
}

// First check the casual catalog for the ask.
const casualCatalogURL = links.learn.abBuildCasualCatalogURL(`/asks/${askID}.aux`);

try {
    const casualCatalogResponse = await web.hook({ method: 'GET', url: casualCatalogURL });

    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] casual catalog response:`, casualCatalogResponse);
    }

    if (casualCatalogResponse.status === 200) {
        if (casualCatalogResponse.data.version === 1 && casualCatalogResponse.data.state) {
            if (dataOnly) {
                lookupAsk = {
                    success: true,
                    origin: 'casual_catalog',
                    data: casualCatalogResponse.data,
                }
            } else {
                // Casual catalog response is a v1 aux file.
                const newBots = await links.create.abCreateBots({ 
                    bots: casualCatalogResponse.data.state,
                    ignoreGridFocus: true,
                    origin: askID,
                    eggParameters,
                    onPreprocessBeforeCreate,
                    sourceEvent,
                });

                lookupAsk = {
                    success: true,
                    origin: 'casual_catalog',
                    hatchedBots: newBots,
                }
            }
        } else if (casualCatalogResponse.data.version === 2 && casualCatalogResponse.data.updates) {
            // Casual catalog response is a v2 aux file.
            links.utils.abLogAndToast({ message: `Asks only support v1 aux file format.`, logType: 'error'});

            lookupAsk = {
                success: false,
                origin: 'casual_catalog'
            }
        } else {
            // Unrecognized casual catalog response.
            console.error(`[${tags.system}.${tagName}] Unrecognized casual catalog ask response.`, casualCatalogResponse);
            links.utils.abLogAndToast({ message: `Unrecognized casual catalog ask response. Check console for more details.`, logType: 'error'});

            lookupAsk = {
                success: false,
                origin: 'casual_catalog'
            }
        }
        
        if (busyIndicator) {
            destroy(busyIndicator);
        }

        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] returning ask '${askID}' found in casual catalog:`, lookupAsk)
        }

        return lookupAsk;
    }
} catch (e) {
    // Did not find in the casual catalog.
}

lookupAsk = await thisBot.lookupFromStudio(that);

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] lookupFromStudio result:`, {...lookupAsk});
}

if (busyIndicator) {
    destroy(busyIndicator);
}

return lookupAsk;