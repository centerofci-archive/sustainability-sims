import { Scene } from "@babylonjs/core"
import { TaskType, useAssetManager } from "react-babylonjs"



export function load_low_poly_house_3 (scene: Scene)
{
    return new Promise<void>((resolve, reject) =>
    {
        try {
            const asset_manager = useAssetManager([
                {
                    taskType: TaskType.Mesh,
                    name: "load low_poly_house_3",
                    rootUrl: "/public/models/low_poly_house/",
                    sceneFilename: "low_poly_house_3.glb",
                    onSuccess: () =>
                    {
                        const chimney = scene.getMeshByName("chimney")
                        chimney?.parent?.setEnabled(false) // disable the root which will hide all meshes of the imported model
                        if (chimney) resolve()
                        else reject("Can not find low_poly_house_3.glb")
                    },
                    onError: reject
                },
            ])
        } catch (e)
        {
            // silence the error, seems it's throwing a Promise, that successfully
            // fulfils with no result?
            // e.then((r: any) => console.log("res...", r))
            //  .catch((r: any) => console.error("err...", r))
            // console.error(e)
        }
    })
}
