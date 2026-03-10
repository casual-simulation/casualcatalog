const result = await os.raycast("grid", os.getPointerPosition("mouse"), os.getPointerDirection("mouse"));

os.log('botID: ' + result.botIntersections.map(x => x.bot.id) + ' ' + result.botIntersections.map(b => b.uv).join(', '));