import React, { Component } from "react";

export default class Dialog extends Component {

  constructor() {
    super();
    this.topPositionStart = '-500px';
    this.state = {topPosition: '0px'};
  }

  componentDidUpdate(prevProps) {
    if (this.props.dialogData.visible && !prevProps.dialogData.visible) {
      this.setState({topPosition: this.topPositionStart});
      setTimeout(() => this.setState({topPosition: '0px'}), 100);
    }
  }

  getOpts(optsInput) {
    let opts = optsInput || {};
    return {
      visible: opts.visible || false,
      title: opts.title || "Alert",
      applyText: opts.applyText || "Apply",
      cancelText: opts.cancelText || (opts.applyFun ? "Cancel" : "OK"),
      applyFun: opts.applyFun,
      content: opts.content,
      contentParams: opts.contentParams || {},
      dataUpdatedFun: opts.dataUpdatedFun || (() => {}),
      contentNoPadding: opts.contentNoPadding || false,
      disabled: opts.disabled || false
    };
  }

  close() {
    this.setState({topPosition: this.topPositionStart});
    setTimeout(() => this.props.removeDialogCallback(), 1000);
  }

  render() {
    let opts = this.getOpts(this.props.dialogData),
        modalBodyStyle = {};
    if (opts.contentNoPadding)
      modalBodyStyle['padding'] = '0px';
    return (
      <div className="pageOverlay" style={{display: opts.visible ? 'block' : 'none'}}>
        <div className="modal d-block" style={{top: this.state.topPosition}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{opts.title}</h5>
                <button type="button" className="close" onClick={this.close.bind(this)}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body" style={modalBodyStyle}>
                {opts.content}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={this.close.bind(this)}>{opts.cancelText}</button>
                {opts.applyFun ?
                  <button type="button" className="btn btn-primary" onClick={() => opts.applyFun(this.close.bind(this))}>
                    {opts.applyText}
                  </button>
                  :
                  null
                }
              </div>
              <div className="disabled" style={{display: opts.disabled ? 'block' : 'none'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}