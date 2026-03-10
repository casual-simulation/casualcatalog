const message = that.message

if (message[0] !== '/') return;

var command = message.split(' ')[0]

switch (command) {
    case '/goto':
        var [command, sequence, step] = message.split(' ')
        shout('changeStep', {newSequence: sequence, newStep: Number(step)})
        break
    
    case '/end':
        shout('showEnd', {sequence: tags.sequence})
        break
    default:
        return
}

os.hideChat()