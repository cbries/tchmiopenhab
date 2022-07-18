var TcHmi;
(function (TcHmi) {
    let Controls;
    (function (Controls) {
        let TcHmiOpenHabControls;
        (function (TcHmiOpenHabControls) {
            var _a, _SensorTemperatureTs_tchmiFQN;
            class SensorTemperatureTs extends TcHmi.Controls.TcHmiOpenHabControls.BaseControlTs {
                constructor(element, pcElement, attrs) {
                    /** Call base class constructor */
                    super(element, pcElement, attrs);
                }
                __previnit() {
                    // Fetch template root element
                    this.__elementTemplateRoot = this.__element.find('.TcHmi_Controls_TcHmiOpenHabControls_SensorTemperatureTs-Template');
                    if (this.__elementTemplateRoot.length === 0) {
                        throw new Error('Invalid Template.html');
                    }
                    this.__elementContainer = this.__elementTemplateRoot.find('.label');
                    // Call __previnit of base class
                    //super.__previnit();
                }
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
                setTemperature(valueNew) {
                    let convertedValue = TcHmi.ValueConverter.toNumber(valueNew, 0.0);
                    if (convertedValue === null || undefined) {
                        convertedValue = this.getAttributeDefaultValueInternal("Temperature");
                    }
                    this.__temperatureValue = convertedValue;
                    if (this.__elementContainer != null)
                        this.__elementContainer.html(this.__temperatureValue + "°C");
                    TcHmi.EventProvider.raise(this.__id + ".onFunctionResultChanged", ["getTemperature"]);
                    this.__processValue();
                }
                getTemperature() {
                    return this.__temperatureValue;
                }
                __processValue() {
                    let addr = TcHmi.Environment.getControlBasePathEx(this);
                    let imgName = "temperature_indoor.svg";
                    if (this.__temperatureValue === null)
                        imgName = "temperature_indoor.svg";
                    else if (this.__temperatureValue <= 5)
                        imgName = "temperature_indoor-05.svg";
                    else if (this.__temperatureValue <= 19)
                        imgName = "temperature_indoor-19.svg";
                    else if (this.__temperatureValue <= 21)
                        imgName = "temperature_indoor-21.svg";
                    else if (this.__temperatureValue <= 24)
                        imgName = "temperature_indoor-24.svg";
                    else if (this.__temperatureValue <= 28)
                        imgName = "temperature_indoor-28.svg";
                    else
                        imgName = "temperature_hot.png";
                    let finalAddr = addr + "/Icons/classic/" + imgName;
                    let url = 'url(' + finalAddr + ')';
                    this.__elementTemplateRoot.css("background-image", url);
                }
            }
            _a = SensorTemperatureTs;
            _SensorTemperatureTs_tchmiFQN = { value: 'TcHmi.Controls.TcHmiOpenHabControls.' + _a.name };
            TcHmiOpenHabControls.SensorTemperatureTs = SensorTemperatureTs;
        })(TcHmiOpenHabControls = Controls.TcHmiOpenHabControls || (Controls.TcHmiOpenHabControls = {}));
    })(Controls = TcHmi.Controls || (TcHmi.Controls = {}));
})(TcHmi || (TcHmi = {}));
/**
* Register Control
*/
TcHmi.Controls.registerEx('SensorTemperatureTs', 'TcHmi.Controls.TcHmiOpenHabControls', TcHmi.Controls.TcHmiOpenHabControls.SensorTemperatureTs);
//# sourceMappingURL=SensorTemperatureTs.js.map