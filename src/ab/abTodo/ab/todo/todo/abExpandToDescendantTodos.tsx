// Expand a seed set of todos to include every descendant patch-todo (via todoParentId chain).
// Excludes user-approval todos — those have their own approve/undo flow.

const seeds: Bot[] = that?.todos ?? [];
if (seeds.length === 0) return [];

const seen = new Set<string>(seeds.map(b => b.id));
const result: Bot[] = seeds.slice();
const queue: Bot[] = seeds.slice();

while (queue.length > 0) {
    const current = queue.shift()!;
    const children = getBots(b =>
        b.tags.abPatchTodoInstance &&
        !b.tags.isUserApprovalTodo &&
        b.tags.todoParentId === current.id &&
        !seen.has(b.id)
    );
    for (const child of children) {
        seen.add(child.id);
        result.push(child);
        queue.push(child);
    }
}

return result;
