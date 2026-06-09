const todoBot = that;

shout('abPatchTodoMenuReset');
await thisBot.abCancelPlanTreeFromHere(todoBot);
// The helper intentionally excludes the approval bot from its destroy set (since approval bots
// aren't part of the plan tree it walks), so the approval always self-destroys at the end.
destroy(todoBot);
