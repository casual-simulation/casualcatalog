const {
    text = '',
    wordsPerMinute = 250,
    delayTime = 500,
} = that;

// Count words (rough approximation by splitting on whitespace)
const wordCount = text.trim().split(/\s+/).length;
let totalTimeMs = 0;

if (wordCount > 0) {
    // Calculate reading time in milliseconds
    const wordsPerSecond = wordsPerMinute / 60;
    const readingTimeMs = Math.ceil((wordCount / wordsPerSecond) * 1000);

    totalTimeMs = readingTimeMs + delayTime;
}

return totalTimeMs;