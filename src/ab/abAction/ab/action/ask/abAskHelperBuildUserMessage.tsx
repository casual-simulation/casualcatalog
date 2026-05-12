const { askContext, message, extra = {} } = that ?? {};

const focus = thisBot.abAskHelperBuildFocusContext({ askContext });

const ctx: Record<string, any> = {};
if (askContext.agentMode) ctx.mode = askContext.agentMode;
if (askContext.todoBot) ctx.todoId = askContext.todoBot.id;
ctx.focus = focus;

const obj: Record<string, any> = { context: { ...ctx, ...extra } };
if (message != null) obj.message = message;

return JSON.stringify(obj);
