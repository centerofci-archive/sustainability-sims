import { Camera } from "@babylonjs/core"
import { ScrollViewer } from "@babylonjs/gui"

import { ContentCommonArgs } from "../../content"



// On desktop, prevents the camera zoom from firing when user scrolls the scrollviewer
// On mobile, prevents the camera from panning up and down when the user uses the two
// fingers down+move gester to scroll the scrollViewer
// On mobile, it allows the one (or two) finger(s) down+move gester to scroll the scrollViewer
// https://forum.babylonjs.com/t/prevent-scrollviewer-onwheel-event-from-propagating-to-camera-zoom/30969/9
export class CustomScrollViewer extends ScrollViewer
{
    wheel_precision: number
    camera: Camera

    constructor ({ camera, scene, ui_layer }: ContentCommonArgs, name?: string, isImageBased?: boolean)
    {
        super(name, isImageBased)

        this.camera = camera
        this.wheel_precision = (this.camera.inputs.attached.mousewheel as any).wheelPrecision


        this.onPointerEnterObservable.add(() =>
        {
            ;(this.camera.inputs.attached.mousewheel as any).wheelPrecision = Number.MAX_VALUE
        })

        this.onPointerOutObservable.add(() =>
        {
            ;(this.camera.inputs.attached.mousewheel as any).wheelPrecision = this.wheel_precision
        })


        let allow_pointer_events_be_captured_by_scroll_viewer = false
        ui_layer.onControlPickedObservable.add(e => {
            if (e.name === "root")
            {
                // picked non-UI part of scene
                allow_pointer_events_be_captured_by_scroll_viewer = false
            }
            else
            {
                // picked scroll or some other UI
                allow_pointer_events_be_captured_by_scroll_viewer = true
            }
        })


        let x_down: number | undefined = undefined
        let y_down: number | undefined = undefined
        let horizontal_scroll_start: number | undefined = undefined
        let vertical_scroll_start: number | undefined = undefined
        scene.onPointerDownObservable.add(({ evt, pickInfo }) =>
        {
            if (!allow_pointer_events_be_captured_by_scroll_viewer) return
            this.camera.detachControl()
            x_down = evt.offsetX
            y_down = evt.offsetY
            horizontal_scroll_start = this.horizontalBar.value
            vertical_scroll_start = this.verticalBar.value
        })

        scene.onPointerMoveObservable.add(({ evt }) =>
        {
            if (!allow_pointer_events_be_captured_by_scroll_viewer) return
            if (x_down === undefined || y_down === undefined) return
            if (horizontal_scroll_start === undefined || vertical_scroll_start === undefined) return

            const x_diff = evt.offsetX - x_down
            const y_diff = evt.offsetY - y_down

            const x_ratio = x_diff / this.widthInPixels
            const y_ratio = y_diff / this.heightInPixels

            this.horizontalBar.value = horizontal_scroll_start - x_ratio
            this.verticalBar.value = vertical_scroll_start - y_ratio
        })

        scene.onPointerUpObservable.add(() =>
        {
            if (!allow_pointer_events_be_captured_by_scroll_viewer) return
            x_down = undefined
            y_down = undefined
            this.camera.attachControl()
        })
    }

    dispose ()
    {
        super.dispose()
        ;(this.camera.inputs.attached.mousewheel as any).wheelPrecision = this.wheel_precision
    }
}
