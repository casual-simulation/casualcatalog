configBot.tags.leftWristPortal = tags.leftWristPortalName

leftWristPortalBot.tags.wristPortalWidth = -1;
leftWristPortalBot.tags.wristPortalHeight = -1;

// Compass Calibration Button
create(thisBot.button({
    space: 'tempLocal',
    dimension: tags.leftWristPortalName,
    dimensionX: 5.5,
    dimensionY: 3,
    label: 'Compass Calibration',
    onClick: `@
        immersiveManager.compassCalibration();
    `
}));