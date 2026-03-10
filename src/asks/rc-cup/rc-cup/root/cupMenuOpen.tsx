thisBot.cupMenuReset();

configBot.tags.menuPortal = 'rcCupMenu';

links.abMenu.abCreateMenuButton({
    rcCupMenu: true,
    label: 'drink',
    formAddress: 'back_hand',
    color: tags.fillColor,
    cup: getLink(thisBot),
    onClick: `@
        let fillAmount = links.cup.tags.fillAmount;

        fillAmount -= 0.1;

        if (fillAmount < 0) {
            fillAmount = 0;
        }
            
        if (links.cup.tags.fillAmount !== fillAmount) {
            links.cup.tags.fillAmount = fillAmount;

            if (fillAmount === 0) {
                os.toast('You drank the last drop from the cup.');
            } else {
                os.toast('You drank from the cup.');
            }
        } else {
            os.toast('The cup is empty.');
        }
    `
});

links.abMenu.abCreateMenuButton({
    rcCupMenu: true,
    label: 'refill',
    formAddress: 'local_drink',
    color: tags.fillColor,
    cup: getLink(thisBot),
    onClick: `@
        if (links.cup.tags.fillAmount !== 1) {
            links.cup.tags.fillAmount = 1;
            os.toast('You refilled the cup');
        } else {
            os.toast('The cup is already full.');
        }
    `
})

links.abMenu.abCreateMenuButton({
    rcCupMenu: true,
    label: 'change color',
    cup: getLink(thisBot),
    formAddress: 'colorize',
    color: tags.fillColor,
    onClick: `@
        const selection = await os.showInput(links.cup.tags.fillColor, {
            title: 'choose color to dye water',
            type: 'color',
        })

        if (selection && links.cup.tags.fillColor !== selection) {
            links.cup.tags.fillColor = selection;
            os.toast('You have dyed the water');
        }
    `
})