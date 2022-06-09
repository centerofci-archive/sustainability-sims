import { SustainableHomeRootState } from "../state"



// Use better name for this function
export function selector_on_mobile (state: SustainableHomeRootState)
{
    return state.device_info.screen_width < 600
}
