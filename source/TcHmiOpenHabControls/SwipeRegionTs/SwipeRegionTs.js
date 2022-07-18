var TcHmi;
(function (TcHmi) {
    let Controls;
    (function (Controls) {
        let TcHmiOpenHabControls;
        (function (TcHmiOpenHabControls) {
            class SwipeRegionTs extends TcHmi.Controls.System.TcHmiControl {
                constructor(element, pcElement, attrs) {
                    /** Call base class constructor */
                    super(element, pcElement, attrs);
                }
                __previnit() {
                    // Fetch template root element
                    this.__elementTemplateRoot = this.__element.find('.TcHmi_Controls_TcHmiOpenHabControls_SwipeRegionTs-Template');
                    if (this.__elementTemplateRoot.length === 0) {
                        throw new Error('Invalid Template.html');
                    }
                    // Call __previnit of base class
                    super.__previnit();
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
                __detach() {
                    super.__detach();
                    /**
                     * Disable everything which is not needed while the control is not part of the active dom.
                     * No need to listen to events for example!
                     */
                }
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
                setContentList(valueNew) {
                    let convertedValue = TcHmi.ValueConverter.toObject(valueNew);
                    if (convertedValue === null || undefined) {
                        convertedValue = this.getAttributeDefaultValueInternal("ContentList");
                    }
                    this.__contentFiles = convertedValue;
                    TcHmi.EventProvider.raise(this.__id + ".onFunctionResultChanged", ["getContentList"]);
                    this.__processContentFiles();
                }
                getContentList() {
                    return this.__contentFiles;
                }
                __processContentFiles() {
                    var _a;
                    let outsideThis = this;
                    this.__cleanUpMemory();
                    if (this.__contentFiles == null || this.__contentFiles.length == 0) {
                        // TODO provide dummy view
                        return;
                    }
                    let targetElement = this.__elementTemplateRoot.find('.owl-carousel')[0];
                    $(targetElement).empty();
                    for (let i = 0; i < this.__contentFiles.length; ++i) {
                        let ctrlInstance = TcHmi.ControlFactory.createEx('TcHmi.Controls.System.TcHmiRegion', 'carouselRegion_' + this.__id + '_' + i, {
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
                        if (ctrlInstance == null)
                            continue;
                        (_a = this.__contentInstances) === null || _a === void 0 ? void 0 : _a.push(ctrlInstance);
                        const container = targetElement.appendChild(document.createElement('div'));
                        container.classList.add('item');
                        container.appendChild(ctrlInstance.getElement()[0]);
                    }
                    if (this.__contentInstances != null && this.__contentInstances.length == this.__contentFiles.length) {
                        let h = this.getHeight();
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
                                    nav: this.__showNavigation == null ? this.getAttributeDefaultValueInternal("ShowNavigation") : false,
                                    dots: this.__showNavigationDots == null ? this.getAttributeDefaultValueInternal("ShowNavigationDots") : false,
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
                __cleanUpMemory() {
                    if (this.__contentInstances == null || this.__contentInstances.length == 0) {
                        this.__contentInstances = new Array();
                        return;
                    }
                    if (this.__contentInstances.length == 0)
                        return;
                    for (let i = 0; i < this.__contentInstances.length; ++i) {
                        let instance = this.__contentInstances[i];
                        instance === null || instance === void 0 ? void 0 : instance.destroy();
                    }
                    this.__contentInstances = new Array();
                }
                setContentStart(valueNew) {
                    let convertedValue = TcHmi.ValueConverter.toNumber(valueNew);
                    if (convertedValue === null || undefined) {
                        convertedValue = this.getAttributeDefaultValueInternal("ContentStart");
                    }
                    this.__contentStartIndex = convertedValue;
                    TcHmi.EventProvider.raise(this.__id + ".onFunctionResultChanged", ["getContentStart"]);
                    this.__processContentFiles();
                }
                getContentStart() {
                    return this.__contentStartIndex;
                }
                setShowNavigation(valueNew) {
                    let convertedValue = TcHmi.ValueConverter.toBoolean(valueNew);
                    if (convertedValue === null || undefined) {
                        convertedValue = this.getAttributeDefaultValueInternal("ShowNavigation");
                    }
                    this.__showNavigation = convertedValue;
                    try {
                        this.__elementTemplateRoot.find('.owl-carousel').data('owl.carousel').options.nav = this.__showNavigation;
                        this.__elementTemplateRoot.find('.owl-carousel').trigger('refresh.owl.carousel');
                    }
                    catch (ex) {
                    }
                    TcHmi.EventProvider.raise(this.__id + ".onFunctionResultChanged", ["getShowNavigation"]);
                }
                getShowNavigation() {
                    return this.__showNavigation;
                }
                setShowNavigationDots(valueNew) {
                    let convertedValue = TcHmi.ValueConverter.toBoolean(valueNew);
                    if (convertedValue === null || undefined) {
                        convertedValue = this.getAttributeDefaultValueInternal("ShowNavigationDots");
                    }
                    this.__showNavigationDots = convertedValue;
                    try {
                        this.__elementTemplateRoot.find('.owl-carousel').data('owl.carousel').options.dots = this.__showNavigationDots;
                        this.__elementTemplateRoot.find('.owl-carousel').trigger('refresh.owl.carousel');
                    }
                    catch (ex) {
                    }
                    TcHmi.EventProvider.raise(this.__id + ".onFunctionResultChanged", ["getShowNavigationDots"]);
                }
                getShowNavigationDots() {
                    return this.__showNavigationDots;
                }
            }
            TcHmiOpenHabControls.SwipeRegionTs = SwipeRegionTs;
        })(TcHmiOpenHabControls = Controls.TcHmiOpenHabControls || (Controls.TcHmiOpenHabControls = {}));
    })(Controls = TcHmi.Controls || (TcHmi.Controls = {}));
})(TcHmi || (TcHmi = {}));
/**
* Register Control
*/
TcHmi.Controls.registerEx('SwipeRegionTs', 'TcHmi.Controls.TcHmiOpenHabControls', TcHmi.Controls.TcHmiOpenHabControls.SwipeRegionTs);
//# sourceMappingURL=SwipeRegionTs.js.map