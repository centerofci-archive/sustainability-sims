import * as BABYLON from "babylonjs"
import { AtmosphericScatteringPostProcess } from "./shaders/atmosphericScattering";
export class AppOne {
    engine: BABYLON.Engine;
    scene: BABYLON.Scene;

    constructor(readonly canvas: HTMLCanvasElement) {
        this.engine = new BABYLON.Engine(canvas)
        window.addEventListener("resize", () => {
            this.engine.resize();
        });
        this.scene = createScene(this.engine, this.canvas)

    }

    debug(debugOn: boolean = true) {
        if (debugOn) {
            this.scene.debugLayer.show({ overlay: true });
        } else {
            this.scene.debugLayer.hide();
        }
    }

    run() {
        this.debug(true);
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }

}


var createScene = function (engine: BABYLON.Engine, canvas: HTMLCanvasElement) {
    // this is the default code from the playground:

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);

    // This creates and positions a camera
    // var camera = new BABYLON.ArcRotateCamera("camera1", 0.9, 0.8, 10, BABYLON.Vector3.Zero(), scene);
    let camera = new BABYLON.ArcRotateCamera("orbitalCamera", Math.PI / 2, Math.PI / 3, 400, BABYLON.Vector3.Zero(), scene);

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const sun_direction = new BABYLON.Vector3(0, 0, 0)
    var sun2 = new BABYLON.PointLight("dir01", sun_direction, scene);
    sun2.position = new BABYLON.Vector3(500, 200, 0);

    var shadowGenerator = new BABYLON.ShadowGenerator(1024, sun2);

    const planetRadius = 100;
    var earth: BABYLON.Mesh = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: planetRadius * 2, segments: 75 }, scene);

    camera.setTarget(earth);
    shadowGenerator.addShadowCaster(earth)

    let earthMaterial = new BABYLON.StandardMaterial("earthMaterial", scene);
    earthMaterial.diffuseTexture = new BABYLON.Texture("./public/textures/earth.jpg", scene);
    earthMaterial.emissiveTexture = new BABYLON.Texture("./public/textures/night2.jpg", scene);
    earthMaterial.specularTexture = new BABYLON.Texture("./public/textures/specular2.jpg", scene);

    earth.material = earthMaterial;
    earth.rotation.x = Math.PI; // textures are always upside down on sphere for some reason...
    earth.rotation.y = Math.PI / 2;
    
    // Move the sphere upward 1/2 its height
    earth.position.y = 1;

    // add atmosphere
    const atmosphereRadius = planetRadius * 1.15;
    let atmosphere = new AtmosphericScatteringPostProcess("atmosphere", earth, planetRadius, atmosphereRadius, sun2, camera, scene);

    

    // Our built-in "ground" shape.
    var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);
    ground.receiveShadows = true
    

    return scene;
};