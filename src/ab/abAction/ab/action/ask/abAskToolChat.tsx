const message = that?.args?.message;
const name = thisBot.abAskHelperGetAgentName({ askContext: that.askContext });

if (message) {
    ab.links.utils.abLog({ name, message });
}
