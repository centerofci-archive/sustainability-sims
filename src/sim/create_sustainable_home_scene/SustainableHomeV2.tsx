import React from "react"

import { Sun } from "../../components/Sun"
import { UILandingScreen } from "./ui/landing_screen/UILandingScreen"
import { connect, ConnectedProps } from "react-redux"
import { SustainableHomeRootState } from "./state/state"
import { FunctionComponent } from "react"
import { VIEWS } from "./state/routing/state"
import { UIHomeSelectionMenu } from "./ui/home_selection_menu/UIHomeSelectionMenu"
import { InternalGenerateOptionPreviewImages } from "./internal/InternalGenerateOptionPreviewImages"



interface OwnProps {}

const map_state = (state: SustainableHomeRootState) =>
{
    return {
        view: state.routing.view,
    }
}

const map_dispatch = {
    // change_view: ACTIONS.routing.change_view,
}
const connector = connect(map_state, map_dispatch)
type Props = ConnectedProps<typeof connector> & OwnProps



const _SustainableHomeV2 = (props: Props) =>
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
            onCreated={ui_layer =>
            {
                // Quick hack
                ;(window as any).ui_layer = ui_layer
            }}
        >
            {props.view === VIEWS.landing_screen && <UILandingScreen />}
            {props.view === VIEWS.home_selection_menu && <UIHomeSelectionMenu />}
            {props.view === VIEWS.__internal_generate_option_preview_images && <InternalGenerateOptionPreviewImages />}

        </adtFullscreenUi>
    </>
}

export const SustainableHomeV2 = connector(_SustainableHomeV2) as FunctionComponent<OwnProps>
