const { enabled } = that;

if (enabled) {
    masks.color = null;
    masks.label = 'disable\nscreen share';
} else {
    masks.color = '#999999';
    masks.label = 'enable\nscreen share';
}