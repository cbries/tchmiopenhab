module TcHmi {
    export module Controls {

        export module TcHmiOpenHabControls {
            export interface LookupItem {
                resolvedValue: number,
                rangeStart: number,
                rangeEnd: number
            }
        }

        export module TcHmiOpenHabControls {
            export class BlindsTs extends TcHmi.Controls.System.TcHmiControl {
                static readonly #tchmiFQN = 'TcHmi.Controls.TcHmiOpenHabControls.' + this.name;

                constructor(element: JQuery, pcElement: JQuery, attrs: TcHmi.Controls.ControlAttributeList) {
                    /** Call base class constructor */
                    super(element, pcElement, attrs);
                }

                protected __elementTemplateRoot!: JQuery;

                protected __clickEventInstances: Array<any> = [];

                public __previnit() {
                    // Fetch template root element
                    this.__elementTemplateRoot = this.__element.find('.TcHmi_Controls_TcHmiOpenHabControls_BlindsTs-Template');
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

                    this.__elementTemplateRoot.on("click",
                        () => {

                            let outsideThis = this;
                            var destroyEvent = TcHmi.EventProvider.register(
                                'BlindsTs_Button_Auf.onAttached',
                                function (evt, data) {
                                    //
                                    // register button click events for the dialog
                                    //
                                    let btnOpen100 = regionElement?.find('#BlindsTs_Button_Auf');
                                    btnOpen100?.on("click", () => { outsideThis.__sendBlindState(100); });
                                    outsideThis.__clickEventInstances.push(btnOpen100);

                                    let btnOpen75 = regionElement?.find('#BlindsTs_Button_Auf_75');
                                    btnOpen75?.on("click", () => { outsideThis.__sendBlindState(75); });
                                    outsideThis.__clickEventInstances.push(btnOpen75);

                                    let btnOpen50 = regionElement?.find('#BlindsTs_Button_Auf_50');
                                    btnOpen50?.on("click", () => { outsideThis.__sendBlindState(50); });
                                    outsideThis.__clickEventInstances.push(btnOpen50);

                                    let btnOpen25 = regionElement?.find('#BlindsTs_Button_Auf_25');
                                    btnOpen25?.on("click", () => { outsideThis.__sendBlindState(25); });
                                    outsideThis.__clickEventInstances.push(btnOpen25);

                                    let btnOpen10 = regionElement?.find('#BlindsTs_Button_Auf_10');
                                    btnOpen10?.on("click", () => { outsideThis.__sendBlindState(10); });
                                    outsideThis.__clickEventInstances.push(btnOpen10);

                                    let btnOpenLamellen = regionElement?.find('#BlindsTs_Button_Auf_Lamellen');
                                    btnOpenLamellen?.on("click", () => { outsideThis.__sendBlindState(1); });
                                    outsideThis.__clickEventInstances.push(btnOpenLamellen);

                                    let btnCloseFull = regionElement?.find('#BlindsTs_Button_Geschlossen');
                                    btnCloseFull?.on("click", () => { outsideThis.__sendBlindState(0); });
                                    outsideThis.__clickEventInstances.push(btnCloseFull);

                                    let btnUp = regionElement?.find('#BlindsTs_Button_Up');
                                    btnUp?.on("click", () => { outsideThis.__sendBlindCommand("UP") });
                                    outsideThis.__clickEventInstances.push(btnUp);

                                    let btnStop = regionElement?.find('#BlindsTs_Button_Stop');
                                    btnStop?.on("click", () => { outsideThis.__sendBlindCommand("STOP") });
                                    outsideThis.__clickEventInstances.push(btnStop);

                                    let btnDown = regionElement?.find('#BlindsTs_Button_Down');
                                    btnDown?.on("click", () => { outsideThis.__sendBlindCommand("DOWN") });
                                    outsideThis.__clickEventInstances.push(btnDown);

                                    // Destroy to free event resources if event is no longer needed.
                                    destroyEvent();
                                }
                            );

                            let region = TcHmi.ControlFactory.createEx(
                                "TcHmi.Controls.System.TcHmiRegion", 'dialogBlind_' + this.__id,
                                {
                                    "data-tchmi-width": 340,
                                    "data-tchmi-height": 260,
                                    "data-tchmi-scale-mode": "ScaleToFill",
                                    "data-tchmi-border-width": {
                                        "left": 2,
                                        "right": 2,
                                        "top": 2,
                                        "bottom": 2,
                                        "leftUnit": "px",
                                        "rightUnit": "px",
                                        "topUnit": "px",
                                        "bottomUnit": "px"
                                    },
                                    "data-tchmi-border-style": {
                                        "left": "Solid",
                                        "right": "Solid",
                                        "top": "Solid",
                                        "bottom": "Solid"
                                    },
                                    "data-tchmi-border-radius": {
                                        "topLeft": 8.0,
                                        "topRight": 8.0,
                                        "bottomLeft": 8.0,
                                        "bottomRight": 8.0,
                                        "topLeftUnit": "px",
                                        "topRightUnit": "px",
                                        "bottomLeftUnit": "px",
                                        "bottomRightUnit": "px"
                                    },
                                    "data-tchmi-target-content": "/TcHmiOpenHabControls/{content}/BlindsCtrl.content"
                                });

                            let regionElement = region?.getElement();

                            TcHmi.TopMostLayer.add(this, regionElement, {
                                centerHorizontal: true,
                                centerVertical: true,
                                removeCb: (data) => {
                                    if (data.canceled) {
                                        // user clicked on background
                                    }

                                    //
                                    // cleanup "click" events
                                    //
                                    const maxIdx = outsideThis.__clickEventInstances.length;
                                    for (let i = 0; i < maxIdx; ++i) {
                                        let ctrl = outsideThis.__clickEventInstances[i];
                                        ctrl?.off("click");
                                    }

                                    region?.destroy();
                                }
                            });
                        });
                }

                public __sendBlindCommand(cmd: string) {
                    let levelSymbol = this.getElement().data("tchmi-level");
                    let symbolExpression = new TcHmi.SymbolExpression(levelSymbol);
                    if (TcHmi.Server.isWebsocketReady()) {
                        let symbolName = symbolExpression.getContent() as string;
                        let value = -1;
                        if (cmd === "UP") value = 0;
                        else if (cmd === "DOWN") value = 100;
                        else value = -1;
                        TcHmi.Server.writeSymbol(symbolName, value, function (data) {
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

                public __sendBlindState(stateValue: number) {
                    // 100%  Auf             __levelValueMapping[0]
                    // 75%   Auf             __levelValueMapping[1]
                    // 50%   Auf             __levelValueMapping[2]
                    // 25%   Auf             __levelValueMapping[3]
                    // 10%   Auf             __levelValueMapping[4]
                    // 1%    Lamellen        __levelValueMapping[5]
                    // 0%    Geschlossen     __levelValueMapping[6]

                    let targetValue = 0;
                    if (this.__levelValueMapping === null)
                        targetValue = 0;
                    switch (stateValue) {
                        case 100:
                            targetValue = (this.__levelValueMapping as TcHmiOpenHabControls.LookupItem[])[0].rangeStart;
                            break;
                        case 75:
                            targetValue = (this.__levelValueMapping as TcHmiOpenHabControls.LookupItem[])[1].rangeStart;
                            break;
                        case 50:
                            targetValue = (this.__levelValueMapping as TcHmiOpenHabControls.LookupItem[])[2].rangeStart;
                            break;
                        case 25:
                            targetValue = (this.__levelValueMapping as TcHmiOpenHabControls.LookupItem[])[3].rangeStart;
                            break;
                        case 10:
                            targetValue = (this.__levelValueMapping as TcHmiOpenHabControls.LookupItem[])[4].rangeStart;
                            break;
                        case 1:
                            targetValue = (this.__levelValueMapping as TcHmiOpenHabControls.LookupItem[])[5].rangeStart;
                            break;
                        case 0:
                            targetValue = (this.__levelValueMapping as TcHmiOpenHabControls.LookupItem[])[6].rangeStart;
                            break;
                    }

                    let levelSymbol = this.getElement().data("tchmi-level");
                    let symbolExpression = new TcHmi.SymbolExpression(levelSymbol);
                    if (TcHmi.Server.isWebsocketReady()) {
                        let symbolName = symbolExpression.getContent() as string;

                        //console.log("symbolName: " + symbolName);
                        //console.log("targetValue: " + targetValue);

                        TcHmi.Server.writeSymbol(symbolName, targetValue,);
                    }
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

                protected __levelValue: number | null;
                protected __levelValueMapping: TcHmiOpenHabControls.LookupItem[] | null;

                public setLevel(valueNew: Number) {

                    let convertedValue = TcHmi.ValueConverter.toNumber(valueNew, 0.0);
                    if (convertedValue === null || undefined) {
                        convertedValue = this.getAttributeDefaultValueInternal("Level") as number;
                    }
                    this.__levelValue = convertedValue as number;
                    //this.__elementContainer.html(this.__temperatureValue + "°C");
                    TcHmi.EventProvider.raise(this.__id + ".onFunctionResultChanged", ["getLevel"]);
                    this.__processValue();
                }

                public getLevel(): number | null {
                    return this.__levelValue;
                }

                protected __processValue() {
                    let addr = TcHmi.Environment.getControlBasePathEx(this);
                    let imgName = "blinds.png";

                    let localLevelValue = 100 - (this.__levelValue as number);

                    if (localLevelValue !== null && this.__levelValueMapping !== null) {

                        let maxIdx = this.__levelValueMapping.length;
                        for (let i = 0; i < maxIdx; ++i) {
                            const item = this.__levelValueMapping[i];
                            if (item === null) continue;

                            if (localLevelValue >= item.rangeStart && localLevelValue <= item.rangeEnd) {
                                localLevelValue = 100 - item.resolvedValue;
                                break;
                            }
                        }
                    }

                    if (localLevelValue === null) imgName = "blinds-0.png";
                    else if (localLevelValue === 0) imgName = "blinds-0.png";
                    else if (localLevelValue <= 10) imgName = "blinds-10.png";
                    else if (localLevelValue <= 20) imgName = "blinds-20.png";
                    else if (localLevelValue <= 30) imgName = "blinds-30.png";
                    else if (localLevelValue <= 40) imgName = "blinds-40.png";
                    else if (localLevelValue <= 50) imgName = "blinds-50.png";
                    else if (localLevelValue <= 60) imgName = "blinds-60.png";
                    else if (localLevelValue <= 70) imgName = "blinds-70.png";
                    else if (localLevelValue <= 80) imgName = "blinds-80.png";
                    else if (localLevelValue <= 90) imgName = "blinds-90.png";
                    else imgName = "blinds-100.png";

                    let url = 'url(' + addr + "/Icons/classic/" + imgName + ')';
                    this.__elementTemplateRoot.css("background-image", url);

                    let lbl = this.__elementTemplateRoot.find('.labelPercentage');
                    if (lbl !== undefined) {
                        let html = localLevelValue?.toString();
                        lbl.html(html as string);
                    }
                }

                public setLevelMapping(valueNew: TcHmiOpenHabControls.LookupItem[]) {
                    let convertedValue = TcHmi.ValueConverter.toObject<TcHmiOpenHabControls.LookupItem[]>(valueNew);
                    if (convertedValue === null || undefined) {
                        convertedValue = this.getAttributeDefaultValueInternal("LevelMapping") as TcHmiOpenHabControls.LookupItem[];
                    }
                    this.__levelValueMapping = convertedValue;
                    //this.__elementContainer.html(this.__temperatureValue + "°C");
                    TcHmi.EventProvider.raise(this.__id + ".onFunctionResultChanged", ["getLevelMapping"]);
                    this.__processValueMapping();
                }

                public getLevelMapping(): TcHmiOpenHabControls.LookupItem[] | null {
                    return this.__levelValueMapping;
                }

                protected __processValueMapping() {

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
TcHmi.Controls.registerEx('BlindsTs', 'TcHmi.Controls.TcHmiOpenHabControls', TcHmi.Controls.TcHmiOpenHabControls.BlindsTs);
