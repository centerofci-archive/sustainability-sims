import { Color4 } from "@babylonjs/core"
import { h } from "preact"

import { Engine, Scene } from "react-babylonjs"



export const AppTwo = () =>
{
    const sceneClearColor = new Color4(0.5, 0.5, 0.5, 0.5)

    return <Engine antialias adaptToDeviceRatio>
        <Scene clearColor={sceneClearColor}>
          <arcRotateCamera name='camera1' radius={7} beta={Math.PI / 4} alpha={Math.PI / 2} target={Vector3.Zero()} minZ={0.001} wheelPrecision={30}
            onViewMatrixChangedObservable={(camera) => {
              let { plane } = this.state

              if (plane) {
                let forwardRay = camera.getForwardRay()
                plane.position = camera.position.clone().add(forwardRay.direction.scale(1.5 / camera.fov /* * forwardRay.length */))
                plane.lookAt(camera.position, 0, Math.PI, Math.PI)
              }
            }}
          />
          <hemisphericLight name='light1' intensity={0.7} direction={Vector3.Up()} />
          {this.state.boxes.map(box => (
            <box key={box.index} size={2} name={box.name} position={box.position}>
              <standardMaterial name={`${box.name}-mat`} diffuseColor={box.color} specularColor={Color3.Black()} />
            </box>
          ))
          }

          {this.state.showModal === true &&
            <plane name='dialog' width={3} height={3 * (dialogHeight / dialogWidth)} onCreated={this.setPlane} rotation={new Vector3(0, Math.PI, 0)}>
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
                        <babylon-button name='close-icon' width='1000px' paddingLeft='950px' height='80px' onPointerDownObservable={this.hideModal.bind(this)}>
                          <textBlock text={'\uf00d'} fontFamily='FontAwesome' fontStyle='bold' fontSize={24} color='black'
                            textHorizontalAlignment={Control.HORIZONTAL_ALIGNMENT_RIGHT}
                            textVerticalAlignment={Control.VERTICAL_ALIGNMENT_CENTER}
                          />
                        </babylon-button>
                      </stackPanel>
                    </rectangle>
                    <rectangle name='body-rectangle' height='200px' thickness={2} color='#EEEEEE'>
                      <stackPanel name='sp-3'>
                        <textBlock name='description' key={`body-${this.state.clickedMeshName}`} text={`You have clicked on '${this.state.clickedMeshName}' .\n....${this.state.boxes.length} remaining...`}
                          color='black' fontSize={28} textWrapping height='100px'
                          textHorizontalAlignment={Control.HORIZONTAL_ALIGNMENT_LEFT}
                          textVerticalAlignment={Control.VERTICAL_ALIGNMENT_TOP}
                          paddingLeft='10px' paddingTop='10px'
                        />
                        {
                          this.state.boxes.map(box => (
                            <textBlock key={`opt--${this.state.clickedMeshName}-${box.name}`} text={'• ' + box.name} color='black' fontSize={28} height={`${90 / this.state.boxes.length}px`}
                              textHorizontalAlignment={Control.HORIZONTAL_ALIGNMENT_LEFT}
                              textVerticalAlignment={Control.VERTICAL_ALIGNMENT_TOP}
                              paddingLeft='20px'
                            />
                          ))
                        }
                      </stackPanel>
                    </rectangle>
                    <stackPanel name='footer-sp' height='80px' paddingTop='10px' paddingBottom='10px' isVertical={false} horizontalAlignment={Control.HORIZONTAL_ALIGNMENT_RIGHT} verticalAlignment={Control.VERTICAL_ALIGNMENT_TOP} >
                      <babylon-button name='cancel-button' background='#6c757d' width='290px' height='60px' cornerRadius={10} onPointerDownObservable={this.hideModal.bind(this)}>
                        <textBlock name='cancel-text' text='Cancel' fontSize={28} fontStyle='bold' color='white' />
                      </babylon-button>
                      <babylon-button name='delete-button' background={this.state.clickedMeshColor} paddingLeft='50px' paddingRight='30px' width='350px' height='60px'
                        cornerRadius={10} onPointerDownObservable={this.deleteSelectedMesh}>
                        <textBlock name='cancel-text' text={`Delete '${this.state.clickedMeshName}'`} fontSize={28} fontStyle='bold' color='white'
                          textVerticalAlignment={Control.VERTICAL_ALIGNMENT_CENTER}
                        />
                      </babylon-button>
                    </stackPanel>
                  </stackPanel>
                </rectangle>
              </advancedDynamicTexture>
            </plane>
          }
          <vrExperienceHelper webVROptions={{ createDeviceOrientationCamera: false }} enableInteractions />
        </Scene>
    </Engine>
}
