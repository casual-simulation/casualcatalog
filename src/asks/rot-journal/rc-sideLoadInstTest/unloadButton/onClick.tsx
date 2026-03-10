const currentInsts = Array.isArray(configBot.tags.inst) ? configBot.tags.inst : [configBot.tags.inst];
os.log("currentInsts: " + currentInsts);

const options = currentInsts.map((inst, index) => {
    return {
        label: inst,
        value: index,
    }
})
os.log("options: " + options);

const selectedItems = await os.showInput([], {
    title: 'Check inst(s) to unload',
    type: 'list',
    subtype: 'checkbox',
    items: options,
});
os.log("selectedItems: " + selectedItems);

if (selectedItems && selectedItems.length > 0) {
    let insts = selectedItems.map(item => item.label);
    os.log("insts: " + insts);

    os.toast('Unload inst(s): ' + insts.join(', '), 3);
    os.log('Unload inst(s): ' + insts.join(', '), 3);

    for (let inst of insts) {
        os.log("inst: " + inst);
        os.unloadInst(inst);
    }
}