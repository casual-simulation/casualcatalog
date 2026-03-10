if (tags.doors && tags.doors.length != 0 && tags.doors.includes(that?.tags?.simID)) {
    if (!tags.lineTo) {
        tags.lineTo = [];
    }

    if (!tags.lineTo.includes(that.id)) {
        tags.lineTo.push(that.id);
    }
}