module TcHmi {
    export module Controls {
        export module TcHmiOpenHabControls {

            enum BatteryState {
                Idle = "Idle",
                Charging = "Charging",
                Discharging = "Discharging"
            };

            export class BatteryTs extends TcHmi.Controls.TcHmiOpenHabControls.BaseControlTs {
                static readonly #tchmiFQN = 'TcHmi.Controls.TcHmiOpenHabControls.' + this.name;

                constructor(element: JQuery, pcElement: JQuery, attrs: TcHmi.Controls.ControlAttributeList) {
                    /** Call base class constructor */
                    super(element, pcElement, attrs);
                }

                protected __elementTemplateRoot!: JQuery;
                protected __elementContainerBatteryState: JQuery | null;

                public __previnit() {
                    // Fetch template root element
                    this.__elementTemplateRoot = this.__element.find('.TcHmi_Controls_TcHmiOpenHabControls_BatteryTs-Template');
                    if (this.__elementTemplateRoot.length === 0) {
                        throw new Error('Invalid Template.html');
                    }

                    this.__elementContainerBatteryState = this.__elementTemplateRoot.find('.state');
                    this.__elementContainer = this.__elementTemplateRoot.find('.label');

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

                protected __batteryLevel: number | null;

                public setLevel(valueNew: Number) {

                    let convertedValue = TcHmi.ValueConverter.toNumber(valueNew, 0.0);
                    if (convertedValue === null || undefined) {
                        convertedValue = this.getAttributeDefaultValueInternal("Level") as number;
                    }
                    this.__batteryLevel = convertedValue as number;
                    if (this.__elementContainer != null)
                        this.__elementContainer.html(this.__batteryLevel + "%");
                    TcHmi.EventProvider.raise(this.__id + ".onFunctionResultChanged", ["getLevel"]);
                    this.__processValue();
                }

                public getLevel(): number | null {
                    return this.__batteryLevel;
                }

                protected __processValue() {
                    let addr = TcHmi.Environment.getControlBasePathEx(this);
                    let imgName = "battery-0.png";
                    if (this.__batteryLevel === null) imgName = "battery-0.png";
                    else if (this.__batteryLevel < 10) imgName = "battery-10.png";
                    else if (this.__batteryLevel < 20) imgName = "battery-20.png";
                    else if (this.__batteryLevel < 30) imgName = "battery-30.png";
                    else if (this.__batteryLevel < 40) imgName = "battery-40.png";
                    else if (this.__batteryLevel < 50) imgName = "battery-50.png";
                    else if (this.__batteryLevel < 60) imgName = "battery-60.png";
                    else if (this.__batteryLevel < 70) imgName = "battery-70.png";
                    else if (this.__batteryLevel < 80) imgName = "battery-80.png";
                    else if (this.__batteryLevel < 90) imgName = "battery-90.png";
                    else imgName = "battery-100.png";

                    let finalAddr = addr + "/Icons/classic/" + imgName;
                    let url = 'url(' + finalAddr + ')';
                    this.__elementTemplateRoot.css("background-image", url);
                }

                protected __batteryState: BatteryState | null;

                public setState(valueNew: BatteryState) {

                    let convertedValue = TcHmi.ValueConverter.toEnum(valueNew, BatteryState, BatteryState.Idle);
                    if (convertedValue === null || undefined) {
                        convertedValue = this.getAttributeDefaultValueInternal("State") as BatteryState;
                    }
                    this.__batteryState = convertedValue as BatteryState;
                    //if (this.__elementContainer != null)
                    //    this.__elementContainer.html(this.__batteryState + "%");
                    TcHmi.EventProvider.raise(this.__id + ".onFunctionResultChanged", ["getState"]);
                    this.__processState();
                }

                public getState(): BatteryState | null {
                    return this.__batteryState;
                }

                protected __processState() {
                    if (this.__elementContainerBatteryState == null) return;
                    let addr = TcHmi.Environment.getControlBasePathEx(this);
                    let imgName = "idle.png";
                    if (this.__batteryState == BatteryState.Charging) {
                        imgName = "charging.png";
                    } else if (this.__batteryState == BatteryState.Discharging) {
                        imgName = "discharging.png";
                    } else if (this.__batteryState == BatteryState.Idle) {
                        imgName = "idle.png";
                    } else {
                        // error
                        imgName = "error.png";
                    }
                    let finalAddr = addr + "/Icons/" + imgName;
                    let url = 'url(' + finalAddr + ')';
                    this.__elementContainerBatteryState.css("background-image", url);
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
TcHmi.Controls.registerEx('BatteryTs', 'TcHmi.Controls.TcHmiOpenHabControls', TcHmi.Controls.TcHmiOpenHabControls.BatteryTs);
