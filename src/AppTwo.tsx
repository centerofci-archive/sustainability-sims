import { ArcRotateCamera, Color3, Color4, Mesh, Texture, TransformNode, Vector3 } from "@babylonjs/core"
import { Control } from "@babylonjs/gui"
import React from "react"
// import { useMemo, useState } from "preact/hooks"

import { BabylonNode, Engine, FiberMeshProps, FiberPlanePropsCtor, Scene } from "react-babylonjs"




export const AppTwo = () =>
{
    const sceneClearColor = new Color4(0.5, 0.5, 0.5, 0.5)

    // const [plane_, set_plane] = useState<undefined | (FiberMeshProps & FiberPlanePropsCtor & BabylonNode<Mesh> & TransformNode)>(undefined)
    // const [show_modal, set_show_modal] = useState(false)
    // const boxes: { index: number, name: string, position: Vector3, color: Color4 }[] = [
    //   {index: 1, name: "Red", position: Vector3.Zero(), color: new Color4(255, 0, 0, 1)}
    // ]
    // const [clickedMeshName, set_clickedMeshName] = useState("")
    // const [clickedMeshColor, set_clickedMeshColor] = useState<Color4>()

    // const dialogHeight = 600
    // const dialogWidth = 900


    // const deleteSelectedMesh = useMemo(() =>
    // {
    //   return () => {}
    // }, [])


    return <Engine antialias adaptToDeviceRatio>
        <Scene clearColor={sceneClearColor}>
          <arcRotateCamera name='camera1' radius={7} beta={Math.PI / 4} alpha={Math.PI / 2} target={Vector3.Zero()} minZ={0.001} wheelPrecision={30}
            onViewMatrixChangedObservable={(camera: ArcRotateCamera) => {

              // if (plane_) {
              //   let forwardRay = camera.getForwardRay()
              //   plane_.position = camera.position.clone().add(forwardRay.direction.scale(1.5 / camera.fov /** forwardRay.length */))
              //   plane_.lookAt(camera.position, 0, Math.PI, Math.PI)
              // }
            }}
          />
          <hemisphericLight name='light1' intensity={0.7} direction={Vector3.Up()} />
          <box key={1} size={2} name={"hello"} position={Vector3.Zero()}>
              <standardMaterial name={`${"hello"}-mat`} specularColor={Color3.Black()} />
          </box>


          {/* {boxes.map(box => (
            <box key={box.index} size={2} name={box.name} position={box.position}>
              <standardMaterial name={`${box.name}-mat`} diffuseColor={box.color} specularColor={Color3.Black()} />
            </box>
          ))
          }

          {show_modal === true &&
            <plane name='dialog' width={3} height={3 * (dialogHeight / dialogWidth)} onCreated={set_plane} rotation={new Vector3(0, Math.PI, 0)}>
              <advancedDynamicTexture
                name='dialogTexture'
                height={1024} width={1024}
                createForParentMesh
                generateMipMaps={true}
                samplingMode={Texture.TRILINEAR_SAMPLINGMODE}
              >
                <rectangle name='rect-1' background='white' color='#666666' height={dialogHeight / dialogWidth} width={1}
                  scaleY={dialogWidth} scaleX={1} thickness={2} cornerRadius={12} >
                  <stackPanel name='sp-1'>
                    <rectangle name='header-rectangle' height='70px'
                      verticalAlignment={Control.HORIZONTAL_ALIGNMENT_CENTER}
                      horizontalAlignment={Control.HORIZONTAL_ALIGNMENT_LEFT}
                    >
                      <stackPanel name='header-stack-panel' isVertical={false} width='100%'>
                        <textBlock name='selection-made' text='Selection Made' color='black' fontSize={28} fontStyle='bold' paddingLeft='20px'
                          textHorizontalAlignment={Control.HORIZONTAL_ALIGNMENT_LEFT}
                          textVerticalAlignment={Control.VERTICAL_ALIGNMENT_CENTER}
                        />
                        <babylon-button name='close-icon' width='1000px' paddingLeft='950px' height='80px' onPointerDownObservable={() => set_show_modal(false)}>
                          <textBlock text={'\uf00d'} fontFamily='FontAwesome' fontStyle='bold' fontSize={24} color='black'
                            textHorizontalAlignment={Control.HORIZONTAL_ALIGNMENT_RIGHT}
                            textVerticalAlignment={Control.VERTICAL_ALIGNMENT_CENTER}
                          />
                        </babylon-button>
                      </stackPanel>
                    </rectangle>
                    <rectangle name='body-rectangle' height='200px' thickness={2} color='#EEEEEE'>
                      <stackPanel name='sp-3'>
                        <textBlock name='description' key={`body-${clickedMeshName}`} text={`You have clicked on '${clickedMeshName}' .\n....${boxes.length} remaining...`}
                          color='black' fontSize={28} textWrapping height='100px'
                          textHorizontalAlignment={Control.HORIZONTAL_ALIGNMENT_LEFT}
                          textVerticalAlignment={Control.VERTICAL_ALIGNMENT_TOP}
                          paddingLeft='10px' paddingTop='10px'
                        />
                        {
                          boxes.map(box => (
                            <textBlock key={`opt--${clickedMeshName}-${box.name}`} text={'• ' + box.name} color='black' fontSize={28} height={`${90 / boxes.length}px`}
                              textHorizontalAlignment={Control.HORIZONTAL_ALIGNMENT_LEFT}
                              textVerticalAlignment={Control.VERTICAL_ALIGNMENT_TOP}
                              paddingLeft='20px'
                            />
                          ))
                        }
                      </stackPanel>
                    </rectangle>
                    <stackPanel name='footer-sp' height='80px' paddingTop='10px' paddingBottom='10px' isVertical={false} horizontalAlignment={Control.HORIZONTAL_ALIGNMENT_RIGHT} verticalAlignment={Control.VERTICAL_ALIGNMENT_TOP} >
                      <babylon-button name='cancel-button' background='#6c757d' width='290px' height='60px' cornerRadius={10} onPointerDownObservable={() => set_show_modal(false)}>
                        <textBlock name='cancel-text' text='Cancel' fontSize={28} fontStyle='bold' color='white' />
                      </babylon-button>
                      <babylon-button name='delete-button' background={clickedMeshColor} paddingLeft='50px' paddingRight='30px' width='350px' height='60px'
                        cornerRadius={10} onPointerDownObservable={deleteSelectedMesh}>
                        <textBlock name='cancel-text' text={`Delete '${clickedMeshName}'`} fontSize={28} fontStyle='bold' color='white'
                          textVerticalAlignment={Control.VERTICAL_ALIGNMENT_CENTER}
                        />
                      </babylon-button>
                    </stackPanel>
                  </stackPanel>
                </rectangle>
              </advancedDynamicTexture>
            </plane>
          } */}
        </Scene>
    </Engine>
}
