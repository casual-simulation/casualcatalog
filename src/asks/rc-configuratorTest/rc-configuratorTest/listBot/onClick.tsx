const urls = tags.fileUrls ?? [];
const timeline = tags.colorTimeline ?? [];
const urlSummary = urls.length > 0 ? urls.join(', ') : 'none';
const timelineSummary = timeline.length > 0
    ? timeline.map((k) => `${k.color} @ ${k.time}s`).join(', ')
    : 'none';
os.toast(`URLs: ${urlSummary} | Timeline: ${timelineSummary}`);
