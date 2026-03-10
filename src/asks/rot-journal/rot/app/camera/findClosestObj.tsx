let dataBot = getBot(byTag("name", "artifactSpawner"));
console.log(dataBot.tags.discoverableData[0].attributes.Latitude);
const location = await os.getGeolocation();

if (location.success) {
    //console.log(`You are at (${location.latitude}, ${location.longitude})`);
}
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
    //console.log("start distance")
    for (var i = 0; i < n; i++) {
   
        var dist = Math.pow((p[0] - (dataBot.tags.discoverableData[i].attributes.Latitude)), 2)
              + Math.pow((p[1] - (dataBot.tags.discoverableData[i].attributes.Longitude)), 2);
        vp[i] = [dist, dataBot.tags.discoverableData[i].attributes];
    }
     
    // Sorting the array with
    // respect to its distance
    console.log("start sort")
    vp.sort(sortFunction);
   
   console.log(vp)
    
    // Output
    //for (var i = 0; i < n; i++) {
      //  document.write("(" + vp[i][1][0] + ", " + vp[i][1][1] + ") ");
    //}
    return vp
}
//console.log("make vars")
var arr = dataBot.tags.discoverableData;//[[ 5, 5 ], [ 6, 6 ], [ 1, 0], [ 2, 0 ], [ 3, 1 ], [ 1, -2 ]];
var n = dataBot.tags.discoverableData.length;
var p = [ location.latitude, location.longitude];
// Function to perform sorting
console.log("start sort")
let tempArr=sortArr(arr, n, p)
var discoverables = new Array(n);
console.log(tempArr[0][0])
for (var i = 0; i < n; i++) {
    discoverables[i]=tempArr[i][1]
}
console.log(discoverables);
return discoverables