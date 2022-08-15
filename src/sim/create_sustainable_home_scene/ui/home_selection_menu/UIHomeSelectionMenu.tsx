import React, { useMemo, useState } from "react"
import { FunctionComponent } from "react"
import { connect, ConnectedProps } from "react-redux"
import { AdvancedDynamicTexture } from "@babylonjs/gui"

import { ACTIONS } from "../../state/actions"
import { SustainableHomeRootState } from "../../state/state"
import { CustomScrollViewer } from "../CustomScrollViewer"
import { Modal } from "../modal/Modal"
import { selector_modal_content_height } from "../modal/selector_modal_height"
import { HomeTitleAndImageButton } from "./HomeTitleAndImageButton"
import { ChooseHomeButton } from "./ChooseHomeButton"
import { HOME_TYPE } from "../../home/interfaces"
import { VIEWS } from "../../state/routing/state"



interface OwnProps
{
    ui_layer: AdvancedDynamicTexture | undefined
}

const map_state = (state: SustainableHomeRootState) =>
{
    return {
        modal_content_height_in_pixels: selector_modal_content_height(state),
        chosen_home: state.home.selected_default_home_type,
    }
}

const map_dispatch =
{
    select_default_home_type: ACTIONS.home.select_default_home_type,
    change_view: ACTIONS.routing.change_view,
}
const connector = connect(map_state, map_dispatch)
type Props = ConnectedProps<typeof connector> & OwnProps



const houses: HOME_TYPE[] = [
    "terrace",
    "semidetached",
    "flat",
    "detached",
    "bungalow",
]



const _UIHomeSelectionMenu = (props: Props) =>
{
    if (!props.ui_layer) return null

    const [current_home_type, set_current_home_type] = useState(props.chosen_home || "")


    const choose_home_type = useMemo(() => (home_type: HOME_TYPE) =>
    {
        props.select_default_home_type({ home_type })
        props.change_view({ view: VIEWS.home_home_page })
    }, [props.select_default_home_type, props.change_view])


    const cancel_choosing_home_type = useMemo(() => () =>
    {
        set_current_home_type("")
    }, [set_current_home_type])


    return <Modal title="Select Your Starting Home">
        <CustomScrollViewer
            name="select home"
            heightInPixels={props.modal_content_height_in_pixels}
            thickness={0}
            wheelPrecision={0.01}
            ui_layer={props.ui_layer}
        >
            <stackPanel
                name="homes"
                isVertical={true}
            >
                {houses.map((home_type, index) =>
                {
                    const is_chosen = home_type === current_home_type

                    const is_first = index === 0 ? 1 : 0
                    const is_last = index === (houses.length - 1) ? 1 : 0
                    // const image_height = OPTION_HEIGHT + padding


                    return <stackPanel
                        name={`home-${home_type}`}
                        key={home_type}
                        isVertical={true}
                    >
                        <HomeTitleAndImageButton
                            home_type={home_type}
                            is_chosen={is_chosen}
                            set_current_home_type={set_current_home_type}
                        />

                        {/* {is_chosen && <HomeExtraInfo
                            home_stats={home_stats}
                        />} */}

                        {is_chosen && <ChooseHomeButton
                            home_type={home_type}
                            choose_home_type={choose_home_type}
                            cancel_choosing_home_type={cancel_choosing_home_type}
                        />}

                    </stackPanel>
                })}
            </stackPanel>
        </CustomScrollViewer>
    </Modal>
}

export const UIHomeSelectionMenu = connector(_UIHomeSelectionMenu) as FunctionComponent<OwnProps>
