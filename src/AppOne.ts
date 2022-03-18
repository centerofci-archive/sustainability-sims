import * as BABYLON from "babylonjs"
import { create_ground } from "./components/create_ground"
import { create_sun } from "./components/create_sun"
import { create_earth } from "./components/create_earth"


export class AppOne {
    engine: BABYLON.Engine
    scene: BABYLON.Scene

    constructor(readonly canvas: HTMLCanvasElement) {
        this.engine = new BABYLON.Engine(canvas)
        window.addEventListener("resize", () => {
            this.engine.resize()
        })
        this.scene = createScene(this.engine, this.canvas)

    }

    debug(debugOn: boolean = true) {
        if (debugOn) {
            this.scene.debugLayer.show({ overlay: true })
        } else {
            this.scene.debugLayer.hide()
        }
    }

    run() {
        this.debug(true)
        this.engine.runRenderLoop(() => {
            this.scene.render()
        })
    }

}


var createScene = function (engine: BABYLON.Engine, canvas: HTMLCanvasElement) {
    // this is the default code from the playground:

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine)
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 1)

    // This creates and positions a camera
    // var camera = new BABYLON.ArcRotateCamera("camera1", 0.9, 0.8, 10, BABYLON.Vector3.Zero(), scene)
    let camera = new BABYLON.ArcRotateCamera("orbitalCamera", Math.PI / 2, Math.PI / 3, 400, BABYLON.Vector3.Zero(), scene)

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true)

    const sun = create_sun(scene)
    // create_earth(scene, camera, sun)
    create_ground(scene)
    

    return scene
}