let finalTimeline = [];
let hasUserAction = false;
let timeline = that.timeline;

for(let i = 0; i < timeline.length; i++) {
    const event = timeline[i];

    if (event.type === 'user_action') {
        hasUserAction = true;

        if ('timeline' in event) {
            if (event.timeline.length <= 1) {
                continue;
            }
        }
    } else if (!hasUserAction) {
        continue;
    }

    finalTimeline.push(event);
}

console.log('[debug] Timeline', timeline.slice());
console.log('[debug] Final Timeline', finalTimeline);
return finalTimeline;