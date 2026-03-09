let {
    simName,
    setting,
    value
} = that

if(setting == "settingsObject"){
    console.log("settingsObject detected: ", value);
    if(typeof value == 'object'){
        let settingKeys = Object.keys(value);
        for(const settingKey of settingKeys){
            // console.log(`settingFound: ${settingKey}`, value[settingKey])
            updateForceGraphSetting(settingKey, value[settingKey]);
        }
    }
}
else {
    updateForceGraphSetting(setting, value);
}

function updateForceGraphSetting(settingPassed, valuePassed) {
    console.log(`setting passed: ${settingPassed}, value passed: `, valuePassed);
    switch (settingPassed) {
        case 'gravity':
            if (valuePassed == false) {
                simContainer[simName].gravitySwitch = false;
                simContainer[simName].force('radialGravity').strength(0);
                console.log(`force graph '${simName}' gravity disabled`);
            }
            else {
                simContainer[simName].gravitySwitch = true;
                simContainer[simName].force('radialGravity').strength(simContainer[simName].gravityStrength);
                console.log(`force graph '${simName}' gravity enabled`);
            }
            break;
        case 'gravityPosition':
            if (typeof valuePassed == 'object') {
                if (Array.isArray(valuePassed)) {
                    Number(valuePassed[0]) || Number(valuePassed[0]) == 0 ? simContainer[simName].force('radialGravity').x(Number(valuePassed[0])) : null
                    Number(valuePassed[1]) || Number(valuePassed[1]) == 0 ? simContainer[simName].force('radialGravity').y(Number(valuePassed[1])) : null
                    Number(valuePassed[2]) || Number(valuePassed[2]) == 0 ? simContainer[simName].force('radialGravity').z(Number(valuePassed[2])) : null
                }
                else {
                    Number(valuePassed.x) || Number(valuePassed.x) == 0 ? simContainer[simName].force('radialGravity').x(Number(valuePassed.x)) : null
                    Number(valuePassed.y) || Number(valuePassed.y) == 0 ? simContainer[simName].force('radialGravity').y(Number(valuePassed.y)) : null
                    Number(valuePassed.z) || Number(valuePassed.z) == 0 ? simContainer[simName].force('radialGravity').z(Number(valuePassed.z)) : null
                }

                let sgPos = {
                    x: simContainer[simName].force('radialGravity').x(),
                    y: simContainer[simName].force('radialGravity').y(),
                    z: simContainer[simName].force('radialGravity').z()
                }

                console.log(`force graph '${simName}' gravity origin updated: x = ` + sgPos.x + ', y = ' + sgPos.y + ', z = ' + sgPos.z)
            }
            break;
        case 'gravityX':
            // console.log('valuePassed: ', valuePassed)
            if (Number(valuePassed) || Number(valuePassed) == 0) {
                simContainer[simName].force('radialGravity').x(Number(valuePassed))
            }
            else if (valuePassed == undefined) {
                simContainer[simName].force('radialGravity').x(Number(0))
            }
            console.log(`force graph '${simName}' gravity origin X updated: ` + simContainer[simName].force('radialGravity').x())
            break;
        case 'gravityY':
            // console.log('valuePassed: ', valuePassed)
            if (Number(valuePassed) || Number(valuePassed) == 0) {
                simContainer[simName].force('radialGravity').y(Number(valuePassed))
            }
            else if (valuePassed == undefined) {
                simContainer[simName].force('radialGravity').y(Number(0))
            }
            console.log(`force graph '${simName}' gravity origin Y updated: ` + simContainer[simName].force('radialGravity').y())
            break;
        case 'gravityZ':
            // console.log('valuePassed: ', valuePassed)
            if (Number(valuePassed) || Number(valuePassed) == 0) {
                simContainer[simName].force('radialGravity').z(Number(valuePassed))
            }
            else if (valuePassed == undefined) {
                simContainer[simName].force('radialGravity').z(Number(0))
            }
            console.log(`force graph '${simName}' gravity origin Z updated: ` + simContainer[simName].force('radialGravity').z())
            break;
        case 'gravityStrength':
            if (Number(valuePassed) || Number(valuePassed) == 0) {
                simContainer[simName].gravitySwitch == true ? simContainer[simName].force('radialGravity').strength(Number(valuePassed)) : null
                simContainer[simName].gravityStrength = Number(valuePassed)
            }
            else if (valuePassed == undefined) {
                simContainer[simName].gravitySwitch == true ? simContainer[simName].force('radialGravity').strength(Number(0.05)) : null
                simContainer[simName].gravityStrength = 0.05
            }
            console.log(`force graph '${simName}' gravity strength updated: ` + simContainer[simName].gravityStrength)
            break;
        case 'gravityRadius':
            // console.log('valuePassed: ', valuePassed)
            let grSet = 0.05
            if (Number(valuePassed) || Number(valuePassed) == 0) {
                simContainer[simName].force('radialGravity').radius(Number(valuePassed))
                grSet = Number(valuePassed)
            }
            else if (valuePassed == undefined) {
                simContainer[simName].force('radialGravity').strength(Number(0))
            }
            console.log(`force graph '${simName}' gravity radius updated: ` + grSet)
            break;
        case 'dimensions':
            // console.log('valuePassed: ', valuePassed)
            if (Number.isInteger(valuePassed) && Number(valuePassed) > 0 && Number(valuePassed) < 4) {
                simContainer[simName].numDimensions(Number(valuePassed))
            }
            else if (valuePassed == undefined) {
                simContainer[simName].numDimensions(Number(3))
            }
            console.log(`force graph '${simName}' dimensions updated: ` + simContainer[simName].numDimensions())
            break;
        case 'collision':
            if (valuePassed == false) {
                simContainer[simName].collisionSwitch = false;
                simContainer[simName].force('collision').radius(0);
                console.log(`force graph '${simName}' collision disabled`);
            }
            else {
                simContainer[simName].collisionSwitch = true;
                simContainer[simName].force('collision').radius(simContainer[simName].collisionRadius);
                console.log(`force graph '${simName}' collision enabled`);
            }
            break;
        case 'collisionRadius':
            if (Number(valuePassed) || Number(valuePassed) == 0) {
                simContainer[simName].collisionSwitch == true ? simContainer[simName].force('collision').radius(Number(valuePassed)) : null
                simContainer[simName].collisionRadius = Number(valuePassed)
            }
            else if (valuePassed == undefined) {
                simContainer[simName].collisionSwitch == true ? simContainer[simName].force('collision').radius(Number(1)) : null
                simContainer[simName].collisionRadius = 1
            }
            console.log(`force graph '${simName}' collision radius updated: ` + simContainer[simName].collisionRadius)
            break;
        case 'charge':
            if (valuePassed == false) {
                simContainer[simName].chargeSwitch = false;
                simContainer[simName].force('charge').strength(0);
                console.log(`force graph '${simName}' charge disabled`);
            }
            else {
                simContainer[simName].chargeSwitch = true;
                simContainer[simName].force('charge').strength(simContainer[simName].chargeStrength);
                console.log(`force graph '${simName}' charge enabled`);
            }
            break;
        case 'chargeStrength':
            if (Number(valuePassed) || Number(valuePassed) == 0) {
                simContainer[simName].chargeSwitch == true ? simContainer[simName].force('charge').strength(Number(valuePassed)) : null
                simContainer[simName].chargeStrength = Number(valuePassed)
            }
            else if (valuePassed == undefined) {
                simContainer[simName].chargeSwitch == true ? simContainer[simName].force('charge').strength(Number(-1)) : null
                simContainer[simName].chargeStrength = -1
            }
            console.log(`force graph '${simName}' charge strength updated: ` + simContainer[simName].chargeStrength)
            break;
        default:
            console.log('Setting not found.')
            break;
    }
}

tags.autoStart == true ? simManager.start(simName) : null