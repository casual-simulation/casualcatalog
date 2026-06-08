// dedent-js https://github.com/MartinKolarik/dedent-js

/**
 * Removes indentation from multiline strings. Works with both tabs and spaces.
 */
function dedent (templateStrings, ...values) {
	let matches = [];
	let strings = typeof templateStrings === 'string' ? [ templateStrings ] : templateStrings.slice();

	// 1. Remove trailing whitespace.
	strings[strings.length - 1] = strings[strings.length - 1].replace(/\r?\n([\t ]*)$/, '');

	// 2. Find all line breaks to determine the highest common indentation level.
	for (let i = 0; i < strings.length; i++) {
		let match;

		if (match = strings[i].match(/\n[\t ]+/g)) {
			matches.push(...match);
		}
	}

	// 3. Remove the common indentation from all strings.
	if (matches.length) {
		let size = Math.min(...matches.map(value => value.length - 1));
		let pattern = new RegExp(`\n[\t ]{${size}}`, 'g');

		for (let i = 0; i < strings.length; i++) {
			strings[i] = strings[i].replace(pattern, '\n');
		}
	}

	// 4. Remove leading whitespace.
	strings[0] = strings[0].replace(/^\r?\n/, '');

	// 5. Perform interpolation.
	let string = strings[0];

	for (let i = 0; i < values.length; i++) {
		string += values[i] + strings[i + 1];
	}

	return string;
}

/**
 * ListenerString is a function that can turn any function into a CasualOS listener tag string.
 */
function ListenerString(func) {
    if (typeof func === 'string' && func[0] === '@') {
        // Is already a listener string.
        return dedent(func);
    }

    if (typeof func !== 'function') {
        throw new Error(`ListenerString can only convert function objects to strings.`);
    }

    const funcString = func.toString();
    
    if (funcString.includes('=>')) {
        // Handle arrow functions
        const arrowIndex = funcString.indexOf('=>');
        const afterArrow = funcString.substring(arrowIndex + 2).trim();
        
        if (afterArrow.startsWith('{')) {
            // Arrow function with block body
            const match = afterArrow.match(/\{([\s\S]*)\}/);
            if (match) {
                return dedent('@' + match[1].trim());
            }
        } else {
            // Arrow function with concise body
            return dedent('@' + afterArrow);
        }
    } else {
        // Handle regular functions
        const match = funcString.match(/\{([\s\S]*)\}/);
        if (match) {
            return dedent('@' + match[1].trim());
        }
    }
}

// Extend Function prototype to include a .toListenerString() function.
// Now you can call .toListenerString() on any function and have it converted to a listener string.
Object.defineProperty(Function.prototype, 'toListenerString', {
    value: function() { return ListenerString(this) },
    writable: true,
    configurable: true,
    enumerable: false,
});

globalThis.ListenerString = ListenerString;