const username = await ab.links.console.getUserName({ canSetPreferredName: false });
if (username) {
    masks.abCoreMenuLabel = `${username}'s pin`
}