if (!Array.isArray(tags.dependencies)) {
    return true;
}

tags.version = that?.version;
const promises = [];

// Get and hatch egg if not existent
for (var d of tags.dependencies) {
	const packageBot = getBot("packageName", d.packageName);

	if (!packageBot) {
		// TODO: get specific version if specified
        links.search.onLookupAskID({
            askID: d.abID,
            sourceEvent: 'tool',
            eggParameters: {
            },
        });
	}
}

return true;
