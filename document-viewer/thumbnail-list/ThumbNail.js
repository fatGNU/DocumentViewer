import React, {Component} from "react";
import {row, col12} from "./ColFunction";

/**
 *
 * This class defines a thumb nail component.
 *
 */
export default class ThumbNail extends Component {
    constructor(props) {
        super(props);
        this.filecontent = props.filecontent;
        this.filename = props.filename;
        this.fileType = this.filecontent.split(';')[0].split(':')[1];
        this.callback = props.callback === undefined ? () => {
            console.warn('No callback method issued to ThumbNail component')
        } : props.callback;
    }

    render = () => {
        return (<div onClick={() => {this.callback(this.filename)}} className={`${row} thumbnail`}>
            <div className={col12}>
                <div className={row}
                     style={{height: '82%', width: '115%', border: '1px solid'}}>
                    <object type={this.fileType}
                            data={this.filecontent}/>
                </div>
                <div className={row}>
                    <div className={`${col12} file-name-label`}>
                        {this.filename}
                    </div>
                </div>
            </div>
        </div>);
    }
}
