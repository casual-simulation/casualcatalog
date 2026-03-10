let { text, key } = that;

text = (text ?? '').toString();

const DEBUG = false;

switch (key) {
    case 'Backspace':
        text = text.substring(0, text.length - 1);
        break;
    case 'Delete':
    case 'Clear':
        text = '';
        break;
    case 'Enter':
        text += '\n';
        break;
    case 'Tab':
        // Convert tabs to spaces.
        text += ' '.repeat(4);
        break;
    case 'Escape':
    case 'Shift':
    case 'CapsLock':
    case 'Control':
    case 'Alt':
    case 'Meta':
    case 'ContextMenu':
    case 'PageUp':
    case 'PageDown':
    case 'Home':
    case 'End':
    case 'Help':
    case 'F1':
    case 'F2':
    case 'F3':
    case 'F4':
    case 'F5':
    case 'F6':
    case 'F7':
    case 'F8':
    case 'F9':
    case 'F10':
    case 'F11':
    case 'F12':
    case 'F13':
    case 'ArrowUp':
    case 'ArrowRight':
    case 'ArrowDown':
    case 'ArrowLeft':
        // Ignore keystroke.
        if (DEBUG) {
            console.log(`[${tags.system}.${tagName}] ignoring keystroke:`, key);
        }
        break;
    default:
        text += key;
}

return text;