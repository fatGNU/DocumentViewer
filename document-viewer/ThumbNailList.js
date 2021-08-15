import React, {Component} from "react";
import ThumbNail from "./ThumbNail";
import {row, col1, col4, col5, col12} from "../MiscUtils";

/**
 *
 * Thumbnail superclass. Defines how thumbnails look like and operate.
 * {'filename': 'the base64 description of a file'}
 *
 */
class ThumbNailList extends Component {
    constructor(props) {
        super(props);
        this.thumbnails = [];
        this.state = {
            documentsList: null,
            thumbnails: null
        }
        this.thumbnailcallback = props.thumbnailcallback === undefined ? () => {
            //by default, load the document viewer
            console.warn(`<${this.constructor.name} />`)
        } : props.thumbnailcallback;
        // for (let t in this.state.documentsList) {
        //     const documentName = Object.getOwnPropertyNames(this.state.documentsList[t]);//get the filename
        //     this.thumbnails[t] = <ThumbNail callback={this.thumbnailcallback}
        //                                     filename={`${documentName[0]}`}
        //                                     filecontent={`${this.state.documentsList[t][documentName[0]]}`}/>
        // }
    }


    componentWillReceiveProps(nextProps, nextContext) {
        //new documents lists
        this.setState({documentsList: nextProps.documents});
        // console.log('state changed into ', nextProps.documents);
        //construct new items out of these props
        if(nextProps !== null)
            this.showDocumentThumbnails(nextProps.documents);
    }

    /**
     *
     * Update ThumbNailList component with new documents. use a react reference to update the child in the caller's
     * componentDidUpdate lifecycle method.
     *
     * @param documentsList list of documents to render and create thumbnails.
     *
     */
    showDocumentThumbnails = (documentsList = []) => {
        this.thumbnails = [];//nullify existing thumbnails
        for (let t in this.state.documentsList) {
            const documentName = Object.getOwnPropertyNames(this.state.documentsList[t]);//get the filename
            this.thumbnails[t] = <ThumbNail callback={this.thumbnailcallback}
                                            filename={`${documentName[0]}`}
                                            filecontent={`${this.state.documentsList[t][documentName[0]]}`}/>
        }
        this.setState(state => {
            state.documentsList = documentsList;
            state.thumbnails = this.thumbnails;
            return state;
        }, () => {
            // console.log('called within this thumbnail! ', this.state.thumbnails)
        });
    }
}

/**
 *
 * ThumbNailList component for vertical views.
 *
 */
export class VerticalThumbNailList extends ThumbNailList {
    render = () => {
        return (<div className={'thumbnail-vertical-list'} onClick={this.thumbnailcallback}>
            <div className={`${row} file-name-label`} style={{borderBottom: '2px solid '}}>
                <div className={col12}>
                    <div className={row}>
                        <div className={col5}/>
                        <div className={`${col4} title`} style={{width: '80%', bottom: 10}}>Selected - &e2sp;</div>
                        <div className={`${col1} title`}
                             style={{
                                 bottom: 10,
                                 fontStyle: 'italic',
                                 color: '#800080'
                             }}>{this.state.thumbnails === null ? 0 : this.state.thumbnails.length}</div>
                    </div>
                </div>
            </div>
            {this.state.thumbnails}
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
            {this.state.thumbnails}
        </div>);
    }
}