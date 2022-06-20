import { Camera, Engine, Mesh, Scene, Tools, AbstractMesh, Vector3, TransformNode } from "@babylonjs/core"
import * as GUI from "@babylonjs/gui"
import React, { FunctionComponent, useEffect, useRef, useState } from "react"
import { TaskType, useAssetManager, useScene } from "react-babylonjs"
import { connect, ConnectedProps } from "react-redux"
import { get_mesh } from "../../../utils/get_mesh"
import { vec3 } from "../../../utils/vector"

import { draw_home } from "../home/draw_home"
import { SustainableHomeRootState } from "../state/state"
import { OPTION_IMAGE_WIDTH, OPTION_IMAGE_HEIGHT } from "../ui/home_selection_menu/UIHomeSelectionMenu"



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


const _InternalGenerateOptionPreviewImages = (props: Props) =>
{
    const scene = useScene()!
    const [ready, set_ready] = useState(false)
    const rendered_once = useRef(false)

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

    if (!chimney) return <></>
    if (!ready) return <></>
    if (rendered_once.current) return <></>
    rendered_once.current = false


    // const door = scene.getMeshByName("door_frame")!.clone("door1", null)!
    // // door.setParent(null)
    // door.parent = null
    // door.rotationQuaternion = null
    // door.rotation = vec3([0,0,0])

    // chimney.parent?.setEnabled(false) // disable the root which will hide all meshes of the imported model

    // return <></>


    chimney.parent?.setEnabled(false) // disable the root which will hide all meshes of the imported model

    const home_type_templates: Shape[] = [
        // { name: "Detached", mesh: draw_home({ scene, position: Vector3.Zero(), home: { type: "detached", footprint_m2: 80 } }) },
        { name: "Flat", mesh: draw_home({ scene, position: Vector3.Zero(), home: { type: "flat", footprint_m2: 80 } }) },
    ]


    // get_preview_images_of_shapes(scene.getEngine(), scene.activeCamera!, scene, home_type_templates)
    // .then(() =>
    // {
    //     const data = home_type_templates.map(shape => ({ name: shape.name, image_data: shape.image_data }))
    //     console.log(JSON.stringify(data, null, 4))
    // })


    return <>
        {home_type_templates.forEach(shape =>
        {
            // shape.mesh.setEnabled(false)

            return { ...shape.mesh, key: shape.name }
        })}
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
