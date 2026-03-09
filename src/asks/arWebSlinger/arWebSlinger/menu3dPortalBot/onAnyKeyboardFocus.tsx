// [SLOP] Show keyboard in menu 3d portal.
const dimension = tags.formAddress;

const keyboardBot = links.keyboard_controller.show({
    dimension,
    position: new Vector3(0, -1.5, 0),
    scale: 5,
})