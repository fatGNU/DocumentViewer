import React, {Component} from "react";
import ThumbNail from "./ThumbNail";
import {row, col1, col4, col5, col12} from "../ColFunction";

/**
 *
 * Thumbnail superclass. Defines how thumbnails look like and operate.
 * {'filename': 'the base64 description of a file'}
 *
 */
class ThumbNailList extends Component {
    constructor(props) {
        super(props);
        this.documents = props.documents === undefined ? [] : props.documents;
        this.thumbnails = [];
        this.thumbnailcallback = props.thumbnailcallback === undefined ? () => {} : props.thumbnailcallback;
        for (let t in this.documents) {
            const documentName = Object.keys(this.documents[t]);//get the filename
            this.thumbnails[t] = <ThumbNail callback = {this.thumbnailcallback}
                                            filename={`${documentName[0]}`}
                                            filecontent={`${this.documents[t][documentName[0]]}`} />
        }
    }
}

/**
 *
 * ThumbNailList component for vertical views.
 *
 */
export class VerticalThumbNailList extends ThumbNailList {
    render = () => {
        return (<div className={'thumbnail-vertical-list'}>
            <div className={`${row} file-name-label`} style = {{borderBottom: '2px solid '}}>
                <div className={col12}>
                    <div className={row}>
                        <div className={col5} />
                        <div className={col4}>Cached Files -  </div>
                        <div className={col1} style = {{fontStyle: 'italic', color: '#800080'}}>{this.thumbnails.length}</div>
                    </div>
                </div>
            </div>
            {this.thumbnails}
        </div>);
    }
}

/**
 * ThumbNailList for horizontal views.
 * Horizontal ThumbNailList does not require a counter attached to it at this time.
 */
export class HorizontalThumbNailList extends ThumbNailList {
    render = () => {
        return (<div className={'thumbnail-horizontal-list'}>
            {this.thumbnails}
        </div>);
    }
}
