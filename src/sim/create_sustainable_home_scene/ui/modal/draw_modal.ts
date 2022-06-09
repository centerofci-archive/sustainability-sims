import { Container, Control, Rectangle, TextBlock } from "@babylonjs/gui"
import { ContentCommonArgs } from "../../../content"
import { get_store } from "../../../../state/store"



export interface ModalReturn
{
    inner_content: Container
    dispose: () => void
}


export function draw_modal ({ ui_layer }: ContentCommonArgs, title: string): ModalReturn
{
    const store = get_store()
    const state = store.getState().sustainable_home

    const on_mobile = state.device_info.screen_width < 600

    const outer_window = new Rectangle("outer modal window")
    outer_window.width = on_mobile ? 0.8 : 0.6
    outer_window.heightInPixels = on_mobile ? 500 : 350
    outer_window.cornerRadius = 20
    outer_window.color = "white"
    outer_window.thickness = 2
    outer_window.background = "rgba(182, 215, 228, 0.8)"
    ui_layer.addControl(outer_window)

    const header = new Rectangle("header")
    header.width = 1
    const header_height = 50
    header.height = `${header_height}px`
    header.thickness = 0
    header.background = "rgb(56,115,151)"
    header.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP
    outer_window.addControl(header)

    const title_text = new TextBlock("title text")
    title_text.text = title
    title_text.fontSize = 24
    title_text.fontWeight = "bold"
    title_text.color = "white"
    header.addControl(title_text)

    const inner_content = new Rectangle("inner content")
    inner_content.heightInPixels = outer_window.heightInPixels - header_height
    inner_content.top = header_height
    inner_content.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP
    inner_content.thickness = 0
    inner_content.background = "rgba(0, 0, 0, 0)"
    outer_window.addControl(inner_content)

    return {
        inner_content,
        dispose: () => {
            outer_window.dispose()
        },
    }
}
