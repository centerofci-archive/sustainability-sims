import { MeshBuilder, Scene, Vector3 } from "@babylonjs/core"



interface DrawWallArgs
{
    scene: Scene
    position: Vector3
}

export function draw_walls (args: DrawWallArgs)
{
    const wall = MeshBuilder.CreateBox("wall", { width: 5, height: 5, depth: 0.3 }, args.scene)
    wall.position = args.position
    return wall
}
