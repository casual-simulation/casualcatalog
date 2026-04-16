const { abDimension, abPosition, recordName, model, menuActionData } = that.askContext;
const todos = that.args.todos ?? [];

const todoPlanId = uuid();
const todoDir = { x: 0, y: 1, z: 0 };
const todoSpacing = 2;

let todoDimension = abDimension ?? 'home';
let todoBasePosition = { x: abPosition?.x ?? 0, y: abPosition?.y ?? 0, z: 0 };
let todoStartOffset = 1;

if (menuActionData?.menu === 'grid') {
    todoDimension = menuActionData.dimension;
    todoBasePosition = { x: menuActionData.dimensionX, y: menuActionData.dimensionY, z: 0 };
    todoStartOffset = 0;
}

for (let i = 0; i < todos.length; i++) {
    const todo = todos[i];
    const step = todoStartOffset + i;
    const abArtifactShard: ABArtifactShard = {
        data: {
            prompt: todo.prompt,
            todoLabel: todo.label,
            budgetCredits: todo.budget_credits,
            budgetRecordName: recordName,
            aiModel: model,
            todoPlanId,
            todoOrder: i,
            eggParameters: {
                gridInformation: {
                    dimension: todoDimension,
                    position: {
                        x: todoBasePosition.x + step * todoDir.x * todoSpacing,
                        y: todoBasePosition.y + step * todoDir.y * todoSpacing,
                        z: todoBasePosition.z + step * todoDir.z * todoSpacing,
                    }
                }
            }
        },
        dependencies: [{ askID: 'abPatchTodo' }]
    };

    await ab.links.artifact.abCreateArtifactPromiseBot({
        abArtifactName: 'abPatchTodo',
        abArtifactInstanceID: uuid(),
        abArtifactShard
    });
}
