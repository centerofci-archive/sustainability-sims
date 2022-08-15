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



interface ChangeCurrentFutureArgs
{
    is_current: boolean
}

interface ActionChangeCurrentFuture extends Action, ChangeCurrentFutureArgs {}

const change_current_future_type = "change_current_future"

const change_current_future = (args: ChangeCurrentFutureArgs): ActionChangeCurrentFuture =>
{
    return { type: change_current_future_type, ...args }
}

export const is_change_current_future = (action: AnyAction): action is ActionChangeCurrentFuture => {
    return action.type === change_current_future_type
}


export const routing_actions = {
    change_view,
    change_current_future,
}
