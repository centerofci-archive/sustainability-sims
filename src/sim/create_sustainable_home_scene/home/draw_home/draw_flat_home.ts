import { AbstractMesh } from "@babylonjs/core"

import { DrawSpecificHomeArgs, DrawSpecificHomeReturn } from "./common"



export function draw_flat_home (args: DrawSpecificHomeArgs): DrawSpecificHomeReturn
{
    const { width, depth } = args

    const home = new AbstractMesh("home")

    return { home, cutthrough_components: [] }
}
