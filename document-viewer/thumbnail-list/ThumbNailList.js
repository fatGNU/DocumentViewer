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
        // this.showDocumentThumbnails();
    }


    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        //new documents lists
        // console.log('state changed into ', nextProps.documents);
        //construct new items out of these props
        // console.log(nextProps.documents, nextProps.documents[0] !== undefined);
        if (nextProps.documents[0] !== undefined && nextProps.documents !== null) {
            this.setState({documentsList: nextProps.documents}, () => {
                this.showDocumentThumbnails(nextProps.documents);
            });
        }
    }

    /**
     *
     * Update ThumbNailList component with new documents. use a react reference to update the child in the caller's
     * componentDidUpdate lifecycle method.
     *
     * @param documentsList list of documents to render and create thumbnails.
     *
     */
    showDocumentThumbnails = (documentsList = this.props.documents) => {
        this.thumbnails = [];//nullify existing thumbnails
        for (let t in documentsList) {
            // documentsList[t] is a JSON object consisting of the name, category and
            // content(as base64 string) of the document
            const currentDocument = documentsList[t];//get the filename
            this.thumbnails[t] = <ThumbNail callback={this.thumbnailcallback}
                                            filename={currentDocument.name}
                                            filecontent={currentDocument.content}/>
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