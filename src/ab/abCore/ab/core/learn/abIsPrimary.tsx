const curInst = os.getCurrentInst();
const primaryInst = thisBot.abPrimaryInst();

console.log(`[${tags.system}.${tagName}] curInst: ${curInst}, primaryInst: ${primaryInst}, abIsPrimary: ${curInst === primaryInst}`);

return curInst === primaryInst;