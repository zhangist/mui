import * as React from 'react'
import { render } from 'react-dom'
import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '../src'

class Examples extends React.Component {
  public state = {
    openModal: false,
    openModal2: false,
    openModal3: false,
  }

  public render() {
    const {
      openModal,
      openModal2,
      openModal3,
    } = this.state

    return (
      <div className="page">
        <header>
          <div className="logo">Shulive-UI</div>
        </header>
        <div className="title">Examples / 实例</div>
        <section>
          <div className="title">
            Button / 按钮
            <sup><a href="#remark-1">1</a></sup>
          </div>
          <div className="subtitle">('a'|'button')</div>
          <div className="content">
            <Button>Button</Button>
            <Button>按钮</Button>
            <Button>Button 按钮</Button>
          </div>
        </section>
        <section>
          <div className="title">
            Modal / 模态框
            <sup><a href="#remark-2">2</a></sup>
            <sup>/</sup>
            <sup><a href="#remark-3">3</a></sup>
          </div>
          <div className="subtitle">react-dom/createPortal</div>
          <div className="content">
            <Button onClick={() => this.setState({ openModal: true })}>Open Modal / 打开模态框</Button>
            <Button onClick={() => this.setState({ openModal2: true })}>Open Modal 2 / 打开模态框2</Button>
            <Button onClick={() => this.setState({ openModal3: true })}>Open Modal 3 / 打开模态框3</Button>
            <Modal open={openModal}>
              <ModalHeader>
                <Button onClick={() => this.setState({ openModal: false })}>Close / 关闭</Button>
              </ModalHeader>
              <ModalContent>
                <div>Modal</div>
                <br /><br />
                {`<Modal open={openModal}>`}
                {`...`}
                {`</Modal>`}
              </ModalContent>
            </Modal>
            <Modal width={600} height="300px" open={openModal2}>
              <ModalHeader>
                <Button onClick={() => this.setState({ openModal2: false })}>Close / 关闭</Button>
              </ModalHeader>
              <ModalContent>
                <div>Modal 2</div>
                <br /><br />
                {`<Modal width={600} height="300px" open={openModal2}>`}
                {`...`}
                {`</Modal>`}
                <br /><br /><br /><br /><br /><br /><br />
                End
              </ModalContent>
              <ModalFooter>Footer</ModalFooter>
            </Modal>
            <Modal fullHeight open={openModal3}>
              <ModalHeader>
                <Button onClick={() => this.setState({ openModal3: false })}>Close / 关闭</Button>
              </ModalHeader>
              <ModalContent>
                <div>Modal 3</div>
                <br /><br />
                {`<Modal fullHeight open={openModal3}>`}
                {`...`}
                {`</Modal>`}
              </ModalContent>
            </Modal>
          </div>
        </section>
        <br /><br /><br /><br /><br /><br /><br />
        <div className="remark">
          Remarks / 备注
        </div>
        <div className="remark" id="remark-1">
          1. The idea of ripple is from Material-UI. / 涟漪特效借鉴自 Material-UI。
          The idea of ripple is from Material-UI. / 涟漪特效借鉴自 Material-UI。
          The idea of ripple is from Material-UI. / 涟漪特效借鉴自 Material-UI。
        </div>
        <div className="remark" id="remark-2">
          2. The idea of ripple is from Material-UI. / 涟漪特效借鉴自 Material-UI。
        </div>
        <div className="remark" id="remark-3">
          3. The idea of ripple is from Material-UI. / 涟漪特效借鉴自 Material-UI。
        </div>
      </div>
    )
  }
}

render(
  <Examples />,
  document.getElementById('root'),
)
