var TcHmi;
(function (TcHmi) {
    let Controls;
    (function (Controls) {
        let TcHmiOpenHabControls;
        (function (TcHmiOpenHabControls) {
            var _a, _SwitchTs_tchmiFQN;
            class SwitchTs extends TcHmi.Controls.TcHmiOpenHabControls.BaseControlTs {
                constructor(element, pcElement, attrs) {
                    /** Call base class constructor */
                    super(element, pcElement, attrs);
                }
                __previnit() {
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
                __init() {
                    super.__init();
                }
                __attach() {
                    super.__attach();
                    /**
                     * Initialize everything which is only available while the control is part of the active dom.
                     */
                    this.__elementTemplateRoot.on("click", () => {
                        let outsideThis = this;
                        outsideThis.__sendToggleCommand();
                    });
                }
                __detach() {
                    super.__detach();
                    /**
                     * Disable everything which is not needed while the control is not part of the active dom.
                     * No need to listen to events for example!
                     */
                }
                destroy() {
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
                __sendToggleCommand() {
                    let stateSymbol = this.getElement().data("tchmi-state");
                    let symbolExpression = new TcHmi.SymbolExpression(stateSymbol);
                    let symbolName = symbolExpression.getContent();
                    if (TcHmi.Server.isWebsocketReady()) {
                        let commandToSend = null;
                        let is_IsOn_Symbol = symbolName.endsWith(".isOn");
                        if (this.__isValidConfiguration() == false) {
                            alert("No valid configuration to send command.");
                        }
                        else {
                            if (this.__switchState == this.__switchStateEnabled) {
                                commandToSend = this.__switchStateDisabled;
                            }
                            else if (this.__switchState == this.__switchStateDisabled) {
                                commandToSend = this.__switchStateEnabled;
                            }
                        }
                        if (commandToSend == null) {
                            alert("No valid command to send.");
                        }
                        else {
                            let errorHandling = function (data) {
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
                            };
                            if (is_IsOn_Symbol == true) {
                                let targetState = commandToSend.toLowerCase() === 'true';
                                TcHmi.Server.writeSymbol(symbolName, targetState, errorHandling);
                            }
                            else {
                                TcHmi.Server.writeSymbol(symbolName, commandToSend, errorHandling);
                            }
                        }
                    }
                }
                getName() {
                    return this.__switchName;
                }
                getState() {
                    return this.__switchState;
                }
                getStateEnabled() {
                    return this.__switchStateEnabled;
                }
                getIconEnabled() {
                    return this.__switchIconEnabled;
                }
                getStateDisabled() {
                    return this.__switchStateDisabled;
                }
                getIconDisabled() {
                    return this.__switchIconDisabled;
                }
                getClickable() {
                    return this.__switchClickable;
                }
                setName(valueNew) {
                    let convertedValue = TcHmi.ValueConverter.toString(valueNew);
                    if (convertedValue === null || undefined) {
                        convertedValue = this.getAttributeDefaultValueInternal("Name");
                    }
                    this.__switchName = convertedValue;
                    TcHmi.EventProvider.raise(this.__id + ".onFunctionResultChanged", ["getName"]);
                    this.__processValues();
                }
                setState(valueNew) {
                    let convertedValue = TcHmi.ValueConverter.toString(valueNew);
                    if (convertedValue === null || undefined) {
                        convertedValue = this.getAttributeDefaultValueInternal("State");
                    }
                    this.__switchState = convertedValue;
                    TcHmi.EventProvider.raise(this.__id + ".onFunctionResultChanged", ["getState"]);
                    this.__processValues();
                }
                setStateEnabled(valueNew) {
                    let convertedValue = TcHmi.ValueConverter.toString(valueNew);
                    if (convertedValue === null || undefined) {
                        convertedValue = this.getAttributeDefaultValueInternal("StateEnabled");
                    }
                    this.__switchStateEnabled = convertedValue;
                    TcHmi.EventProvider.raise(this.__id + ".onFunctionResultChanged", ["getStateEnabled"]);
                    this.__processValues();
                }
                setIconEnabled(valueNew) {
                    let convertedValue = TcHmi.ValueConverter.toString(valueNew);
                    if (convertedValue === null || undefined) {
                        convertedValue = this.getAttributeDefaultValueInternal("IconEnabled");
                    }
                    this.__switchIconEnabled = convertedValue;
                    TcHmi.EventProvider.raise(this.__id + ".onFunctionResultChanged", ["getIconEnabled"]);
                    this.__processValues();
                }
                setStateDisabled(valueNew) {
                    let convertedValue = TcHmi.ValueConverter.toString(valueNew);
                    if (convertedValue === null || undefined) {
                        convertedValue = this.getAttributeDefaultValueInternal("StateDisabled");
                    }
                    this.__switchStateDisabled = convertedValue;
                    TcHmi.EventProvider.raise(this.__id + ".onFunctionResultChanged", ["getStateDisabled"]);
                    this.__processValues();
                }
                setIconDisabled(valueNew) {
                    let convertedValue = TcHmi.ValueConverter.toString(valueNew);
                    if (convertedValue === null || undefined) {
                        convertedValue = this.getAttributeDefaultValueInternal("IconDisabled");
                    }
                    this.__switchIconDisabled = convertedValue;
                    TcHmi.EventProvider.raise(this.__id + ".onFunctionResultChanged", ["getIconDisabled"]);
                    this.__processValues();
                }
                setClickable(valueNew) {
                    let convertedValue = TcHmi.ValueConverter.toBoolean(valueNew, false);
                    if (convertedValue === null || undefined) {
                        convertedValue = this.getAttributeDefaultValueInternal("Clickable");
                    }
                    this.__switchClickable = convertedValue;
                    TcHmi.EventProvider.raise(this.__id + ".onFunctionResultChanged", ["getClickable"]);
                    this.__processValues();
                }
                __isValidConfiguration() {
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
                __processValues() {
                    let addr = TcHmi.Environment.getControlBasePathEx(this);
                    let imgName = "/Icons/wrong.png";
                    if (this.__isValidConfiguration() == false) {
                        // error
                    }
                    else {
                        if (this.__switchState == this.__switchStateEnabled) {
                            if (this.__switchIconEnabled == null) {
                                imgName = "/Icons/classic/switch-on.png";
                            }
                            else {
                                imgName = "/../../" + this.__switchIconEnabled;
                            }
                        }
                        else if (this.__switchState == this.__switchStateDisabled) {
                            if (this.__switchIconDisabled == null) {
                                imgName = "/Icons/classic/switch-off.png";
                            }
                            else {
                                imgName = "/../../" + this.__switchIconDisabled;
                            }
                        }
                    }
                    let finalAddr = addr + imgName;
                    let url = 'url(' + finalAddr + ')';
                    this.__elementTemplateRoot.css("background-image", url);
                    if (this.__elementContainer != null && this.__switchState != null)
                        this.__elementContainer.html(this.__switchState);
                    else if (this.__elementContainer != null)
                        this.__elementContainer.html("");
                    if (this.__elementContainerSub != null && this.__switchName != null)
                        this.__elementContainerSub.html(this.__switchName);
                    else if (this.__elementContainerSub != null)
                        this.__elementContainerSub.html("");
                }
            }
            _a = SwitchTs;
            _SwitchTs_tchmiFQN = { value: 'TcHmi.Controls.TcHmiOpenHabControls.' + _a.name };
            TcHmiOpenHabControls.SwitchTs = SwitchTs;
            /**
             * E N D
             */
        })(TcHmiOpenHabControls = Controls.TcHmiOpenHabControls || (Controls.TcHmiOpenHabControls = {}));
    })(Controls = TcHmi.Controls || (TcHmi.Controls = {}));
})(TcHmi || (TcHmi = {}));
/**
* Register Control
*/
TcHmi.Controls.registerEx('SwitchTs', 'TcHmi.Controls.TcHmiOpenHabControls', TcHmi.Controls.TcHmiOpenHabControls.SwitchTs);
//# sourceMappingURL=SwitchTs.js.map