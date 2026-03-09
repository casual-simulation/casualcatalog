const deepSplice = helper.deepSplice()
const getAtLocation = helper.getAtLocation()

const parseHtmlString = (str) => {
    if (!str) {
        return {tag: 'p', children: ['Sorry, there is no help for this step.']}
    }
    if (str[0] !== '<') {
        console.warn("Tried to parse HTML that did not start with '<':")
        return {tag: 'p', children: ['Sorry, there is no help for this step.']}
    }

    let htmlArray = []
    let address = [0]

    let tagString = ''
    let readingTag = false
    let closingTag = false
    let childText = ''

    for (var i in str) {
        let char = str[i]
        switch (char) {
            // Start reading html tag
            case '<':
                readingTag = true;
                break;

            // Html tag done
            case '>':
                if (!closingTag) { // Opening tag complete: add an item to the htmlArray
                    // Update address if there's already text there")
                    childText = getAtLocation(htmlArray, address);
                    if (typeof childText == 'string') address[address.length - 1] += 1; 

                    // Add the new element
                    htmlArray = deepSplice(htmlArray, address, 0, {tag: tagString, children: ['']})
                    address.push(0) // Update the address

                } else { // Closing tag complete: Go back a level and to the next child
                    address.pop();
                    address[address.length - 1] += 1;
                }

                // Reset trackers
                tagString = ''  // Reset the tag string
                readingTag = false;
                closingTag = false; // Doesn't matter if it was opening tag, concludes closing tag
                break;

            // Make sure we know if we're looking at an opening or closing tag
            case '/':
                if ( str[i-1] == '<' ) {
                    closingTag = true;
                } else if (readingTag) {
                    tagString += char
                }
                break;

            // Adding characters to the tag tracker or object
            default:
                if (readingTag) {
                    tagString += char
                } else {
                    childText = getAtLocation(htmlArray, address)
                    if (!childText) childText = ''
                    childText += char
                    htmlArray = deepSplice(htmlArray, address, 1, childText)
                }

        }
    }
    // Loop done
    return htmlArray[0]
}

return parseHtmlString