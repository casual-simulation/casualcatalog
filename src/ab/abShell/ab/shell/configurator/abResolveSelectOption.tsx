/**
 * Resolves a select option from a list of options by value or index.
 *
 * Matches by value first, falls back to index if value is an integer
 * within the options range.
 *
 * Usage:
 *
 *   // Resolve by value
 *   thisBot.abResolveSelectOption({ options, value: 'wave' });
 *   // => { value: 'wave', label: 'Wave' }
 *
 *   // Resolve by index
 *   thisBot.abResolveSelectOption({ options, value: 0 });
 *   // => first option (if no option has value === 0)
 *
 *   // No match
 *   thisBot.abResolveSelectOption({ options, value: 'invalid' });
 *   // => null
 */

interface ABResolveSelectOptionArg {
    options: ABConfiguratorSelectOption[];
    value: string | number | ABConfiguratorSelectOption;
}

const { options, value } = that as ABResolveSelectOptionArg ?? {};

// Already a full option object — delegate to scalar path so groups are traversed
if (typeof value === 'object' && value != null && 'value' in value) {
    return thisBot.abResolveSelectOption({ options, value: (value as ABConfiguratorSelectOption).value });
}

if (value == null) return null;

const byValue = options.find((o) => !('options' in o) && o.value === value);
if (byValue) return byValue;

const flatOptions = options.filter(o => !('options' in o)) as ABConfiguratorSelectOption[];
if (typeof value === 'number' && Number.isInteger(value) && value >= 0 && value < flatOptions.length) {
    return flatOptions[value];
}

for (const item of options) {
    if ('options' in item) {
        const found = thisBot.abResolveSelectOption({ options: (item as ABConfiguratorSelectOptionGroup).options, value });
        if (found) return found;
    }
}

return null;