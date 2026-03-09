if (!globalThis.TeleXR) {
	globalThis.TeleXR = {}
}

TeleXR.math = {};

// ==========
// math utils
// ==========
const utils = {}
TeleXR.math.utils = utils;

utils.degToRad = (degrees) => {
    return degrees * (Math.PI / 180);
}

utils.radToDeg = (radians) => {
    return radians * (180 / Math.PI);
}

utils.clamp = (value, min, max) => {
	return Math.max(min, Math.min(max, value));
}

utils.fmod = (a, b) => {
	return Number((a - (Math.floor(a / b) * b)).toPrecision(8));
}

utils.wrapTo2Pi = (a) => {
	a = utils.fmod(a, Math.PI * 2);
	return a;
}

utils.flipYZ = (v, sign) => {
	const y = v.y;
	const z = v.z;
	v.z = y;
	v.y = sign ? -z : z;
}

utils.normalize = (value, min, max) => {
	return (value - min) / (max - min);
}

utils.unnormalize = (normal, min, max) => {
	return normal * (max - min) + min;
}

utils.lerp = (a, b, t) => {
	return a + (b - a) * t;
}

utils.pointOnCircle = (center, radius, angle) => {
	const angleRad = angle * utils.DEG2RAD;

	const point = {
		x: center.x + radius * Math.sin(angleRad),
		y: center.y + radius * Math.cos(angleRad)
	};

	return point;
}

/**
 * prettyFloat will round a number to the specified decimal points and then remove any trailing zeros
 * if they are present after rounding to fixed point number. Integers are returned as-is.
 */
utils.prettyFloat = (n, decimalPlaces = 2) => {
	if (Number.isInteger(n)) {
		return n;
	} else {
		const fixed = n.toFixed(decimalPlaces);
		return parseFloat(fixed);
	}
}

// ==========
// plane
// ==========
const plane = {};
TeleXR.math.plane = plane;

plane.fromNormalAndCoplanarPoint = (normal, point) => {
	let newPlane = {
		normal: {...normal},
		constant: -vector3.dot(point, normal)
	}

	return newPlane;
}

plane.fromCoplanarPoints = (a, b, c) => {
	const cb = math.subtractVectors({...c}, b);
	const ab = math.subtractVectors({...a}, b);

	const normal = math.normalizeVector( vector3.crossVectors(cb, ab) );

	return plane.fromNormalAndCoplanarPoint(normal, a);
}

plane.distanceToPoint = (plane, point) => {
	return vector3.dot(plane.normal, point) + plane.constant;
}

plane.intersectRay = (plane, ray) => {
	const t = TeleXR.math.ray.distanceToPlane(ray, plane);

	if (t === null) {
		return null;
	}

	return TeleXR.math.ray.at(ray, t);
}

// ==========
// ray
// ==========
const ray = {};
TeleXR.math.ray = ray;

ray.distanceToPlane = (ray, plane) => {
	const denominator = vector3.dot(plane.normal, ray.direction);

	if (denominator === 0) {
		// line is coplanar, return origin.
		if (TeleXR.math.plane.distanceToPoint(plane, ray.origin) === 0) {
			return 0;
		}

		return null;
	}

	const t = -( vector3.dot(ray.origin, plane.normal) + plane.constant ) / denominator;

	// Return if the ray never intersect the plane.
	return t >= 0 ? t : null;
}

ray.at = (ray, distance) => {
	let point = {...ray.origin};
	const dirScaled = vector3.multiplyScalar({...ray.direction}, distance);
	point = math.addVectors(point, dirScaled);

	return point;
}

// ==========
// vector3
// ==========
const vector3 = {};
TeleXR.math.vector3 = vector3;

vector3.zero = () => {
	return { x: 0, y: 0, z: 0 }
}

vector3.up = () => {
	return { x: 0, y: 1, z: 0 }
}

vector3.one = () => {
	return { x: 1, y: 1, z: 1 }
}

