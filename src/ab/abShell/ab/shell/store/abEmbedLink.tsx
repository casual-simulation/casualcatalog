const ab = that ? true : false;
const embedLink = ab ? "ab=" + that : "inst=" + configBot.tags.inst;
const siteOrigin = new URL(configBot.tags.url).origin;
const embedText = `<!DOCTYPE html>
    <html>
        <head></head>
        <body>
            <iframe src="${siteOrigin + "/?" + embedLink}" width="100%" height="400" />
        </body>
    </html>`;

return embedText;