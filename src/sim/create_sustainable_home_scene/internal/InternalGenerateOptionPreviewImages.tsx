import { Camera, Engine, Mesh, Scene, Tools, AbstractMesh, Vector3, TransformNode, Animation, ExponentialEase, EasingFunction, QuarticEase, ArcRotateCamera } from "@babylonjs/core"
import * as GUI from "@babylonjs/gui"
import { AdvancedDynamicTexture, Control } from "@babylonjs/gui"
import React, { FunctionComponent, useEffect, useMemo, useRef, useState } from "react"
import { TaskType, useAssetManager, useScene } from "react-babylonjs"
import { connect, ConnectedProps } from "react-redux"
import { get_mesh } from "../../../utils/get_mesh"
import { vec3 } from "../../../utils/vector"

import { draw_home } from "../home/draw_home/draw_home"
import { SustainableHomeRootState } from "../state/state"
import { OPTION_IMAGE_WIDTH, OPTION_IMAGE_HEIGHT } from "../ui/home_selection_menu/UIHomeSelectionMenu"



interface OwnProps {
    ui_layer: AdvancedDynamicTexture | undefined
}

const map_state = (state: SustainableHomeRootState) =>
{
    return {}
}

const map_dispatch = {
    // change_view: ACTIONS.routing.change_view,
}
const connector = connect(map_state, map_dispatch)
type Props = ConnectedProps<typeof connector> & OwnProps


const _InternalGenerateOptionPreviewImages = (props: Props) =>
{
    const scene = useScene()!
    const [ready, set_ready] = useState(false)
    const home_type_templates = useRef<Shape[]>([])
    const [show_view, set_show_view] = useState<"inside" | "outside">("outside")

    // useEffect(() =>
    // {
        try {
            const asset_manager = useAssetManager([
                {
                    taskType: TaskType.Mesh,
                    name: "somename",
                    rootUrl: "/public/models/low_poly_house/",
                    sceneFilename: "low_poly_house_3.glb",
                    onSuccess: () => set_ready(true),
                },
            ])
        } catch (e)
        {
            // silence the two errors
        }
    // }, [])


    const chimney = scene.getMeshByName("chimney")

    if (!chimney) return null
    if (!props.ui_layer) return null
    if (!ready) return null


    // const door = scene.getMeshByName("door_frame")!.clone("door1", null)!
    // // door.setParent(null)
    // door.parent = null
    // door.rotationQuaternion = null
    // door.rotation = vec3(0, 0, 0)

    // chimney.parent?.setEnabled(false) // disable the root which will hide all meshes of the imported model

    // return <></>


    chimney.parent?.setEnabled(false) // disable the root which will hide all meshes of the imported model

    if (home_type_templates.current.length === 0)
    {
        home_type_templates.current = [
            // { name: "Detached", mesh: draw_home({ scene, position: Vector3.Zero(), home: { type: "detached", footprint_m2: 80 } }) },
            { name: "Flat", mesh: draw_home({ scene, position: vec3(-2.5, -2, 2.5), home: { type: "flat", footprint_m2: 80 } }) },
        ]
    }



    // get_preview_images_of_shapes(scene.getEngine(), scene.activeCamera!, scene, home_type_templates)
    // .then(() =>
    // {
    //     const data = home_type_templates.map(shape => ({ name: shape.name, image_data: shape.image_data }))
    //     console.log(JSON.stringify(data, null, 4))
    // })


    return <>
        {home_type_templates.current.forEach(shape =>
        {
            // shape.mesh.setEnabled(false)

            return { ...shape.mesh, key: shape.name }
        })}


        {show_view === "outside" && <rectangle
            name="button container"
            width={0.3}
            topInPixels={600}
            heightInPixels={200}
            cornerRadius={20}
            thickness={2}
            color="rgba(0,0,0,0)"
        >
            <babylon-button
                widthInPixels={400}
                heightInPixels={100}
                cornerRadius={12}
                color="rgb(200, 200, 255)"
                thickness={2}
                background="white"
                paddingTopInPixels={10}
                paddingBottomInPixels={10}
                onPointerDownObservable={() =>
                {
                    set_show_view("inside")

                    const animate_pos = new Animation("", "position", 20, Animation.ANIMATIONTYPE_VECTOR3)
                    animate_pos.setKeys([
                        { frame: 0, value: scene.activeCamera!.position.clone() },
                        { frame: 50, value: vec3(-12, 2, 0) },
                    ])

                    const easing_function = new QuarticEase()
                    easing_function.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT)
                    animate_pos.setEasingFunction(easing_function)
                    scene.activeCamera!.animations.push(animate_pos)
                    scene.beginAnimation(scene.activeCamera!, 0, 50, false, 1, () =>
                    {
                        ;(window as any).hide_wall()
                    })
                }}
            >
                <textBlock
                    text="View inside"
                    // fontFamily="FontAwesome"
                    fontStyle="bold"
                    fontSize={24}
                    color="black"
                    textHorizontalAlignment={
                        Control.HORIZONTAL_ALIGNMENT_CENTER
                    }
                    textVerticalAlignment={
                        Control.VERTICAL_ALIGNMENT_CENTER
                    }
                />
            </babylon-button>
        </rectangle>}
    </>
}

export const InternalGenerateOptionPreviewImages = connector(_InternalGenerateOptionPreviewImages) as FunctionComponent<OwnProps>



interface Shape
{
    name: string
    mesh: AbstractMesh
    image_data?: string
}


async function get_preview_images_of_shapes (engine: Engine, camera: Camera, scene: Scene, shapes: Shape[]): Promise<void>
{
    await some_small_delay()


    shapes = [...shapes]
    const shape = shapes.shift()

    if (!shape) return

    shape.mesh.setEnabled(true)

    // await some_small_delay(2000)


    return new Promise<void>(resolve =>
    {
        Tools.CreateScreenshot(engine, camera, { width: OPTION_IMAGE_WIDTH, height: OPTION_IMAGE_HEIGHT }, function (data)
        {
            // console .log(`For "${shape.name}" got the following screenshot data: `, data)

            // if (!shape.preview_image!.source) shape.preview_image!.source = data;
            shape.image_data = data
            shape.mesh.dispose()

            get_preview_images_of_shapes(engine, camera, scene, shapes)
            .then(() => resolve())
        });
    })
}



async function some_small_delay (delay = 500)
{
    return new Promise(resolve =>
    {
        setTimeout(resolve, delay)
    })
}
