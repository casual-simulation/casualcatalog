if (tags.avoidDelete) return;

const result = os.eraseData(tags.stickyRecord, tags.stickyAddress);

if (!result.success) {
    return
}