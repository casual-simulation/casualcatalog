const currentInsts = Array.isArray(configBot.tags.inst) ? configBot.tags.inst : [configBot.tags.inst];

const options = currentInsts.map((inst, index) => {
    return {
        label: inst,
        value: index,
    }
})

os.toast('Unload inst ' + that, 3);
os.unloadInst(that);