const curInst = os.getCurrentInst();
const primaryInst = thisBot.abPrimaryInst();

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] curInst: ${curInst}, primaryInst: ${primaryInst}, abIsPrimary: ${curInst === primaryInst}`);
}

return curInst === primaryInst;