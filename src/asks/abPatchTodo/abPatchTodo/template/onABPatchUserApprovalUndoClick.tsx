shout('abPatchTodoMenuReset');
await thisBot.abCancelPlanTreeFromHere();
// The helper intentionally excludes thisBot from its destroy set (since approval bots aren't
// part of the plan tree it walks), so the approval always self-destroys at the end.
destroy(thisBot);
