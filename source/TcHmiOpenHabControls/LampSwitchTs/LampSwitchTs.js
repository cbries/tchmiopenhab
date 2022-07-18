var TcHmi;
(function (TcHmi) {
    let Controls;
    (function (Controls) {
        let TcHmiOpenHabControls;
        (function (TcHmiOpenHabControls) {
            class LampSwitchTs extends TcHmi.Controls.System.TcHmiControl {
                constructor(element, pcElement, attrs) {
                    /** Call base class constructor */
                    super(element, pcElement, attrs);
                }
                __previnit() {
                    // Fetch template root element
                    this.__elementTemplateRoot = this.__element.find('.TcHmi_Controls_TcHmiOpenHabControls_LampSwitchTs-Template');
                    if (this.__elementTemplateRoot.length === 0) {
                        throw new Error('Invalid Template.html');
                    }
                    // Call __previnit of base class
                    super.__previnit();
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
                setState(valueNew) {
                    let convertedValue = TcHmi.ValueConverter.toBoolean(valueNew);
                    if (convertedValue === null || undefined) {
                        convertedValue = this.getAttributeDefaultValueInternal("State");
                    }
                    this.__state = convertedValue;
                    TcHmi.EventProvider.raise(this.__id + ".onFunctionResultChanged", ["getState"]);
                    this.__processValue();
                }
                getState() {
                    return this.__state;
                }
                __processValue() {
                    let addr = TcHmi.Environment.getControlBasePathEx(this);
                    let imgName = "light-off.png";
                    if (this.__state === true) {
                        imgName = "light-on.png";
                    }
                    else {
                        imgName = "light-off.png";
                    }
                    let finalAddr = addr + "/Icons/classic/" + imgName;
                    let url = 'url(' + finalAddr + ')';
                    this.__elementTemplateRoot.css("background-image", url);
                }
            }
            TcHmiOpenHabControls.LampSwitchTs = LampSwitchTs;
        })(TcHmiOpenHabControls = Controls.TcHmiOpenHabControls || (Controls.TcHmiOpenHabControls = {}));
    })(Controls = TcHmi.Controls || (TcHmi.Controls = {}));
})(TcHmi || (TcHmi = {}));
/**
* Register Control
*/
TcHmi.Controls.registerEx('LampSwitchTs', 'TcHmi.Controls.TcHmiOpenHabControls', TcHmi.Controls.TcHmiOpenHabControls.LampSwitchTs);
//# sourceMappingURL=LampSwitchTs.js.map