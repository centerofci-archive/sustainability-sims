import * as BABYLON from "@babylonjs/core"
import "@babylonjs/loaders"
// As per instructions here: https://doc.babylonjs.com/divingDeeper/developWithBjs/treeShaking#almighty-inspector
import "@babylonjs/core/Debug/debugLayer" // Augments the scene with the debug methods
import "@babylonjs/inspector" // Injects a local ES6 version of the inspector to prevent automatically relying on the none compatible version

import { create_ground } from "./components/create_ground"
import { create_sun, SUN_NAME } from "./components/create_sun"
import { create_earth } from "./components/create_earth"
import { create_tree, mesh_name_low_poly_tree_1_green, mesh_name_low_poly_tree_1_trunk } from "./components/create_tree"
import { DirectionalLight, StandardMaterial, Vector3 } from "@babylonjs/core"
import { create_forest } from "./components/create_forest"
import { get_mesh } from "./components/get_mesh"
import { create_sky } from "./components/create_sky"


export class AppOne {
    engine: BABYLON.Engine
    scene: BABYLON.Scene
    assets_manager: BABYLON.AssetsManager

    constructor(readonly canvas: HTMLCanvasElement) {
        this.engine = new BABYLON.Engine(canvas)
        window.addEventListener("resize", () => {
            this.engine.resize()
        })
        this.scene = create_scene(this.engine, this.canvas)
        this.assets_manager = new BABYLON.AssetsManager(this.scene)
        load_assets(this.assets_manager)
    }

    debug(debugOn: boolean = true) {
        if (debugOn) {
            this.scene.debugLayer.show({ overlay: true })
            ;(window as any).scene = this.scene
        } else {
            this.scene.debugLayer.hide()
        }
    }

    run() {
        this.debug(true)

        this.assets_manager.load()

        this.assets_manager.onFinish = tasks =>
        {
            create_content(this.scene)

            this.engine.runRenderLoop(() =>
            {
                this.scene.render()
            })
        }
    }

}



function create_scene (engine: BABYLON.Engine, canvas: HTMLCanvasElement)
{
    // this is the default code from the playground:

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine)
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 1)

    // This creates and positions a camera
    // var camera = new BABYLON.ArcRotateCamera("camera1", 0.9, 0.8, 10, BABYLON.Vector3.Zero(), scene)
    let camera = new BABYLON.ArcRotateCamera("orbitalCamera", Math.PI / 2, Math.PI / 3, 400, BABYLON.Vector3.Zero(), scene)

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true)
    // camera.speed = 0.25

    const sun = create_sun(scene)
    sun.set_intensity(2)
    create_sky(scene)

    // create_earth(scene, camera, sun)
    camera.position = new Vector3(10, 10, 10)
    create_ground(scene)

    return scene
}



function load_assets (assets_manager: BABYLON.AssetsManager)
{
    assets_manager.addMeshTask("load low_poly_tree_1", null, "public/models/low_poly_tree/", "low_poly_tree_1.obj")
    assets_manager.addMeshTask("load low_poly_tree2", null, "public/models/low_poly_tree/", "low_poly_trees2.obj")

    assets_manager.onTaskSuccess = task =>
    {
        if (is_MeshAssetTask(task))
        {
            task.loadedMeshes.forEach(mesh => mesh.visibility = 0)
        }
    }
}


function is_MeshAssetTask (task: BABYLON.AbstractAssetTask): task is BABYLON.MeshAssetTask
{
    return (task as BABYLON.MeshAssetTask).loadedMeshes !== undefined
}



function create_content (scene: BABYLON.Scene)
{
    const trees = create_forest(scene, new Vector3(-15, 0, -15), 10)

    // Add shadows for trees
    const sun = scene.getLightByName(SUN_NAME)! as DirectionalLight
    const shadow_generator = new BABYLON.ShadowGenerator(1024, sun)
    shadow_generator.usePoissonSampling = true // soft shadows
    shadow_generator.useExponentialShadowMap = false // faster
    trees.forEach(tree => tree.getChildMeshes().forEach(child_mesh => shadow_generator.addShadowCaster(child_mesh)))
}
