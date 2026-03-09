let toggle = that
if (toggle === undefined) {
    return
}
if (toggle) {
    tags.labelOpacity = 1;
    tags.labelFloatingBackgroundColor = "white";
    tags.labelPosition = "floatingBillboard";
    // so it automatically makes the #name the label
    tags.label = tags.name
}
else {
    tags.label = " "
    tags.labelOpacity = 0
    return;
}