vector3.applyQuaternion = (v, q) => {
	const x = v.x, y = v.y, z = v.z;
	const qx = q.x, qy = q.y, qz = q.z, qw = q.w;

	// calculate quat * vector
	const ix = qw * x + qy * z - qz * y;
	const iy = qw * y + qz * x - qx * z;
	const iz = qw * z + qx * y - qy * x;
	const iw = - qx * x - qy * y - qz * z;

	// calculate result * inverse quat
	v.x = ix * qw + iw * - qx + iy * - qz - iz * - qy;
	v.y = iy * qw + iw * - qy + iz * - qx - ix * - qz;
	v.z = iz * qw + iw * - qz + ix * - qy - iy * - qx;

	return v;
}

vector3.lengthSq = (v) => {
	return v.x * v.x + v.y * v.y + v.z * v.z;
}

vector3.dot = (v1, v2) => {
	return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}

vector3.angle = (v1, v2) => {
	const denominator = Math.sqrt(vector3.lengthSq(v1) * vector3.lengthSq(v2));
	if (denominator === 0) return Math.PI / 2;

	const theta = vector3.dot(v1, v2) / denominator;
	// clamp, to handle numerical problems
	return Math.acos(utils.clamp(theta, - 1, 1));
}

vector3.lerp = (v1, v2, t) => {
	return {
		x: v1.x + (v2.x - v1.x) * t,
		y: v1.y + (v2.y - v1.y) * t,
		z: v1.z + (v2.z - v1.z) * t
	}
}

vector3.length = (v) => {
	return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}

vector3.lengthSq = (v) => {
	return v.x * v.x + v.y * v.y + v.z * v.z;
}

vector3.setLength = (v, l) => {
	v = math.normalizeVector(v);
	v = vector3.multiplyScalar(v, l);

	return v;
}

vector3.applyMatrix4 = (v, m) => {
	const x = v.x, y = v.y, z = v.z;
	const w = 1 / (m[3] * x + m[7] * y + m[11] * z + m[15]);

	v.x = (m[0] * x + m[4] * y + m[8] * z + m[12]) * w;
	v.y = (m[1] * x + m[5] * y + m[9] * z + m[13]) * w;
	v.z = (m[2] * x + m[6] * y + m[10] * z + m[14]) * w;

	return v;
}

vector3.multiply = (v1, v2) => {
	v1.x *= v2.x;
	v1.y *= v2.y;
	v1.z *= v2.z;

	return v1;
}

vector3.multiplyScalar = (v, s) => {
	v.x *= s;
	v.y *= s;
	v.z *= s;

	return v;
}

vector3.divide = (v1, v2) => {
	v1.x /= v2.x;
	v1.y /= v2.y;
	v1.z /= v2.z;

	return v1;
}

vector3.divideScalar = (v, s) => {
	return vector3.multiplyScalar(v, 1 / s);
}

vector3.crossVectors = (a, b) => {
	const v = vector3.zero();
	const ax = a.x, ay = a.y, az = a.z;
	const bx = b.x, by = b.y, bz = b.z;

	v.x = ay * bz - az * by;
	v.y = az * bx - ax * bz;
	v.z = ax * by - ay * bx;
	return v;
}

vector3.applyEuler = (v, euler, order = 'XYZ') => {
	return vector3.applyQuaternion(v, quaternion.fromEuler(euler, order));
}

vector3.applyAxisAngle = (v, axis, angle) => {
	return vector3.applyQuaternion(v, quaternion.setFromAxisAngle(axis, angle));
}

vector3.transformDirection = (v, m) => {
	let x = v.x, y = v.y, z = v.z;

	let newX = m[0] * x + m[4] * y + m[8] * z;
	let newY = m[1] * x + m[5] * y + m[9] * z;
	let newZ = m[2] * x + m[6] * y + m[10] * z;

	return math.normalizeVector({ x: newX, y: newY, z: newZ });
}


