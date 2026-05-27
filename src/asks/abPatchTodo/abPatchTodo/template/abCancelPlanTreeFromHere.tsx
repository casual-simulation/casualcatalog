// Cancel the entire connected todo tree centered on this bot — ancestor plans up the
// todoParentId chain *and* descendant plans down it. Undoes applied patches, destroys every
// affected todo, and cleans up any sibling user-approval bots pointing at plans in the tree.
//
// Used by both the in-progress patch-todo undo and the user-approval undo so the two flows
// have identical semantics: cancelling any node tears down the whole connected work. Without
// the upward walk, cancelling a leaf build plan left orphaned ancestor plans behind once
// agent tools (useTodoPlan etc.) started chaining work through todoParentId.
//
// Returns true if a chain was found and cancelled, false if nothing was reachable. Callers
// that need to clean themselves up afterward (e.g. an approval bot, which is intentionally
// excluded from the destroy set) handle their own self-destroy.

const startPlanId = tags.todoApprovalForPlanId ?? tags.todoPlanId;
if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] called on bot ${thisBot.id} (isApproval=${!!tags.isUserApprovalTodo}), startPlanId=${startPlanId}`);
}
if (!startPlanId) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] no startPlanId — bailing`);
    }
    return false;
}

const ancestorChain: { planId: string; todos: Bot[] }[] = [];
const visitedPlans = new Set<string>();
let currentPlanId: string | null = startPlanId;

while (currentPlanId && !visitedPlans.has(currentPlanId)) {
    visitedPlans.add(currentPlanId);

    const todos = getBots(b =>
        b.tags.abPatchTodoInstance &&
        b.tags.todoPlanId === currentPlanId &&
        !b.tags.isUserApprovalTodo
    );
    if (todos.length === 0) {
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] up-walk: plan ${currentPlanId} has no todos — stopping`);
        }
        break;
    }

    ancestorChain.push({ planId: currentPlanId, todos });
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] up-walk: collected plan ${currentPlanId} with ${todos.length} todo(s) [${todos.map(b => b.id).join(', ')}]`);
    }

    const parentId = todos[0].tags.todoParentId;
    if (!parentId) {
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] up-walk: plan ${currentPlanId} has no todoParentId — reached root`);
        }
        break;
    }
    const parentBot = getBot('id', parentId);
    if (!parentBot) {
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] up-walk: parent bot ${parentId} not found — stopping`);
        }
        break;
    }
    currentPlanId = parentBot.tags.todoPlanId ?? null;
}

if (ancestorChain.length === 0) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] empty ancestor chain — bailing`);
    }
    return false;
}

const chainTodos = ancestorChain.flatMap(p => p.todos);
const allTodos = thisBot.abExpandToDescendantTodos({ todos: chainTodos });
if (tags.debug) {
    const chainIds = chainTodos.map(b => b.id);
    const descendantOnly = allTodos.filter(b => !chainIds.includes(b.id));
    console.log(`[${tags.system}.${tagName}] tree: ${ancestorChain.length} ancestor plan(s), ${chainTodos.length} chain todo(s), ${descendantOnly.length} additional descendant todo(s) — ${allTodos.length} total`);
    if (descendantOnly.length > 0) {
        console.log(`[${tags.system}.${tagName}] descendant todos: [${descendantOnly.map(b => `${b.id} (plan=${b.tags.todoPlanId})`).join(', ')}]`);
    }
}

// Undo applied patches in reverse todoOrder. todoOrder is per-plan but using it across plans
// approximates a leaf-to-root ordering well enough in practice.
const appliedTodos = allTodos
    .filter(b => b.tags.abPatchApplied)
    .sort((a, b) => (b.tags.todoOrder ?? 0) - (a.tags.todoOrder ?? 0));
if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] undoing ${appliedTodos.length} applied patch(es)`);
}
for (const todo of appliedTodos) {
    whisper(todo, 'abPatchUndo');
}

// Clear awaitingUserResponse on user-ask clarifications so cascading onDestroy handlers treat
// this as a deliberate cancel rather than the user abandoning a clarification chain.
for (const todo of allTodos) {
    if (todo.tags.awaitingUserResponse === true) {
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] clearing awaitingUserResponse on todo ${todo.id}`);
        }
        setTag(todo, 'awaitingUserResponse', null);
    }
}

const allPlanIds = [...new Set(allTodos.map(b => b.tags.todoPlanId).filter(id => id != null))];
const treeApprovals = getBots(b =>
    b.tags.isUserApprovalTodo &&
    allPlanIds.includes(b.tags.todoApprovalForPlanId) &&
    b.id !== thisBot.id
);

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] destroying ${allTodos.length} todo(s) and ${treeApprovals.length} sibling approval(s); plan ids: [${allPlanIds.join(', ')}]`);
}

destroy(allTodos);
destroy(treeApprovals);

// Reset ab's conversation history — the cancelled work is gone, the next user request
// should start with a clean slate (parallels the archive+clear that approval does, minus
// the archive since there's nothing left to attach it to).
const historyStorageBot = ab.links.remember;
if (historyStorageBot) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] clearing ab conversation history`);
    }
    ab.links.ask.abConversationHistoryClear({ historyStorageBot, log: false });
}

const username = await ab.links.console.getUserName();
ab.links.utils.abLog({
    message: `Todo plan(s) ${allPlanIds.join(', ')} have been cancelled by ${username}.`,
    space: 'shared',
});

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] cancel complete`);
}

return true;
