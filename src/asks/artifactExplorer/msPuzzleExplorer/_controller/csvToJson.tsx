let csv = that.replaceAll("\r", "");
const rows = csv.split("\n").filter(row => row.trim() !== "");

const result = { tilesetName: [] };
let currentHeader = null;

for (let i = 0; i < rows.length; i++) {
    let line = rows[i];
    let inQuotes = false;
    let modifiedLine = "";

    // Handle commas inside quotes
    for (let j = 0; j < line.length; j++) {
        let char = line[j];
        if (char === `"`) {
            inQuotes = !inQuotes;
            modifiedLine += char;
        } else if (char === "," && inQuotes) {
            modifiedLine += "&&&"; // placeholder for in-quote commas
        } else {
            modifiedLine += char;
        }
    }

    const splitLine = modifiedLine.split(",").map(entry => {
        let cleaned = entry.replaceAll("&&&", ",").trim();

        // Remove surrounding quotes if present
        if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
            cleaned = cleaned.slice(1, -1);
        }

        // Convert double double-quotes to real quotes
        cleaned = cleaned.replaceAll('""', '"');

        // Convert empty strings to null
        if (cleaned === "") {
            return null;
        }

        // Try parsing JSON if it looks like JSON
        const trimmed = cleaned.trim();
        const looksLikeJson = (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
                              (trimmed.startsWith("[") && trimmed.endsWith("]"));
        if (looksLikeJson) {
            try {
                return JSON.parse(trimmed);
            } catch {
                return cleaned;
            }
        }

        return cleaned;
    });

    // First row: tileset names
    if (i === 0) {
        result.tilesetName = splitLine.slice(2);
        continue;
    }

    const header = splitLine[0];
    const property = splitLine[1];
    const values = splitLine.slice(2);

    // Update currentHeader if found
    if (header) {
        currentHeader = header;
        if (!result[currentHeader]) {
            result[currentHeader] = {};
        }
    }

    // Skip if we don't have a current header or property name
    if (!currentHeader || !property) continue;

    // Add property values to the correct header
    result[currentHeader][property] = values;
}

return result;
