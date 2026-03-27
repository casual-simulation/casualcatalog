const animTransitions = {
    'incomplete_in': 'incomplete_static',
    'incomplete_out': 'processing_in',
    'processing_in': 'processing_loop',
    'processing_out': tags.nextAnimation,
    'error_in': 'error_static',
    'error_out': 'blank',
    'complete_in': 'complete_static',
    'complete_out': 'blank',
};

const next = animTransitions[tags.currAnimation];

if (next) {
    thisBot.changeAnimationState(next);
}
