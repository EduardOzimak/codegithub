import "./styles.css"; // keep this here!

// naimportujte vše co je potřeba z BabylonJS
import {
  Engine,
  Scene,
  UniversalCamera,
  MeshBuilder,
  Path3D,
  StandardMaterial,
  DirectionalLight,
  Vector3,
  Axis,
  Space,
  Color3,
  SceneLoader,
  DeviceOrientationCamera,
  Mesh,
  Animation,
  SixDofDragBehavior
} from "@babylonjs/core";
import "@babylonjs/inspector";

//canvas je grafické okno, to rozáhneme přes obrazovku
const canvas = document.getElementById("renderCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const engine = new Engine(canvas, true);

//scéna neměnit
var scene = new Scene(engine);
// Default Environment

//vytoření kamery v pozici -5 (dozadu)
const camera = new DeviceOrientationCamera(
  "kamera",
  new Vector3(-100, 40, 17),
  scene
);

//zaměřit kameru do středu
camera.setTarget(new Vector3(0, 1, 0));

//spojení kamery a grafikcého okna
camera.attachControl(canvas, true);

//zde přídáme cyklus for

//světlo
const light1 = new DirectionalLight(
  "DirectionalLight",
  new Vector3(-1, -1, -1),
  scene
);

//vytvoření cesty
var points = [];
var n = 450; //počet bodů
var r = 60; //radius křivky
for (var i = 0; i < n + 1; i++) {
  points.push(
    new Vector3(
      (r + (r / 10) * Math.sin((2 * i * Math.PI) / n)) *
        Math.sin((2 * i * Math.PI) / n),
      0,
      (r + (r / 10) * Math.sin((2 * i * Math.PI) / n)) *
        Math.cos((2 * i * Math.PI) / n)
    )
  );
}
//vykreslení křivky
var track = MeshBuilder.CreateLines("track", { points });
var trn = MeshBuilder.CreateCylinder("trn", { diameter: 0.00001 });
var celist = MeshBuilder.CreateCylinder("celist", {
  diameter: 0.00001,
  height: 6
});

var path3D = new Path3D(points);
var normals = path3D.getNormals();
SceneLoader.ImportMesh("", "public/", "EDUARD.obj", scene, function (
  noveModely
) {
  trn = noveModely[0];
  trn.scaling = new Vector3(0.45, 0.45, 0.45);
});
SceneLoader.ImportMesh("", "public/", "CELIST.obj", scene, function (
  noveModely
) {
  celist = noveModely[0];
  celist.scaling = new Vector3(0.45, 0.45, 0.45);
});
//úhly a rotace

//animace
var i = 0;
scene.registerAfterRender(function () {
  trn.position.x = points[i].x;
  trn.position.z = points[i].z;

  var theta = Math.acos(Vector3.Dot(normals[i], normals[i + 3]));
  var sklopeni = Vector3.Cross(normals[i], normals[i + 3]).y;
  sklopeni = sklopeni / Math.abs(sklopeni);
  trn.rotate(Axis.X, sklopeni * theta, Space.WORLD);
  i = (i + 2) % (n - 2);
  trn.rotate(Axis.Z, sklopeni * theta, Space.WORLD);
  i = (i + 2) % (n - 2);
  celist.rotate(Axis.Y, 0.2, Space.WORLD);
});

//fyzika

// povinné vykreslování
engine.runRenderLoop(function () {
  scene.render();
});
const environment1 = scene.createDefaultEnvironment({
  enableGroundShadow: true
});
// zde uděláme VR prostředí

const xrHelper = scene.createDefaultXRExperienceAsync({
  // define floor meshes
  floorMeshes: [environment1.ground]
});
//environment1.setMainColor(new Color3.FromHexString("#74b9ff"));
environment1.ground.parent.position.y = 0;
environment1.ground.position.y = 0;
scene.debugLayer.show();
