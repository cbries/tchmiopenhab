/*
 * Generated 6/19/2022 7:02:34 AM
 * Copyright (C) 2022
 */
var TcHmi;
(function (TcHmi) {
    let Controls;
    (function (Controls) {
        let TcHmiOpenHabControls;
        (function (TcHmiOpenHabControls) {
            let EnumState;
            (function (EnumState) {
                EnumState["OPEN"] = "OPEN";
                EnumState["CLOSED"] = "CLOSED";
            })(EnumState || (EnumState = {}));
            ;
            class ContactDoorTs extends TcHmi.Controls.System.TcHmiControl {
                /*
                Attribute philosophy
                --------------------
                - Local variables are not set while definition in class, so they have the value 'undefined'.
                - On compile the Framework sets the value from HTML or from theme (possibly 'null') via normal setters.
                - The "changed detection" in the setter will result in processing the value only once while compile.
                - Attention: If we have a Server Binding on an Attribute the setter will be called once with null to initialize and later with the correct value.
                */
                /**
                 * Constructor of the control
                 * @param {JQuery} element Element from HTML (internal, do not use)
                 * @param {JQuery} pcElement precompiled Element (internal, do not use)
                 * @param {TcHmi.Controls.ControlAttributeList} attrs Attributes defined in HTML in a special format (internal, do not use)
                 * @returns {void}
                 */
                constructor(element, pcElement, attrs) {
                    /** Call base class constructor */
                    super(element, pcElement, attrs);
                }
                /**
                  * If raised, the control object exists in control cache and constructor of each inheritation level was called.
                  * Call attribute processor functions here to initialize default values!
                  */
                __previnit() {
                    // Fetch template root element
                    this.__elementTemplateRoot = this.__element.find('.TcHmi_Controls_TcHmiOpenHabControls_ContactDoorTs-Template');
                    if (this.__elementTemplateRoot.length === 0) {
                        throw new Error('Invalid Template.html');
                    }
                    // Call __previnit of base class
                    super.__previnit();
                }
                /**
                 * Is called during control initialize phase after attribute setter have been called based on it's default or initial html dom values.
                 * @returns {void}
                 */
                __init() {
                    super.__init();
                }
                /**
                * Is called by tachcontrol() after the control instance gets part of the current DOM.
                * Is only allowed to be called from the framework itself!
                */
                __attach() {
                    super.__attach();
                    /**
                     * Initialize everything which is only available while the control is part of the active dom.
                     */
                }
                /**
                * Is called by tachcontrol() after the control instance is no longer part of the current DOM.
                * Is only allowed to be called from the framework itself!
                */
                __detach() {
                    super.__detach();
                    /**
                     * Disable everything which is not needed while the control is not part of the active dom.
                     * No need to listen to events for example!
                     */
                }
                /**
                * Destroy the current control instance.
                * Will be called automatically if system destroys control!
                */
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
                    let convertedValue = TcHmi.ValueConverter.toEnum(valueNew, EnumState, EnumState.CLOSED);
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
                    let baseName = "ContactDoorTs";
                    let addr = "";
                    if (this.__state === EnumState.CLOSED) {
                        addr = "TcHmiOpenHabControls/" + baseName + "/Icons/classic/door-closed.png";
                    }
                    else if (this.__state === EnumState.OPEN) {
                        addr = "TcHmiOpenHabControls/" + baseName + "/Icons/classic/door-open.png";
                    }
                    else {
                        addr = "TcHmiOpenHabControls/" + baseName + "/Icons/classic/door.png";
                    }
                    let url = 'url(' + addr + ')';
                    this.__elementTemplateRoot.css("background-image", url);
                }
            }
            TcHmiOpenHabControls.ContactDoorTs = ContactDoorTs;
        })(TcHmiOpenHabControls = Controls.TcHmiOpenHabControls || (Controls.TcHmiOpenHabControls = {}));
    })(Controls = TcHmi.Controls || (TcHmi.Controls = {}));
})(TcHmi || (TcHmi = {}));
/**
* Register Control
*/
TcHmi.Controls.registerEx('ContactDoorTs', 'TcHmi.Controls.TcHmiOpenHabControls', TcHmi.Controls.TcHmiOpenHabControls.ContactDoorTs);
//# sourceMappingURL=ContactDoorTs.js.map