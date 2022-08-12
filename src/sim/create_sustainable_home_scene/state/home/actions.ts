import type { Action, AnyAction } from "redux"



interface SelectDefaultHomeTypeArgs
{
    home_type: string
}

interface ActionSelectDefaultHomeType extends Action, SelectDefaultHomeTypeArgs {}

const select_default_home_type_type = "select_default_home_type"

const select_default_home_type = (args: SelectDefaultHomeTypeArgs): ActionSelectDefaultHomeType =>
{
    return { type: select_default_home_type_type, ...args }
}

export const is_select_default_home_type = (action: AnyAction): action is ActionSelectDefaultHomeType => {
    return action.type === select_default_home_type_type
}



export const home_actions = {
    select_default_home_type,
}
