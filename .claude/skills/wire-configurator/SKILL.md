Make a specified tool agent-ready by implementing the AB Configurator pattern.

This skill analyzes a target tool's bots, proposes a set of configurator properties that capture the tool's configurable surface, and generates the listener tags and tags needed so the tool can be configured by the AB configurator (and, in turn, by agents). If the user has not named a specific tool in their request, ask which tool to configure before proceeding.

## What the AB Configurator pattern is

The AB Configurator (defined in `src/ab/abShell/ab/shell/configurator/`) is a generic menu + apply pipeline. Any bot that opts into a configurator group advertises a set of properties and receives back resolved values when the user (or an agent) commits a configuration. Three things make a bot participate:

1. Tag `abConfiguratorGroup` — a string key that groups one or more bots into a single logical configurator. All bots that share a group key are configured together in one menu.
2. Listener tag `onABCollectConfiguratorProperties` — whispered during collection; returns `ABConfiguratorProperty[]`. This is where the bot declares its knobs (type, key, label, description, default, current value, options, validation, `visibleWhen`, etc.).
3. Listener tag `onABConfiguratorPropertiesChanged` — whispered when the configurator is submitted; receives `{ propertyValues }` (a key→value object) and is responsible for applying each value to the bot's tags or state.

Type definitions live in [src/ab/abShell/ab/shell/configurator/types.tsm](src/ab/abShell/ab/shell/configurator/types.tsm). Read them before writing properties — they are the source of truth for property shape.

## Reference implementations

- V1: [src/asks/rc-configuratorTest/rc-configuratorTest/](src/asks/rc-configuratorTest/rc-configuratorTest/) — exercises every property type (`boolean`, `select`, `multiselect`, `color`, `number`, `text`, `group`, `visibleWhen`).
- V1: [src/asks/abStudioConfigurator/abStudioConfigurator/config/](src/asks/abStudioConfigurator/abStudioConfigurator/config/) — minimal example backed by an external record store.

Always re-read at least one reference before generating code so current conventions are preserved.

## Procedure

### 1. Locate the tool
Tools live under either `src/ab/<toolName>/` (V2) or `src/asks/<toolName>/` (V1). Resolve the path and list the files. Identify which bots exist inside — each bot folder contains a `*.bot.aux` file whose tags define its starting state and whose sibling files are its listener/tag definitions.

### 2. Understand the tool's surface
Read each bot's `.bot.aux` and its listener code. Build a mental model of:
- Which tags drive user-visible behavior (colors, labels, counts, modes, toggles).
- Which tags are read inside listeners and branched on (these are usually configurable).
- Which values are hardcoded but *should* be parameterized for agent use (magic numbers, fixed strings, URLs).
- Which bots in the tool share configuration vs. which are independent.

Do not propose a property for internal bookkeeping tags (e.g. `creator`, `space`, `abIDOrigin`, runtime vars). Expose only the knobs that a caller — human or agent — would reasonably want to set.

### 3. Propose the property schema
Before editing anything, summarize the proposed property list to the user:
- Each property's `key`, `type`, and purpose.
- Which bot(s) own it.
- Whether it uses `group` for organization or `visibleWhen` for conditional display.
- Which `abConfiguratorGroup` value you plan to use (usually the tool folder name).

Wait for confirmation or corrections before writing code. This is where the user injects domain knowledge you cannot infer from the code.

### 4. Implement
For each bot that owns properties:

- Add (or update) `abConfiguratorGroup` in the bot's `.bot.aux` tags. All bots in a single configurator must share the same group key.
- Create `onABCollectConfiguratorProperties.tsx` alongside the `.bot.aux`. Return an `ABConfiguratorProperty[]`. For each property:
  - Set `value` to the bot's current tag value so the menu opens with the live state.
  - Set `default` to the value the tool ships with.
  - Use `group` properties to organize related knobs (renders as a submenu).
  - Use `visibleWhen` to hide properties that only make sense when another is set.
  - Include a human-readable `description` — it is shown to users and is what agents reason over.
- Create `onABConfiguratorPropertiesChanged.tsx` alongside the `.bot.aux`. Destructure `const { propertyValues } = that;` and, for each key you declared, write the resolved value back to the appropriate tag or call the appropriate helper.

**Value resolution rules** (these are applied by `abApplyConfiguratorProperties` before the listener fires):
- `select` values arrive as the full `{ value, label }` option object — read `.value` to get the underlying scalar.
- `multiselect` values arrive as an array of `{ value, label }` objects.
- `number`, `text`, `boolean`, `color` arrive as raw scalars.
- A property only appears in `propertyValues` if it has a resolved value (explicit value or default). Guard each branch with `if ('<key>' in propertyValues)` — do not assume every key is present.

### 5. Verify
After writing, re-read the generated files and confirm:
- Every `key` declared in `onABCollectConfiguratorProperties` has a matching handler branch in `onABConfiguratorPropertiesChanged` (and vice versa — no orphan handlers).
- `abConfiguratorGroup` is set on every participating bot.
- The group key matches across bots and matches what the tool's caller will pass to `abOpenConfigurator`.
- Property keys are unique across the whole group (`abCollectConfiguratorData` warns and drops duplicates).

Do not run `pnpm pack:*` or commit — the user handles packaging and commits separately.

## Property type cheat sheet

| Type | `value`/`default` shape | Notes |
|------|-------------------------|-------|
| `boolean` | `boolean` | — |
| `number` | `number` | Supports `min`, `max`, `step`, `integer` |
| `text` | `string` | Supports `placeholder`, `maxLength`, `pattern`, `patternMessage` |
| `color` | `string` | CSS color string |
| `select` | `string \| number \| { value, label }` | Requires `options: { value, label? }[]`. Handler receives `{ value, label }`. |
| `multiselect` | Array of the `select` value shape | Handler receives array of `{ value, label }`. |
| `group` | — | Has `properties: ABConfiguratorProperty[]`; renders as a submenu. Do not apply in the handler — its children are flattened and appear as their own keys. |

## Common property fields

All non-group properties support:
- `key` (required, unique across the group)
- `label` (display name; falls back to `key`)
- `description` (shown in UI and read by agents — write this for the agent reader)
- `order` (sort order; lower first)
- `visibleWhen: { key, operator: 'equal' | 'not equal' | 'greater than' | 'less than' | 'contains', value }` — hides the property unless the referenced key's current value satisfies the condition.
