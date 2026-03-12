interface ABGetGroupNamesFromPropertiesArg {
    properties: ABConfiguratorProperty[];
}

const { properties } = that as ABGetGroupNamesFromPropertiesArg ?? {};

function getGroups(properties: ABConfiguratorProperty[]): ABConfiguratorPropertyGroup[] {
  const groups: ABConfiguratorPropertyGroup[] = [];

  for (const prop of properties) {
    if (prop.type === 'group') {
      groups.push(prop);
      groups.push(...getGroups(prop.properties));
    }
  }

  return groups;
}

return getGroups(properties);