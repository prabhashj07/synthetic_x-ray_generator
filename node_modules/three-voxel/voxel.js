var mesher = require('ao-mesher');
var ndarray = require('ndarray');
var assert = require('assert');
var THREE = require('three');

function Voxel (width, height, depth, field) {
  this.resolution = [width, height, depth];

  assert(width);
  assert(height);
  assert(depth);

  if (field) {
    assert(field instanceof Uint8Array);
  } else {
    field = new Uint8Array(width * height * depth);
  }

  this.voxels = ndarray(field, this.resolution);

  this.palette = [0x000000, 0xFF0000, 0x00FF00, 0x0000FF];

  this.generateGeometry();
}

Voxel.prototype = THREE.Geometry.prototype;

Voxel.prototype.fillCube = function (a, b, value) {
  if (!value) {
    value = 1;
  }

  for (var x = a.x; x < b.x; x++) {
    for (var y = a.y; y < b.y; y++) {
      for (var z = a.z; z < b.z; z++) {
        this.voxels.set(x, y, z, value);
      }
    }
  }

  this.generateGeometry();
};

Voxel.prototype.recalculate = function () {
  this.generateGeometry();
};

Voxel.prototype.generateGeometry = function () {
  // Create geometry
  var geometry = new THREE.Geometry();

  // Calculate data
  var vertData = mesher(this.voxels);

  var colors = this.palette.map(function (c) { return new THREE.Color(c) });

  if (vertData) {
    var face = 0;
    var vertices = new Float32Array(vertData.length / 8);

    var uvs = geometry.faceVertexUvs[0] = [];
    var v = new THREE.Vector3(-this.resolution[0] / 2, -this.resolution[1] / 2, -this.resolution[2] / 2).round();

    var i = 0;
    var j = 0;
    while (i < vertData.length) {
      var s = 1.0;

      var uvSet = [];
      var uv;

      uv = new THREE.Vector2();
      uv.x = vertices[j++] = vertData[i + 0];
      uv.y = vertices[j++] = vertData[i + 1];
      uv.x += vertices[j++] = vertData[i + 2];
      geometry.vertices.push(new THREE.Vector3(vertData[i + 0], vertData[i + 1], vertData[i + 2]).add(v).multiplyScalar(s));
      uvSet.push(uv);
      i += 8;

      uv = new THREE.Vector2();
      uv.x = vertices[j++] = vertData[i + 0];
      uv.y = vertices[j++] = vertData[i + 1];
      uv.x += vertices[j++] = vertData[i + 2];
      geometry.vertices.push(new THREE.Vector3(vertData[i + 0], vertData[i + 1], vertData[i + 2]).add(v).multiplyScalar(s));
      uvSet.push(uv);
      i += 8;

      uv = new THREE.Vector2();
      uv.x = vertices[j++] = vertData[i + 0];
      uv.y = vertices[j++] = vertData[i + 1];
      uv.x += vertices[j++] = vertData[i + 2];
      geometry.vertices.push(new THREE.Vector3(vertData[i + 0], vertData[i + 1], vertData[i + 2]).add(v).multiplyScalar(s));
      uvSet.push(uv);
      i += 8;

      var f = new THREE.Face3(face + 0, face + 1, face + 2);

      var c = colors[vertData[i - 24 + 7]];

      f.vertexColors = [c, c, c];

      // fixme something broke with aomesher
      // f.vertexColors = [
      //   c.clone().lerp(black, vertData[i - 24 + 3] / 256),
      //   c.clone().lerp(black, vertData[i - 16 + 3] / 256),
      //   c.clone().lerp(black, vertData[i - 8 + 3] / 256)
      // ];

      // f.color = c; // Math.floor(Math.random() * 0xFFFFFF);
      geometry.faces.push(f);
      uvs.push(uvSet);
      face += 3;
    }
  }

  geometry.computeBoundingSphere();
  geometry.computeFaceNormals();
  geometry.computeVertexNormals();

  Object.assign(this, geometry);

  this.colorsNeedUpdate = true;
  this.verticesNeedUpdate = true;
  this.facesNeedUpdate = true;
  this.uvsNeedUpdate = true;
  this.elementsNeedUpdate = true;
};

module.exports = Voxel;
