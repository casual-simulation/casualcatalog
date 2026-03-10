leftWristPortalBot.tags.wristPortalWidth = -1;
leftWristPortalBot.tags.wristPortalHeight = -1;

// Compass Calibration Button
create(modFactory.button({
    space: 'tempLocal',
    dimension: configBot.tags.leftWristPortalName,
    dimensionX: 5.5,
    dimensionY: 3,
    label: 'Compass Calibration',
    onClick: `@
        spatialCalibration.compassCalibration();
    `
}));

// Totem Calibration Button
create(modFactory.button({
    space: 'tempLocal',
    dimension: configBot.tags.leftWristPortalName,
    dimensionX: 5.5,
    dimensionY: 4,
    onAdded: `@
        tags.label = 'Start Totem Calibration';

        tags.onTotemSetupStarted = \`@
            tags.label = 'Stop Totem Calibration';
        \`;

        tags.onTotemSetupStopped = \`@
            tags.label = 'Start Totem Calibration';
        \`;
    `,
    onClick: `@
        if (totemInput.tags.enabled) {
            totemInput.stop();
        } else {
            totemInput.start();
        }
    `
}));