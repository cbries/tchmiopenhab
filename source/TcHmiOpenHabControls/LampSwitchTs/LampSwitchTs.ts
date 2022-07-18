module TcHmi {
    export module Controls {
        export module TcHmiOpenHabControls {
			export class LampSwitchTs extends TcHmi.Controls.System.TcHmiControl {

                constructor(element: JQuery, pcElement: JQuery, attrs: TcHmi.Controls.ControlAttributeList) {
                    /** Call base class constructor */
                    super(element, pcElement, attrs);
                }

                protected __elementTemplateRoot!: JQuery;

                public __previnit() {
                    // Fetch template root element
                    this.__elementTemplateRoot = this.__element.find('.TcHmi_Controls_TcHmiOpenHabControls_LampSwitchTs-Template');
                    if (this.__elementTemplateRoot.length === 0) {
                        throw new Error('Invalid Template.html');
                    }
                    // Call __previnit of base class
                    super.__previnit();
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

                /**
                 *
                 * S T A R T
                 *
                 * implementation of the state handling
                 */

                protected __state: boolean | null;
                
                public setState(valueNew: boolean) {
                    let convertedValue = TcHmi.ValueConverter.toBoolean(valueNew);
                    if (convertedValue === null || undefined) {
                        convertedValue = this.getAttributeDefaultValueInternal("State");
                    }
                    this.__state = convertedValue;
                    TcHmi.EventProvider.raise(this.__id + ".onFunctionResultChanged", ["getState"]);
                    this.__processValue();
                }

                public getState(): boolean | null {
                    return this.__state;
                }
                
                protected __processValue() {
                    let addr = TcHmi.Environment.getControlBasePathEx(this);
                    let imgName = "light-off.png";
                    if (this.__state === true) {
                        imgName = "light-on.png";
                    } else {
                        imgName = "light-off.png";
                    }
                    let finalAddr = addr + "/Icons/classic/" + imgName;
                    let url = 'url(' + finalAddr + ')';
                    this.__elementTemplateRoot.css("background-image", url);
                }

                /**
                 * implementation of the state handling
                 *
                 * E N D
                 *             
                 */
            }
        }
    }
}

/**
* Register Control
*/
TcHmi.Controls.registerEx('LampSwitchTs', 'TcHmi.Controls.TcHmiOpenHabControls', TcHmi.Controls.TcHmiOpenHabControls.LampSwitchTs);
