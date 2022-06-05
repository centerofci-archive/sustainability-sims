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

        this.onPointerDownObservable = new Observable()
        this.onPointerDown = (evt, pickInfo, type) =>
        {
            this.onPointerDownObservable.notifyObservers({ evt, pickInfo, type })
        }

        this.onPointerMoveObservable = new Observable()
        this.onPointerMove = (evt, pickInfo, type) =>
        {
            this.onPointerMoveObservable.notifyObservers({ evt, pickInfo, type })
        }

        this.onPointerUpObservable = new Observable()
        this.onPointerUp = (evt, pickInfo, type) =>
        {
            this.onPointerUpObservable.notifyObservers({ evt, pickInfo, type })
        }
    }
}
