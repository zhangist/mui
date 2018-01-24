import * as React from 'react'
import { render } from 'react-dom'
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  Drawer,
} from '../src'

class Examples extends React.Component {
  public state = {
    openDialog: false,
    openDialog2: false,
    openDialog3: false,
    openDrawer: false,
    openDrawer2: false,
  }

  public renderSectionButton() {
    return (
      <section>
        <div className="title">
          Button / 按钮
          <sup><a href="#remark-1">1</a></sup>
        </div>
        <div className="subtitle">(a | button)</div>
        <div className="content">
          <Button>Button / 按钮</Button>
        </div>
      </section>
    )
  }

  public renderSectionDialog() {
    const {
      openDialog,
      openDialog2,
      openDialog3,
    } = this.state
    return (
      <section>
        <div className="title">
          Dialog / 模态框
          <sup><a href="#remark-2">2</a></sup>
          <sup>/</sup>
          <sup><a href="#remark-3">3</a></sup>
        </div>
        <div className="subtitle">react-dom/createPortal</div>
        <div className="content">
          <Button onClick={() => this.setState({ openDialog: true })}>Open Dialog / 打开模态框</Button>
          <Button onClick={() => this.setState({ openDialog2: true })}>Open Dialog 2 / 打开模态框2</Button>
          <Button onClick={() => this.setState({ openDialog3: true })}>Open Dialog 3 / 打开模态框3</Button>
          <Dialog open={openDialog} onClose={() => this.setState({openDialog: false})}>
            <DialogContent>
              <div>Dialog</div>
              <br /><br />
              {`<Dialog open={openDialog} onClose={() => this.setState({openDialog: false})}>`}
              {`...`}
              {`</Dialog>`}
              <br /><br />
              End
            </DialogContent>
          </Dialog>
          <Dialog width={600} height="300px" open={openDialog2}>
            <DialogHeader>
              <Button onClick={() => this.setState({ openDialog2: false })}>Close / 关闭</Button>
            </DialogHeader>
            <DialogContent style={{ padding: '0 16px 16px 16px'}}>
              <div>Dialog 2</div>
              <br /><br />
              {`<Dialog width={600} height="300px" open={openDialog2}>`}
              {`...`}
              {`</Dialog>`}
              <br /><br /><br /><br /><br /><br /><br /><br />
              <br /><br /><br /><br /><br /><br /><br /><br />
              End
            </DialogContent>
            <DialogFooter>Footer</DialogFooter>
          </Dialog>
          <Dialog fullHeight open={openDialog3}>
            <DialogHeader>
              <Button onClick={() => this.setState({ openDialog3: false })}>Close / 关闭</Button>
            </DialogHeader>
            <DialogContent>
              <div>Dialog 3</div>
              <br /><br />
              {`<Dialog fullHeight open={openDialog3}>`}
              {`...`}
              {`</Dialog>`}
              <br /><br />
              End
            </DialogContent>
          </Dialog>
        </div>
      </section>
    )
  }

  public renderSectionDrawer() {
    return (
      <section>
        <div className="title">
          Drawer / 抽屉
        </div>
        <div className="content" style={{height: '200px'}}>
          <div style={{width: '100%', height: '100%', overflow: 'hidden', display: 'flex', position: 'relative'}}>
            <Drawer
              type="persistent"
              anchor="left"
              open={this.state.openDrawer}
              onClose={() => this.setState({openDrawer: false})}
              rootStyle={{height: '100%', position: 'relative'}}
            >
              <Button onClick={() => this.setState({openDrawer: false})}>Close Drawer / 关闭抽屉</Button>
              <div style={{width: '200px'}}>Drawer</div>
            </Drawer>
            <Drawer
              type="temporary"
              anchor="right"
              open={this.state.openDrawer2}
              onClose={() => this.setState({openDrawer2: false})}
            >
              <div style={{width: '200px'}}>Drawer</div>
            </Drawer>
            <div style={{
              height: '100%',
              backgroundColor: '#ccc',
              flex: '1 1 auto',
              transition: 'margin 200ms',
              marginLeft: this.state.openDrawer ? '0px' : '-200px',
            }}>
              <Button
                onClick={() => this.setState({openDrawer: true})}
                disabled={this.state.openDrawer}
              >
                Open Drawer / 打开抽屉
              </Button>
              <Button onClick={() => this.setState({openDrawer2: true})}>Open Drawer2 / 打开抽屉2</Button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  public render() {

    return (
      <div className="page">
        <header>
          <div className="logo">Shulive-UI</div>
        </header>
        <div className="title">Examples / 实例</div>
        {this.renderSectionButton()}
        {this.renderSectionDialog()}
        {this.renderSectionDrawer()}
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
