import type { Action, AnyAction } from "redux"
import { ViewTypes } from "./state"



interface ChangeViewArgs
{
    view: ViewTypes
}

interface ActionChangeView extends Action, ChangeViewArgs {}

const change_view_type = "change_view"

const change_view = (args: ChangeViewArgs): ActionChangeView =>
{
    return { type: change_view_type, ...args }
}

export const is_change_view = (action: AnyAction): action is ActionChangeView => {
    return action.type === change_view_type
}



export const routing_actions = {
    change_view,
}
