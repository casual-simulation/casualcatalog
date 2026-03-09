const location = await os.getGeolocation();

function sortFunction(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] < b[0]) ? -1 : 1;
    }
}
 
// Function to sort the array of
// points by its distance from P
function sortArr(arr, n, p)
{
    // Vector to store the distance
    // with respective elements
    var vp = new Array(n);

    // Storing the distance with its
    // distance in the vector array
    for (var i = 0; i < n; i++) {
   
        var dist = Math.pow((p[0] - (tags.discoverableData[i].attributes.Latitude)), 2)
              + Math.pow((p[1] - (tags.discoverableData[i].attributes.Longitude)), 2);
        vp[i] = [dist, tags.discoverableData[i].attributes];
    }
     
    // Sorting the array with
    // respect to its distance
    vp.sort(sortFunction);
    return vp
}

var arr = tags.discoverableData;
var n = tags.discoverableData.length;
var p = [ location.latitude, location.longitude];

// Function to perform sorting
let tempArr=sortArr(arr, n, p)
var discoverables = new Array(n);

for (var i = 0; i < n; i++) {
    discoverables[i]=tempArr[i][1]
}

return discoverables