console.log(that)
let portal = configBot.tags.mapPortal
// if we arent in the mapPortal, use gridPortal
if (portal === undefined) {
    portal = configBot.tags.gridPortal
}

thisBot.space = "tempLocal"

tags[portal] = true

// set location
tags[portal + "X"] = that.eggParameters?.spawnX ?? 0
tags[portal + "Y"] = that.eggParameters?.spawnY ?? 0
tags.name = that.eggParameters?.name ?? "Landmark"
tags.landmarkAttributes = that.eggParameters?.landmarkAttributes ?? tags.landmarkAttributes
tags.artifactID = that.eggParameters?.artifactID ?? 1
// set size
//tags.scaleX = that.eggParameters?.scaleX ?? 1
//tags.scaleY = that.eggParameters?.scaleY ?? 1
//tags.scaleZ = that.eggParameters?.scaleZ ?? 1
tags.scale = that.eggParameters?.scale ?? .6

// set form/model types
tags.form = that.eggParameters?.form ?? ""
tags.formSubtype = that.eggParameters?.formSubtype ?? "gltf"
tags.formAddress = that.eggParameters?.formAddress ?? "https://publicos-link-filesbucket-404655125928.s3.amazonaws.com/5828ecd8-660d-4af6-8889-5d1c983f68a3/9eabbacf91c7c1cbe7e6566b1aa7cb635ce8150420d99bcbba6fc4843b152091.xml"
tags.label = that.eggParameters?.label ?? ""

// saves the after discovery options
tags.discoveredForm = that.eggParameters?.discoveredForm ?? ""
tags.discoveredFormAddress = that.eggParameters?.imageURL ?? ""

// sets bot color options
tags.color = "gray"
tags.labelColor = that.eggParameters?.labelColor ?? ""

// saves discovered color options
tags.discoveredColor = that.eggParameters?.color ?? ""
tags.discoveredLabelColor = that.eggParameters?.discoveredLabelColor ?? ""

// saves code to execute onDiscover
tags.onDiscover = that.eggParameters?.onDiscover ?? tags.onDiscover
tags.allData = that.eggParameters.allData
tags.collectionData = that.eggParameters?.collectionData ?? "test"

// changes the residual idicators from the template
tags.system = "rot.artifacts.artifact"

// transfers the rest of the data to a tag
for (const tag in that.eggParameters.allData ?? {}) {
    thisBot.tags[tag] = that.eggParameters.allData[tag]
}
whisper(this,"checkForNewDiscovery")