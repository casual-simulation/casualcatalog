// Broadcast from the todo manager (remoteShout) when an approval todo is about to spawn.
// Plays on every client, but only once per event — gate to a single bot via the todoId arg.
if (that?.todoId !== thisBot.id) return;

// const isOwner = !thisBot.tags.ownerId || thisBot.tags.ownerId === authBot?.id; // Only chime on the owner's client(s).
// if (isOwner) {
    ab.links.sound.abPlaySound({ value: 'ab/audio/todo_plan_completed.mp3' });
// }
