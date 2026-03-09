await os.unregisterApp('formMenu')
await os.registerApp('formMenu', thisBot)

const App = thisBot.getApp()

var pointerX = gridPortalBot.tags.pointerPixelX
var pointerY = gridPortalBot.tags.pointerPixelY

masks.selectedBot = that.id

os.compileApp('formMenu',
    <div className="form-app-container" style={{position: 'absolute', left: `${pointerX}px`, top: `${pointerY}px`}}>
        <App />
    </div>
);
