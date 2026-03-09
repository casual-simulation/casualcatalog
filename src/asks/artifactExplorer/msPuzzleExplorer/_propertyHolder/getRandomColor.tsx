const h = Math.floor(Math.random() * 360);
const s = 100;
const l = 60 + Math.random() * 20;

const a = s * Math.min(l / 100, 1 - l / 100) / 100;
const f = n => {
    const k = (n + h / 30) % 12;
    const color = l / 100 - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
};

return `#${f(0)}${f(8)}${f(4)}`;