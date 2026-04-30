const { menuType } = that ?? {};

const menuItems = [];

menuItems.push({
    "label": "hello",
    "formAddress": "chat",
    "onClick": "@os.toast('world')"
})
menuItems.push({
    "label": "foo",
    "onClick": "@os.toast('bar')"
})

masks.menuItems = menuItems;