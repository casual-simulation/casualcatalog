masks.abInitialized = true;

if (configBot.tags.mapPortal) {
    thisBot.onPortalChanged({portal: "mapPortal", dimension: configBot.tags.mapPortal, initial: true });
}