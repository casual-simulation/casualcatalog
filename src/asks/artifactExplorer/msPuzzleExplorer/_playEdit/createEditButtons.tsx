let baseEditMods = {
    home: true,
    onBoardStateChange: `@ that == "edit" ? destroy(thisBot) : null;`,
    playEdit: getLink(thisBot),
    onClick: `@ links.playEdit.onClick();`,
    draggable: false,
    form: "sprite",
    scaleZ: 0.01,
    scale: 0.5,
    system: "msPuzzleExplorer.editButton"
}

let startX = -2;
let startY = -5.5;

let editMods = [
    {
        homeX: startX,
        homeY: startY,
        formAddress: "https://brandplayer-prod-filesbucket-458964701190.s3.amazonaws.com/8980607d-1ff6-4361-8d88-cf7e921f2be7/54ef8fe6110d87701620489d7214aa1c8aac376e53154fe7b004dfd7bdb80ddd.png"
    },
    {
        homeX: startX + 0.5,
        homeY: startY,
        formAddress: "https://brandplayer-prod-filesbucket-458964701190.s3.amazonaws.com/8980607d-1ff6-4361-8d88-cf7e921f2be7/e1297bd86f5fb39fbc732f29cefd5a4292dfec67eac24b194f298e7251561b05.png"
    },
    {
        homeX: startX + 1,
        homeY: startY,
        formAddress: "https://brandplayer-prod-filesbucket-458964701190.s3.amazonaws.com/8980607d-1ff6-4361-8d88-cf7e921f2be7/8052e55b928c549abe5591866128fd7a2e9e9b7157289eb821abf6c08099f7f2.png"
    },
    {
        homeX: startX + 1.5,
        homeY: startY,
        formAddress: "https://brandplayer-prod-filesbucket-458964701190.s3.amazonaws.com/8980607d-1ff6-4361-8d88-cf7e921f2be7/3a07844936cbf9c7b7d2ee29928e17c612a2a020cbad894c5501388f7a5fcf77.png"
    },
    {
        homeX: startX,
        homeY: startY - 0.5,
        formAddress: "https://brandplayer-prod-filesbucket-458964701190.s3.amazonaws.com/8980607d-1ff6-4361-8d88-cf7e921f2be7/9a48a670c751db59587fd85a274bc0c5ef4e52e38b87a6d12d0d1630161389a5.png"
    },
    {
        homeX: startX + 0.5,
        homeY: startY - 0.5,
        formAddress: "https://brandplayer-prod-filesbucket-458964701190.s3.amazonaws.com/8980607d-1ff6-4361-8d88-cf7e921f2be7/6431e8f857813d4f6ff2391eacf5ddd18cf98dcc702f3996a764c3476247915e.png"
    },
    {
        homeX: startX + 1,
        homeY: startY - 0.5,
        formAddress: "https://brandplayer-prod-filesbucket-458964701190.s3.amazonaws.com/8980607d-1ff6-4361-8d88-cf7e921f2be7/b103d72d0758bebcfadbf3a5c5dab569ff6127e8c67da8a2f4caf4a0887cde30.png"
    },
    {
        homeX: startX + 1.5,
        homeY: startY - 0.5,
        formAddress: "https://brandplayer-prod-filesbucket-458964701190.s3.amazonaws.com/8980607d-1ff6-4361-8d88-cf7e921f2be7/a53b8f79d08e8dfdb7860b3d04456eca7d8fca098a9d1c9533430c8535990ad3.png"
    },
    {
        homeX: startX,
        homeY: startY - 1,
        formAddress: "https://brandplayer-prod-filesbucket-458964701190.s3.amazonaws.com/8980607d-1ff6-4361-8d88-cf7e921f2be7/56077b9677a168207277c5d2e3e2770ce1a9eff92233a5a1f5dfb7a760ff5407.png"
    },
    {
        homeX: startX + 0.5,
        homeY: startY - 1,
        formAddress: "https://brandplayer-prod-filesbucket-458964701190.s3.amazonaws.com/8980607d-1ff6-4361-8d88-cf7e921f2be7/0e65b4f8d8a11877d23df386a08a6f900e1930c06aa108714049998b70860753.png"
    },
    {
        homeX: startX + 1,
        homeY: startY - 1,
        formAddress: "https://brandplayer-prod-filesbucket-458964701190.s3.amazonaws.com/8980607d-1ff6-4361-8d88-cf7e921f2be7/383cd58f34a7fa20f214295b23e218d03b16274bfcf53f139f9d38a809ae4d8b.png"
    }
]

let editButtons = [];

for(const mod of editMods){
    editButtons.push({...baseEditMods, ...mod});
}

create(editButtons);