vector3.setFromRotationMatrix = (m, order = 'XYZ') => {
	// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
	// console.log(`[vector3.setFromRotationMatrix] 1. matrix`, JSON.stringify(m));
	const m11 = m[0], m12 = m[4], m13 = m[8];
	const m21 = m[1], m22 = m[5], m23 = m[9];
	const m31 = m[2], m32 = m[6], m33 = m[10];
	const v = vector3.zero();

	switch (order) {
		case 'XYZ':
			v.y = Math.asin(utils.clamp(m13, - 1, 1));

			if (Math.abs(m13) < 0.9999999) {
				v.x = Math.atan2(- m23, m33);
				v.z = Math.atan2(- m12, m11);
			} else {
				v.x = Math.atan2(m32, m22);
				v.z = 0;
			}
			// console.log(`[vector3.setFromRotationMatrix] 2. XYZ swizzle`, JSON.stringify(v));
			break;
		case 'YXZ':
			v.x = Math.asin(- utils.clamp(m23, - 1, 1));

			if (Math.abs(m23) < 0.9999999) {
				v.y = Math.atan2(m13, m33);
				v.z = Math.atan2(m21, m22);
			} else {
				v.y = Math.atan2(- m31, m11);
				v.z = 0;
			}
			break;
		case 'ZXY':
			v.x = Math.asin(utils.clamp(m32, - 1, 1));

			if (Math.abs(m32) < 0.9999999) {
				v.y = Math.atan2(- m31, m33);
				v.z = Math.atan2(- m12, m22);
			} else {
				v.y = 0;
				v.z = Math.atan2(m21, m11);
			}
			break;
		case 'ZYX':
			v.y = Math.asin(- utils.clamp(m31, - 1, 1));

			if (Math.abs(m31) < 0.9999999) {
				v.x = Math.atan2(m32, m33);
				v.z = Math.atan2(m21, m11);
			} else {
				v.x = 0;
				v.z = Math.atan2(- m12, m22);
			}
			break;
		case 'YZX':
			v.z = Math.asin(utils.clamp(m21, - 1, 1));

			if (Math.abs(m21) < 0.9999999) {
				v.x = Math.atan2(- m23, m22);
				v.y = Math.atan2(- m31, m11);
			} else {
				v.x = 0;
				v.y = Math.atan2(m13, m33);
			}
			break;
		case 'XZY':
			v.z = Math.asin(- utils.clamp(m12, - 1, 1));

			if (Math.abs(m12) < 0.9999999) {
				v.x = Math.atan2(m32, m22);
				v.y = Math.atan2(m13, m11);
			} else {
				v.x = Math.atan2(- m23, m33);
				v.y = 0;
			}
			break;
		default:
			console.warn('[vector3.setFromRotationMatrix] encountered an unknown order: ' + order);
	}

	return v;
}

vector3.setFromQuaternion = (q, order = 'XYZ') => {
	const m = matrix4.compose(vector3.zero(), q, vector3.one());
	return vector3.setFromRotationMatrix(m, order);
}

vector3.localToWorld = (vector, matrixWorld) => {
	return vector3.applyMatrix4(vector, matrixWorld);
}

vector3.worldToLocal = (vector, matrixWorld) => {
	const inverseMatrix = matrix4.invert([...matrixWorld]);
	return vector3.applyMatrix4(vector, inverseMatrix);
}

// ==========
// quaternion
// ==========
const quaternion = {};
TeleXR.math.quaternion = quaternion;

quaternion.identity = () => {
	return { x: 0, y: 0, z: 0, w: 1 };
}

quaternion.setFromRotationMatrix = (q, m) => {
	// http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
	// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

	const m11 = m[0], m12 = m[4], m13 = m[8];
	const m21 = m[1], m22 = m[5], m23 = m[9];
	const m31 = m[2], m32 = m[6], m33 = m[10];

	const trace = m11 + m22 + m33;

	if (trace > 0) {
		const s = 0.5 / Math.sqrt(trace + 1.0);

		q.w = 0.25 / s;
		q.x = (m32 - m23) * s;
		q.y = (m13 - m31) * s;
		q.z = (m21 - m12) * s;
	} else if (m11 > m22 && m11 > m33) {
		const s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);

		q.w = (m32 - m23) / s;
		q.x = 0.25 * s;
		q.y = (m12 + m21) / s;
		q.z = (m13 + m31) / s;
	} else if (m22 > m33) {
		const s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);

		q.w = (m13 - m31) / s;
		q.x = (m12 + m21) / s;
		q.y = 0.25 * s;
		q.z = (m23 + m32) / s;
	} else {
		const s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);

		q.w = (m21 - m12) / s;
		q.x = (m13 + m31) / s;
		q.y = (m23 + m32) / s;
		q.z = 0.25 * s;
	}

	return q;
}

