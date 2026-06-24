// Per-type icon + label for an opp's option in the "show me" > opps dropdown. Add a case per type.

const { opp } = that ?? {};
if (!opp) return;

if (opp.type === 'todo_approval') {
    let label = 'plan ready to review';

    // Show the opp's inst when it's somewhere other than where the user is now.
    const { inst: currentInst, instOwner: currentOwner } = ab.links.utils.getCurrentInstInfo();
    const sameInst = opp.inst === currentInst && (opp.instOwner ?? null) === (currentOwner ?? null);
    if (!sameInst && opp.inst) {
        label = `${label}\n${opp.inst}`;
    }

    return { formAddress: 'how_to_reg', label };
}
