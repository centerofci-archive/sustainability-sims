// As per instructions here: https://doc.babylonjs.com/divingDeeper/developWithBjs/treeShaking#almighty-inspector
import "@babylonjs/core/Debug/debugLayer" // Augments the scene with the debug methods
import "@babylonjs/inspector" // Injects a local ES6 version of the inspector to prevent automatically relying on the none compatible version
import * as GUI from "@babylonjs/gui"

import { Vector3, Scene as BabylonCoreScene, Color4 } from "@babylonjs/core"
import React, { Component, FunctionComponent } from "react"
import { Engine, Scene, useScene } from "react-babylonjs"
import { connect, ConnectedProps, Provider } from "react-redux"

import { Sun } from "./components/Sun"
import { RoutingPath1 } from "./state/routes"
import { CustomScene, mutate_scene } from "./utils/CustomScene"
import { get_store } from "./state/store"
import { add_toggle_show_debug } from "./utils/add_toggle_show_debug"
import { SustainableHomeV2 } from "./sim/create_sustainable_home_scene/SustainableHomeV2"
import { AppRootState } from "./state/state"
import { SustainableHomeStoreType } from "./sim/create_sustainable_home_scene/state/store"
import { SustainableHomeRootState } from "./sim/create_sustainable_home_scene/state/state"



interface State
{
    in_space: boolean
}

export class AppOne extends Component<{}, State>
{
    scene?: BabylonCoreScene
    // assets_manager: BABYLON.AssetsManager
    // ui_layer: AdvancedDynamicTexture


    constructor (props: {})
    {
        super(props)


        this.state = {
            in_space: false,
        }

        // this.assets_manager = new BABYLON.AssetsManager(this.scene)
        // this.ui_layer = AdvancedDynamicTexture.CreateFullscreenUI("UI", true, this.scene)
        // load_assets(this.assets_manager)
    }


    render ()
    {
        const store = get_store()

        const scene_path = RoutingPath1.sustainable_home_v2

        const sustainable_home_store: SustainableHomeStoreType = {...store, getState: () => store.getState().sustainable_home } as any


        return <Engine antialias adaptToDeviceRatio canvasId="babylonJS">
            <Scene
                clearColor={this.state.in_space ? new Color4(0, 0, 0, 1) : new Color4(0.443, 0.737, 0.945, 1)}
                onSceneMount={e =>
                {
                    add_toggle_show_debug(e.scene)
                    mutate_scene(e.scene)
                }}
                // onMeshPicked={mesh => this.meshPicked(mesh)}
            >
                <arcRotateCamera
                    name="orbitalCamera"
                    alpha={Math.PI / 3}
                    beta={Math.PI / 3}
                    radius={30}
                    target={Vector3.Zero()}
                    wheelPrecision={30}
                    // minZ={0.001}
                    lowerRadiusLimit={3}
                    useBouncingBehavior={true}
                />

                {scene_path === RoutingPath1.sustainable_home_v2 && <Provider store={sustainable_home_store}>
                    <SustainableHomeV2 />
                    {/* <sphere name="wrap">
                        <Demo />
                    </sphere> */}
                </Provider>}
            </Scene>
        </Engine>
    }


    // run ()
    // {
    //     this.debug(false)

    //     this.assets_manager.load()

    //     this.assets_manager.onFinish = tasks =>
    //     {
    //         const shadow_generator = create_shadow_generator(this.scene)
    //         create_content({
    //             scene: this.scene,
    //             camera: this.camera,
    //             sun: this.sun,
    //             shadow_generator,
    //             ui_layer: this.ui_layer,
    //         })

    //         this.engine.runRenderLoop(() =>
    //         {
    //             this.scene.render()
    //         })
    //     }
    // }

}




interface OwnProps {}

const map_state = (state: SustainableHomeRootState) =>
{
    return {}
}

const map_dispatch = {
    // change_view: ACTIONS.routing.change_view,
}
const connector = connect(map_state, map_dispatch)
type Props = ConnectedProps<typeof connector> & OwnProps


const _Demo = (props: Props) =>
{
    return <sphere name="demo" diameter={3} />
}

export const Demo = connector(_Demo) as FunctionComponent<OwnProps>
