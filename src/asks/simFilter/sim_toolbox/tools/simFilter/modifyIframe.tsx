await os.registerApp('modifyIFrameContainer', thisBot);

const css = `
.vm-iframe-container iframe:first-child {
    display: block !important;
    z-index: 2;
    pointer-events: auto !important;
}
`

os.compileApp(
    'modifyIFrameContainer',
    <div>
        <style>{css}</style>
    </div>
);