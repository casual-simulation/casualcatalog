function _sort(array, propertyKey, dir) { 
    array.sort((a, b) => {
        let valueA = Number(a[propertyKey]);
        let valueB = Number(b[propertyKey]);
        
        if (Number.isNaN(valueA)) {
            valueA = 0;
        }
        if (Number.isNaN(valueB)) {
            valueB = 0;
        }
        
        if (dir === 'az') {
            return valueA > valueB ? 1 : -1;
        } else {
            return valueA < valueB ? 1 : -1;
        }
    });
}

function _sortBots(array, tag, dir) {
    array.sort((a, b) => {
        let valueA = Number(a.tags[tag]);
        let valueB = Number(b.tags[tag]);
        
        if (Number.isNaN(valueA)) {
            valueA = 0;
        }
        if (Number.isNaN(valueB)) {
            valueB = 0;
        }

        if (dir === 'az') {
            return valueA > valueB ? 1 : -1;
        } else {
            return valueA < valueB ? 1 : -1;
        }
    });
}

function sortAZ(array, propertyKey) {
    return _sort(array, propertyKey, 'az');
}

function sortZA(array, propertyKey) {
    return _sort(array, propertyKey, 'za');
}

function sortBotsAZ(array, tag) {
    return _sortBots(array, tag, 'az');
}

function sortBotsZA(array, tag) {
    return _sortBots(array, tag, 'za');
}

globalThis.sortAZ = sortAZ;
globalThis.sortBotsAZ = sortBotsAZ;
globalThis.sortZA = sortZA;
globalThis.sortBotsZA = sortBotsZA;