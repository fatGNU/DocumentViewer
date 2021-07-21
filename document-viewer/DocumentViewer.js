import React, {Component} from "react";
import './document-viewer-style.css';
import {container, row, col1, col3, col4, col9, col10, col11, col12} from "../ColFunction";
import CloseControl from "../controls/svg-controls/CloseControl";
import RemoveControl from "../controls/svg-controls/RemoveControl";
import FowardControl from "../controls/svg-controls/FowardControl";
import TextField from "../input-field/TextField";
import FileSelectFieldIcon from "../input-field/FileSelectFieldIcon";
import DataContainerProvider from "../DataProvider";
import {VerticalThumbNailList} from "./ThumbNailList";


/**
 *
 * Document viewer component provides a facility to view documents passed
 * to it through the 'documents' property.
 *
 * Properties in use:
 *  - documents {an array of arrays consisting of document names and base64 strings or paths}
 *  - withCurtain {a reference attribute whose presence determines whether the document viewer
 *  is drawn on a z-indexed div above all fields, or it inherits it's current caller's parent
 *  position. This is a-kin-to boolean true or false (only that it's implied).}
 *
 * The documents property has a structure like the one that follows:
 *  [[document_name:base64_document_string],...]
 *
 * In this component, the state will be heavily used to depict or host components
 * being shown to the user but for a short duration.
 */
export default class DocumentViewer extends DataContainerProvider {
    constructor(props) {
        super(props);
        /*
        * This is the index whose document is currently being viewed
         */
        this.currentDocumentIndex = 0;
        /*
        * makes sure that the document viewer has
         */
        this.withCurtain = props.withcurtain === undefined;
        this.closecallback = props.closeCallback;
        this.uploadcallback = props.uploadcallback;//called by 'next' icon
        this.documents = [];
        if (props.documents === undefined)
            throw new ReferenceError(`The document viewer cannot list 0 documents. Use the 'documents' property to pass
            a array of JSON objects containing '{filename: document_blob_or_image_path_or_base64_string}'`)
        else this.documents = props.documents;
        /*
        * Hosts a list of documents that are currently known to this document
        * viewer.
         */
        //when a document list is passed, create thumbnails to represent these thumbnails of documents
        this.state = {
            documentsList: this.documents,
            renameTool: null,
            currentFileName: null,
            currentFile: null,
            fileType: null
        }
    }


    /**
     *
     * @deprecated overriden by drawDocumentInViewer
     * sets the file-viewer with the filename of the currently viewed file
     * @param filename filename in question
     *
     */
    setTitleBarWithFileName = (filename) => {
        this.setState(state => {
            state.currentFileName = filename;
            return state;
        })
    }
    /**
     * Removes the renameTool toolitem that shows ontop of the viewer.
     * This is done either through a command to effect the rename, the pressing
     * of the escape key, or clicking the close buttons.
     */
    removeRenameTool = () => {
        if (this.state.renameTool != null)
            this.setState(state => {
                state.renameTool = null;
                return state;
            });
    }
    /**
     *
     * remove current file from list of document list.
     *
     */
    removeCurrentFile = () => {
        this.setState(state => {
            state.currentFile = null;
            return state;
        })
    }
    /**
     *
     * Draw document in the document viewer.
     * @param documentName the document name to be reflected
     * in the title-bar
     *
     */
    drawDocumentInViewer = (documentName = String()) => {
        let currentFile;
        let currentFileType;
        let currentFileName;
        for (const doc of this.state.documentsList) {
            const currentKey = Object.keys(doc)[0];
            if (currentKey === documentName) {
                currentFile = doc[currentKey];
                currentFileName = currentKey;
                currentFileType = currentKey.split(';')[0].split(':')[1];
                break;
            }
        }
        this.setState(state => {
            state.currentFile = currentFile;
            state.currentFileName = currentFileName;
            state.fileType = currentFileType;
            return state;
        });
    }

    /**
     * Method updates the state of the current tool that's being viewed
     */
    showRenameTool = () => {
        //window event listener for escape

        this.renameTool = (<div className={`${row} rename-tool`}>
            <div className={col12}>
                <div className={`${row} rename-title`}>
                    Rename current file...
                </div>
                <div className={`${row}`}>
                    <div className={`${col12} rename-input-field-space`}>
                        <TextField name={'file_rename'} onChange={this.rename} placeholder={'New File Name'} focus/>
                    </div>
                </div>
                <div className={row}>
                    <div className={col4}/>
                    <div className={col4}>
                        <button onClick={this.rename} className={'btn btn-primary'}>rename</button>
                    </div>
                </div>
            </div>
        </div>);
        this.setState(state => {
            state.renameTool = this.renameTool;
            return state;
        });
    }
    /**
     * Provides a renaming operation when a document is double-clicked on the viewer
     * area.
     *
     * @param document_index the array index that this document has been viewed from.
     * @returns {boolean} whether the document has been renamed from its old name
     * to the new name
     */
    rename = (document_index = Number | this.currentDocumentIndex) => {
        let is_renamed = false;
        if (is_renamed)
            is_renamed = true;
        return is_renamed;
    }

    render = () => {
        return (
            <div className={`${container} curtain`}>
                <div className={`${row} row`}>
                    <div className={`${col11} title-text`}>
                        {this.state.currentFileName}
                    </div>
                    <div className={col1}>
                        <CloseControl callback={this.closecallback}/>
                    </div>
                </div>
                <div className={'row'}>
                    <div className={col12}>
                        <div className={'row'}>
                            <div className={col12}/>
                        </div>
                        <div className={row}>
                            <div className={col12}>
                                <div className={row}>
                                    <div className={col3}>
                                        <div className={'thumbnail-list'}>
                                            {/*list of files here*/}
                                            <VerticalThumbNailList thumbnailcallback={this.drawDocumentInViewer}
                                                                   documents={this.state.documentsList}
                                            />
                                        </div>
                                    </div>
                                    <div className={col9}>
                                        {/*onClick={this.removeRenameTool}*/}
                                        <div className={'file-viewer'} onDoubleClick={this.showRenameTool
                                        }>
                                            {this.state.renameTool}
                                            {/*actual file content*/}
                                            <object type={this.state.fileType} data={this.state.currentFile}
                                                    width={900} height={740} />
                                            <div className={`${row} control-bar`}>
                                                <div className={col9}>
                                                    {/*this is a spacer div*/}
                                                </div>
                                                <div className={`${col1} viewer-tools`}>
                                                    <FileSelectFieldIcon callback={this.uploadcallback}
                                                                         name={'file_uploads'} placeholder={''}/>
                                                </div>
                                                <div className={`${col1} viewer-tools`}>
                                                    <RemoveControl callback={() => {
                                                        console.log('remove content')
                                                    }}/>
                                                </div>
                                            </div>
                                            <div className={`${row} control-bar`} style={{marginTop: 600}}>
                                                <div className={col10}>
                                                    {/*this is a spacer div*/}
                                                </div>
                                                <div className={`${col1} viewer-tools`}>
                                                    <FowardControl callback={this.updateFormDataFromSelectTool}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={'row'}/>
            </div>
        );
    }
}