interface ABGetParentGroupPropertyArg {
    properties: ABConfiguratorProperty[];
    targetKey: string;
}

const { properties, targetKey } = that as ABGetParentGroupPropertyArg ?? {};

function getParentGroup(
  properties: ABConfiguratorProperty[],
  targetKey: string,
  parentGroup: ABConfiguratorPropertyGroup | null = null
): ABConfiguratorPropertyGroup | null {
  for (const prop of properties) {
    if (prop.key === targetKey) {
      return parentGroup;
    }
    if (prop.type === 'group') {
      const result = getParentGroup(prop.properties, targetKey, prop);
      if (result !== null) {
        return result;
      }
    }
  }

  return null;
}

return getParentGroup(properties, targetKey);