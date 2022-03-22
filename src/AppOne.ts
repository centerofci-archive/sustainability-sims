import * as BABYLON from "@babylonjs/core"
import "@babylonjs/loaders"
// As per instructions here: https://doc.babylonjs.com/divingDeeper/developWithBjs/treeShaking#almighty-inspector
import "@babylonjs/core/Debug/debugLayer" // Augments the scene with the debug methods
import "@babylonjs/inspector" // Injects a local ES6 version of the inspector to prevent automatically relying on the none compatible version

import { create_ground } from "./components/create_ground"
import { create_sun, WrappedSun } from "./components/create_sun"
import { create_earth } from "./components/create_earth"
import { ArcRotateCamera, Camera, PointLight, ShadowGenerator, Vector3 } from "@babylonjs/core"
import { create_forest } from "./components/create_forest"
import { create_sky } from "./components/create_sky"
import { create_shadow_generator } from "./utils/create_shadow_generator"
import { create_house, mesh_name_low_poly_house_2 } from "./components/create_house"
import { mesh_name_low_poly_tree_1 } from "./components/create_tree"


export class AppOne {
    engine: BABYLON.Engine
    scene: BABYLON.Scene
    assets_manager: BABYLON.AssetsManager
    camera: ArcRotateCamera
    sun: WrappedSun

    constructor(readonly canvas: HTMLCanvasElement) {
        this.engine = new BABYLON.Engine(canvas)
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
            const shadow_generator = create_shadow_generator(this.scene)
            create_content(this.scene, this.camera, this.sun, shadow_generator)

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
    const camera = new BABYLON.ArcRotateCamera("orbitalCamera", Math.PI / 2, Math.PI / 3, 400, BABYLON.Vector3.Zero(), scene)

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true)
    // camera.speed = 0.25

    const sun = create_sun(scene)
    sun.set_intensity(2)

    camera.position = new Vector3(40, 40, 40)

    return { scene, camera, sun }
}



const parent_mesh_names = new Set([
    mesh_name_low_poly_tree_1,
    mesh_name_low_poly_house_2,
])
function load_assets (assets_manager: BABYLON.AssetsManager)
{
    assets_manager.addMeshTask("load low_poly_tree_1", null, "public/models/low_poly_tree/", "low_poly_tree_1.obj")
    // assets_manager.addMeshTask("load low_poly_tree2", null, "public/models/low_poly_tree/", "low_poly_trees2.obj")
    assets_manager.addMeshTask("load low_poly_house_2", null, "public/models/low_poly_house/", "low_poly_house_2.obj")

    assets_manager.onTaskSuccess = task =>
    {
        if (is_MeshAssetTask(task))
        {
            const parent_mesh = task.loadedMeshes.find(mesh => parent_mesh_names.has(mesh.name))
            if (!parent_mesh)
            {
                console.error("No parent mesh found whilst loading ", task.name)
                return
            }

            task.loadedMeshes.forEach(mesh =>
            {
                if (mesh.name !== parent_mesh.name) parent_mesh.addChild(mesh)
                mesh.visibility = 0
            })
        }
    }
}


function is_MeshAssetTask (task: BABYLON.AbstractAssetTask): task is BABYLON.MeshAssetTask
{
    return (task as BABYLON.MeshAssetTask).loadedMeshes !== undefined
}



enum Content
{
    earth,
    forest,
    house,
}
let content = Content.house


function create_content (scene: BABYLON.Scene, camera: ArcRotateCamera, sun: WrappedSun, shadow_generator: ShadowGenerator)
{
    if (content === Content.earth)
    {
        sun.configure_for_earth_globe()
        camera.position = new Vector3(170, 170, 170)
        create_earth(scene, camera, sun.sun_point_light)
    }
    else if (content === Content.forest)
    {
        create_sky(scene)
        create_ground(scene)
        create_forest(scene, shadow_generator, new Vector3(-15, 0, -15), 10)
    }
    else if (content === Content.house)
    {
        create_sky(scene)
        create_ground(scene)
        create_house(scene, shadow_generator, new Vector3(0, 0, 0), "house_one")
        create_forest(scene, shadow_generator, new Vector3(-15, 0, -15), 10)
    }
}
