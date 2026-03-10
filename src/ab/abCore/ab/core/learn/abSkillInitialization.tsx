//Find the appropriate array and populate skills
let skillArray = links.remember.tags[that + "SkillArray"];

for (let i = 0; i < skillArray.length; i++) {
    await thisBot.abAdapt(skillArray[i]);
}

if (configBot.tags.embed === 'ios') {
    await thisBot.abAdapt('abIOSBridge');
}

return;