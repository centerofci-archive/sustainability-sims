import { Vector3 } from "@babylonjs/core"



export function vec3 (vec: Vector3 | [number, number, number]): Vector3
export function vec3 (vec: Vector3 | [number, number, number] | undefined): Vector3 | undefined
export function vec3 (vec: Vector3 | [number, number, number] | undefined): Vector3 | undefined
{
    if (!vec) return vec

    if (is_Vector3(vec)) return vec

    return new Vector3(...vec)
}


function is_Vector3 (vec: Vector3 | [number, number, number]): vec is Vector3
{
    return !!(vec as Vector3).cross
}
