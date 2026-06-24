// Builds the opps dropdown: 3 most-recent active opps, each opp's icon +
// label resolved per-type by getOppMenuPresentation. Options route to abGoToOpp.

const activeOpps = Array.isArray(thisBot.vars.activeOpps) ? thisBot.vars.activeOpps : [];

const recent = [...activeOpps]
    .sort((a, b) => (b.createTime ?? 0) - (a.createTime ?? 0))
    .slice(0, 3);

const activeMenu = configBot.tags.menuPortal ?? 'abMenu';

const dropdownOptions = [];
for (const opp of recent) {
    const pres = thisBot.getOppMenuPresentation({ opp }) ?? {};

    dropdownOptions.push({
        dimension: activeMenu,
        [activeMenu]: true,
        abMenuRefresh: '@ destroy(thisBot);',
        skillBot: getLink(thisBot),
        oppAddress: opp.address,
        label: pres.label ?? opp.description ?? opp.type,
        formAddress: pres.formAddress ?? 'notifications',
        onClick: `@
            links.skillBot.abGoToOpp({ address: tags.oppAddress });
            shout('abMenuRefresh');
        `,
    });
}

masks.dropdownOptions = dropdownOptions;
masks.abShowMenuHide = dropdownOptions.length === 0;

return JSON.stringify(dropdownOptions);
