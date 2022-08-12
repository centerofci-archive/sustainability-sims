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
import { HomeExtraInfo } from "./HomeExtraInfo"
import { ChooseHomeButton } from "./ChooseHomeButton"
import { HomeStats } from "../../home/interfaces"
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



// Images will be generated from copying console output when view === __internal_generate_option_preview_images
// Dwelling types taken from:
// https://anot8.org/r/?url=https%3A%2F%2Fassets.publishing.service.gov.uk%2Fgovernment%2Fuploads%2Fsystem%2Fuploads%2Fattachment_data%2Ffile%2F945013%2F2019-20_EHS_Headline_Report.pdf&h=0-ajp&ta=%5B%5B0%2C54%2C%22%22%2C%22%22%2C%5B%5D%2C%2293%22%2C%22575%22%2C%22144%22%2C%2222%22%2C%22AJP%22%5D%5D
//
const terrace_summary_image = "data:image/png;base64,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"
const semi_detached_summary_image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMcAAACRBAMAAACF/LEfAAAAGFBMVEUAAAAsLStHSUdmaGWGiYaprKnJy8j///+6nO2YAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH5gcEETgbsZWlKAAAC1pJREFUaN7tm8tX2zwWwBUndraZfpRuMyUtWxcK2RrIY+tCsLeGxtI25CH9+3N1JdvyQ04CZDFzJue0DWmqn67u+8ol4vSvFfk/5H8AQp+f2WkhfOET8q8OOylkRW6Y4P78pJCplGFDvp0SsnPl79ub3ikhb+QcWWR+Qsi6B+pIJw9d74SQjbfrBYQML9xT6sQTQW/BkqfLE0K4N3+Ck0pCdkqI63GAPASNf0kpZZ8B6SHk34YJU/lKn+EFfwLnEyDOWHiCdwHCFADXlq/sG+yDEE6XnZtFb/KrMxgjIKqfz0cgNF1cDQi+BsTxbwnjFgXQd0E4TR/k+heT6WLROZc6WcWvVkdJ2XsgENu700hvMHF4X/CACWsg5u+BcHJl7DoJnB93BPS+tcbI+inuh7x2eaf4aSn+kF4k3wVWUaKjITuHidBcb3Or/tx2D9bKPggfxhB7G2NuMD5UlH2Q8DZPVWqBdJKpaNM7VJR2CF8S/H6mlPQXIc7vmf5peKhW2iD0nhA/xpNhWKgMyO/I2OTboaLYIfyOnEUiQUgyF/yJdKOqcceHiWKD8EdyhoVJH/d8/qQNt/RKvMNEaYbAQek1/3aH8P3HJoSsJ9hBojRA+AvJ1lwOncGz9BWLT1ituCxKAyQcPatAlQ6dmUhQ505FUqqS4NoaJkui1CF8qLbNg4601TUWi76xMfqgYr4rVc8OEaUOCX4mcAhgTDesqBnD3I5Sn3R+P2tJWs7LFKUGeXFhXb4g3WwnX9CO9GLpkIzMg7CflylKFYIH8Cs0XAKrn7e+luKmfD5mgLaLUoUksmpLbs3yV36y9dB1RjUVtDQRhSgVyA4jxbZfLhrx82XF43n68Gve4o+GKBVIEKvqyvzsCx6L35mVjPiBkM513JIgQRTaCHnR+wrMY0Gl+CVlpAFxpjTX4b4DK0FkFlSfzvNY749XlyUbRv2f5UcRtHQqXFNMCM8TxNbTXShsmKFSkktDihE9JEiiWlgFwv2fRcmrEagHGQGyDJzekR+lA9q2dipK+QWE+18NA4DgOMhULZWiHJ8HNSvm7fkb40IOSckP012mPplmy63GOkQuK1IYBmmnGJC/pGShW3M5VIoMka9NSSVpb7dlQakgPHCiSrNj/iSVEtqsaLunfaQashv0qsfgi4qnJH1ry9LKYBlkVfeoxDxpqRT7hn3W0hA8RxlE1PvMTd84VakUbq1KE2slSSPKcp1c1cu0XCmQvTxUSnnDsMfJKOvtbVJQU/GLIbkVjUqhqtqSkobFhtOHIYTHrJLkTTGSUl0oFNYVTElV9aAUmchVeJdKKaruvxBszEqyrhTohrMupYD4Mfe75a9C+IK+mRaxbJdvuGLuZSPB9i8qGiETIl2l/N1e9YehzYrW/dLA4LnUy+9MCBy6w6rOUcQOhgWxbUxhaCKqdHMViAhLelmZlikBG2tQ/1JootZgp6IM4YFbmtUUb+Ntq6eg0CVN2CEQts0T+Z43o0MPzdTq2iA0TRunKmYU1hAIvqxmNFARR1opNtfezlLK9ob6DCJeDZvCwoj/UTkggdC/bVJKCu2Yu7SHr6gGoenwZyG1K9PUGdMygh/V4y29gw6P0oC15l8FGca6qsDXSLtzKMR9lBcoV5245HWyDyY6UFitG2ymCtnBpl47E2hxscpaxdlyUAOH89fu0i0Vd7AdrYrVvC0xliG6dZB9riwitpcqGiJzAyVpTzs9h4j6T8QmRR16EISZjWCM5dBXIedBS590Z9ihwjoBNj4glzNlVRu2TU2aIeK1qyqkHvWeQAhtCBLCnxx5TNlHgsFmruatkFQ0Q0RwrmssQmb5X0iI4AOjQIWw+UicidTT6rKtItKQASt3zrH2dAOOkLdSDOWYbd4JES96rYRltWmsJTF8NY2TnvamFohRplarFR0pV9heQ7Pb6SuIyG14B9rHcRHGUSuEt0C4OieErJzfEZQrAEkjuSKXvrEEq07iAyBFVV/vZHghiXRJhHBCIhdMGuz4VWbRhJ19DCIKyOZSQ7be1gH7jai7cbBlYdd7IbsDIesMApkxUAcUUA9DWwH51trQtULQutbjDHKpZiDc41xmgTuxX5JUHAZZjQtJNujZnkDItXjYKwk1IaIFMse6az2Hymc9Vna8k5ALcY+uw1og0REQKL9X8dtcvKGz/FCQEUJeydjeCHETYpmQJFmqhyNDyEpDMAmMxCMks17c0m3xeD8kzCDwa8XWc53GXLEdK0nudBNohbD9kPsMAoXViq00hHsq7nc3WQFghewOgFwrxfAICoUEwohSEigEhEqHM05LsyX73ENBLG3fGS4wIe53yUpuGUJAIcnsvtQtWyFiPwRjLuSu3z0JCX0ia0i6i0VYaWdsELofoqph8v37wENzhuwOfQxORGjDKM7qJgdA/mIy1+b8TG4abf2ydazWCulXHTMozy0+A7LrVxzTegNgg7D9kG1h/XyBfUMoPh2yGReVexfHpuFx8wIbZPfwOzdOFQ5lsT2iqpH4JIjvDPOKRAWRQFXf2H0eCdk1Q2RhlXdtAOGP+eAr+DyIV5R08k1SXM5goPwciGsMGBKWj+qg45FVSwWSTrG1iI+EyNFDAaH6H3Oo7kdSyBIEtDVg8NuVZ4WI/ZAwQG1n93K9MkROPZM4cRl86R2QrG0KQ+iseX4REBiQ1J/IxnsVX+MRfwyy/uHjTIg/9aQdhPkw6hojjDLygyB8ZkK4XxwX1CIYEXdDsDLQfCiy2SuOcfdBTGfkTpF+exfFgOXPvehih75EFGg+VF0DZCwVPLOcf4jHh4NiwpoUOS+8UKOhJx18L3T5cp5HaITsDrOudXNxF7oYAkKc6aXnoJQgn7koSNIO4SXFN9fCIdbuDCPmI5lDkRrkcdOAQOi0jnbMS5ph47wMR5tv31S/zaSG7/MMoCHsCIjfKAouBLZDF/pGIlTXapdlyMYKYSVIMGgSRY09Aubr8Sn3vXxEpSA4soOmpTkz0jIkfGgSBSteKLZ5FkemBsTLi2VoxZognFbuGcN5k1Z2t5Rls1IIYCCPW5yil+UY8TZu6E9Kz2ApSDJeNxQiO0JkmRWoGCknII0Q6CvW/Rqifh8P4vpu08A9hY9Xc+7rGDky7UHeJOg5VGmaC4SINlgX7GRjebQx9HhvmF13FRBhgfCmya2CyNuSwPaIwg3JlzAgaM0XfPFMwzgfgfKm8XMGkV/aqoc161YyVFcFMtoZEHx7FoLaOtnlJ08j2uKM+O9CS6ONK0DZ4uqGRUGwQepNYOVYG3R2Y2KDCAzZpPnaSvok9zvTrmldstWjqVvEBm6fP5fufl9IY3SA5n0pm55/SpA7SI9E+SBdPHg8YvtiV14+Nn1zNX/FruQfOYsoJHlxlAb4Pek41pOqQ7akKYStYv9WXWnqiwgmXaG7YDrYQNq0PlTUAAHdNzhLEgd6NJjddmzBpvRb9cjRkh0B4YOGA4O+d65Cou6KOJll3vBkab3aIOD3rg0ClqxiP1Q3efXlxOJ4CBzYuH7Pg1l2jTMCU+x78vWwJ3prD8cMay4ZylTO1RDH+OKCdGZCvAsCSq1egN7JBJjE2dQju4JqegDgUAi45Hl1wgKQDZMkliuj9mzccRBo1st2PNJPruT1dhochWh+Um1Q9q2eelbG0aMp0LczE+KDEFBLyVtczLKymzzDRNyZHfmfNpof7PtLjNtmcPNA5Vt4lw7J9FiE7elBk6IhO4/fuWH1+a6PQEwKhBMfHT74Uru0/xgEKNmCELACtOyLwVchPhWi8pRQFwIB3mUMJv3PhuQUSIyPIFjEb/n80yHQKHZjVVYtA4eJD7zaHuXlgbTXVfSUz39PAMHc+vPlyBhyNEQOUDszIU4LMdqlk0LEfwvkPwKsFsnFlyxdAAAAAElFTkSuQmCC"
const flat_summary_image = "data:image/png;base64,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"
const detached_summary_image = "data:image/png;base64,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"
const bungalow_summary_image = detached_summary_image

const houses: { home_type: string, image_data: string }[] = [
    {
        home_type: "Terrace",
        image_data: terrace_summary_image,
    },
    {
        home_type: "Semi-Detached",
        image_data: semi_detached_summary_image,
    },
    {
        home_type: "Flat",
        image_data: flat_summary_image,
    },
    {
        home_type: "Detached",
        image_data: detached_summary_image,
    },
    {
        home_type: "Bungalow",
        image_data: bungalow_summary_image,
    },
]



const _UIHomeSelectionMenu = (props: Props) =>
{
    if (!props.ui_layer) return null

    const [current_home_type, set_current_home_type] = useState(props.chosen_home || "")


    const choose_home_type = useMemo(() => (home_type: string) =>
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
                {houses.map(({ home_type, image_data }, index) =>
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
                            image_data={image_data}
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
