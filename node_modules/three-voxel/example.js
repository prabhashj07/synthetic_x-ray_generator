/* globals requestAnimationFrame */

var THREE = require('three');
var Voxel = require('./voxel');
var getPixels = require('get-image-pixels');
var VREffect = require('./vr-effect');

var camera, scene, renderer, effect;
var mesh;

var vertexShader = `
  varying vec3 vWorldPosition;

  void main() {

    vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
    vWorldPosition = worldPosition.xyz;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

  }
`;

var fragmentShader = `
  uniform vec3 topColor;
  uniform vec3 bottomColor;
  uniform float offset;
  uniform float exponent;

  varying vec3 vWorldPosition;

  void main() {

    float h = normalize( vWorldPosition + offset ).y;
    gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );

  }
`;

function addSky () {
  var uniforms = {
    topColor: { value: new THREE.Color(0x77bbff) },
    bottomColor: { value: new THREE.Color(0xffffff) },
    offset: { value: 0 },
    exponent: { value: 0.8 }
  };

  var skyGeo = new THREE.SphereGeometry(100, 32, 15);
  var skyMat = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: uniforms,
    side: THREE.BackSide
  });

  var sky = new THREE.Mesh(skyGeo, skyMat);
  scene.add(sky);
}

function init () {
  document.body.style.cssText = 'margin: 0; padding: 0; overflow: hidden';

  camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 5;
  camera.position.y = 1.85;

  scene = new THREE.Scene();

  var directionalLight = new THREE.DirectionalLight(0xffffff, 1.15);
  directionalLight.position.set(1, 1, 1).multiplyScalar(90);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  scene.add(directionalLight);

  var light = new THREE.AmbientLight(0x606065);
  scene.add(light);

  var voxel = new Voxel(34, 34, 4);
  // voxel.fillCube(new THREE.Vector3(2, 0, 2), new THREE.Vector3(62, 2, 62));

  // for (var x = 20; x < 40; x += 4) {
  //   for (var z = 20; z < 40; z += 4) {
  //     voxel.fillCube(new THREE.Vector3(x, 0, z), new THREE.Vector3(x + 1, 8, z + 1));
  //   }
  // }

  var image = new Image();
  image.src = 'emoji/1f608.gif';
  // image.style.cssText = 'position: absolute; z-index: 1000;';
  // document.body.appendChild(image);

  image.onload = () => {
    console.time('voxelise');

    var data = getPixels(image);

    var i = 0;

    var colors = {};
    var colorIndex = 1;

    for (var y = 0; y < 32; y++) {
      for (var x = 0; x < 32; x++) {
        if (data[i + 3]) {
          var c = new THREE.Color(data[i + 0] / 256.0, data[i + 1] / 256.0, data[i + 2] / 256.0);
          var hex = '#' + c.getHexString();

          var index = colors[hex];

          if (!index) {
            index = colors[hex] = colorIndex;
            colorIndex++;
          }

          voxel.voxels.set(x + 1, 33 - y, 1, index);
        }

        i += 4;
      }
    }

    var palette = Object.keys(colors).map((c) => {
      return {
        color: c,
        index: colors[c]
      };
    });

    palette = palette.sort((a, b) => a.index - b.index);

    voxel.palette = ['#000000'].concat(palette.map((tuple) => tuple.color));

    voxel.recalculate();

    console.timeEnd('voxelise');
  };

  // for (var i = 0; i < 50; i++) {
  //   var x = Math.floor(Math.random() * 60 + 2);
  //   var z = Math.floor(Math.random() * 60 + 2);

  //   voxel.fillCube(new THREE.Vector3(x, 0, z), new THREE.Vector3(x + 1, 8, z + 1));
  // }

  var texture = new THREE.TextureLoader().load('grid.png');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(64, 64);

  var material = new THREE.MeshLambertMaterial({
    map: texture
  });

  var plane = new THREE.PlaneGeometry(64, 64, 1, 1);
  var ground = new THREE.Mesh(plane, material);
  ground.rotation.x = -Math.PI / 2;
  ground.castShadow = true;
  ground.receiveShadow = true;
  scene.add(ground);

  var voxelMaterial = new THREE.MeshLambertMaterial({
    color: 'white',
    vertexColors: THREE.VertexColors
  });

  mesh = new THREE.Mesh(voxel, voxelMaterial);
  mesh.scale.multiplyScalar(2 / 34);
  mesh.position.set(0, 1 - 4 / 34, 1);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);

  addSky();

  renderer = new THREE.WebGLRenderer({
    antialias: false
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  effect = new VREffect(renderer);
  effect.setSize(window.innerWidth, window.innerHeight);

  window.addEventListener('resize', onWindowResize, false);

  document.body.addEventListener('click', () => {
    effect.requestPresent();
  });
}

function onWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate () {
  requestAnimationFrame(animate);

  // mesh.rotation.x = 0.05;
  mesh.rotation.y += 0.02;

  effect.render(scene, camera);

  // renderer.render(scene, camera);
}

init();
animate();
