interface ABGetListEntryDefaultArg {
    itemSchema: ABConfiguratorProperty;
}

const { itemSchema } = that as ABGetListEntryDefaultArg ?? {};

if (!itemSchema || !itemSchema.type) {
    return null;
}

if (itemSchema.type === 'group') {
    const obj: any = {};
    for (const field of itemSchema.properties ?? []) {
        obj[field.key] = (field as any).default ?? null;
    }
    return obj;
}

return (itemSchema as any).default ?? null;
