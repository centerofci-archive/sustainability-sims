import { h, render } from "preact"
import { Provider } from "react-redux"

import { AppTwo } from "./AppTwo"
import { get_store } from "./scenes/create_sustainable_home_scene/state/store"



window.addEventListener("DOMContentLoaded", () => {
    let canvas = document.getElementById("renderCanvas") as HTMLCanvasElement
    render(
        <Provider store={get_store({ load_state_from_storage: false })}>
            <AppTwo />
        </Provider>,
        canvas
    )
})
