import { AssetsManager, AbstractAssetTask, MeshAssetTask } from "@babylonjs/core"
import "@babylonjs/loaders"

import { mesh_name_low_poly_house_2, mesh_name_low_poly_house_2_chimney } from "../components/create_house"
import { mesh_name_low_poly_tree_1 } from "../components/create_tree"



const parent_mesh_names = new Set([
    mesh_name_low_poly_tree_1,
    mesh_name_low_poly_house_2,
    mesh_name_low_poly_house_2_chimney,
])
export function load_assets (assets_manager: AssetsManager)
{
    assets_manager.addMeshTask("load low_poly_tree_1", null, "public/models/low_poly_tree/", "low_poly_tree_1.obj")
    // assets_manager.addMeshTask("load low_poly_tree2", null, "public/models/low_poly_tree/", "low_poly_trees2.obj")
    assets_manager.addMeshTask("load low_poly_house_2", null, "public/models/low_poly_house/", "low_poly_house_2.glb")

    assets_manager.onTaskSuccess = task =>
    {
        if (is_MeshAssetTask(task))
        {
            if (typeof task.sceneFilename === "string" && task.sceneFilename.endsWith(".glb"))
            {
                const roots = task.loadedMeshes.filter(mesh => mesh.name === "__root__")

                roots.forEach(mesh =>
                {
                    mesh.getChildMeshes().forEach(child =>
                    {
                        if (child.parent === mesh) child.setParent(null)
                    })
                    mesh.dispose()
                })
            }
            else
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
                })
            }

            task.loadedMeshes.forEach(mesh => mesh.visibility = 0)
        }
    }
}


function is_MeshAssetTask (task: AbstractAssetTask): task is MeshAssetTask
{
    return (task as MeshAssetTask).loadedMeshes !== undefined
}
