const eggParameters = that.eggParameters;
let makeDefaultBots = true;
let abIgnoreThis = false;

if (eggParameters) {

    if (eggParameters.customBots) {
        create(eggParameters.customBots);
    }

    if(eggParameters.defaultBots == false){
        makeDefaultBots = false;
    }

    if(eggParameters.abIgnore){
        abIgnoreThis = true;
    }

}

if(makeDefaultBots){
    create(tags.defaultBots)
}

if(abIgnoreThis){
    await os.sleep(500);
    getBots(b=>{
        const systemTag = b.tags.system;
        if(String(systemTag).includes("ms-forceGraph") && b.tags.abIDOrigin == "msForceGraphTool"){
            setTag(b, 'abIgnore', true);
        }
    })
}