shout('clearStudioHomeConfigMenu');

const catalogAddress = ab.abBuildCasualCatalogURL('asks/home-world-assets/earthTexture.jpeg');

const currentURL = new URL(configBot.tags.url);
const origin = currentURL.origin;

let newURL = new URL(origin);

if (configBot.tags.comId) {
    newURL.searchParams.append("comId", configBot.tags.comId);
}

newURL.searchParams.append("owner", that.id);
newURL.searchParams.append("inst", 'home');
newURL.searchParams.append("mapPortal", 'home');
newURL.searchParams.append("studio", that.id);
newURL.searchParams.append("ask", 'home');

const abArtifactShard = {
    data: {
        'biosSetting': 'studio',
        'instSetting': 'home',
        'instURL': newURL.href,
        'studioSetting': that.id,
        'label': that.label,
        'form': 'sphere',
        'formAddress': catalogAddress,
        'color': 'white',
        'scale': 4,
        eggParameters: {
            gridInformation: tags.gridInformation
        },
        dimensionData: {
            [tags.gridInformation?.dimension + 'RotationX']: 1.57
        }
    },
    dependencies: [
        {
            askID: "instBot"
        }
    ]
};

ab.links.artifact.abCreateArtifactPromiseBot({
    abArtifactName: "instBot",
    abArtifactInstanceID: uuid(),
    abArtifactShard,
});

shout("abMenuRefresh");

destroy(thisBot);