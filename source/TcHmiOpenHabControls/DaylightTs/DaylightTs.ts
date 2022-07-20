module TcHmi {
    export module Controls {
        export module TcHmiOpenHabControls {

            export class DaylightTs extends TcHmi.Controls.TcHmiOpenHabControls.BaseControlTs {
                static readonly #tchmiFQN = 'TcHmi.Controls.TcHmiOpenHabControls.' + this.name;

                constructor(element: JQuery, pcElement: JQuery, attrs: TcHmi.Controls.ControlAttributeList) {
                    /** Call base class constructor */
                    super(element, pcElement, attrs);
                }

                protected __elementTemplateRoot!: JQuery;

                public __previnit() {
                    // Fetch template root element
                    this.__elementTemplateRoot = this.__element.find('.TcHmi_Controls_TcHmiOpenHabControls_DaylightTs-Template');
                    if (this.__elementTemplateRoot.length === 0) {
                        throw new Error('Invalid Template.html');
                    }

                    this.__elementContainerSub2 = this.__elementTemplateRoot.find('.labelSunset');
                    this.__elementContainerSub = this.__elementTemplateRoot.find('.labelSunrise');
                    this.__elementContainer = this.__elementTemplateRoot.find('.labelNow');

                    // Call __previnit of base class
                    //super.__previnit();
                }

                public __init() {
                    super.__init();
                }

                private __intervalId: number;

                public __attach() {
                    super.__attach();

                    /**
                     * Initialize everything which is only available while the control is part of the active dom.
                     */

                    let localThis = this;
                    this.__intervalId = setInterval(function () {
                        localThis.__updateTime(false);
                    }, 1000);

                    /* @ts-ignore */
                    moment.locale("de");
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

                protected __daylightNow: string | null;
                protected __daylightSunset: string | null;
                protected __daylightSunrise: string | null;

                //public getDatetime(): string | null {
                //    return this.__daylightNow;
                //}
                public getSunset(): string | null {
                    return this.__daylightSunset;
                }
                public getSunrise(): string | null {
                    return this.__daylightSunrise;
                }

                //public setDatetime(valueNew: string) {
                //    let convertedValue = TcHmi.ValueConverter.toString(valueNew);
                //    if (convertedValue === null || undefined) {
                //        convertedValue = this.getAttributeDefaultValueInternal("Datetime") as string;
                //    }
                //    this.__daylightNow = convertedValue as string;
                //    TcHmi.EventProvider.raise(this.__id + ".onFunctionResultChanged", ["getDatetime"]);
                //    this.__processValues();
                //}

                public setSunset(valueNew: string) {
                    let convertedValue = TcHmi.ValueConverter.toString(valueNew);
                    if (convertedValue === null || undefined) {
                        convertedValue = this.getAttributeDefaultValueInternal("Sunset") as string;
                    }
                    this.__daylightSunset = convertedValue as string;
                    TcHmi.EventProvider.raise(this.__id + ".onFunctionResultChanged", ["getSunset"]);
                    this.__processValues();
                }

                public setSunrise(valueNew: string) {
                    let convertedValue = TcHmi.ValueConverter.toString(valueNew);
                    if (convertedValue === null || undefined) {
                        convertedValue = this.getAttributeDefaultValueInternal("Sunrise") as string;
                    }
                    this.__daylightSunrise = convertedValue as string;
                    TcHmi.EventProvider.raise(this.__id + ".onFunctionResultChanged", ["getSunrise"]);
                    this.__processValues();
                }

                private __imgNow: JQuery<HTMLElement> | null;
                private __imgSunrise: JQuery<HTMLElement> | null;
                private __imgSunset: JQuery<HTMLElement> | null;
                private __textNow: JQuery<HTMLElement> | null;
                private __textSunrise: JQuery<HTMLElement> | null;
                private __textSunset: JQuery<HTMLElement> | null;

                protected __updateTime(forcePositionCalculation: boolean) {
                    /* @ts-ignore */
                    this.__daylightNow = moment().format();
                    /* @ts-ignore */
                    let t = moment(this.__daylightNow).format('LTS');

                    /* @ts-ignore */
                    if (moment().second() % 10 == 0 || forcePositionCalculation) {
                        this.__calculatePercentages();
                        if (this.__elementContainer != null && this.__daylightNow != null) {
                            let w = this.__elementContainer.css("width");
                            let leftCalc = 'calc(' + this.__percentageDayDone + '% - (' + w + ' / 2))';
                            this.__elementContainer.css("left", leftCalc);
                            /* @ts-ignore */
                            let t = moment(this.__daylightNow).format('LTS');
                            if (this.__textNow == null)
                                this.__textNow = this.__elementContainer?.find('.text');
                            this.__textNow?.html(t);
                        }
                    } else {
                        this.__textNow?.html(t);
                    }
                }

                protected __processValues() {

                    /* @ts-ignore */
                    this.__daylightNow = moment().format();

                    if (this.__daylightSunset == null)
                        /* @ts-ignore */
                        this.__daylightSunset = moment().hour(8).format();

                    if (this.__daylightSunrise == null)
                        /* @ts-ignore */
                        this.__daylightSunrise = moment().hour(20).format();

                    this.__calculatePercentages();

                    let baseAddr = TcHmi.Environment.getControlBasePathEx(this);
                    if (this.__imgNow == null)
                        this.__imgNow = this.__elementTemplateRoot.find('.imageNow img');
                    if (this.__imgSunrise == null)
                        this.__imgSunrise = this.__elementTemplateRoot.find('.imageSunrise img');
                    if (this.__imgSunset == null)
                        this.__imgSunset = this.__elementTemplateRoot.find('.imageSunset img');

                    this.__imgNow.attr("src", baseAddr + "/Icons/time.png");
                    this.__imgSunrise.attr("src", baseAddr + "/Icons/sunrise.svg");
                    this.__imgSunset.attr("src", baseAddr + "/Icons/sunset.svg");

                    //console.log("Done: " + this.__percentageDayDone +  "    Sunrise: " + this.__percentageSunrise + "    Sunset: " +  this.__percentageSunset)

                    this.__updateTime(true);

                    // sunrise
                    if (this.__elementContainerSub != null && this.__daylightSunrise != null) {
                        let w = this.__elementContainerSub.css("width");
                        let leftCalc = 'calc(' + this.__percentageSunrise + '% - (' + w + ' / 2))';

                        this.__elementContainerSub.css("left", leftCalc);
                        //this.__imgSunrise.parent().css("left", leftCalc);
                        /* @ts-ignore */
                        let t = moment(this.__daylightSunrise).format('LT');
                        if (this.__textSunrise == null)
                            this.__textSunrise = this.__elementContainerSub?.find('.text');
                        this.__textSunrise?.html(t);

                        let pleft = this.__percentageSunrise - 5;
                        let pright = this.__percentageSunrise + 5;
                        if (this.__percentageDayDone >= pleft && this.__percentageDayDone <= pright) {
                            this.__textSunrise?.hide();
                        } else {
                            this.__textSunrise?.show();
                        }

                    }

                    // sunset
                    if (this.__elementContainerSub2 != null && this.__daylightSunset != null) {
                        let w = this.__elementContainerSub2.css("width");
                        let leftCalc = 'calc(' + this.__percentageSunset + '% - (' + w + ' / 2))';

                        this.__elementContainerSub2.css("left", leftCalc);
                        //this.__imgSunset.parent().css("left", leftCalc);
                        /* @ts-ignore */
                        let t = moment(this.__daylightSunset).format('LT');
                        if (this.__textSunset == null)
                            this.__textSunset = this.__elementContainerSub2?.find('.text');
                        this.__textSunset?.html(t);

                        let pleft = this.__percentageSunset - 5;
                        let pright = this.__percentageSunset + 5;
                        if (this.__percentageDayDone >= pleft && this.__percentageDayDone <= pright) {
                            this.__textSunset?.hide();
                        } else {
                            this.__textSunset?.show();
                        }
                    }
                }

                protected __percentageDayDone: number;
                protected __percentageSunrise: number;
                protected __percentageSunset: number;

                protected __calculatePercentages() {
                    /* @ts-ignore */
                    let pstart = moment().startOf('day').unix();
                    /* @ts-ignore */
                    let pend = moment().endOf('day').unix();

                    /* @ts-ignore */
                    let pcurrent = moment(this.__daylightNow).unix();
                    let delta = pend - pstart;
                    let left = pend - pcurrent;
                    let percentRemain = left / delta * 100.0;
                    let percentDone = 100.0 - percentRemain;
                    //console.log("Vergangen:   " + percentDone + " %");
                    //console.log("Verbleibend: " + percentRemain + " %");
                    this.__percentageDayDone = percentDone;

                    /* @ts-ignore */
                    let psunrise = moment(this.__daylightSunrise).unix();
                    let psunriseDelta = pend - psunrise;
                    let psunriseRemain = psunriseDelta / delta * 100.0;
                    let psunriseDone = 100.0 - psunriseRemain;
                    //console.log("Sunrise:     " + psunriseDone + " %");
                    this.__percentageSunrise = psunriseDone;

                    /* @ts-ignore */
                    let psunset = moment(this.__daylightSunset).unix();
                    let psunsetDelta = pend - psunset;
                    let psunsetRemain = psunsetDelta / delta * 100.0;
                    let psunsetDone = 100.0 - psunsetRemain;
                    //console.log("Sunset:      " + psunsetDone + " %");
                    this.__percentageSunset = psunsetDone;
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
TcHmi.Controls.registerEx('DaylightTs', 'TcHmi.Controls.TcHmiOpenHabControls', TcHmi.Controls.TcHmiOpenHabControls.DaylightTs);
