if (that.tags.includes("strokeColor")) {
    if (links.strokeBot) {
        links.strokeBot.tags.color = tags.strokeColor;
    }
}

if (that.tags.includes("eggConfigConfirmed")) {
    if (tags.chosenEggName && authBot && tags.eggConfigConfirmed) {
        let dataResponse = await os.getData(tags.chosenStudio ?? authBot.id, tags.chosenEggName);

        if (!dataResponse.success) {
            if(dataResponse.errorCode && dataResponse.errorCode == 'not_authorized') {
                await os.grantInstAdminPermission(tags.chosenStudio ?? authBot.id);
                dataResponse = await os.getData(tags.chosenStudio ?? authBot.id, tags.chosenEggName);
            }
        }

        if (dataResponse.success) {
            tags.label = tags.chosenEggName + ' v' + dataResponse.data.maxVersion;
            tags.maxEggVersion = dataResponse.data.maxVersion;
        }
    }
}
