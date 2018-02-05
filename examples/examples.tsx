import * as React from 'react'
import { render } from 'react-dom'
import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  Drawer,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  LinearProgress,
  Menu,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
} from '../src'

class Examples extends React.Component {
  public state = {
    openDialog: false,
    openDialog2: false,
    openDialog3: false,
    openDrawer: false,
    openDrawer2: false,
    textFieldValue: '',
    textFieldValue2: '',
    textFieldValue3: '',
    textFieldValue4: 'value1',
    textFieldValue5: 'value1',
    anchorElMenu: null,
    radioGroup: 'left',
  }

  public handleChange = (name: string) => (event: any) => {
    this.setState({
      [name]: event.target.value,
    })
  }

  public renderSectionButton() {
    return (
      <section id="Button">
        <div className="title">
          Button / 按钮
          <sup><a href="#remark-1">1</a></sup>
        </div>
        <div className="subtitle">(a | button)</div>
        <div className="content">
          <Button raised fullWidth>Button / 按钮</Button>
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
      <section id="Dialog">
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
            <DialogContent>
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
      <section id="Drawer">
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
              <Button
                onClick={() => this.setState({openDrawer: false})}
                disabled={!this.state.openDrawer}
              >
                Close Drawer / 关闭抽屉
              </Button>
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

  public renderSectionInput() {
    return (
      <section id="TextField">
        <div className="title">
          TextField / 输入框
        </div>
        <div className="content">
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <TextField
              className="margin-left-8 margin-right-8"
              helperText="&nbsp;"
              label="&nbsp;"
              type="date"
              value={this.state.textFieldValue}
              onChange={this.handleChange('textFieldValue')}
              margin="normal"
            />
            <TextField
              className="margin-left-unit margin-right-unit"
              helperText="Some important text"
              label="Helper text"
              type="text"
              value={this.state.textFieldValue2}
              onChange={this.handleChange('textFieldValue2')}
              placeholder="PlaceHolder"
              margin="normal"
            />
            <TextField
              className="margin-left-unit margin-right-unit"
              helperText="&nbsp;"
              label="&nbsp;"
              type="number"
              value={this.state.textFieldValue3}
              onChange={this.handleChange('textFieldValue3')}
              margin="normal"
            />
            <TextField
              className="margin-left-unit margin-right-unit"
              id="select-currency"
              select
              label="Select"
              value={this.state.textFieldValue4}
              onChange={this.handleChange('textFieldValue4')}
              helperText="Please select your currency"
              margin="normal"
            >
              {[{value: 'value1', label: 'label'}].map((option: any) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              className="margin-left-unit margin-right-unit"
              id="select-currency-native"
              select
              label="Native select"
              value={this.state.textFieldValue5}
              onChange={this.handleChange('textFieldValue5')}
              SelectProps={{
                native: true,
              }}
              helperText="Please select your currency"
              margin="normal"
            >
              {[{value: 'value1', label: 'label'}].map((option: any) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </div>
          <div className="margin-unit">
            <span>TextField: {this.state.textFieldValue}</span>
          </div>
        </div>
      </section>
    )
  }

  public renderSectionMenu() {
    return (
      <section id="Menu">
        <div className="title">
          Menu / 菜单
        </div>
        <div className="content">
          <Button
            aria-owns={this.state.anchorElMenu ? 'simple-menu' : null}
            onClick={(event) => this.setState({anchorElMenu: event.currentTarget})}
          >Open Menu / 打开菜单</Button>
          <Menu
            id="simple-menu"
            anchorEl={this.state.anchorElMenu}
            open={Boolean(this.state.anchorElMenu)}
            onClose={() => this.setState({anchorElMenu: null})}
          >
            <MenuItem onClick={() => this.setState({anchorElMenu: null})}>Profile</MenuItem>
            <MenuItem onClick={() => this.setState({anchorElMenu: null})}>My account</MenuItem>
            <MenuItem onClick={() => this.setState({anchorElMenu: null})}>Logout</MenuItem>
          </Menu>
        </div>
      </section>
    )
  }

  public renderSectionProgress() {
    return (
      <section id="Progress">
        <div className="title">
          Progress / 进度
        </div>
        <div className="content">
          <CircularProgress />
          <CircularProgress color="secondary" size={32} thickness={5} />
          <br />
          <LinearProgress rootStyle={{marginTop: '30px'}} />
          <LinearProgress color="secondary" rootStyle={{marginTop: '30px'}} />
        </div>
      </section>
    )
  }

  public renderSectionRadio() {
    return (
      <section id="Radio">
        <div className="title">
          Radio / 单选
        </div>
        <div className="content">
          <Grid container>
            <Grid item xs={12} sm={6}>
              <FormControl component="fieldset">
                <FormLabel component="legend">anchorReference</FormLabel>
                <RadioGroup
                  value={this.state.radioGroup}
                  onChange={this.handleChange('radioGroup')}
                >
                  <FormControlLabel value="left" control={<Radio />} label="Left" />
                  <FormControlLabel value="right" control={<Radio />} label="Right" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl component="fieldset">
                <FormLabel component="legend">anchorReference</FormLabel>
                <RadioGroup
                  value={this.state.radioGroup}
                  onChange={this.handleChange('radioGroup')}
                >
                  <FormControlLabel value="left" control={<Radio />} label="Left" />
                  <FormControlLabel value="right" control={<Radio />} label="Right" />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        </div>
      </section>
    )
  }

  public render() {
    return (
      <div className="page">
        <header>
          <div className="logo">
            <img src="./logo.svg" style={{width: '128px', verticalAlign: 'top'}} />
            <br />
            <span>Shulive-UI</span>
          </div>
        </header>
        <div className="title">Examples / 实例</div>
        {this.renderSectionButton()}
        {this.renderSectionDialog()}
        {this.renderSectionDrawer()}
        {this.renderSectionInput()}
        {this.renderSectionMenu()}
        {this.renderSectionProgress()}
        {this.renderSectionRadio()}
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
