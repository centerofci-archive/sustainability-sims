import "./utils/monkey_patch"

import { Vector3, Color3, Mesh } from "@babylonjs/core"
import React, { useRef, useState } from "react"

import { useClick, useHover, useBeforeRender, Engine, Scene, BabylonNode, FiberBoxPropsCtor, FiberMeshProps } from "react-babylonjs"
import { Provider } from "react-redux"

import { get_store } from "./state/store"
import { render } from "react-dom"
import { AppOne } from "./AppOne"
import { AppTwo } from "./AppTwo"


window.addEventListener("DOMContentLoaded", () => {
    let canvas = document.getElementById("renderCanvas") as HTMLCanvasElement
    render(
        <AppOne />,
        // <AppTwo />,
        // <SceneWithSpinningBoxes />,
        // <Provider store={get_store({ load_state_from_storage: false })}>
        // </Provider>,
        canvas
    )
})


// // Prevents the swipe left / right from navigating forwards and backwards
// // But does not work on Mac when using two fingers (positioned vertically relative to each other)
// // and swiping left right.  Note: on Mac when using two fingers positioned horizontally relative to
// // each other then it works fine.
// window.ontouchmove = e => e.preventDefault()




const DefaultScale = new Vector3(1, 1, 1)
const BiggerScale = new Vector3(1.25, 1.25, 1.25)



const SpinningBox = (props: { name: string, position: Vector3, hoveredColor: Color3, color: Color3 }) => {
  // access Babylon scene objects with same React hook as regular DOM elements
  const boxRef = useRef<Mesh>(null)

  const [clicked, setClicked] = useState(false)
  useClick(() => setClicked((clicked) => !clicked), boxRef)

  const [hovered, setHovered] = useState(false)
  useHover(
    () => setHovered(true),
    () => setHovered(false),
    boxRef
  )

  // This will rotate the box on every Babylon frame.
  const rpm = 5
  useBeforeRender((scene) => {
    if (boxRef.current?.rotation) {
      // Delta time smoothes the animation.
      var deltaTimeInMillis = scene.getEngine().getDeltaTime()
      boxRef.current.rotation.y +=
        (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000)
    }
  })

  return (
    <box
      name={props.name}
      ref={boxRef as any}
      size={2}
      position={props.position}
      scaling={clicked ? BiggerScale : DefaultScale}
    >
      <standardMaterial
        name={`${props.name}-mat`}
        diffuseColor={hovered ? props.hoveredColor : props.color}
        specularColor={Color3.Black()}
      />
    </box>
  )
}



const SceneWithSpinningBoxes = () => (
  <div>
    <Engine antialias adaptToDeviceRatio canvasId="renderCanvas">
      <Scene>
        <arcRotateCamera
          name="camera1"
          target={Vector3.Zero()}
          alpha={Math.PI / 2}
          beta={Math.PI / 4}
          radius={8}
        />
        <hemisphericLight
          name="light1"
          intensity={0.7}
          direction={Vector3.Up()}
        />
        <SpinningBox
          name="left"
          position={new Vector3(-2, 0, 0)}
          color={Color3.FromHexString('#EEB5EB')}
          hoveredColor={Color3.FromHexString('#C26DBC')}
        />
        <SpinningBox
          name="right"
          position={new Vector3(2, 0, 0)}
          color={Color3.FromHexString('#C8F4F9')}
          hoveredColor={Color3.FromHexString('#3CACAE')}
        />
      </Scene>
    </Engine>
  </div>
)
