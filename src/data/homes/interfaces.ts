import { MATERIAL_TYPE } from "../materials"


export type HOME_TYPE = "terrace" | "semidetached" | "detached" | "flat" | "bungalow"

export interface HomeV1
{
    archetype: HOME_TYPE

    // materials: HouseComponentMaterialV1[]
    /**
     * Degrees between North and angle of front wall.
     * Required for calculating solar gain.
     * Defaults to 0.
     */
    orientation?: number
    /**
     * Only expecting 1 or 2 entries.  The first being the
     * original home and the second being an optional extension
     */
    house_parts: HousePartV1[]
}


interface HousePartV1
{
    name: string
    number_of_floors: number
    /**
     * This does not include uninhabitable loft space.
     * Default is given by archetype home but usually defaults to number_of_floors
     */
    total_floors_in_building?: number
    /**
     * The floor the home starts at.  If it is the ground floor then 0.
     * If it is the first floor above the ground floor then 1, the next floor up is 2, etc.
     * UDefault is given by archetype home but usually defaults to 0
     */
    starts_at_floor?: number
    floor: HouseFloorComponentV1
    walls: HouseWallsV1
    roof: HouseRoofComponentV1
}


interface HouseComponentV1
{
    type: "floor" | "wall" | "roof"
}


interface HouseFloorComponentV1 extends HouseComponentV1
{
    type: "floor"
    material: HouseComponentMaterialV1
    area_m2: number
    /**
     * Can override the width and depth calculated from the area & archetype's width_to_depth_ratio
     *
     * And when they have walls, then it's easier to just give the height of the walls and calculate
     * the wall areas from that.  But do they need this level of fidelity?
     * I think it comes down to the party walls and the positions of windows.
     * If we don't allow for multiple walls then defining the party wall must be done as a function of
     * the archetype, i.e. the semi and terrace have 1 & 2 party walls.
     * But the windows are harder.  For a semi, there may be windows on the side, but without seperate walls
     * we can't easily capture this.  Unless we
     */
    width_m?: number
    depth_m?: number
}

interface HouseWallsV1 extends HouseComponentV1
{
    type: "wall"
    wall_material: HouseComponentMaterialV1
    /**
     * Defaults to 2.3 ref: https://web.archive.org/web/20210506074031/https://themocracy.com/standard-floor-to-floor-height/
     */
    wall_height_m?: number
    /**
     * The exposed_area_m2
     * This overides the value calculated from the wall_height x floor dimensions
     */
    wall_area_m2?: number
    /**
     * Will contain 4 walls, going clockwise (from the top) with the first being
     * towards the front of the house.
     *
     * We make the assumption that all the walls are the same height.
     * Their areas will be given by the width_m or depth_m if specified,
     * otherwise they will come from the archetype's width_to_depth_ratio.
     */
    walls: HouseWallComponentV1[]
}

interface HouseWallComponentV1
{
    /**
     * Defaults to 0
     */
    party_wall_area_ratio?: number
    /**
     * Area of wall which is open to the outside
     * Defaults to 0
     */
    ventilation_hole_area_m2?: number

    windows: HouseComponentWindowsV1[]
    doors: HouseComponentDoorsV1[]
}

interface HouseRoofComponentV1 extends HouseComponentV1
{
    type: "roof"
    material: HouseComponentMaterialV1
    roof_type: "gable" | "hip" | "shed" | "flat"
    roof_pitch: number
    has_loft: false |
    {
        /**
         * Is this a habitable living area?
         */
        converted: boolean,
    },
    /**
     * May have skylights in the roof
     */
    windows: HouseComponentWindowsV1[]
    /**
     * If there is a loft but no loft_conversion then will almost
     * certainly have a door to the loft
     */
    doors: HouseComponentDoorsV1[]
}


type MATERIAL_USE_TYPE = "walls" | "windows" | "doors" | "floors" | "ceilings" | "roofs"

interface MaterialData
{
    limit_to?: MATERIAL_USE_TYPE[]
    /**
     * If limit_to is present, the exclude_from list should be ignored.
     */
    exclude_from?: MATERIAL_USE_TYPE[]
}
export const HOME_MATERIALS_DATA: { [p in MATERIAL_TYPE]: MaterialData } = {
    "concrete roof tiles":
    {
        limit_to: ["roofs"],
    },
    "clay brick":
    {
        limit_to: ["walls", "floors"],
    },
    "wood":
    {

    },
    "mineral wool":
    {
        exclude_from: ["windows", "doors"],
    },
    "plasterboard":
    {
        exclude_from: ["windows", "doors"],
    },
    "foam PIR (polyisocyanurate) board":
    {
        exclude_from: ["windows", "doors"],
    },
    "autoclaved aerated concrete blocks":
    {
        exclude_from: ["windows", "doors"],
    },
    "PVC-U":
    {
        limit_to: ["windows", "doors"],
    },
    "aluminium":
    {
        exclude_from: ["floors"],
    },
    "steel":
    {
        exclude_from: ["floors"],
    },
    "double glazing":
    {
        limit_to: ["windows", "doors"],
    },
    "triple glazing":
    {
        limit_to: ["windows", "doors"],
    },
    "PMMA (aka Perspex)":
    {
        limit_to: ["windows", "doors"],
    },
    "polycarbonate":
    {
        limit_to: ["windows", "doors"],
    },
    "straw bale":
    {
        limit_to: ["walls"],
    },
    "air":
    {

    },
}


interface HouseComponentMaterialV1
{
    name: string
    layers: HouseComponentMaterialLayerV1[]
}

interface HouseComponentMaterialLayerV1
{
    thickness_mm: number
    material: MATERIAL_TYPE
}


interface HouseComponentWindowsV1
{
    area_m2: number
    glazing: "single" | "double" | "triple"
    /**
     * Default is given by archetype home but usually defaults to false
     */
    secondary_glazing?: boolean
    /**
     * Default is given by archetype home but usually defaults to false
     */
    ventilation_grills?: boolean
    /**
     * Default is given by archetype home but usually defaults to false
     */
    drafty_gaps?: boolean
}



interface HouseComponentDoorsV1
{
    area_m2: number
    materials: {
        relative_area: number,
        type: MATERIAL_TYPE,
    }[]
    /**
     * Default is given by archetype home but usually defaults to false
     */
    ventilation_grills?: boolean
    /**
     * Default is given by archetype home but usually defaults to true
     */
    drafty_gaps?: boolean
}


export interface HomeStats
{

}
