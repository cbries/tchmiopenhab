module TcHmi {
    export module Controls {
        export module TcHmiOpenHabControls {
            export class SwipeRegionTs extends TcHmi.Controls.System.TcHmiControl {

                constructor(element: JQuery, pcElement: JQuery, attrs: TcHmi.Controls.ControlAttributeList) {
                    /** Call base class constructor */
                    super(element, pcElement, attrs);
                }

                protected __elementTemplateRoot!: JQuery;

                public __previnit() {
                    // Fetch template root element
                    this.__elementTemplateRoot = this.__element.find('.TcHmi_Controls_TcHmiOpenHabControls_SwipeRegionTs-Template');
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

                /** ###############################################################################
                 *
                 * S T A R T
                 *
                 * implementation of the content files
                 */

                protected __contentFiles: string[] | null;
                protected __contentInstances: System.baseTcHmiControl[] | null;

                public setContentList(valueNew: TcHmi.Controls.System.TcHmiRegion[]) {
                    let convertedValue = TcHmi.ValueConverter.toObject<string[]>(valueNew);
                    if (convertedValue === null || undefined) {
                        convertedValue = this.getAttributeDefaultValueInternal("ContentList") as string[];
                    }
                    this.__contentFiles = convertedValue;
                    TcHmi.EventProvider.raise(this.__id + ".onFunctionResultChanged", ["getContentList"]);
                    this.__processContentFiles();
                }

                public getContentList(): string[] | null {
                    return this.__contentFiles;
                }

                protected __processContentFiles() {

                    let outsideThis = this;

                    this.__cleanUpMemory();

                    if (this.__contentFiles == null || this.__contentFiles.length == 0) {
                        // TODO provide dummy view
                        return;
                    }

                    let targetElement = this.__elementTemplateRoot.find('.owl-carousel')[0];

                    $(targetElement).empty();

                    for (let i = 0; i < this.__contentFiles.length; ++i) {
                        let ctrlInstance = TcHmi.ControlFactory.createEx(
                            'TcHmi.Controls.System.TcHmiRegion',
                            'carouselRegion_' + this.__id + '_' + i, {
                            'data-tchmi-scale-mode': 'ScaleToFill',
                            'data-tchmi-left': 0,
                            'data-tchmi-left-unit': 'px',
                            'data-tchmi-top': 0,
                            'data-tchmi-top-unit': 'px',
                            'data-tchmi-height': 100,
                            'data-tchmi-height-unit': '%',
                            'data-tchmi-width': 100,
                            'data-tchmi-width-unit': '%',
                            'data-tchmi-target-content': this.__contentFiles[i]
                        }, this);
                        if (ctrlInstance == null) continue;
                        this.__contentInstances?.push(ctrlInstance);
                        const container = targetElement.appendChild(document.createElement('div'));
                        container.classList.add('item');
                        container.appendChild(ctrlInstance.getElement()[0]);
                    }

                    if (this.__contentInstances != null && this.__contentInstances.length == this.__contentFiles.length) {

                        let h = this.getHeight() as number;
                        let hItem = h - 55;
                        let hUnit = this.getHeightUnit();
                        let idx = 0;
                        if (this.__contentStartIndex != null)
                            idx = this.__contentStartIndex;
                        if (!isNaN(h)) {

                            if (this.__owlIsCalled == null || this.__owlIsCalled === false) {

                                $(targetElement).owlCarousel({
                                    startPosition: idx,
                                    loop: false,
                                    margin: 0,
                                    nav: this.__showNavigation == null ? this.getAttributeDefaultValueInternal("ShowNavigation") as boolean : false,
                                    dots: this.__showNavigationDots == null ? this.getAttributeDefaultValueInternal("ShowNavigationDots") as boolean : false,
                                    items: 1
                                });

                                this.__owlIsCalled = true;
                            }

                            this.__elementTemplateRoot.find('.owl-carousel div.item').each(function () {
                                $(this).css({
                                    'height': hItem + 'px'
                                });
                            });
                        }
                    }
                }

                private __owlIsCalled: boolean | null;

                protected __cleanUpMemory() {
                    if (this.__contentInstances == null || this.__contentInstances.length == 0) {
                        this.__contentInstances = new Array<System.baseTcHmiControl>();
                        return;
                    }
                    if (this.__contentInstances.length == 0) return;
                    for (let i = 0; i < this.__contentInstances.length; ++i) {
                        let instance = this.__contentInstances[i];
                        instance?.destroy();
                    }
                    this.__contentInstances = new Array<System.baseTcHmiControl>();
                }

                /**
                 * implementation of the content files
                 *
                 * E N D
                 *             
                 */

                /** ###############################################################################
                 *
                 * S T A R T
                 *
                 * implementation of the content files
                 */

                protected __contentStartIndex: number | null;

                public setContentStart(valueNew: number) {
                    let convertedValue = TcHmi.ValueConverter.toNumber(valueNew);
                    if (convertedValue === null || undefined) {
                        convertedValue = this.getAttributeDefaultValueInternal("ContentStart") as number;
                    }
                    this.__contentStartIndex = convertedValue;
                    TcHmi.EventProvider.raise(this.__id + ".onFunctionResultChanged", ["getContentStart"]);
                    this.__processContentFiles();
                }

                public getContentStart(): number | null {
                    return this.__contentStartIndex;
                }

                /**
                 * implementation of the content files
                 *
                 * E N D
                 *             
                 */

                /** ###############################################################################
                 *
                 * S T A R T
                 *
                 * implementation of show navigation
                 */

                protected __showNavigation: boolean | null;
                protected __showNavigationDots: boolean | null;

                public setShowNavigation(valueNew: number) {
                    let convertedValue = TcHmi.ValueConverter.toBoolean(valueNew);
                    if (convertedValue === null || undefined) {
                        convertedValue = this.getAttributeDefaultValueInternal("ShowNavigation") as boolean;
                    }
                    this.__showNavigation = convertedValue;

                    try {
                        this.__elementTemplateRoot.find('.owl-carousel').data('owl.carousel').options.nav = this.__showNavigation;
                        this.__elementTemplateRoot.find('.owl-carousel').trigger('refresh.owl.carousel');
                    } catch (ex) {

                    }

                    TcHmi.EventProvider.raise(this.__id + ".onFunctionResultChanged", ["getShowNavigation"]);

                }

                public getShowNavigation(): boolean | null {
                    return this.__showNavigation;
                }

                public setShowNavigationDots(valueNew: number) {
                    let convertedValue = TcHmi.ValueConverter.toBoolean(valueNew);
                    if (convertedValue === null || undefined) {
                        convertedValue = this.getAttributeDefaultValueInternal("ShowNavigationDots") as boolean;
                    }
                    this.__showNavigationDots = convertedValue;

                    try {
                        this.__elementTemplateRoot.find('.owl-carousel').data('owl.carousel').options.dots = this.__showNavigationDots;
                        this.__elementTemplateRoot.find('.owl-carousel').trigger('refresh.owl.carousel');
                    } catch (ex) {

                    }

                    TcHmi.EventProvider.raise(this.__id + ".onFunctionResultChanged", ["getShowNavigationDots"]);

                }

                public getShowNavigationDots(): boolean | null {
                    return this.__showNavigationDots;
                }

                /**
                 * 
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
TcHmi.Controls.registerEx('SwipeRegionTs', 'TcHmi.Controls.TcHmiOpenHabControls', TcHmi.Controls.TcHmiOpenHabControls.SwipeRegionTs);
