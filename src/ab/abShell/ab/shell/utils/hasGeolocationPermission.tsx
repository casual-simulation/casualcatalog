let hasPermission = false;

try {
    if (globalThis.navigator && navigator.permissions) {
        const status = await navigator.permissions.query({ name: 'geolocation' });
        hasPermission = status?.state === 'granted';
    }
} catch (e) { 
    console.error(`Caught an error will querying permissions. Error:`, ab.links.utils.getErrorMessage(e));
}

return hasPermission;