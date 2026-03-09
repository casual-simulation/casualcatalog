let fillAmount = tags.fillAmount >= 0 ? tags.fillAmount : 0;
fillAmount = Math.min(Math.max(fillAmount, 0), 1);

const filledScaleZ = tags.filledScaleZ ?? 1;

links.liquid.tags.scaleZ = fillAmount * filledScaleZ;
links.liquid.tags.color = tags.fillColor;

const rcCupMenuBots = getBots(b => b.tags.rcCupMenu != null);
rcCupMenuBots.forEach(b => b.tags.color = tags.fillColor);