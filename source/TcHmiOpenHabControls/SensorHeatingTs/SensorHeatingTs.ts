module TcHmi {
    export module Controls {
        export module TcHmiOpenHabControls {
            export class SensorHeatingTs extends TcHmi.Controls.TcHmiOpenHabControls.BaseControlTs {
                static readonly #tchmiFQN = 'TcHmi.Controls.TcHmiOpenHabControls.' + this.name;

                constructor(element: JQuery, pcElement: JQuery, attrs: TcHmi.Controls.ControlAttributeList) {
                    /** Call base class constructor */
                    super(element, pcElement, attrs);
                }
                                
                public __previnit() {
                    // Fetch template root element
                    this.__elementTemplateRoot = this.__element.find('.TcHmi_Controls_TcHmiOpenHabControls_SensorHeatingTs-Template');
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

                public __listOfCtrl: {
                    id: string,
                    cmd: string | number | undefined,
                    instance: JQuery<HTMLElement> | undefined,
                    instanceHmi: TcHmi.Controls.System.baseTcHmiControl | undefined,
                }[] = [
                        { // 0
                            "id": "Heat_SwitchMode",
                            "cmd": "Mode",
                            "instance": undefined,
                            "instanceHmi": undefined
                        },
                        { // 1
                            "id": "Heat_Button_Boost",
                            "cmd": "Boost",
                            "instance": undefined,
                            "instanceHmi": undefined
                        },
                        { // 2
                            "id": "Heat_Button_Temperature_17",
                            "cmd": 17,
                            "instance": undefined,
                            "instanceHmi": undefined
                        },
                        { // 3
                            "id": "Heat_Button_Temperature_18",
                            "cmd": 18,
                            "instance": undefined,
                            "instanceHmi": undefined
                        },
                        { // 4
                            "id": "Heat_Button_Temperature_19",
                            "cmd": 19,
                            "instance": undefined,
                            "instanceHmi": undefined
                        },
                        { // 5
                            "id": "Heat_Button_Temperature_20",
                            "cmd": 20,
                            "instance": undefined,
                            "instanceHmi": undefined
                        },
                        { // 6
                            "id": "Heat_Button_Temperature_21",
                            "cmd": 21,
                            "instance": undefined,
                            "instanceHmi": undefined
                        },
                        { // 7
                            "id": "Heat_Button_Temperature_22",
                            "cmd": 22,
                            "instance": undefined,
                            "instanceHmi": undefined
                        },
                        { // 8
                            "id": "Heat_Button_Temperature_23",
                            "cmd": 23,
                            "instance": undefined,
                            "instanceHmi": undefined
                        },
                        { // 9
                            "id": "Heat_Current",
                            "cmd": undefined,
                            "instance": undefined,
                            "instanceHmi": undefined
                        }
                    ];

                private __listOfDestroyFunctions: Array<DestroyFunction> = new Array();
                private __isDialogInitialized: boolean = false;

                public __attach() {
                    super.__attach();
                    this.__elementTemplateRoot.on("click", () => {

                        // Heizmodi für die ganze Wohnung:
                        //  NORMAL: Betriebsmodus für die normale Arbeitswoche, Heizprofil 1
                        //  HOLIDAY: abgesenkte Temperatur für eine längere Zeit, Heizprofil 2
                        //  SUMMER: alle Heizkörper sind aus (Sommerbetrieb)
                        // val int heizprofilNormal = 1
                        // val int heizprofilHoliday = 2
                        // val int heizprofilSommer = 3

                        let outsideThis = this;

                        outsideThis.__isDialogInitialized = false;

                        var destroyEvent = TcHmi.EventProvider.register(
                            'Heat_SwitchMode.onAttached',
                            function (evt, data) {

                                for (let i = 0; i < outsideThis.__listOfCtrl.length; ++i) {
                                    let ctrl = outsideThis.__listOfCtrl[i];
                                    ctrl.instance = regionElement?.find('#' + ctrl.id);
                                    ctrl.instanceHmi = TcHmi.Controls.get(ctrl.id);
                                    if (i == 0) {
                                        //
                                        // Heat Mode: Normal, Holiday, Off
                                        // 

                                        let c = ctrl.instanceHmi as TcHmi.Controls.Beckhoff.TcHmiCombobox;
                                        let destroyEvent = TcHmi.EventProvider.register(ctrl.id + ".onSelectionChanged",
                                            function (evt, data) {
                                                if (outsideThis.__isDialogInitialized === false) return;
                                                if (outsideThis.__heatingMode === c.getSelectedId()) return;
                                                outsideThis.__heatingMode = c.getSelectedId() as number;
                                                outsideThis.__sendHeatMode(outsideThis.__heatingMode);
                                            });

                                        outsideThis.__listOfDestroyFunctions.push(destroyEvent);
                                        outsideThis.__processValue_Mode();
                                    }
                                    else if (i == 1) {
                                        // 
                                        // Toggle Boost
                                        // 

                                        let c = ctrl.instanceHmi as TcHmi.Controls.Beckhoff.TcHmiToggleSwitch;
                                        let destroyEvent = TcHmi.EventProvider.register(ctrl.id + ".onToggleStateChanged",
                                            function (evt, data) {
                                                outsideThis.__sendHeatBoost(!outsideThis.__heatingBoostState);
                                            });

                                        outsideThis.__listOfDestroyFunctions.push(destroyEvent);
                                    }
                                    else if (i >= 2 && i <= 8) {
                                        //
                                        // Change Temperature
                                        //

                                        ctrl.instance?.on("click", () => {
                                            outsideThis.__sendHeatCommand(i + 15);
                                        });

                                    } else if (i == 9) {
                                        //
                                        // Current Temperature
                                        //

                                        //let c = ctrl.instanceHmi as TcHmi.Controls.Beckhoff.TcHmiTachometer;
                                        outsideThis.__processTemperature();
                                    }
                                }

                                if (outsideThis.__heatingMode === 3) {
                                    outsideThis.__changeEnableState(false);
                                } else {
                                    outsideThis.__updateButtonHighlight();
                                }

                                outsideThis.__isDialogInitialized = true;

                                // Destroy to free event resources if event is no longer needed.
                                destroyEvent();
                            }
                        );

                        let region = TcHmi.ControlFactory.createEx(
                            "TcHmi.Controls.System.TcHmiRegion", 'dialogHeat_' + this.__id,
                            {
                                "data-tchmi-width": 340,
                                "data-tchmi-height": 260,
                                "data-tchmi-scale-mode": "ScaleToFill",
                                "data-tchmi-target-content": "/TcHmiOpenHabControls/{content}/HeatCtrl.content"
                            });

                        let regionElement = region?.getElement();

                        TcHmi.TopMostLayer.add(this, regionElement, {
                            centerHorizontal: true,
                            centerVertical: true,
                            removeCb: (data) => {
                                if (data.canceled) {
                                    // user clicked on background
                                }

                                for (let i = 0; i < this.__listOfDestroyFunctions.length; ++i) {
                                    let fncDestroy = this.__listOfDestroyFunctions[i];
                                    fncDestroy();
                                }

                                this.__listOfDestroyFunctions = new Array();

                                region?.destroy();
                            }
                        });
                    });
                }

                public __updateButtonHighlight() {
                    let globalHeatingValue = this.__heatingValue as number;
                    let roundedHeatingValue = Math.round(globalHeatingValue);
                    for (let i = 2; i <= 8; ++i) {
                        let btn = this.__listOfCtrl[i]?.instanceHmi as TcHmi.Controls.Beckhoff.TcHmiButton;
                        btn?.setTextFontWeight("Normal");
                        btn?.setTextFontSize(1.0);
                        btn?.setTextFontSizeUnit("em");
                    }
                    switch (roundedHeatingValue) {
                        case 17:
                            {
                                let btn = this.__listOfCtrl[2]?.instanceHmi as TcHmi.Controls.Beckhoff.TcHmiButton;
                                btn?.setTextFontWeight("Bold");
                                btn?.setTextFontSize(1.5);
                                btn?.setTextFontSizeUnit("em");
                            } break;
                        case 18:
                            {
                                let btn = this.__listOfCtrl[3]?.instanceHmi as TcHmi.Controls.Beckhoff.TcHmiButton;
                                btn?.setTextFontWeight("Bold");
                                btn?.setTextFontSize(1.5);
                                btn?.setTextFontSizeUnit("em");
                            } break;
                        case 19:
                            {
                                let btn = this.__listOfCtrl[4]?.instanceHmi as TcHmi.Controls.Beckhoff.TcHmiButton;
                                btn?.setTextFontWeight("Bold");
                                btn?.setTextFontSize(1.5);
                                btn?.setTextFontSizeUnit("em");
                            } break;
                        case 20:
                            {
                                let btn = this.__listOfCtrl[5]?.instanceHmi as TcHmi.Controls.Beckhoff.TcHmiButton;
                                btn?.setTextFontWeight("Bold");
                                btn?.setTextFontSize(1.5);
                                btn?.setTextFontSizeUnit("em");
                            } break;
                        case 21:
                            {
                                let btn = this.__listOfCtrl[6]?.instanceHmi as TcHmi.Controls.Beckhoff.TcHmiButton;
                                btn?.setTextFontWeight("Bold");
                                btn?.setTextFontSize(1.5);
                                btn?.setTextFontSizeUnit("em");
                            } break;
                        case 22:
                            {
                                let btn = this.__listOfCtrl[7]?.instanceHmi as TcHmi.Controls.Beckhoff.TcHmiButton;
                                btn?.setTextFontWeight("Bold");
                                btn?.setTextFontSize(1.5);
                                btn?.setTextFontSizeUnit("em");
                            } break;
                        case 23:
                            {
                                let btn = this.__listOfCtrl[8]?.instanceHmi as TcHmi.Controls.Beckhoff.TcHmiButton;
                                btn?.setTextFontWeight("Bold");
                                btn?.setTextFontSize(1.5);
                                btn?.setTextFontSizeUnit("em");
                            } break;
                    }
                }

                public __changeEnableState(state: boolean) {
                    for (let i = 1; i < this.__listOfCtrl.length - 1; ++i) {
                        let btn = this.__listOfCtrl[i];
                        btn.instanceHmi?.setIsEnabled(state);
                    }
                }

                public __sendHeatBoost(state: boolean) {
                    if (this.__isDialogInitialized === false) return;
                    let levelSymbol = this.getElement().data("tchmi-boost");
                    let symbolExpression = new TcHmi.SymbolExpression(levelSymbol);
                    let symbolName = symbolExpression.getContent() as string;
                    if (TcHmi.Server.isWebsocketReady()) {
                        TcHmi.Server.writeSymbol(symbolName, state, function (data) {
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
                        });
                    }
                }

                public __sendHeatCommand(setPoint: string | number) {
                    if (this.__isDialogInitialized === false) return;
                    let levelSymbol = this.getElement().data("tchmi-heat");
                    let symbolExpression = new TcHmi.SymbolExpression(levelSymbol);
                    let symbolName = symbolExpression.getContent() as string;
                    if (TcHmi.Server.isWebsocketReady()) {
                        TcHmi.Server.writeSymbol(symbolName, setPoint, function (data) {
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
                        });
                    }
                }

                public __sendHeatMode(mode: number) {
                    if (this.__isDialogInitialized === false) return;
                    let levelSymbol = this.getElement().data("tchmi-mode");
                    let symbolExpression = new TcHmi.SymbolExpression(levelSymbol);
                    let symbolName = symbolExpression.getContent() as string;
                    if (TcHmi.Server.isWebsocketReady()) {
                        if (mode >= 1 && mode <= 3) {
                            TcHmi.Server.writeSymbol(symbolName, mode, function (data) {
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
                            });
                        }
                    }
                }

                public __detach() {
                    super.__detach();
                    /**
                     * Disable everything which is not needed while the control is not part of the active dom.
                     * No need to listen to events for example!
                     */
                }

                public destroy() {
                    if (this.__keepAlive) {
                        return;
                    }

                    super.destroy();
                }

                /** ###############################################################################
                 *
                 * S T A R T
                 *
                 * implementation of the state handling
                 */

                protected __heatingValue: number | null;

                public setHeat(valueNew: Number) {
                    let convertedValue = TcHmi.ValueConverter.toNumber(valueNew, 0.0);
                    if (convertedValue === null || undefined) {
                        convertedValue = this.getAttributeDefaultValueInternal("Heat") as number;
                    }
                    this.__heatingValue = convertedValue as number;
                    TcHmi.EventProvider.raise(this.__id + ".onFunctionResultChanged", ["getHeat"]);
                    this.__processValue();
                }

                public getHeat(): number | null {
                    return this.__heatingValue;
                }

                protected __processValue() {
                    let addr = "TcHmiOpenHabControls/SensorHeatingTs/Icons/classic/";
                    let imgName = "heating-off.png";
                    if (this.__heatingValue === null)
                        imgName = "heating-off.png";
                    else if (this.__heatingValue <= 15)
                        imgName = "heating-0.png";
                    else if (this.__heatingValue > 15 && this.__heatingValue <= 25)
                        imgName = "heating-" + this.__heatingValue + ".png";
                    else
                        imgName = "humidity-on.png";
                    let url = 'url(' + addr + imgName + ')';
                    this.__elementTemplateRoot.css("background-image", url);
                    if (this.__elementContainer != null)
                        this.__elementContainer.html(this.__heatingValue + "°C");
                    this.__updateButtonHighlight();
                }

                /**
                 * implementation of the state handling
                 *
                 * E N D
                 *             
                 */



                /** ###############################################################################
                 *
                 * S T A R T
                 *
                 * implementation of the heating mode handling
                 */

                protected __heatingMode: number | null;

                public setMode(valueNew: Number) {

                    let convertedValue = TcHmi.ValueConverter.toNumber(valueNew, 0.0);
                    if (convertedValue === null || undefined) {
                        convertedValue = this.getAttributeDefaultValueInternal("Mode") as number;
                    }

                    if (this.__heatingMode === convertedValue) return;

                    this.__heatingMode = convertedValue as number;
                    TcHmi.EventProvider.raise(this.__id + ".onFunctionResultChanged", ["getMode"]);
                    // 
                    // do not set the mode when it is received
                    // this can result in flickering, because
                    // the homematic protocol is implemented like this:
                    /*
                        <ItemCommandEvent>  habpanel_Heizung2_1ACTIVEPROFILE : 3  =>  
                        <ItemStatePredictedEvent>  habpanel_Heizung2_1ACTIVEPROFILE :   =>  
                        <ItemStateEvent>  habpanel_Heizung2_1ACTIVEPROFILE : 3  =>  
                        <ItemStateChangedEvent>  habpanel_Heizung2_1ACTIVEPROFILE : 3  =>  1
                        <ItemStateEvent>  habpanel_Heizung2_1ACTIVEPROFILE : 1  =>  
                        <ItemStateChangedEvent>  habpanel_Heizung2_1ACTIVEPROFILE : 1  =>  3
                        <ItemStateEvent>  habpanel_Heizung2_1ACTIVEPROFILE : 3  =>  
                        <ItemStateChangedEvent>  habpanel_Heizung2_1ACTIVEPROFILE : 3  =>  1
                     */
                    // I.e. the state transition looks like this: 3 -> 1 -> 3 -> 1
                    // when we like to change from "Summer / Off" (3) to "Normal" (1) mode
                    //
                    //this.__processValue_Mode();

                    if (this.__heatingMode === 3) {
                        this.__changeEnableState(false);
                    } else {
                        this.__changeEnableState(true);
                    }

                    let addr = TcHmi.Environment.getControlBasePathEx(this);
                    let imgName = "state-off.png";
                    switch (this.__heatingMode) {
                        case 1: // normal
                            imgName = "state-normal.png"
                            break;
                        case 2: // holiday
                            imgName = "state-holiday.png"
                            break;
                        case 3: // summer / off
                            imgName = "state-off.png";
                            break;
                    }

                    // stateIcon
                    let finalAddr = addr + "/Icons/classic/" + imgName;
                    let imgState = this.__elementTemplateRoot.find('img');
                    if (imgState !== undefined) {
                        imgState.attr("src", finalAddr);
                    }
                }

                public getMode(): number | null {
                    return this.__heatingMode;
                }

                //private __headModeNames: Array<string> = ["", "Normal", "Holiday", "Summer / Off"];
                protected __processValue_Mode() {
                    (this.__listOfCtrl[0]?.instanceHmi as TcHmi.Controls.Beckhoff.TcHmiCombobox)?.setSelectedId(this.__heatingMode as number);
                }

                /**
                 * implementation of the state handling
                 *
                 * E N D
                 *             
                 */


                /** ###############################################################################
                 *
                 * S T A R T
                 *
                 * implementation of the boost state handling
                 */

                protected __heatingBoostState: boolean | null;

                public setBoost(valueNew: boolean) {

                    let convertedValue = TcHmi.ValueConverter.toBoolean(valueNew, false);
                    if (convertedValue === null || undefined) {
                        convertedValue = this.getAttributeDefaultValueInternal("HeatingBoost") as boolean;
                    }
                    this.__heatingBoostState = convertedValue as boolean;
                    TcHmi.EventProvider.raise(this.__id + ".onFunctionResultChanged", ["getBoost"]);
                    this.__processValue_Mode();
                }

                public getBoost(): boolean | null {
                    return this.__heatingBoostState;
                }

                protected __processValue_BoostState() {
                    //console.log("HeatingBoost: " + this.__heatingBoostState);
                }

                /**
                 * implementation of the state handling
                 *
                 * E N D
                 *             
                 *



                /** ###############################################################################
                 *
                 * S T A R T
                 *
                 * implementation of the boost counter handling
                 */

                protected __heatingBoostCounter: number | null;

                public setBoostCounter(valueNew: Number) {

                    let convertedValue = TcHmi.ValueConverter.toNumber(valueNew, 0.0);
                    if (convertedValue === null || undefined) {
                        convertedValue = this.getAttributeDefaultValueInternal("HeatingBoostCounter") as number;
                    }
                    this.__heatingBoostCounter = convertedValue as number;
                    TcHmi.EventProvider.raise(this.__id + ".onFunctionResultChanged", ["getBoostCounter"]);
                    this.__processValueBoostCounter();
                }

                public getBoostCounter(): number | null {
                    return this.__heatingBoostCounter;
                }

                protected __processValueBoostCounter() {
                    let c = this.__listOfCtrl[1].instanceHmi as TcHmi.Controls.Beckhoff.TcHmiToggleSwitch;
                    if (this.__heatingBoostCounter === 300) {
                        c?.setText("Boost");
                    } else {
                        c?.setText(this.__heatingBoostCounter + "s");

                    }
                }

                /**
                 * implementation of the state handling
                 *
                 * E N D
                 *             
                 */


                /** ###############################################################################
                 *
                 * S T A R T
                 *
                 * implementation of the temperature handling
                 */

                protected __heatingTemperature: number | null;

                public setTemperature(valueNew: Number) {
                    let convertedValue = TcHmi.ValueConverter.toNumber(valueNew, 0.0);
                    if (convertedValue === null || undefined) {
                        convertedValue = this.getAttributeDefaultValueInternal("Heat") as number;
                    }
                    this.__heatingTemperature = convertedValue as number;
                    TcHmi.EventProvider.raise(this.__id + ".onFunctionResultChanged", ["getTemperature"]);
                    this.__processTemperature();
                }

                public getTemperature(): number | null {
                    return this.__heatingTemperature;
                }

                protected __processTemperature() {
                    // 
                    // set current temperature in the control dialog
                    //
                    let ctrl = this.__listOfCtrl[9];
                    let c = ctrl.instanceHmi as TcHmi.Controls.Beckhoff.TcHmiTachometer;
                    c?.setValue(this.__heatingTemperature);
                    c?.setUnit(" °C");
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
TcHmi.Controls.registerEx('SensorHeatingTs', 'TcHmi.Controls.TcHmiOpenHabControls', TcHmi.Controls.TcHmiOpenHabControls.SensorHeatingTs);
