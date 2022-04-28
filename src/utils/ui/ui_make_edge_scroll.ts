import { ArcRotateCamera, Camera, Matrix, Nullable, Observer, Vector3 } from "@babylonjs/core"
import { AdvancedDynamicTexture, Control, Rectangle } from "@babylonjs/gui"



// Inspired by https://forum.babylonjs.com/t/rts-camera-wasd-move-eq-rotate-mousewheel-zoom-edge-scroll/29289/4
export function ui_make_edge_scroll (camera: ArcRotateCamera, ui_full_screen_advanced_texture: AdvancedDynamicTexture)
{
    const scroll_direction = { vertical: 0, horizontal: 0 }

    const edge_width_scroll_size_ratio = 0.02
    const edge_height_scroll_size_ratio = 0.04

    // gui elements for edge areas
    const top = new Rectangle("edge_top")
    const top_right = new Rectangle("edge_top_right")
    const right = new Rectangle("edge_right")
    const bottom_right = new Rectangle("edge_bottom_right")
    const bottom = new Rectangle("edge_bottom")
    const bottom_left = new Rectangle("edge_bottom_left")
    const left = new Rectangle("edge_left")
    const top_left = new Rectangle("edge_top_left")

    const all_scroll_edge_ui_elements = [
        {
            ui_element: top,
            vertical: 1, horizontal: 0,
        },
        {
            ui_element: top_right,
            vertical: 1, horizontal: 1,
        },
        {
            ui_element: right,
            vertical: 0, horizontal: 1,
        },
        {
            ui_element: bottom_right,
            vertical: -1, horizontal: 1,
        },
        {
            ui_element: bottom,
            vertical: -1, horizontal: 0,
        },
        {
            ui_element: bottom_left,
            vertical: -1, horizontal: -1,
        },
        {
            ui_element: left,
            vertical: 0, horizontal: -1,
        },
        {
            ui_element: top_left,
            vertical: 1, horizontal: -1,
        },
    ]


    // ++++ Set the sizes ++++
    const top_width = 1 - (4 * edge_width_scroll_size_ratio)
    top.width = top_width
    bottom.width = top_width

    const left_height = 1 - (4 * edge_height_scroll_size_ratio)
    left.height = left_height
    right.height = left_height

    top_left.height = edge_height_scroll_size_ratio * 2
    top.height = edge_height_scroll_size_ratio
    top_right.height = edge_height_scroll_size_ratio * 2
    bottom_left.height = edge_height_scroll_size_ratio * 2
    bottom.height = edge_height_scroll_size_ratio
    bottom_right.height = edge_height_scroll_size_ratio * 2

    top_left.width = edge_width_scroll_size_ratio * 2
    left.width = edge_width_scroll_size_ratio
    bottom_left.width = edge_width_scroll_size_ratio * 2
    top_right.width = edge_width_scroll_size_ratio * 2
    right.width = edge_width_scroll_size_ratio
    bottom_right.width = edge_width_scroll_size_ratio * 2
    // ---- Set the sizes ----


    // ++++ Set alignment ++++
    top.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP
    top_right.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP
    top_right.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT
    right.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT
    bottom_right.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT
    bottom_right.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM
    bottom.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM
    bottom_left.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM
    bottom_left.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT
    left.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT
    top_left.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT
    top_left.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP
    // ---- Set alignment ----


    let execute_scroll_observable: Nullable<Observer<Camera>> = null
    let target_camera_position = camera.target.clone()
    function execute_scroll ()
    {
        const direction = new Vector3(-scroll_direction.horizontal, 0, -scroll_direction.vertical).scale(camera.speed * 0.3)

        if (direction.length() > 0)
        {
            const mat_y = Matrix.RotationY(-camera.alpha + (Math.PI / 2))
            target_camera_position.addInPlace(Vector3.TransformCoordinates(direction, mat_y))
        }
        else
        {
            // This means user is no longer scrolling so now move the target back towards
            // the current position to prevent a long draw out scroll effect
            target_camera_position = Vector3.Lerp(target_camera_position, camera.target, 0.1)
        }


        // calculate distance between actual camera position and target camera position
        const diff = (target_camera_position.subtract(camera.target)).length()

        if (diff <= 0.01)
        {
            camera.onAfterCheckInputsObservable.remove(execute_scroll_observable)
            return
        }

        camera.setTarget(Vector3.Lerp(camera.target, target_camera_position, 0.02), true, true, true)
    }


    all_scroll_edge_ui_elements.forEach(({ ui_element, vertical, horizontal }) =>
    {
        // ui_element.background = "green"
        ui_element.alpha = 0
        ui_element.isPointerBlocker = false

        ui_element.onPointerEnterObservable.add((eventData, eventState) =>
        {
            scroll_direction.vertical = vertical
            scroll_direction.horizontal = horizontal
            target_camera_position = camera.target.clone()
            camera.onAfterCheckInputsObservable.remove(execute_scroll_observable)
            execute_scroll_observable = camera.onAfterCheckInputsObservable.add(execute_scroll)
        })

        ui_element.onPointerOutObservable.add((eventData, eventState) =>
        {
            scroll_direction.vertical = 0
            scroll_direction.horizontal = 0
        })

        ui_full_screen_advanced_texture.addControl(ui_element)
    })


    // window.onpointerout = () =>
    // {
    //     scroll_direction.vertical = 0
    //     scroll_direction.horizontal = 0
    // }
}
