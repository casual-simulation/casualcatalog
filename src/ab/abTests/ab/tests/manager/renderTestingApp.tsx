let result;

if  (thisBot.vars.debug) {
    if (thisBot.vars.tracing) {
        result = <div>
            <button onClick={() => thisBot.abStopTracing()}>Stop Tracing</button>
        </div>
    } else {
        result = <div>
            <button onClick={() => thisBot.abStopRecording()}>Stop Recording</button>
        </div>
    }
} else {
    result = <div></div>;
}

os.compileApp('abTestingApp', result);