const leftWristPortal = configBot.tags.leftWristPortal;
const rightWristPortal = configBot.tags.rightWristPortal;

if (leftWristPortal && tags[leftWristPortal] === true) {
    return true;
} else if (rightWristPortal && tags[rightWristPortal]) {
    return true;
}

return false;