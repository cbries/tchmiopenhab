module TcHmi {
    export module Controls {
        export module TcHmiOpenHabControls {
            export class SensorTemperatureTs extends TcHmi.Controls.TcHmiOpenHabControls.BaseControlTs {
                static readonly #tchmiFQN = 'TcHmi.Controls.TcHmiOpenHabControls.' + this.name;

                constructor(element: JQuery, pcElement: JQuery, attrs: TcHmi.Controls.ControlAttributeList) {
                    /** Call base class constructor */
                    super(element, pcElement, attrs);
                }

                protected __elementTemplateRoot!: JQuery;

                public __previnit() {
                    // Fetch template root element
                    this.__elementTemplateRoot = this.__element.find('.TcHmi_Controls_TcHmiOpenHabControls_SensorTemperatureTs-Template');
                    if (this.__elementTemplateRoot.length === 0) {
                        throw new Error('Invalid Template.html');
                    }
                    this.__elementContainer = this.__elementTemplateRoot.find('.label');

                    // Call __previnit of base class
                    //super.__previnit();
                }

                public __init() {
                    super.__init();
                }

                /**
                * Is called by tachcontrol() after the control instance gets part of the current DOM.
                * Is only allowed to be called from the framework itself!
                */
                public __attach() {
                    super.__attach();

                    /**
                     * Initialize everything which is only available while the control is part of the active dom.
                     */
                }

                /**
                * Is called by tachcontrol() after the control instance is no longer part of the current DOM.
                * Is only allowed to be called from the framework itself!
                */
                public __detach() {
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
                 *
                 * S T A R T
                 *
                 * implementation of the state handling
                 */

                protected __temperatureValue: number | null;

                public setTemperature(valueNew: Number) {

                    let convertedValue = TcHmi.ValueConverter.toNumber(valueNew, 0.0);
                    if (convertedValue === null || undefined) {
                        convertedValue = this.getAttributeDefaultValueInternal("Temperature") as number;
                    }
                    this.__temperatureValue = convertedValue as number;
                    if (this.__elementContainer != null)
                        this.__elementContainer.html(this.__temperatureValue + "°C");
                    TcHmi.EventProvider.raise(this.__id + ".onFunctionResultChanged", ["getTemperature"]);
                    this.__processValue();
                }

                public getTemperature(): number | null {
                    return this.__temperatureValue;
                }

                protected __processValue() {
                    let addr = TcHmi.Environment.getControlBasePathEx(this);
                    let imgName = "temperature_indoor.svg";
                    if (this.__temperatureValue === null) imgName = "temperature_indoor.svg";
                    else if (this.__temperatureValue <= 5) imgName = "temperature_indoor-05.svg";
                    else if (this.__temperatureValue <= 19) imgName = "temperature_indoor-19.svg";
                    else if (this.__temperatureValue <= 21) imgName = "temperature_indoor-21.svg";
                    else if (this.__temperatureValue <= 24) imgName = "temperature_indoor-24.svg";
                    else if (this.__temperatureValue <= 28) imgName = "temperature_indoor-28.svg";
                    else imgName = "temperature_hot.png";
                                        
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
TcHmi.Controls.registerEx('SensorTemperatureTs', 'TcHmi.Controls.TcHmiOpenHabControls', TcHmi.Controls.TcHmiOpenHabControls.SensorTemperatureTs);
