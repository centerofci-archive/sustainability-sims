import {
    Engine,
    IPointerEvent,
    Observable,
    PickingInfo,
    PointerEventTypes,
    Scene,
    SceneOptions,
} from "@babylonjs/core"
import { Nullable } from "xmachina"



interface PointerDownMoveArgs
{
    evt: IPointerEvent
    pickInfo: PickingInfo
    type: PointerEventTypes
}

interface PointerUpArgs
{
    evt: IPointerEvent
    pickInfo: Nullable<PickingInfo>
    type: PointerEventTypes
}


export class CustomScene extends Scene
{
    onPointerDownObservable: Observable<PointerDownMoveArgs>
    onPointerMoveObservable: Observable<PointerDownMoveArgs>
    onPointerUpObservable: Observable<PointerUpArgs>

    constructor (engine: Engine, options?: SceneOptions)
    {
        super(engine, options)

        // ++ silence the type errors
        this.onPointerDownObservable = new Observable()
        this.onPointerMoveObservable = new Observable()
        this.onPointerUpObservable = new Observable()
        // -- silence the type errors

        mutate_scene(this)
    }
}



export function mutate_scene (scene: Scene)
{
    const mutated_scene: CustomScene = scene as CustomScene

    mutated_scene.onPointerDownObservable = new Observable()
    mutated_scene.onPointerDown = (evt, pickInfo, type) =>
    {
        mutated_scene.onPointerDownObservable.notifyObservers({ evt, pickInfo, type })
    }

    mutated_scene.onPointerMoveObservable = new Observable()
    mutated_scene.onPointerMove = (evt, pickInfo, type) =>
    {
        mutated_scene.onPointerMoveObservable.notifyObservers({ evt, pickInfo, type })
    }

    mutated_scene.onPointerUpObservable = new Observable()
    mutated_scene.onPointerUp = (evt, pickInfo, type) =>
    {
        mutated_scene.onPointerUpObservable.notifyObservers({ evt, pickInfo, type })
    }
}
