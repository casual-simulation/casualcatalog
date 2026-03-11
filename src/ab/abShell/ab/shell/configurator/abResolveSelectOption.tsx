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

interface ABResolveSelectOptionArgs {
    options: ABConfiguratorSelectOption[];
    value: string | number | ABConfiguratorSelectOption;
}

const { options, value } = that as ABResolveSelectOptionArgs ?? {};

// Already a full option object — validate it exists in options
if (typeof value === 'object' && value != null && 'value' in value) {
    return options.find((o) => o.value === value.value) ?? null;
}

const byValue = options.find((o) => o.value === value);
if (byValue) return byValue;

if (typeof value === 'number' && Number.isInteger(value) && value >= 0 && value < options.length) {
    return options[value];
}

return null;