import * as BABYLON from "@babylonjs/core"
// As per instructions here: https://doc.babylonjs.com/divingDeeper/developWithBjs/treeShaking#almighty-inspector
import "@babylonjs/core/Debug/debugLayer" // Augments the scene with the debug methods
import "@babylonjs/inspector" // Injects a local ES6 version of the inspector to prevent automatically relying on the none compatible version

import { create_sun, WrappedSun } from "./components/create_sun"
import { ArcRotateCamera, Vector3 } from "@babylonjs/core"
import { create_shadow_generator } from "./utils/create_shadow_generator"
import { load_assets } from "./utils/load_assets"
import { create_content } from "./scenes/content"



export class AppOne
{
    engine: BABYLON.Engine
    scene: BABYLON.Scene
    assets_manager: BABYLON.AssetsManager
    camera: ArcRotateCamera
    sun: WrappedSun

    constructor (readonly canvas: HTMLCanvasElement)
    {
        this.engine = new BABYLON.Engine(canvas, true, { stencil: true })
        window.addEventListener("resize", () => {
            this.engine.resize()
        })
        const res = create_scene(this.engine, this.canvas)
        this.scene = res.scene
        this.camera = res.camera
        this.sun = res.sun
        this.assets_manager = new BABYLON.AssetsManager(this.scene)
        load_assets(this.assets_manager)
    }

    debug (debug_on: boolean)
    {
        ;(window as any).scene = this.scene

        if (debug_on)
        {
            this.scene.debugLayer.show({ overlay: true })
        }
        else
        {
            this.scene.debugLayer.hide()
        }

        ;(window as any).show_debug = () => this.scene.debugLayer.show({ overlay: true })
    }

    run ()
    {
        this.debug(false)

        this.assets_manager.load()

        this.assets_manager.onFinish = tasks =>
        {
            const shadow_generator = create_shadow_generator(this.scene)
            create_content({
                scene: this.scene,
                camera: this.camera,
                sun: this.sun,
                shadow_generator,
            })

            this.engine.runRenderLoop(() =>
            {
                this.scene.render()
            })
        }
    }

}



function create_scene (engine: BABYLON.Engine, canvas: HTMLCanvasElement)
{
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine)
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 1)

    // This creates and positions a camera
    const camera = new BABYLON.ArcRotateCamera("orbitalCamera", Math.PI / 3, Math.PI / 3, 30, new Vector3(0, 0, 0), scene)

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true)

    camera.lowerRadiusLimit = 3
    camera.useBouncingBehavior = true

    const sun = create_sun(scene)

    return { scene, camera, sun }
}
