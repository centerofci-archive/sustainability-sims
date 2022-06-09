import React from "react"

import { create_sky } from "../../components/create_sky"
import { Sun } from "../../components/Sun"
import { URLParams } from "../../utils/url_params_parser"
import { ContentCommonArgs } from "../content"
import { ACTIONS } from "./state/actions"
import { connect } from "./state/connected_component"
import { get_store } from "../../state/store"
import { setup_UI_home_selection_menu } from "./ui/home_selection_menu/setup_UI_home_selection_menu"
import { setup_UI_landing_screen } from "./ui/landing_screen/setup_UI_landing_screen"
import { UILandingScreen } from "./ui/landing_screen/UILandingScreen"



interface Props
{

}


export const SustainableHomeV2 = (props: Props) =>
{
    // connect(setup_UI_landing_screen(args))
    // connect(setup_UI_home_selection_menu(args))

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

    // state_machine.start()

    return <>
        <Sun in_space={false} />
        <adtFullscreenUi
            name="UI"
            isForeground={true}
        >
            <UILandingScreen />
        </adtFullscreenUi>
    </>
}
