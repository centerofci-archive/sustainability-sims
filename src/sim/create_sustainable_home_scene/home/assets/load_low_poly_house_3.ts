import { TaskType, useAssetManager } from "react-babylonjs"



export function load_low_poly_house_3 (onSuccess: () => void)
{
    try {
        const asset_manager = useAssetManager([
            {
                taskType: TaskType.Mesh,
                name: "load low_poly_house_3",
                rootUrl: "/public/models/low_poly_house/",
                sceneFilename: "low_poly_house_3.glb",
                onSuccess,
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
}
