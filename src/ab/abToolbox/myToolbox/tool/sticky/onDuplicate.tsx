if (tags.selected) {
    const payload = {...tags};
    delete payload.stickyAddress;
    delete payload[`${os.getCurrentDimension()}Z`];
    delete payload.strokeColor;
    delete payload.strokeWidth;
    delete payload.selected;

    payload[`${os.getCurrentDimension()}X`] += 1;
    const newSticky = create(payload);
    whisper(newSticky, 'onPointerDown');
    whisper(newSticky, 'onSelect');
    whisper(newSticky, 'handleUpdate');
}