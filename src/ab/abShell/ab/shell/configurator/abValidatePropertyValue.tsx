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
        const itemSchema = property.itemSchema;
        if (!itemSchema || typeof itemSchema !== 'object' || !itemSchema.type) {
            return { valid: false, reason: 'list itemSchema is required and must be a property schema' };
        }

        const allowedSimple = ['boolean', 'number', 'text', 'color', 'select', 'multiselect'];
        if (itemSchema.type !== 'group' && !allowedSimple.includes(itemSchema.type)) {
            return { valid: false, reason: `list itemSchema.type "${itemSchema.type}" is not supported (allowed: ${allowedSimple.join(', ')}, group)` };
        }

        if (itemSchema.type === 'group') {
            const fields = itemSchema.properties ?? [];
            for (const field of fields) {
                if (!allowedSimple.includes(field.type)) {
                    return { valid: false, reason: `complex list field "${field.key}" type "${field.type}" is not supported (allowed: ${allowedSimple.join(', ')})` };
                }
            }
        }

        if (!Array.isArray(value)) {
            return { valid: false, reason: `Expected array, got ${typeof value}` };
        }

        if (property.minLength !== undefined && value.length < property.minLength) {
            return { valid: false, reason: `Array length ${value.length} is below minLength ${property.minLength}` };
        }
        if (property.maxLength !== undefined && value.length > property.maxLength) {
            return { valid: false, reason: `Array length ${value.length} is above maxLength ${property.maxLength}` };
        }

        const resolved = [];
        for (let i = 0; i < value.length; i++) {
            const entry = value[i];

            if (itemSchema.type === 'group') {
                if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
                    return { valid: false, reason: `Entry at index ${i} must be an object` };
                }
                const resolvedEntry: any = {};
                for (const field of itemSchema.properties ?? []) {
                    const fieldValue = entry[field.key];
                    if (fieldValue == null) {
                        resolvedEntry[field.key] = fieldValue;
                        continue;
                    }
                    const fieldResult = thisBot.abValidatePropertyValue({ property: field, value: fieldValue });
                    if (!fieldResult.valid) {
                        return { valid: false, reason: `Entry ${i}.${field.key}: ${fieldResult.reason}` };
                    }
                    resolvedEntry[field.key] = fieldResult.value;
                }
                resolved.push(resolvedEntry);
            } else {
                if (entry == null) {
                    resolved.push(entry);
                    continue;
                }
                const result = thisBot.abValidatePropertyValue({ property: itemSchema, value: entry });
                if (!result.valid) {
                    return { valid: false, reason: `Entry ${i}: ${result.reason}` };
                }
                resolved.push(result.value);
            }
        }

        return { valid: true, value: resolved };
    }

    default:
        return { valid: false, reason: `Unknown property type: ${property.type}` };
}