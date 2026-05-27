const tool = that?.tool;
if (!tool?.targetAB) return;

const current = (tags.tools ?? []).filter(t => t.targetAB !== tool.targetAB);
current.unshift(tool);
setTagMask(thisBot, "tools", current.slice(0, 8), "local");
