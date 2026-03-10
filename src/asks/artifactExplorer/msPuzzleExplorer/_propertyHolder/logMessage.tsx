let functionText = `@ 
    if (!ab.links.console.masks.open) {
        whisper(ab.links.console, "showConsole");
        ab.links.console.masks.open = true;
    }
    ab.log("${that}")
`

return functionText