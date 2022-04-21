import { ArcRotateCamera, Mesh, PointerEventTypes, Scene, Vector3 } from "@babylonjs/core"
import { retarget_and_move_camera } from "../../utils/move_camera"



const DOUBLE_CLICK_LIMIT = 200

export function listen_for_double_click (scene: Scene, camera: ArcRotateCamera, leaves: Mesh)
{
    let last_pointer_down = 0

    scene.onPointerObservable.add(pointerInfo => {
        if (pointerInfo.type === PointerEventTypes.POINTERDOWN)
        {
            const have_double_clicked = (performance.now() - last_pointer_down) < DOUBLE_CLICK_LIMIT

            last_pointer_down = performance.now()

            if (pointerInfo.pickInfo?.hit && pointerInfo.pickInfo.pickedMesh?.position && have_double_clicked)
            {
                let pos = new Vector3()
                const worldMat = leaves.thinInstanceGetWorldMatrices()
                const thinInstanceMatrix = worldMat[pointerInfo.pickInfo.thinInstanceIndex]

                if (thinInstanceMatrix)
                {
                    thinInstanceMatrix.getTranslationToRef(pos)
                }
                else
                {
                    pos = pointerInfo.pickInfo.pickedMesh.position.clone()
                }

                // console .log("Double clicked on ", pointerInfo.pickInfo.pickedMesh, pos)

                retarget_and_move_camera(scene, camera, pos)
            }
        }
        else if (pointerInfo.type === PointerEventTypes.POINTERMOVE)
        {
            // if (pointerInfo.pickInfo?.pickedMesh === gas1.gas_bubble_mesh)
            // {
            //     highlight.addMesh(gas1.gas_bubble_mesh, Color3.Green())
            // }
            // else
            // {
            //     highlight.removeMesh(gas1.gas_bubble_mesh)
            // }

            // if (pointerInfo.pickInfo?.pickedMesh === gas2.gas_bubble_mesh)
            // {
            //     highlight.addMesh(gas2.gas_bubble_mesh, Color3.Green())
            // }
            // else
            // {
            //     highlight.removeMesh(gas2.gas_bubble_mesh)
            // }
        }
    })
}
