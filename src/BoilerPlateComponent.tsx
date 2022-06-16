import React, { FunctionComponent } from "react"
import { connect, ConnectedProps } from "react-redux"
import { SustainableHomeRootState } from "./sim/create_sustainable_home_scene/state/state"



interface OwnProps {}

const map_state = (state: SustainableHomeRootState) =>
{
    return {}
}

const map_dispatch = {
    // change_view: ACTIONS.routing.change_view,
}
const connector = connect(map_state, map_dispatch)
type Props = ConnectedProps<typeof connector> & OwnProps


const _BoilerPlateComponent = (props: Props) =>
{
    return <></>
}

export const BoilerPlateComponent = connector(_BoilerPlateComponent) as FunctionComponent<OwnProps>
