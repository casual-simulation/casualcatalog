const loopAnimations = ['incomplete_static', 'processing_loop', 'error_static', 'complete_static'];
tags.currAnimation = that;
os.startFormAnimation(thisBot, that, { loop: loopAnimations.includes(that) });
