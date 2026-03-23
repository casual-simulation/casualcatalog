const {
    controllerName, // Required: The id to use to identify this animation controller, mostly used in debug logs.
    gptSourceId, // Optional: The source id to use to identify what gpt requests are coming from the bot these tags are being attached to. Will default to bot id.
    debugAnim = false, // Optional
} = that ?? {};

assert(controllerName, `[${tags.system}.${tagName}] controllerName is required`);

return {
    controllerName,
    gptSourceId,
    debugAnim,
    animTransitions: {
        // Key format: 'CurrentState:animationName' → next state to transition to.
        // When an animation finishes, we look up the current state + animation combo
        // to determine what state to move to. If no entry exists, we stay in the current state.
        'Blink:blink': 'Idle',
        'Click:hover_action': 'Idle',
        'Click:happy_webslinger': 'Idle',
        'ThinkingBegin:thinking_in': 'ThinkingLoop',
        'ThinkingFailure:thinking_out_fail': 'Idle',
        'ThinkingFailure:thinking_out': 'Idle', // for backwards compatibility (can be removed when agent bots have this animation)
        'ThinkingSuccess:thinking_out': 'Idle',
        'SelectSingleBegin:select_single_in': 'SelectSingleLoop',
        'SelectSingleEnd:select_single_out': 'Idle',
        'SelectMultiBegin:select_multi': 'SelectMultiLoop',
        'SelectMultiEnd:select_single_out': 'Idle',
    },
    onBotAdded: ListenerString(async () => {
        // MUST run this before triggering animations. Without it, animations may try to trigger before the animation system is ready.
        tags.formAnimations = await os.listFormAnimations(thisBot);
        tags.animationsLoaded = true;

        const activeRequestGPTs = getBots((b) => { return b.tags.abActiveRequestGPT && b.tags.input?.sourceId === (tags.gptSourceId ?? thisBot.id) });

        if (tags.debugAnim) {
            console.log(`[${tags.controllerName}.${tagName}] active request gpts for ${tags.gptSourceId ?? thisBot.id}:`, activeRequestGPTs.length);
        }

        if (activeRequestGPTs.length > 0) {
            thisBot.changeAnimState('Thinking');
        } else {
            thisBot.changeAnimState('Idle');
        }
    }),
    onFormAnimationFinished: ListenerString(() => {
        const { animation } = that;
        const state = tags.animState;

        const key = `${state}:${animation}`;
        const nextState = tags.animTransitions?.[key];

        if (tags.debugAnim) {
            console.log(`[${tags.controllerName}.${tagName}] transition lookup: '${key}' → ${nextState ?? '(no match, staying in ' + state + ')'}`);
        }

        if (nextState) {
            thisBot.changeAnimState(nextState);
        }
    }),
    onABUserInputAskGPT: ListenerString(() => {
        const { sourceId } = that;

        if (sourceId === (tags.gptSourceId ?? thisBot.id)) {
            thisBot.changeAnimState('ThinkingBegin');
        }
    }),
    onABRequestGPTStarted: ListenerString(() => {
        const { input } = that;

        if (input.sourceId === (tags.gptSourceId ?? thisBot.id)) {
            if (tags.animState !== 'Thinking') {
                thisBot.changeAnimState('ThinkingBegin');
            }
        }
    }),
    onABRequestGPTSuccess: ListenerString(() => {
        const { input } = that;

        if (input.sourceId === (tags.gptSourceId ?? thisBot.id)) {
            thisBot.changeAnimState('ThinkingSuccess');
        }
    }),
    onABRequestGPTFailure: ListenerString(() => {
        const { input } = that;

        if (input.sourceId === (tags.gptSourceId ?? thisBot.id)) {
            thisBot.changeAnimState('ThinkingFailure');
        }
    }),
    changeAnimState: ListenerString(() => {
        const state = that;

        if (state !== tags.animState) {
            if (tags.debugAnim) {
                console.log(`[${tags.controllerName}.${tagName}]`, { to: state, from: tags.animState });
            }

            changeState(thisBot, state, 'animState');
        } else {
            if (tags.debugAnim) {
                console.log(`[${tags.controllerName}.${tagName}] already in state: '${state}'`);
            }
        }
    }),
    animStateIdleOnEnter: ListenerString(() => {
        os.startFormAnimation(thisBot, 'idle_smile', { crossFadeWarp: true, crossFadeDuration: 300, loop: { mode: 'repeat' } });

        // Enter blink state randomly while idling.
        const blinkTimeRange = [4500, 8000];
        const blinkTime = math.random(blinkTimeRange[0], blinkTimeRange[1]);
        thisBot.vars.idleBlinkTimeoutId = setTimeout(() => { thisBot.changeAnimState('Blink') }, blinkTime);
    }),
    animStateIdleOnExit: ListenerString(() => {
        // Clear the blink timeout.
        clearTimeout(thisBot.vars.idleBlinkTimeoutId);
        thisBot.vars.idleBlinkTimeoutId = null;
    }),
    animStateBlinkOnEnter: ListenerString(() => {
        os.startFormAnimation(thisBot, 'blink', { crossFadeWarp: true, crossFadeDuration: 300 });
    }),
    animStateClickOnEnter: ListenerString(() => {
        if (Math.random() > 0.5) {
            os.startFormAnimation(thisBot, 'hover_action', { timeScale: 2.25 });
        } else {
            os.startFormAnimation(thisBot, 'happy_webslinger', { timeScale: 2.25 });
        }
    }),
    animStateThinkingBeginOnEnter: ListenerString(() => {
        os.startFormAnimation(thisBot, 'thinking_in', { crossFadeWarp: true, crossFadeDuration: 300 });
    }),
    animStateThinkingLoopOnEnter: ListenerString(() => {
        os.startFormAnimation(thisBot, 'thinking_loop', { crossFadeWarp: true, crossFadeDuration: 300, loop: { mode: 'repeat' } });
    }),
    animStateThinkingSuccessOnEnter: ListenerString(() => {
        os.startFormAnimation(thisBot, 'thinking_out', { crossFadeWarp: true, crossFadeDuration: 500 });
    }),
    animStateThinkingFailureOnEnter: ListenerString(() => {
        const hasFailAnimation = tags.formAnimations.some(a => a.name === 'thinking_out_fail');

        if (hasFailAnimation) {
            os.startFormAnimation(thisBot, 'thinking_out_fail', { crossFadeWarp: true, crossFadeDuration: 500 });
        } else {
            os.startFormAnimation(thisBot, 'thinking_out', { crossFadeWarp: true, crossFadeDuration: 500 });
        }
    }),
    animStateSelectSingleBeginOnEnter: ListenerString(() => {
        os.startFormAnimation(thisBot, 'select_single_in', { crossFadeWarp: true, crossFadeDuration: 300 });
    }),
    animStateSelectSingleLoopOnEnter: ListenerString(() => {
        os.startFormAnimation(thisBot, 'select_single_loop', { crossFadeWarp: true, crossFadeDuration: 300, loop: { mode: 'repeat' } });
    }),
    animStateSelectSingleEndOnEnter: ListenerString(() => {
        os.startFormAnimation(thisBot, 'select_single_out', { crossFadeWarp: true, crossFadeDuration: 300 });
    }),
    animStateSelectMultiBeginOnEnter: ListenerString(() => {
        os.startFormAnimation(thisBot, 'select_multi', { crossFadeWarp: true, crossFadeDuration: 300 });
    }),
    animStateSelectMultiLoopOnEnter: ListenerString(() => {
        os.startFormAnimation(thisBot, 'select_single_loop', { crossFadeWarp: true, fadeDuration: 200, crossFadeDuration: 300, loop: { mode: 'repeat' } });
    }),
    animStateSelectMultiEndOnEnter: ListenerString(() => {
        os.startFormAnimation(thisBot, 'select_single_out', { crossFadeWarp: true, crossFadeDuration: 300 });
    }),
}