import * as BABYLON from "babylonjs"



export function create_tree (scene: BABYLON.Scene, engine: BABYLON.Engine)
{
    // BABYLON.SceneLoader.ImportMeshAsync("tree1", "public/models/low_poly_tree/", "lowpolytree.obj")
    BABYLON.SceneLoader.ImportMeshAsync("tree1", "public/models/low_poly_tree/", "BlenderNatureAsset.obj")
    .then((result) => {
        // result.meshes[1].position.x = 20  // result.meshes[1] is undefined
        const myMesh1 = scene.getMeshByName("tree1")!  // is undefined
        // myMesh1.rotation.y = Math.PI / 2
        debugger
    })
    .catch(e =>
    {
        debugger
    })
}
