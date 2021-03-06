import { NavigationButton } from 'tns-core-modules/ui/action-bar/action-bar';
import { EventData, Frame, View } from 'tns-core-modules/ui/frame/frame';
import { alert, login, prompt } from 'nativescript-material-dialogs';
import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';
import * as http from 'tns-core-modules/http';
import { isAndroid, isIOS } from 'tns-core-modules/platform';
const builder = require('ui/builder');

function getObjectClass(obj) {
    if (typeof obj !== 'object' || obj === null) return false;
    else return /(\w+)\(/.exec(obj.constructor.toString())[1];
}

interface DataItem {
    title: string;
}

class Model {
    private _dataItems: ObservableArray<DataItem>;
    public get dataItems() {
        if (!this._dataItems) {
            this.initDataItems();
        }
        return this._dataItems;
    }

    private initDataItems() {
        if (!this._dataItems) {
            this._dataItems = new ObservableArray<DataItem>();

            for (let i = 1; i <= 50; i++) {
                this._dataItems.push({ title: `item ${i}` });
            }
        }
    }
    constructor(public title) {}
    onTap(args: EventData) {
        const obj = args.object as View;
        const objId = obj.id;
        console.log('tapped', getObjectClass(obj), objId);
        switch (objId) {
            case 'alert': {
                alert('this is test Alert!');
                break;
            }
            case 'dialogCustomView': {
                alert({
                    okButtonText: 'OK',
                    title: 'custom dialog view',
                    context: {
                        dataItems: this.dataItems
                    },
                    view: 'examples/bottomsheetinner2-fragment'
                }).then(result => {
                    alert(`closed  dialog with customview and result: ${result}`);
                });
                break;
            }
            case 'prompt': {
                prompt({
                    message: 'this is test Prompt!',
                    okButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    title: 'title?'
                }).then(result => console.log('prompt result', result));
                break;
            }
            case 'login': {
                login({
                    message: 'this is test Prompt!',
                    okButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    title: 'title?',
                    userName: 'my username?',
                    password: 'my password?'
                }).then(result => console.log('login result', result));
                break;
            }
            case 'bottomsheet1': {
                obj.showBottomSheet({
                    view: 'examples/bottomsheetinner1-fragment',
                    context: {},
                    closeCallback: objId => {
                        alert(`bottomsheet closed ${objId}`);
                    }
                });
                break;
            }
            case 'bottomsheet2': {
                obj.showBottomSheet({
                    view: 'examples/bottomsheetinner2-fragment',
                    trackingScrollView: 'listview',
                    context: {
                        dataItems: this.dataItems
                    },
                    closeCallback: objId => {
                        alert(`bottomsheet closed ${objId}`);
                    }
                });
                break;
            }
        }
    }
}

export function onNavigatingTo(args) {
    const page = args.object;
    const context = page.navigationContext;

    const exampleTitle = context.example;
    page.bindingContext = new Model(exampleTitle);

    let theModule;
    try {
        theModule = require(`./${context.example}-fragment`);
        if (theModule && theModule.onNavigatingTo) {
            theModule.onNavigatingTo(args);
        }
    } catch (e) {
        console.log('error', e);
    }

    const container = page.getViewById('container');
    let innerComponent;
    if (global.TNS_WEBPACK) {
        // some-fragment.xml registered via bundle-config.ts, because it's postfixed with "fragment"
        // so it already exist in bundle.js as module
        innerComponent = builder.parse(require(`./${exampleTitle}-fragment.xml`) as string, theModule);
    } else {
        innerComponent = builder.load(`${__dirname}/${exampleTitle}-fragment.xml`, theModule);
    }

    container.addChild(innerComponent);
}

export function onBack(args) {
    const navigationButton = args.object as NavigationButton;
    const frame = navigationButton.page.frame as Frame;
    frame.goBack();
}
