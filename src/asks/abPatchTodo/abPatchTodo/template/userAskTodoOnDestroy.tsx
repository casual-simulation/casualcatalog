if (!tags.isUserAskTodo) return;

const data = tags.userAskData;
if (!data?.askContext?.todoBot) return;

const parentTodo = getBot('id', data.askContext.todoBot);

// Only fail the parent if the chain is still actively paused. Any other state means the
// chain has moved past the user-input phase and this destruction is incidental.
const stillPaused = parentTodo && parentTodo.tags.awaitingUserResponse === true;
if (!stillPaused) return;

setTag(parentTodo, 'abPatchError', `User cancelled clarification: "${data.question}"`);
setTag(parentTodo, 'animationState', 'error');
setTag(parentTodo, 'awaitingUserResponse', null);

const siblings = getBots(b =>
    b.id !== thisBot.id &&
    b.tags.isUserAskTodo &&
    b.tags.todoPlanId === tags.todoPlanId
);
for (const b of siblings) {
    destroy(b);
}
