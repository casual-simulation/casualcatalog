const message = that?.args?.message;
const name = thisBot.abAskHelperGetAgentName({ askContext: that.askContext });
const avatar = thisBot.abAskHelperGetAgentAvatar({ askContext: that.askContext });

if (message) {
    ab.links.utils.abLog({ name, avatar, message, space: 'shared' });
}
