interface ABValidatePropertyValueArg {
    property: ABConfiguratorProperty;
    value: any;
}

const { property, value } = that as ABValidatePropertyValueArg ?? {};

if (value == null) {
    return { valid: true, value };
}

switch (property.type) {
    case 'color':
        return typeof value === 'string'
            ? { valid: true, value }
            : { valid: false, reason: `Expected string, got ${typeof value}` };

    case 'number':
        if (typeof value !== 'number' || isNaN(value)) {
            return { valid: false, reason: `Expected number, got ${typeof value}` };
        }
        if (property.integer && !Number.isInteger(value)) {
            return { valid: false, reason: `Expected integer, got ${value}` };
        }
        if (property.min !== undefined && value < property.min) {
            return { valid: false, reason: `${value} is below min ${property.min}` };
        }
        if (property.max !== undefined && value > property.max) {
            return { valid: false, reason: `${value} is above max ${property.max}` };
        }
        return { valid: true, value };

    case 'text':
        if (typeof value !== 'string') {
            return { valid: false, reason: `Expected string, got ${typeof value}` };
        }
        if (property.maxLength !== undefined && value.length > property.maxLength) {
            return { valid: false, reason: `Length ${value.length} exceeds maxLength ${property.maxLength}` };
        }
        if (property.pattern && !new RegExp(property.pattern).test(value)) {
            return { valid: false, reason: property.patternMessage ?? `Failed pattern ${property.pattern}` };
        }
        return { valid: true, value };

    case 'boolean':
        return typeof value === 'boolean'
            ? { valid: true, value }
            : { valid: false, reason: `Expected boolean, got ${typeof value}` };

    case 'select': {
        const option = thisBot.abResolveSelectOption({ options: property.options, value });
        return option
            ? { valid: true, value: option.value }
            : { valid: false, reason: `"${value}" is not a valid option or index` };
    }

    case 'multiselect': {
        if (!Array.isArray(value)) {
            return { valid: false, reason: `Expected array, got ${typeof value}` };
        }
        const resolved = [];
        for (const v of value) {
            const option = thisBot.abResolveSelectOption({ options: property.options, value: v });
            if (!option) {
                return { valid: false, reason: `"${v}" is not a valid option or index` };
            }
            resolved.push(option.value);
        }
        return { valid: true, value: resolved };
    }

    case 'group':
        return { valid: true, value };

    default:
        return { valid: false, reason: `Unknown property type: ${property.type}` };
}