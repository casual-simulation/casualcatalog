const Styles = () => {
    return (<style>
        {tags['App.css']}
        {tags['HUD.css']}
        {tags['Help.css']}
        {tags['CollectionsMenu.css']}
        {tags['Collection.css']}
        {tags['Info.css']}
        {tags['miniGridHUD.css']}
        {tags['gridHUD.css']}
        {tags['Landmark.css']}
        {tags['locationRequest.css']}
        {tags['DebugMenu.css']}
    </style>)
}

await os.unregisterApp('rot-styles');
await os.registerApp('rot-styles', thisBot);
os.compileApp('rot-styles', <Styles />);