quaternion.setFromAxisAngle = (axis, angle) => {
	// http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm
	// assumes axis is normalized
	const q = quaternion.identity();
	const halfAngle = angle / 2, s = Math.sin(halfAngle);

	q.x = axis.x * s;
	q.y = axis.y * s;
	q.z = axis.z * s;
	q.w = Math.cos(halfAngle);

	return q;
}

quaternion.setFromUnitVectors = (vFrom, vTo) => {
	// assumes direction vectors vFrom and vTo are normalized
	const q = quaternion.identity();
	let r = vector3.dot(vFrom, vTo) + 1;

	if (r < Number.EPSILON) {

		// vFrom and vTo point in opposite directions

		r = 0;

		if (Math.abs(vFrom.x) > Math.abs(vFrom.z)) {

			q.x = - vFrom.y;
			q.y = vFrom.x;
			q.z = 0;
			q.w = r;

		} else {

			q.x = 0;
			q.y = - vFrom.z;
			q.z = vFrom.y;
			q.w = r;

		}

	} else {

		q.x = vFrom.y * vTo.z - vFrom.z * vTo.y;
		q.y = vFrom.z * vTo.x - vFrom.x * vTo.z;
		q.z = vFrom.x * vTo.y - vFrom.y * vTo.x;
		q.w = r;

	}

	return quaternion.normalize(q);
}

quaternion.fromEuler = (euler, order = 'XYZ') => {
	const q = quaternion.identity();
	const x = euler.x, y = euler.y, z = euler.z;

	// http://www.mathworks.com/matlabcentral/fileexchange/
	// 	20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/content/SpinCalc.m
	const c1 = Math.cos(x / 2);
	const c2 = Math.cos(y / 2);
	const c3 = Math.cos(z / 2);

	const s1 = Math.sin(x / 2);
	const s2 = Math.sin(y / 2);
	const s3 = Math.sin(z / 2);

	switch (order) {
		case 'XYZ':
			q.x = s1 * c2 * c3 + c1 * s2 * s3;
			q.y = c1 * s2 * c3 - s1 * c2 * s3;
			q.z = c1 * c2 * s3 + s1 * s2 * c3;
			q.w = c1 * c2 * c3 - s1 * s2 * s3;
			break;
		case 'YXZ':
			q.x = s1 * c2 * c3 + c1 * s2 * s3;
			q.y = c1 * s2 * c3 - s1 * c2 * s3;
			q.z = c1 * c2 * s3 - s1 * s2 * c3;
			q.w = c1 * c2 * c3 + s1 * s2 * s3;
			break;
		case 'ZXY':
			q.x = s1 * c2 * c3 - c1 * s2 * s3;
			q.y = c1 * s2 * c3 + s1 * c2 * s3;
			q.z = c1 * c2 * s3 + s1 * s2 * c3;
			q.w = c1 * c2 * c3 - s1 * s2 * s3;
			break;
		case 'ZYX':
			q.x = s1 * c2 * c3 - c1 * s2 * s3;
			q.y = c1 * s2 * c3 + s1 * c2 * s3;
			q.z = c1 * c2 * s3 - s1 * s2 * c3;
			q.w = c1 * c2 * c3 + s1 * s2 * s3;
			break;
		case 'YZX':
			q.x = s1 * c2 * c3 + c1 * s2 * s3;
			q.y = c1 * s2 * c3 + s1 * c2 * s3;
			q.z = c1 * c2 * s3 - s1 * s2 * c3;
			q.w = c1 * c2 * c3 - s1 * s2 * s3;
			break;
		case 'XZY':
			q.x = s1 * c2 * c3 - c1 * s2 * s3;
			q.y = c1 * s2 * c3 - s1 * c2 * s3;
			q.z = c1 * c2 * s3 + s1 * s2 * c3;
			q.w = c1 * c2 * c3 + s1 * s2 * s3;
			break;
		default:
			console.warn('[quaternion.fromEuler] encountered an unknown order: ' + order);
	}

	return q;
}

