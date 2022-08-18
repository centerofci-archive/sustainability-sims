import { HOME_TYPE } from "./interfaces"



interface HomeArcheTypesData
{
    width_to_depth_ratio: number
}


export const home_archetypes_data: { [p in HOME_TYPE]: HomeArcheTypesData } = {
    terrace:
    {
        /**
         * ref -- none, value is a guess
         */
        width_to_depth_ratio: 0.5,
    },
    semidetached:
    {
        /**
         * ref -- none, value is a guess
         */
        width_to_depth_ratio: 0.65,
    },
    detached:
    {
        /**
         * ref -- none, value is a guess
         */
        width_to_depth_ratio: 1.4,
    },
    flat:
    {
        /**
         * ref -- none, value is a guess
         */
        width_to_depth_ratio: 1.2,
    },
    bungalow:
    {
        /**
         * ref -- none, value is a guess
         */
        width_to_depth_ratio: 1.4,
    },
}
