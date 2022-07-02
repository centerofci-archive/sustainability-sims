import { AbstractMesh, Scene, TransformNode, Vector3 } from "@babylonjs/core"

import { get_mesh } from "../../../../utils/get_mesh"
import { mesh_dispose } from "../../../../utils/mesh_dispose"
import { vec3 } from "../../../../utils/vector"
import { HEIGHT_OF_ONE_STORY, THICKNESS_OF_ONE_WALL } from "../draw_walls"



export interface DrawSpecificHomeArgs
{
    scene: Scene
    position: Vector3
    width: number
    depth: number
}

export interface DrawSpecificHomeReturn
{
    home: AbstractMesh
    cutthrough_components: (TransformNode | undefined)[]
    ground_width?: number
}


export const HEIGHT_OF_GROUND_FLOOR_FLOOR = 0.3



export function replace_with_door (scene: Scene, door_placeholder: TransformNode | undefined)
{
    const door = get_mesh(scene, "door_frame")
    coplace_with(door_placeholder, door)
    if (door_placeholder)
    {
        const depth_of_step = 0.5
        ;(door_placeholder as AbstractMesh).position.addInPlace(vec3(0, -HEIGHT_OF_GROUND_FLOOR_FLOOR, depth_of_step))
        ;(door_placeholder as AbstractMesh).scaling = vec3(1, -HEIGHT_OF_GROUND_FLOOR_FLOOR / HEIGHT_OF_ONE_STORY, depth_of_step / THICKNESS_OF_ONE_WALL)
    }
}


export function replace_with_window (scene: Scene, window_placeholder: TransformNode | undefined, height: "medium" | "tall" = "medium")
{
    const window = get_mesh(scene, `window_medium_${height}`)
    replace_with(window_placeholder, window)
    return window
}


function replace_with (placeholder: TransformNode | undefined, replacement: AbstractMesh)
{
    coplace_with(placeholder, replacement)

    mesh_dispose((placeholder as any))
}


function coplace_with (placeholder: TransformNode | undefined, replacement: AbstractMesh)
{
    if (!placeholder) return

    replacement.parent = placeholder.parent
    replacement.position = (placeholder as any).position.clone()
}



export function get_children (node: TransformNode)
{
    // Have to use `as (AbstractMesh | undefined)` because type of Node incorrectly
    // does not have a clone function

    return node.getChildren() as AbstractMesh[]
}
