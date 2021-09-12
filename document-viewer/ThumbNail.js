import React, {Component} from "react";
import {row, col12, paraphrase} from "../MiscUtils";

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
        return (
            <div className={row}>
                <div className={col12} onClick={() => {
                        this.callback(this.filename)
                    }}>
                    <div className={`${row} thumbnail`}>
                        <div className={col12}>
                            <div className={row}>
                                <object type={this.fileType}
                                        data={this.filecontent}
                                />
                            </div>
                            <div className={row}>
                                <div className={`${col12} file-name-label`}>
                                    {/*paraphrase long names and limit them by default to 15 characters*/}
                                    {paraphrase(this.filename, 15)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>);
    }
}