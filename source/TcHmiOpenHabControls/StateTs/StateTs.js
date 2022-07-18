var TcHmi;
(function (TcHmi) {
    let Controls;
    (function (Controls) {
        let TcHmiOpenHabControls;
        (function (TcHmiOpenHabControls) {
            var _a, _StateTs_tchmiFQN;
            class StateTs extends TcHmi.Controls.TcHmiOpenHabControls.BaseControlTs {
                constructor(element, pcElement, attrs) {
                    /** Call base class constructor */
                    super(element, pcElement, attrs);
                }
                __previnit() {
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
                __init() {
                    super.__init();
                }
                __attach() {
                    super.__attach();
                    /**
                     * Initialize everything which is only available while the control is part of the active dom.
                     */
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
                getName() {
                    return this.__switchName;
                }
                getState() {
                    return this.__switchState;
                }
                getStateMapping() {
                    return this.__stateMapping;
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
                setStateMapping(valueNew) {
                    let convertedValue = TcHmi.ValueConverter.toObject(valueNew);
                    if (convertedValue === null || undefined) {
                        convertedValue = this.getAttributeDefaultValueInternal("StateMapping");
                    }
                    this.__stateMapping = convertedValue;
                    TcHmi.EventProvider.raise(this.__id + ".onFunctionResultChanged", ["getStateMapping"]);
                    this.__processValues();
                }
                __state2humanReadable(state) {
                    if (state == null)
                        return null;
                    if (this.__stateMapping == null || this.__stateMapping.length == 0)
                        return null;
                    let maxIdx = this.__stateMapping.length;
                    for (let i = 0; i < maxIdx; ++i) {
                        if ((this.__stateMapping[i].state).toString() == state)
                            return this.__stateMapping[i];
                    }
                    return null;
                }
                __provideFallbackUi() {
                }
                __processValues() {
                    if (this.__switchName == null || this.__switchState == null) {
                        this.__provideFallbackUi();
                        return;
                    }
                    let mapItem = this.__state2humanReadable(this.__switchState);
                    let addr = TcHmi.Environment.getControlBasePathEx(this);
                    let imgName = "/Icons/dummy64x64.png";
                    if (this.__elementContainer != null && this.__switchState != null) {
                        if (mapItem == null) {
                            this.__elementContainer.html(this.__switchState);
                            imgName = "/Icons/wrong.png";
                        }
                        else {
                            this.__elementContainer.html(mapItem.stateHumanReadable);
                            if (mapItem.stateIcon == null) {
                                imgName = "";
                            }
                            else {
                                imgName = "/../../" + mapItem.stateIcon;
                            }
                        }
                    }
                    else if (this.__elementContainer != null) {
                        this.__elementContainer.html("");
                    }
                    let finalAddr = addr + imgName;
                    let url = 'url(' + finalAddr + ')';
                    if (imgName == null)
                        url = 'url()';
                    this.__elementTemplateRoot.css("background-image", url);
                    if (this.__elementContainerSub != null && this.__switchName != null)
                        this.__elementContainerSub.html(this.__switchName);
                    else if (this.__elementContainerSub != null)
                        this.__elementContainerSub.html("");
                }
            }
            _a = StateTs;
            _StateTs_tchmiFQN = { value: 'TcHmi.Controls.TcHmiOpenHabControls.' + _a.name };
            TcHmiOpenHabControls.StateTs = StateTs;
        })(TcHmiOpenHabControls = Controls.TcHmiOpenHabControls || (Controls.TcHmiOpenHabControls = {}));
    })(Controls = TcHmi.Controls || (TcHmi.Controls = {}));
})(TcHmi || (TcHmi = {}));
/**
* Register Control
*/
TcHmi.Controls.registerEx('StateTs', 'TcHmi.Controls.TcHmiOpenHabControls', TcHmi.Controls.TcHmiOpenHabControls.StateTs);
//# sourceMappingURL=StateTs.js.map