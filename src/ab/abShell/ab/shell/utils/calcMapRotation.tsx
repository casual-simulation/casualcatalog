const { mapPosition, auxRotation } = that;

let THREE = thisBot.vars.THREE;
if (!THREE) {
    THREE = await import('three');
    thisBot.vars.THREE = THREE;
}

const degToRad = (d) => (d * Math.PI) / 180;

function tangentBasisFromLonLat(lonDeg, latDeg) {
    const lon = degToRad(lonDeg);
    const lat = degToRad(latDeg);

    // Normal pointing out of the globe.
    const n = new THREE.Vector3(
        Math.cos(lat) * Math.cos(lon),
        Math.cos(lat) * Math.sin(lon),
        Math.sin(lat),
    ).normalize();

    // Build east/north from the normal
    const worldUp = new THREE.Vector3(0, 0, 1);
    let east = worldUp.clone().cross(n).normalize();
    if (east.lengthSq() === 0) east = new THREE.Vector3(1, 0, 0); // pole guard
    const north = n.clone().cross(east).normalize();

    // Basis: columns = east, north, normal
    const basis = new THREE.Matrix4().makeBasis(east, north, n);
    return basis;
}

// Given portal bot tags and a gizmo object3D, align gizmo rotation
function calcMapRotation(mapPosition, auxRotation) {
    const lon = mapPosition.x; // X = longitude (degrees)
    const lat = mapPosition.y; // Y = latitude (degrees)
    const auxQuat = auxRotation.quaternion;

    if (lon == null || lat == null || auxQuat == null) return;

    const quat = new THREE.Quaternion(auxQuat.x, auxQuat.y, auxQuat.z, auxQuat.w);

    const basis = tangentBasisFromLonLat(lon, lat);
    const basisInv = basis.clone().invert();
    const basisInvQuat = new THREE.Quaternion().setFromRotationMatrix(basisInv);

    // Apply the tangent correction
    const worldQuat = quat.clone().premultiply(basisInvQuat);

    return new Rotation({ quaternion: { x: worldQuat.x, y: worldQuat.y, z: worldQuat.z, w: worldQuat.w }});
}

return calcMapRotation(mapPosition, auxRotation);