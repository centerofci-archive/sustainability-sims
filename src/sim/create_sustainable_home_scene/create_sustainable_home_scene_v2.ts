
import { create_sky } from "../../components/create_sky"
import { URLParams } from "../../utils/url_params_parser"
import { ContentCommonArgs } from "../content"
import { ACTIONS } from "./state/actions"
import { connect } from "./state/connected_component"
import { get_store } from "../../state/store"
import { setup_UI_home_selection_menu } from "./ui/home_selection_menu/setup_UI_home_selection_menu"
import { setup_UI_landing_screen } from "./ui/landing_screen/setup_UI_landing_screen"



export const create_sustainable_home_scene_v2 = (args: ContentCommonArgs, ground_size: number, url_params: URLParams) =>
{
    const { scene, camera, shadow_generator } = args
    create_sky(scene)

    const store = get_store()

    connect(setup_UI_landing_screen(args))
    connect(setup_UI_home_selection_menu(args))

    setup_lightswitch()

    // const state_machine = create_state_machine()



    /*

    start -> show home selection menu
    user selects a home -> change selected home
    user chooses "confirm"
        -> closes home selection menu
        -> renders house



    */

    // const is_revisiting = determine_if_revisiting()

    // show_home_selector()

    // store.dispatch(ACTIONS.setup_complete())
    // state_machine.start()
}



function setup_lightswitch ()
{
    const store = get_store()

    ;(window as any).switch_on = () =>
    {
        store.dispatch(ACTIONS.user_info.set_detected_user_location({ detected_location: { country: "abc" } }))
    }

    ;(window as any).switch_off = () =>
    {
        store.dispatch(ACTIONS.user_info.set_detected_user_location({ detected_location: undefined }))
    }
}
