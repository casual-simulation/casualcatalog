const { enabled } = that;

if (enabled) {
    masks.color = null;
    masks.label = 'disable\nmic';
} else {
    masks.color = '#999999';
    masks.label = 'enable\nmic';
}