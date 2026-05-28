if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] that:`, that, `tags:`, JSON.parse(JSON.stringify(tags)));
}

if (that.sourceEvent !== 'reconstitute') {
    thisBot.setup({ data: { eggParameters: that.eggParameters } });
}