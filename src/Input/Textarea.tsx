import * as classnames from 'classnames'
import debounce = require('lodash/debounce')
import * as React from 'react'
import EventListener from 'react-event-listener'

const ROWS_HEIGHT = 24

export interface Props {
  /**
   * @ignore
   */
  className?: string,
  /**
   * @ignore
   */
  defaultValue?: string|number,
  /**
   * @ignore
   */
  disabled?: boolean,
  /**
   * @ignore
   */
  onChange?: (arg: any) => any,
  /**
   * Number of rows to display when multiline option is set to true.
   */
  rows?: string|number,
  /**
   * Maximum number of rows to display when multiline option is set to true.
   */
  rowsMax?: string|number,
  /**
   * Use that property to pass a ref callback to the native textarea element.
   */
  textareaRef?: (arg: any) => any,
  /**
   * @ignore
   */
  value?: string|number,
}

/**
 * @ignore - internal component.
 */
class Textarea extends React.Component<Props, any> {
  public static defaultProps = {
    rows: 1,
  }
  public shadow = null
  public singlelineShadow = null
  public input = null
  public value: any = null
  public state = {
    height: null,
  }

  public handleResize = debounce((event: any) => {
    this.syncHeightWithShadow(event)
  }, 166)

  public componentWillMount() {
    // <Input> expects the components it renders to respond to 'value'
    // so that it can check whether they are dirty
    this.value = this.props.value || this.props.defaultValue || ''
    this.setState({
      height: Number(this.props.rows) * ROWS_HEIGHT,
    })
  }

  public componentDidMount() {
    this.syncHeightWithShadow(null)
  }

  public componentWillReceiveProps(nextProps: any) {
    if (
      nextProps.value !== this.props.value ||
      Number(nextProps.rowsMax) !== Number(this.props.rowsMax)
    ) {
      this.syncHeightWithShadow(null, nextProps)
    }
  }

  public componentWillUnmount() {
    this.handleResize.cancel()
  }

  public syncHeightWithShadow(event: any, props = this.props) {
    if (this.shadow && this.singlelineShadow) {
      // The component is controlled, we need to update the shallow value.
      if (typeof this.props.value !== 'undefined') {
        (this.shadow as any).value = props.value == null ? '' : String(props.value)
      }

      const lineHeight = (this.singlelineShadow as any).scrollHeight
      let newHeight = (this.shadow as any).scrollHeight

      // Guarding for jsdom, where scrollHeight isn't present.
      // See https://github.com/tmpvar/jsdom/issues/1013
      if (newHeight === undefined) {
        return
      }

      if (Number(props.rowsMax) >= Number(props.rows)) {
        newHeight = Math.min(Number(props.rowsMax) * lineHeight, newHeight)
      }

      newHeight = Math.max(newHeight, lineHeight)

      if (this.state.height !== newHeight) {
        this.setState({
          height: newHeight,
        })
      }
    }
  }

  public handleRefInput = (node: any) => {
    this.input = node
    if (this.props.textareaRef) {
      this.props.textareaRef(node)
    }
  }

  public handleRefSinglelineShadow = (node: any) => {
    this.singlelineShadow = node
  }

  public handleRefShadow = (node: any) => {
    this.shadow = node
  }

  public handleChange = (event: any) => {
    this.value = event.target.value

    if (typeof this.props.value === 'undefined' && this.shadow) {
      // The component is not controlled, we need to update the shallow value.
      (this.shadow as any).value = this.value
      this.syncHeightWithShadow(event)
    }

    if (this.props.onChange) {
      this.props.onChange(event)
    }
  }

  public render() {
    const {
      className,
      defaultValue,
      onChange,
      rows,
      rowsMax,
      textareaRef,
      value,
      ...other,
    } = this.props
    const rowsNumber: any = rows
    const defaultValueStringOrArray: any = defaultValue

    return (
      <div className="Sui_Textarea_root" style={{ height: this.state.height }}>
        <EventListener target="window" onResize={this.handleResize} />
        <textarea
          ref={this.handleRefSinglelineShadow}
          className={classnames('Sui_Textarea_shadow', 'Sui_Textarea_textarea')}
          tabIndex={-1}
          rows={1}
          readOnly
          aria-hidden="true"
          value=""
        />
        <textarea
          ref={this.handleRefShadow}
          className={classnames('Sui_Textarea_shadow', 'Sui_Textarea_textarea')}
          tabIndex={-1}
          rows={rowsNumber}
          aria-hidden="true"
          readOnly
          defaultValue={defaultValueStringOrArray}
          value={value}
        />
        <textarea
          rows={rowsNumber}
          className={classnames('Sui_Textarea_textarea', className)}
          defaultValue={defaultValueStringOrArray}
          value={value}
          onChange={this.handleChange}
          ref={this.handleRefInput}
          {...other}
        />
      </div>
    )
  }
}

export default Textarea
