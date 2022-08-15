import { AdvancedDynamicTexture, ScrollViewer } from "@babylonjs/gui"
import React, { useEffect, useMemo, useRef } from "react"
import { BabylonNode, FiberScrollViewerProps, FiberScrollViewerPropsCtor, useScene } from "react-babylonjs"

import { CustomScene } from "../../../utils/CustomScene"



type Props = { ui_layer: AdvancedDynamicTexture } & FiberScrollViewerProps & FiberScrollViewerPropsCtor & BabylonNode<ScrollViewer>


// On desktop, prevents the camera zoom from firing when user scrolls the scrollviewer
// On mobile, prevents the camera from panning up and down when the user uses the two
// fingers down+move gester to scroll the scrollViewer
// On mobile, it allows the one (or two) finger(s) down+move gester to scroll the scrollViewer
// https://forum.babylonjs.com/t/prevent-scrollviewer-onwheel-event-from-propagating-to-camera-zoom/30969/9
export const CustomScrollViewer = (props: Props) =>
{
    if (props.onPointerEnterObservable || props.onPointerOutObservable || props.onCreated)
    {
        throw new Error(`Not implemented yet as this is overwritten`)
    }

    const scene = useScene() as CustomScene
    const camera = scene.activeCamera!
    const wheel_precision = useMemo(() => (camera.inputs.attached.mousewheel as any), [])
    // We give it an empty object to remove the type errors because we know that it will
    // be assigned a value once it has been created and before it is accessed.
    const scroll_viewer_ref = useRef<ScrollViewer>({} as ScrollViewer)


    const allow_pointer_events_be_captured_by_scroll_viewer = useRef(false)
    useEffect(() =>
    {
        props.ui_layer.onControlPickedObservable.add(e => {
            if (e.name === "root")
            {
                // picked non-UI part of scene
                allow_pointer_events_be_captured_by_scroll_viewer.current = false
            }
            else
            {
                // picked scroll or some other UI
                allow_pointer_events_be_captured_by_scroll_viewer.current = true
            }
        })
    }, [])


    useEffect(() =>
    {
        let pointer_down_at: { x: number, y: number } | { x?: undefined, y?: undefined } = {}
        let horizontal_scroll_start: number | undefined = undefined
        let vertical_scroll_start: number | undefined = undefined
        const on_pointer_down_observer = scene.onPointerDownObservable.add(({ evt, pickInfo }) =>
        {
            if (!allow_pointer_events_be_captured_by_scroll_viewer) return
            camera.detachControl()
            pointer_down_at = { x: evt.offsetX, y: evt.offsetY }
            horizontal_scroll_start = scroll_viewer_ref.current.horizontalBar.value
            vertical_scroll_start = scroll_viewer_ref.current.verticalBar.value
        })


        const on_pointer_move_observer = scene.onPointerMoveObservable.add(({ evt }) =>
        {
            if (!allow_pointer_events_be_captured_by_scroll_viewer) return
            if (pointer_down_at.x === undefined)
            {
                // // On Mac (desktop) on Firefox, and Chrome, when a single pointer down is moved over the
                // // scrollViewer area, the evt.pointerType is "mouse".
                // // When two fingers down and dragged over the area, the evt.pointerType is undefined
                // // This will be broken on Safari
                // This approach does not work as the pointerUp is never triggered
                // and pointer_down_at is never reset to `{}`
                // if (evt.pointerType === undefined)
                // {
                //     pointer_down_at = { x: evt.offsetX, y: evt.offsetY }
                // }
                // else return
                return
            }
            if (horizontal_scroll_start === undefined || vertical_scroll_start === undefined) return

            const x_diff = evt.offsetX - pointer_down_at.x
            const y_diff = evt.offsetY - pointer_down_at.y

            const x_ratio = x_diff / scroll_viewer_ref.current.widthInPixels
            const y_ratio = y_diff / scroll_viewer_ref.current.heightInPixels

            scroll_viewer_ref.current.horizontalBar.value = horizontal_scroll_start - x_ratio
            scroll_viewer_ref.current.verticalBar.value = vertical_scroll_start - y_ratio
        })


        const on_pointer_up_observer = scene.onPointerUpObservable.add(() =>
        {
            if (!allow_pointer_events_be_captured_by_scroll_viewer) return
            pointer_down_at = {}
            camera.attachControl()
        })


        return () =>
        {
            scene.onPointerDownObservable.remove(on_pointer_down_observer)
            scene.onPointerMoveObservable.remove(on_pointer_move_observer)
            scene.onPointerUpObservable.remove(on_pointer_up_observer)
        }
    }, [])


    useEffect(() =>
    {
        return () =>
        {
            ;(camera.inputs.attached.mousewheel as any).wheelPrecision = wheel_precision
        }
    }, [])


    return <scrollViewer
        {...props}
        onPointerEnterObservable={() =>
        {
            ;(camera.inputs.attached.mousewheel as any).wheelPrecision = Number.MAX_VALUE
        }}
        onPointerOutObservable={() =>
        {
            ;(camera.inputs.attached.mousewheel as any).wheelPrecision = wheel_precision
        }}
        onCreated={scroll_viewer => scroll_viewer_ref.current = scroll_viewer}
    >
        {props.children}
    </scrollViewer>
}
