const xMask = tags.homeX;
const yMask = tags.homeY;

thisBot.masks.homeX = null;
thisBot.masks.homeY = null;

const xPos = tags.homeX;
const yPos = tags.homeY;

const xDiff = xMask - xPos;
const yDiff = yMask - yPos;

const offset = thisBot.getOffset();
const boardOffset = tags.boardOffset;

tags.homeX = 0.5 + offset.x + boardOffset.x;
tags.homeY = 0.5 + offset.y + boardOffset.y;

setTagMask(thisBot, "homeX", tags.homeX + xDiff, "shared");
setTagMask(thisBot, "homeY", tags.homeY + yDiff, "shared");