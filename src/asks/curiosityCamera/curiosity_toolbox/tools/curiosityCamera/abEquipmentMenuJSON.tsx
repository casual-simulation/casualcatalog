return ( {
    label: "curiosity camera",
    formAddress: 'photo_camera',
    camera: getLink(thisBot),
    onClick: `@
        links.camera.onClick();
    `
})