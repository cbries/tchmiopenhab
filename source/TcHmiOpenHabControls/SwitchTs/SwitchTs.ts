module TcHmi {
    export module Controls {
        export module TcHmiOpenHabControls {
            export class SwitchTs extends TcHmi.Controls.TcHmiOpenHabControls.BaseControlTs {
                static readonly #tchmiFQN = 'TcHmi.Controls.TcHmiOpenHabControls.' + this.name;

                constructor(element: JQuery, pcElement: JQuery, attrs: TcHmi.Controls.ControlAttributeList) {
                    /** Call base class constructor */
                    super(element, pcElement, attrs);
                }

                public __previnit() {
                    // Fetch template root element
                    this.__elementTemplateRoot = this.__element.find('.TcHmi_Controls_TcHmiOpenHabControls_SwitchTs-Template');
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

                    this.__elementTemplateRoot.on("click", () => {
                        let outsideThis = this;
                        outsideThis.__sendToggleCommand();
                    });
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

                protected __sendToggleCommand() {
                    let stateSymbol = this.getElement().data("tchmi-state");
                    let symbolExpression = new TcHmi.SymbolExpression(stateSymbol);
                    let symbolName = symbolExpression.getContent() as string;
                    if (TcHmi.Server.isWebsocketReady()) {

                        let commandToSend = null;

                        let is_IsOn_Symbol = symbolName.endsWith(".isOn") as boolean;

                        if (this.__isValidConfiguration() == false) {
                            alert("No valid configuration to send command.");
                        } else {
                            if (this.__switchState == this.__switchStateEnabled) {
                                commandToSend = this.__switchStateDisabled
                            } else if (this.__switchState == this.__switchStateDisabled) {
                                commandToSend = this.__switchStateEnabled;
                            }
                        }

                        if (commandToSend == null) {
                            alert("No valid command to send.");
                        } else {
                            let errorHandling = function (data : any) {
                                if (data.error !== TcHmi.Errors.NONE) {
                                    // Handle TcHmi.Server class level error here.
                                    return;
                                }
                                var response = data.response;
                                if (!response || response.error !== undefined) {
                                    // Handle TwinCAT HMI Server response level error here.
                                    return;
                                }
                                var commands = response.commands;
                                if (commands === undefined) {
                                    return;
                                }
                                var command = commands[0];
                                if (command === undefined) {
                                    return;
                                }
                                if (command.error !== undefined) {
                                    // Handle TwinCAT HMI Server command level error here.
                                    return;
                                }

                                // Handle result...
                                //TcHmi.Log.debug('PLC1.MAIN.bTest=' + command.readValue);
                            }

                            if (is_IsOn_Symbol == true) {
                                let targetState = commandToSend.toLowerCase() === 'true';
                                TcHmi.Server.writeSymbol(symbolName, targetState, errorHandling);
                            } else {
                                TcHmi.Server.writeSymbol(symbolName, commandToSend, errorHandling);
                            }
                        }
                    }
                }

                protected __switchName: String | null;                
                protected __switchState: String | null;
                protected __switchStateEnabled: String | string | null;
                protected __switchStateDisabled: String | string | null;
                protected __switchIconEnabled: String | string | null;
                protected __switchIconDisabled: String | string | null;
                protected __switchClickable: boolean | Boolean | null;

                public getName(): String | null {
                    return this.__switchName;
                }
                public getState(): String | null {
                    return this.__switchState;
                }
                public getStateEnabled(): String | null {
                    return this.__switchStateEnabled;
                }
                public getIconEnabled(): String | null {
                    return this.__switchIconEnabled;
                }
                public getStateDisabled(): String | null {
                    return this.__switchStateDisabled;
                }
                public getIconDisabled(): String | null {
                    return this.__switchIconDisabled;
                }
                public getClickable(): boolean | Boolean | null {
                    return this.__switchClickable;
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

                public setStateEnabled(valueNew: string) {

                    let convertedValue = TcHmi.ValueConverter.toString(valueNew);
                    if (convertedValue === null || undefined) {
                        convertedValue = this.getAttributeDefaultValueInternal("StateEnabled") as string;
                    }
                    this.__switchStateEnabled = convertedValue as string;
                    TcHmi.EventProvider.raise(this.__id + ".onFunctionResultChanged", ["getStateEnabled"]);
                    this.__processValues();
                }

                public setIconEnabled(valueNew: string) {

                    let convertedValue = TcHmi.ValueConverter.toString(valueNew);
                    if (convertedValue === null || undefined) {
                        convertedValue = this.getAttributeDefaultValueInternal("IconEnabled") as string;
                    }
                    this.__switchIconEnabled = convertedValue as string;
                    TcHmi.EventProvider.raise(this.__id + ".onFunctionResultChanged", ["getIconEnabled"]);
                    this.__processValues();
                }

                public setStateDisabled(valueNew: string) {

                    let convertedValue = TcHmi.ValueConverter.toString(valueNew);
                    if (convertedValue === null || undefined) {
                        convertedValue = this.getAttributeDefaultValueInternal("StateDisabled") as string;
                    }
                    this.__switchStateDisabled = convertedValue as string;
                    TcHmi.EventProvider.raise(this.__id + ".onFunctionResultChanged", ["getStateDisabled"]);
                    this.__processValues();
                }

                public setIconDisabled(valueNew: string) {

                    let convertedValue = TcHmi.ValueConverter.toString(valueNew);
                    if (convertedValue === null || undefined) {
                        convertedValue = this.getAttributeDefaultValueInternal("IconDisabled") as string;
                    }
                    this.__switchIconDisabled = convertedValue as string;
                    TcHmi.EventProvider.raise(this.__id + ".onFunctionResultChanged", ["getIconDisabled"]);
                    this.__processValues();
                }

                public setClickable(valueNew: boolean) {

                    let convertedValue = TcHmi.ValueConverter.toBoolean(valueNew, false);
                    if (convertedValue === null || undefined) {
                        convertedValue = this.getAttributeDefaultValueInternal("Clickable") as boolean;
                    }
                    this.__switchClickable = convertedValue as boolean;
                    TcHmi.EventProvider.raise(this.__id + ".onFunctionResultChanged", ["getClickable"]);
                    this.__processValues();
                }

                protected __isValidConfiguration(): boolean {
                    if (this.__switchState == null
                        || this.__switchStateEnabled == null
                        || this.__switchStateDisabled == null
                        //|| this.__switchIconEnabled == null
                        //|| this.__switchIconDisabled == null
                    ) {
                        return false;
                    }
                    return true;
                }

                protected __processValues() {
                    let addr = TcHmi.Environment.getControlBasePathEx(this);
                    let imgName = "/Icons/wrong.png";
                    if (this.__isValidConfiguration() == false) {
                        // error
                    } else {
                        if (this.__switchState == this.__switchStateEnabled) {
                            if (this.__switchIconEnabled == null) {
                                imgName = "/Icons/classic/switch-on.png";
                            } else {
                                imgName = "/../../" + this.__switchIconEnabled as string;
                            }
                        } else if (this.__switchState == this.__switchStateDisabled) {
                            if (this.__switchIconDisabled == null) {
                                imgName = "/Icons/classic/switch-off.png";
                            } else {
                                imgName = "/../../" + this.__switchIconDisabled as string;
                            }
                        }
                    }

                    let finalAddr = addr + imgName;
                    let url = 'url(' + finalAddr + ')';
                    this.__elementTemplateRoot.css("background-image", url);

                    if (this.__elementContainer != null && this.__switchState != null)
                        this.__elementContainer.html(this.__switchState as string);
                    else if (this.__elementContainer != null)
                        this.__elementContainer.html("");

                    if (this.__elementContainerSub != null && this.__switchName != null)
                        this.__elementContainerSub.html(this.__switchName as string);
                    else if (this.__elementContainerSub != null)
                        this.__elementContainerSub.html("");
                }
            }

            /**
             * E N D
             */
        }
    }
}

/**
* Register Control
*/
TcHmi.Controls.registerEx('SwitchTs', 'TcHmi.Controls.TcHmiOpenHabControls', TcHmi.Controls.TcHmiOpenHabControls.SwitchTs);
