let functionText = `@ 
    if (!ab.links.console.masks.open) {
        whisper(ab.links.console, "showConsole");
    }
    ab.log("${that}")
`

return functionText