quaternion.multiplyQuaternions = (a, b) => {
	// from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm
	const q = quaternion.identity();
	const qax = a.x, qay = a.y, qaz = a.z, qaw = a.w;
	const qbx = b.x, qby = b.y, qbz = b.z, qbw = b.w;

	q.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
	q.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
	q.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
	q.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

	return q;
}

quaternion.length = (q) => {
	return Math.sqrt(q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w);
}

quaternion.normalize = (q) => {
	let l = quaternion.length(q);

	if (l === 0) {
		q.x = 0;
		q.y = 0;
		q.z = 0;
		q.w = 1;
	} else {
		l = 1 / l;

		q.x = q.x * l;
		q.y = q.y * l;
		q.z = q.z * l;
		q.w = q.w * l;
	}

	return q;
}

quaternion.invert = (q) => {
	// quaternion is assumed to have unit length
	return quaternion.conjugate(q);
}

quaternion.conjugate = (q) => {
	q.x *= - 1;
	q.y *= - 1;
	q.z *= - 1;

	return q;
}

// ==========
// matrix4
// ==========
const matrix4 = {};
TeleXR.math.matrix4 = matrix4;

matrix4.identity = () => {
	return [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	];
}

matrix4.multiplyMatrices = (m, a, b) => {
	const a11 = a[0], a12 = a[4], a13 = a[8], a14 = a[12];
	const a21 = a[1], a22 = a[5], a23 = a[9], a24 = a[13];
	const a31 = a[2], a32 = a[6], a33 = a[10], a34 = a[14];
	const a41 = a[3], a42 = a[7], a43 = a[11], a44 = a[15];

	const b11 = b[0], b12 = b[4], b13 = b[8], b14 = b[12];
	const b21 = b[1], b22 = b[5], b23 = b[9], b24 = b[13];
	const b31 = b[2], b32 = b[6], b33 = b[10], b34 = b[14];
	const b41 = b[3], b42 = b[7], b43 = b[11], b44 = b[15];

	m[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
	m[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
	m[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
	m[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

	m[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
	m[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
	m[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
	m[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

	m[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
	m[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
	m[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
	m[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

	m[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
	m[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
	m[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
	m[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

	return m;
}

matrix4.invert = (m) => {
	// based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
	const n11 = m[0], n21 = m[1], n31 = m[2], n41 = m[3];
	const n12 = m[4], n22 = m[5], n32 = m[6], n42 = m[7];
	const n13 = m[8], n23 = m[9], n33 = m[10], n43 = m[11];
	const n14 = m[12], n24 = m[13], n34 = m[14], n44 = m[15];

	const t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
	const t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
	const t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
	const t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;

	const det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;

	if (det === 0) return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

	const detInv = 1 / det;

	m[0] = t11 * detInv;
	m[1] = (n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44) * detInv;
	m[2] = (n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44) * detInv;
	m[3] = (n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43) * detInv;

	m[4] = t12 * detInv;
	m[5] = (n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44) * detInv;
	m[6] = (n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44) * detInv;
	m[7] = (n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43) * detInv;

	m[8] = t13 * detInv;
	m[9] = (n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44) * detInv;
	m[10] = (n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44) * detInv;
	m[11] = (n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43) * detInv;

	m[12] = t14 * detInv;
	m[13] = (n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34) * detInv;
	m[14] = (n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34) * detInv;
	m[15] = (n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33) * detInv;

	return m;
}

matrix4.compose = (position, quaternion, scale) => {
	const m = matrix4.identity();

	const x = quaternion.x, y = quaternion.y, z = quaternion.z, w = quaternion.w;
	const x2 = x + x, y2 = y + y, z2 = z + z;
	const xx = x * x2, xy = x * y2, xz = x * z2;
	const yy = y * y2, yz = y * z2, zz = z * z2;
	const wx = w * x2, wy = w * y2, wz = w * z2;

	const sx = scale.x, sy = scale.y, sz = scale.z;

	m[0] = (1 - (yy + zz)) * sx;
	m[1] = (xy + wz) * sx;
	m[2] = (xz - wy) * sx;
	m[3] = 0;

	m[4] = (xy - wz) * sy;
	m[5] = (1 - (xx + zz)) * sy;
	m[6] = (yz + wx) * sy;
	m[7] = 0;

	m[8] = (xz + wy) * sz;
	m[9] = (yz - wx) * sz;
	m[10] = (1 - (xx + yy)) * sz;
	m[11] = 0;

	m[12] = position.x;
	m[13] = position.y;
	m[14] = position.z;
	m[15] = 1;

	return m;
}

matrix4.decompose = (m) => {
	const p = vector3.zero();
	const q = quaternion.identity();
	const s = vector3.zero();

	let sx = vector3.length({ x: m[0], y: m[1], z: m[2] });
	const sy = vector3.length({ x: m[4], y: m[5], z: m[6] });
	const sz = vector3.length({ x: m[8], y: m[9], z: m[10] });

	// if determine is negative, we need to invert one scale
	const det = matrix4.determinant(m);
	if (det < 0) sx = - sx;

	p.x = m[12];
	p.y = m[13];
	p.z = m[14];

	// scale the rotation part
	let m1 = [...m];

	const invSX = 1 / sx;
	const invSY = 1 / sy;
	const invSZ = 1 / sz;

	m1[0] *= invSX;
	m1[1] *= invSX;
	m1[2] *= invSX;

	m1[4] *= invSY;
	m1[5] *= invSY;
	m1[6] *= invSY;

	m1[8] *= invSZ;
	m1[9] *= invSZ;
	m1[10] *= invSZ;

	quaternion.setFromRotationMatrix(q, m1);

	s.x = sx;
	s.y = sy;
	s.z = sz;

	return {
		position: p,
		quaternion: q,
		scale: s,
	}
}

matrix4.determinant = (m) => {
	const n11 = m[0], n12 = m[4], n13 = m[8], n14 = m[12];
	const n21 = m[1], n22 = m[5], n23 = m[9], n24 = m[13];
	const n31 = m[2], n32 = m[6], n33 = m[10], n34 = m[14];
	const n41 = m[3], n42 = m[7], n43 = m[11], n44 = m[15];

	//TODO: make this more efficient
	//( based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm )
	return (
		n41 * (
			+ n14 * n23 * n32
			- n13 * n24 * n32
			- n14 * n22 * n33
			+ n12 * n24 * n33
			+ n13 * n22 * n34
			- n12 * n23 * n34
		) +
		n42 * (
			+ n11 * n23 * n34
			- n11 * n24 * n33
			+ n14 * n21 * n33
			- n13 * n21 * n34
			+ n13 * n24 * n31
			- n14 * n23 * n31
		) +
		n43 * (
			+ n11 * n24 * n32
			- n11 * n22 * n34
			- n14 * n21 * n32
			+ n12 * n21 * n34
			+ n14 * n22 * n31
			- n12 * n24 * n31
		) +
		n44 * (
			- n13 * n22 * n31
			- n11 * n23 * n32
			+ n11 * n22 * n33
			+ n13 * n21 * n32
			- n12 * n21 * n33
			+ n12 * n23 * n31
		)
	);
}

matrix4.lookAt = (m, eye, target, up) => {
	let x, y, z;

	z = math.subtractVectors(target, eye);

	if (vector3.lengthSq(z) === 0) {
		// eye and target are in the same position
		z.z = 1;
	}

	z = math.normalizeVector(z);
	x = vector3.crossVectors(up, z);

	if (vector3.lengthSq(x) === 0) {
		// up and z are parallel
		if (Math.abs(up.z) === 1) {
			z.x += 0.0001;
		} else {
			z.z += 0.0001;
		}

		z = math.normalizeVector(z);
		x = vector3.crossVectors(up, z);
	}

	x = math.normalizeVector(x);
	y = vector3.crossVectors(z, x);

	m[0] = x.x; m[4] = y.x; m[8] = z.x;
	m[1] = x.y; m[5] = y.y; m[9] = z.y;
	m[2] = x.z; m[6] = y.z; m[10] = z.z;

	return m;
}

matrix4.localMatrixFromBot = (bot, dimension) => {
	const isBillboard = bot.tags.orientationMode === 'billboard';

	const p = {
		x: bot.tags[dimension + "X"] ?? 0,
		y: bot.tags[dimension + "Y"] ?? 0,
		z: bot.tags[dimension + "Z"] ?? 0,
	};

    // If billboard, ignore rotation tags (use identity). Otherwise use tags.
    const r = isBillboard
        ? { x: 0, y: 0, z: 0 }
        : {
            x: bot.tags[dimension + "RotationX"] ?? 0,
            y: bot.tags[dimension + "RotationY"] ?? 0,
            z: bot.tags[dimension + "RotationZ"] ?? 0,
        };
	
	const q = quaternion.fromEuler(r);
	const s = {
		x: bot.tags["scaleX"] ?? 1,
		y: bot.tags["scaleY"] ?? 1,
		z: bot.tags["scaleZ"] ?? 1,
	};
	const scalar = bot.tags["scale"] ?? 1;
	vector3.multiplyScalar(s, scalar);

	// Local matrix is actually affected by parent in CasualOS.
	// Primarily due to the anchorPoint concept.
	const parentId = bot.tags.transformer;
	let parent = parentId ? getBot('id', parentId) : null;

	if (parent) {
		let parentAnchorOffset = math.getAnchorPointOffset(parent.tags['anchorPoint'] ?? 'bottom');
		parentAnchorOffset.y *= -1; // Seems to be a bug in CasualOS, anchor point y is flipped?

		p.x += (parentAnchorOffset.x * 2);
		p.y += (parentAnchorOffset.y * 2);
		p.z += (parentAnchorOffset.z * 2);
	}

	return matrix4.compose(p, q, s);
}

matrix4.worldMatrixFromBot = (bot, dimension) => {
	let matrixWorld = matrix4.identity();
	const matrixLocal = matrix4.localMatrixFromBot(bot, dimension);

	const parentId = bot.tags.transformer;
	let parent = parentId ? getBot('id', parentId) : null;

	if (!parent) {
		matrixWorld = matrixLocal;
	} else {
		const parentMatrixWorld = matrix4.worldMatrixFromBot(parent, dimension);
		matrixWorld = matrix4.multiplyMatrices(matrixWorld, parentMatrixWorld, matrixLocal);
	}

	if (bot.tags.orientationMode === 'billboard') {
		const cameraRotation = {
			x: gridPortalBot.tags.cameraRotationX,
			y: gridPortalBot.tags.cameraRotationY,
			z: gridPortalBot.tags.cameraRotationZ,
		};
		let fwd = math.getForwardDirection(cameraRotation);
		fwd = { x: -fwd.x, y: -fwd.y, z: -fwd.z };
		fwd = math.normalizeVector(fwd);

		if (TeleXR.math.vector3.lengthSq(fwd) < 1e-12) return matrixWorld;

		// decompose to keep position/scale
		const { position: worldPos, scale: worldScale } = matrix4.decompose([...matrixWorld]);

		// build Z-up lookAt rotation: +Z will point along fwd
		const lookRot = matrix4.identity();
		const target = { x: worldPos.x + fwd.x, y: worldPos.y + fwd.y, z: worldPos.z + fwd.z };
		matrix4.lookAt(lookRot, worldPos, target, { x: 0, y: 0, z: 1 }); // Z is up

		const qLook = TeleXR.math.quaternion.setFromRotationMatrix(TeleXR.math.quaternion.identity(), lookRot);
		const qFix = TeleXR.math.quaternion.setFromAxisAngle({ x: 1, y: 0, z: 0 }, -Math.PI / 2); // Z→Y
		const qBill = TeleXR.math.quaternion.multiplyQuaternions(qLook, qFix);

		matrixWorld = matrix4.compose(worldPos, qBill, worldScale);
	}

	return matrixWorld;
}