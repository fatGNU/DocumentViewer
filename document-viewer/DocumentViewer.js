import React, {Component} from "react";
import "./document-viewer-style.css";
import {
    container,
    row,
    col1,
    col3,
    col4,
    col9,
    col10,
    col11,
    col12, col6, col2,
} from "../MiscUtils";
import CloseControl from "../controls/svg-controls/CloseControl";
import RemoveControl from "../controls/svg-controls/RemoveControl";
import FowardControl from "../controls/svg-controls/FowardControl";
import TextField from "../input-field/TextField";
import FileSelectFieldIcon from "../input-field/FileSelectFieldIcon";
// import DataContainerProvider from "../DataContainer";
import {VerticalThumbNailList} from "./ThumbNailList";
import SelectField from "../input-field/SelectField";

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
export default class DocumentViewer extends Component {
    constructor(props) {
        super(props);
        /*
         * This is the index whose document is currently being viewed
         */
        this.thumbNailRef = React.createRef();// for rerendering ThumbNailList component
        this.categoriesRef = React.createRef();// for resetting the categories selector
        this.currentDocumentIndex = 0;
        /*
         * makes sure that the document viewer has
         */
        this.withCurtain = props.withcurtain === undefined;
        this.closecallback = props.callback;
        this.uploadcallback = props.uploadcallback; //called by 'next' icon
        /**
         * This is used to label the kind of document that's being uploaded.
         * Its specific to a given company's or organization's structure of documents
         * @type {null|string[]|string}
         */
        this.docoptions = props.categories === undefined ? null : props.categories;
        this.docCategory = '';
        /*end docoptions*/
        this.documents = [];
        if (props.documents === undefined)
            console.warn(`The document viewer cannot list 0 documents. Use the 'documents' property to pass
            a array of JSON objects containing '{filename: document_blob_or_image_path_or_base64_string}'`);
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
            fileType: null,
        };
    }

    /**
     *
     * read file contents into a base64 string
     * @param _file the file object to read as base64
     * @param callback a callback method to execute when read is complete
     * @returns {string} the file in form of a base64 string
     *  that the file contents are translated to.

     */
    readToBase64 = (_file = File | Blob, callback = undefined) => {
        if (callback === undefined) {
            throw new ReferenceError(`readToBase64 method requires a callback as a second argument.
            This is because this method's file-read activity is asynchronous and does not do well with returning
            its output. Pass a method reference(--without-arguments--) which will execute when
            the internal file-read-operation is complete.`);
        }
        let fR;
        if (_file instanceof File || _file instanceof Blob) {
            fR = new FileReader();
            let fileString;
            fR.readAsDataURL(_file);
            fR.onload = (e) => {
                fileString = e.target.result;
                if (callback !== undefined) {
                    callback(fileString);
                }
                // return fileString;
            };
        } else
            throw new TypeError(`readToBase64 method expected a file object. Found ${typeof _file}`);
    }


    /**
     *
     * re-render the VerticalThumbNailList
     * @param prevProps
     * @param prevState
     * @param snapshot
     *
     */

    componentDidUpdate(prevProps, prevState, snapshot) {
        // console.log('componentDidUpdate documentviewer')
        this.thumbNailRef.current.showDocumentThumbnails(this.state.documentsList);
        //update documentsList in state
    }

    /**
     *
     * @deprecated overriden by drawDocumentInViewer
     * sets the file-viewer with the filename of the currently viewed file
     * @param filename filename in question
     *
     */
    setTitleBarWithFileName = (filename) => {
        this.setState((state) => {
            state.currentFileName = filename;
            return state;
        });
    };
    /**
     * Removes the renameTool toolitem that shows ontop of the viewer.
     * This is done either through a command to effect the rename, the pressing
     * of the escape key, or clicking the close buttons.
     */
    removeRenameTool = () => {
        if (this.state.renameTool != null)
            this.setState((state) => {
                state.renameTool = null;
                return state;
            });
    };
    /**
     *
     * remove current file/document from list of document list.
     *
     */
    removeCurrentDocument = () => {
        let revisedDocuments = [];
        //iterate through the current state na get the document with the current filename
        for (const document of this.state.documentsList) {
            // documents list contains name, content and category. iterate and ask whether the current
            // document has this name.
            if (document.name !== this.state.currentFileName)
                revisedDocuments.push(document);
            // else break off
        }
        // nullify current state of documentsList then rewrite it with updated
        // documentsList, and select first document in the updated list.
        this.setState({documentsList: null}, () => {
            if (revisedDocuments.length > 0)
                this.setState({
                    documentsList: revisedDocuments,
                    currentFile: revisedDocuments[0].content,
                    currentFileName: revisedDocuments[0].name
                });
        });
    };

    /**
     *
     * Populates the selected file into a list of documents
     *
     * @param base64FileString string
     */
    populateFile = (base64FileString) => {
        // pick the first item in the files selected
        let fileObject = {};
        // fileObject = Object.defineProperty(fileObject, this.state.documentsList.length + 1, {
        //     value: {name: this.state.currentFileName, content: base64FileString, category: this.docCategory},
        //     writable: true
        // });//read writeable
        // console.log(fileObject)
        // Object.defineProperty is not working for large objects. delete it for now...
        fileObject = {name: this.state.currentFileName, content: base64FileString, category: this.docCategory};
        this.setState(state => {
            if (!state.documentsList.includes(fileObject)) {
                state.documentsList.push(fileObject);
                state.currentFile = base64FileString;
            }

            return state;
        });
        // reset the categories of document selector to the default '--select-item--'
        if (this.docCategory !== null)
            this.categoriesRef.current.selectedIndex = 0;
    }

    /**
     *
     * Draw document in the document viewer.
     * @param documentName the document name to be reflected
     * in the title-bar
     *
     */
    drawDocumentInViewer = (documentName = String()) => {
        let cFile;
        let cFileType;
        let cFileName;
        for (const doc of this.state.documentsList) {
            console.log(doc.name, documentName);
            //get the name and content in current viewer
            if (doc.name === documentName) {
                cFile = doc.content;
                cFileName = doc.name;
                cFileType = doc.content.split(';')[0].split(':')[1];
                // set state and abort
                this.setState({
                    currentFile: cFile,
                    currentFileType: cFileType,
                    currentFileName: cFileName
                }, () => {
                    console.log(this.state.currentFile, this.state.currentFileName, this.state.currentFileType)
                });
                break;
            }
        }
        //update state with new items

    };

    /**
     * Method updates the state of the current tool that's being viewed
     */
    showRenameTool = () => {
        //window event listener for escape
        this.renameTool = (
            <div className={`${row} rename-tool`}>
                <div className={col12}>
                    <div className={`${row} rename-title`}>Rename current file...</div>
                    <div className={`${row}`}>
                        <div className={`${col12} rename-input-field-space`}>
                            <TextField
                                name={"file_rename"}
                                onChange={this.rename}
                                placeholder={"New File Name"}
                                focus
                            />
                        </div>
                    </div>
                    <div className={row}>
                        <div className={col4}/>
                        <div className={col4}>
                            <button onClick={this.rename} className={"btn btn-primary"}>
                                rename
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
        this.setState((state) => {
            state.renameTool = this.renameTool;
            return state;
        });
    };
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
        if (is_renamed) is_renamed = true;
        return is_renamed;
    };

    render = () => {
        return (
            <div className={`${container} curtain`}>
                <div className={`${row}`} style={{background: '#FFFFFF'}}>
                    <div className={`${col11} title-text`}>
                        {this.state.currentFileName}
                    </div>
                    <div className={col1}>
                        <CloseControl callback={this.closecallback}/>
                    </div>
                </div>
                <div className={`${row}`}>
                    <div className={col12}>
                        <div className={`${row}`}>
                            <div className={col12}/>
                        </div>
                        <div className={row}>
                            <div className={col2}>
                                <div>
                                    <VerticalThumbNailList
                                        ref={this.thumbNailRef}
                                        thumbnailcallback={this.drawDocumentInViewer}
                                        documents={this.state.documentsList}
                                    />
                                </div>
                            </div>
                            <div className={col9}>
                                <div
                                    className={'file-viewer'}
                                    onDoubleClick={this.showRenameTool}
                                >
                                    {this.state.renameTool}
                                    <object
                                        type={this.state.fileType}
                                        data={this.state.currentFile}
                                        width={900}
                                        height={740}
                                    />
                                    <div className={'control-bar'}>
                                        <div className={`${col3} viewer-tools`}>
                                            {this.docoptions !== null ? this.docoptions :
                                                <SelectField ref={this.categoriesRef}
                                                             options={this.docoptions}
                                                             placeholder={'category of document'}
                                                             changecallback={(e) => {
                                                                 this.docCategory = e.target.selectedIndex;
                                                             }}
                                                             name={'doc_upload_category'}/>
                                            }
                                        </div>
                                        <div className={`${col1} viewer-tools`}>
                                            <FileSelectFieldIcon
                                                changecallback={(e) => {
                                                    //pre-record the name of the selected file
                                                    this.setState(state => {
                                                        state.currentFileName = e.target.files[0].name;
                                                        return state;
                                                    });
                                                    //proceed to read the file contents into a base64 entity
                                                    this.readToBase64(e.target.files[0], this.populateFile);
                                                }}
                                                name={"file_uploads"}
                                                placeholder={""}
                                            />
                                        </div>
                                        <div className={`${col1} viewer-tools`}>
                                            <RemoveControl
                                                callback={() => {
                                                    // go through the state and remove the document in the current
                                                    // document name
                                                    this.removeCurrentDocument()
                                                }}
                                            />
                                        </div>
                                        <div className={`${col1} viewer-tools`}>
                                            <FowardControl
                                                callback={() => {
                                                    if (this.state.documentsList !== null) {
                                                        this.uploadcallback(this.state.documentsList);
                                                    }
                                                    this.closecallback();//scrub it from view
                                                }}
                                            />
                                        </div>
                                    </div>
                                    {/*<div className={`${row} control-bar`}>*/}
                                    {/*    */}
                                    {/*</div>*/}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`${row}`}/>
            </div>
        );
    };
}
