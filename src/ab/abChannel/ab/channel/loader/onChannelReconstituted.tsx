if (that.tags.channelName == tags.currentLoadingChannel) {
    that.onChannelLoaded();

    if (tags.destroyChannelOnLoad) {
        destroy(that);
    }
}