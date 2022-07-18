module TcHmi {
    export module Controls {

        export module TcHmiOpenHabControls {
            export interface MapItem {
                state: number,
                stateHumanReadable: string,
                stateIcon: string
            }
        }

        export module TcHmiOpenHabControls {
            export class StateTs extends TcHmi.Controls.TcHmiOpenHabControls.BaseControlTs {
                static readonly #tchmiFQN = 'TcHmi.Controls.TcHmiOpenHabControls.' + this.name;

                constructor(element: JQuery, pcElement: JQuery, attrs: TcHmi.Controls.ControlAttributeList) {
                    /** Call base class constructor */
                    super(element, pcElement, attrs);
                }

                public __previnit() {
                    // Fetch template root element
                    this.__elementTemplateRoot = this.__element.find('.TcHmi_Controls_TcHmiOpenHabControls_StateTs-Template');
                    if (this.__elementTemplateRoot.length === 0) {
                        throw new Error('Invalid Template.html');
                    }

                    this.__elementContainerSub = this.__elementTemplateRoot.find('.labelName');
                    this.__elementContainer = this.__elementTemplateRoot.find('.labelState');

                    // Call __previnit of base class
                    //super.__previnit();
                }

                public __init() {
                    super.__init();
                }

                public __attach() {
                    super.__attach();

                    /**
                     * Initialize everything which is only available while the control is part of the active dom.
                     */
                }

                public __detach() {
                    super.__detach();

                    /**
                     * Disable everything which is not needed while the control is not part of the active dom.
                     * No need to listen to events for example!
                     */
                }

                public destroy() {
                    /**
                    * While __keepAlive is set to true control must not be destroyed.
                    */
                    if (this.__keepAlive) {
                        return;
                    }

                    super.destroy();

                    /**
                    * Free resources like child controls etc.
                    */
                }

                /** ###############################################################################
                 * S T A R T
                 */

                protected __switchName: String | null;
                protected __switchState: String | null;
                protected __stateMapping: TcHmiOpenHabControls.MapItem[] | null;

                public getName(): String | null {
                    return this.__switchName;
                }
                public getState(): String | null {
                    return this.__switchState;
                }
                public getStateMapping(): TcHmiOpenHabControls.MapItem[] | null {
                    return this.__stateMapping;
                }

                public setName(valueNew: String) {

                    let convertedValue = TcHmi.ValueConverter.toString(valueNew);
                    if (convertedValue === null || undefined) {
                        convertedValue = this.getAttributeDefaultValueInternal("Name") as string;
                    }
                    this.__switchName = convertedValue as string;
                    TcHmi.EventProvider.raise(this.__id + ".onFunctionResultChanged", ["getName"]);
                    this.__processValues();
                }

                public setState(valueNew: String) {

                    let convertedValue = TcHmi.ValueConverter.toString(valueNew);
                    if (convertedValue === null || undefined) {
                        convertedValue = this.getAttributeDefaultValueInternal("State") as string;
                    }
                    this.__switchState = convertedValue as string;
                    TcHmi.EventProvider.raise(this.__id + ".onFunctionResultChanged", ["getState"]);
                    this.__processValues();
                }

                public setStateMapping(valueNew: TcHmiOpenHabControls.MapItem[]) {
                    let convertedValue = TcHmi.ValueConverter.toObject<TcHmiOpenHabControls.MapItem[]>(valueNew);
                    if (convertedValue === null || undefined) {
                        convertedValue = this.getAttributeDefaultValueInternal("StateMapping") as TcHmiOpenHabControls.MapItem[];
                    }
                    this.__stateMapping = convertedValue as TcHmiOpenHabControls.MapItem[];
                    TcHmi.EventProvider.raise(this.__id + ".onFunctionResultChanged", ["getStateMapping"]);
                    this.__processValues();
                }

                private __state2humanReadable(state: string | String): TcHmiOpenHabControls.MapItem | null {
                    if (state == null) return null;
                    if (this.__stateMapping == null || this.__stateMapping.length == 0) return null;
                    let maxIdx = this.__stateMapping.length;
                    for (let i = 0; i < maxIdx; ++i) {
                        if ((this.__stateMapping[i].state).toString() == state)
                            return this.__stateMapping[i];
                    }
                    return null;
                }

                protected __provideFallbackUi() {

                }

                protected __processValues() {
                    if (this.__switchName == null || this.__switchState == null) {
                        this.__provideFallbackUi();
                        return;
                    }
                    let mapItem = this.__state2humanReadable(this.__switchState);

                    let addr = TcHmi.Environment.getControlBasePathEx(this);
                    let imgName = "/Icons/dummy64x64.png";

                    if (this.__elementContainer != null && this.__switchState != null) {
                        if (mapItem == null) {
                            this.__elementContainer.html(this.__switchState as string);
                            imgName = "/Icons/wrong.png";
                        } else {
                            this.__elementContainer.html(mapItem.stateHumanReadable);
                            if (mapItem.stateIcon == null) {
                                imgName = "";
                            } else {
                                imgName = "/../../" + mapItem.stateIcon as string;
                            }
                        }
                    } else if (this.__elementContainer != null) {
                        this.__elementContainer.html("");
                    }

                    let finalAddr = addr + imgName;
                    let url = 'url(' + finalAddr + ')';
                    if (imgName == null)
                        url = 'url()';
                    this.__elementTemplateRoot.css("background-image", url);

                    if (this.__elementContainerSub != null && this.__switchName != null)
                        this.__elementContainerSub.html(this.__switchName as string);
                    else if (this.__elementContainerSub != null)
                        this.__elementContainerSub.html("");
                }

                /**
                 * E N D
                 */
            }
        }
    }
}

/**
* Register Control
*/
TcHmi.Controls.registerEx('StateTs', 'TcHmi.Controls.TcHmiOpenHabControls', TcHmi.Controls.TcHmiOpenHabControls.StateTs);
