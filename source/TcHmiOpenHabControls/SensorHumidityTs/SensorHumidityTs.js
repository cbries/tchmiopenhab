var TcHmi;
(function (TcHmi) {
    let Controls;
    (function (Controls) {
        let TcHmiOpenHabControls;
        (function (TcHmiOpenHabControls) {
            var _a, _SensorHumidityTs_tchmiFQN;
            class SensorHumidityTs extends TcHmi.Controls.TcHmiOpenHabControls.BaseControlTs {
                constructor(element, pcElement, attrs) {
                    /** Call base class constructor */
                    super(element, pcElement, attrs);
                }
                __previnit() {
                    // Fetch template root element
                    this.__elementTemplateRoot = this.__element.find('.TcHmi_Controls_TcHmiOpenHabControls_SensorHumidityTs-Template');
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
                setHumidity(valueNew) {
                    let convertedValue = TcHmi.ValueConverter.toNumber(valueNew, 0.0);
                    if (convertedValue === null || undefined) {
                        convertedValue = this.getAttributeDefaultValueInternal("Temperature");
                    }
                    this.__humidityValue = convertedValue;
                    if (this.__elementContainer != null)
                        this.__elementContainer.html(this.__humidityValue + "%");
                    TcHmi.EventProvider.raise(this.__id + ".onFunctionResultChanged", ["getTemperature"]);
                    this.__processValue();
                }
                getHumidity() {
                    return this.__humidityValue;
                }
                __processValue() {
                    let addr = TcHmi.Environment.getControlBasePathEx(this);
                    let imgName = "humidity-0.png";
                    if (this.__humidityValue === null)
                        imgName = "humidity-0.png";
                    else if (this.__humidityValue < 10)
                        imgName = "humidity-10.png";
                    else if (this.__humidityValue < 20)
                        imgName = "humidity-20.png";
                    else if (this.__humidityValue < 30)
                        imgName = "humidity-30.png";
                    else if (this.__humidityValue < 40)
                        imgName = "humidity-40.png";
                    else if (this.__humidityValue < 50)
                        imgName = "humidity-50.png";
                    else if (this.__humidityValue < 60)
                        imgName = "humidity-60.png";
                    else if (this.__humidityValue < 70)
                        imgName = "humidity-70.png";
                    else if (this.__humidityValue < 80)
                        imgName = "humidity-80.png";
                    else if (this.__humidityValue < 90)
                        imgName = "humidity-90.png";
                    else
                        imgName = "humidity-100.png";
                    //if (this.__temperatureValue === EnumState.Closed) {
                    //    addr = "TcHmiOpenHabControls/ContactWindowTs/Icons/classic/contact-closed.png";
                    //} else if (this.__state === EnumState.Open) {
                    //    addr = "TcHmiOpenHabControls/ContactWindowTs/Icons/classic/contact-open.png";
                    //} else {
                    //    addr = "TcHmiOpenHabControls/ContactWindowTs/Icons/classic/contact-ajar.png";
                    //}
                    let finalAddr = addr + "/Icons/classic/" + imgName;
                    let url = 'url(' + finalAddr + ')';
                    this.__elementTemplateRoot.css("background-image", url);
                }
            }
            _a = SensorHumidityTs;
            _SensorHumidityTs_tchmiFQN = { value: 'TcHmi.Controls.TcHmiOpenHabControls.' + _a.name };
            TcHmiOpenHabControls.SensorHumidityTs = SensorHumidityTs;
        })(TcHmiOpenHabControls = Controls.TcHmiOpenHabControls || (Controls.TcHmiOpenHabControls = {}));
    })(Controls = TcHmi.Controls || (TcHmi.Controls = {}));
})(TcHmi || (TcHmi = {}));
/**
* Register Control
*/
TcHmi.Controls.registerEx('SensorHumidityTs', 'TcHmi.Controls.TcHmiOpenHabControls', TcHmi.Controls.TcHmiOpenHabControls.SensorHumidityTs);
//# sourceMappingURL=SensorHumidityTs.js.map