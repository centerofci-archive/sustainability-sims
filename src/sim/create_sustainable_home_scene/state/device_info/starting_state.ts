import { DeviceInfoState } from "./state"



export function get_device_info_starting_state (): DeviceInfoState
{
    return {
        // Storing here as that we can accommodate the user changing the orientiation
        // of the device and or the window size
        screen_width: window.screen.width,
    }
}
