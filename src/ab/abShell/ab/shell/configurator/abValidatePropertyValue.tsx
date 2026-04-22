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

    case 'list': {
        if (!Array.isArray(value)) {
            return { valid: false, reason: `Expected array, got ${typeof value}` };
        }
        if (property.minItems !== undefined && value.length < property.minItems) {
            return { valid: false, reason: `List has ${value.length} items, minimum is ${property.minItems}` };
        }
        if (property.maxItems !== undefined && value.length > property.maxItems) {
            return { valid: false, reason: `List has ${value.length} items, maximum is ${property.maxItems}` };
        }
        const isCompound = Array.isArray(property.itemSchema);
        for (let i = 0; i < value.length; i++) {
            const item = value[i];
            if (isCompound) {
                if (typeof item !== 'object' || item == null) {
                    return { valid: false, reason: `Item ${i} expected object, got ${typeof item}` };
                }
                for (const fieldSchema of property.itemSchema as ABConfiguratorScalarProperty[]) {
                    const fieldValue = item[fieldSchema.key];
                    if (fieldValue == null) continue;
                    const result = thisBot.abValidatePropertyValue({ property: fieldSchema, value: fieldValue });
                    if (!result.valid) {
                        return { valid: false, reason: `Item ${i} field "${fieldSchema.key}": ${result.reason}` };
                    }
                }
            } else {
                const result = thisBot.abValidatePropertyValue({ property: property.itemSchema as ABConfiguratorScalarProperty, value: item });
                if (!result.valid) {
                    return { valid: false, reason: `Item ${i}: ${result.reason}` };
                }
            }
        }
        return { valid: true, value };
    }

    default:
        return { valid: false, reason: `Unknown property type: ${property.type}` };
}