var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var TcHmi;
(function (TcHmi) {
    let Controls;
    (function (Controls) {
        let TcHmiOpenHabControls;
        (function (TcHmiOpenHabControls) {
            var _a, _BaseControlTs_tchmiFQN;
            class BaseControlTs extends TcHmi.Controls.System.TcHmiControl {
                constructor(element, pcElement, attrs) {
                    /** Call base class constructor */
                    super(element, pcElement, attrs);
                    /**
                     * List of control for which jQuery click events registration has to be removed.
                     */
                    this.__clickEventInstances = [];
                    this.__onResolverForTextColorWatchCallback = (data) => {
                        if (this.__isAttached === false) {
                            // While not attached attribute should only be processed once during initializing phase.
                            this.__suspendObjectResolver('textColor');
                        }
                        if (data.error !== TcHmi.Errors.NONE) {
                            if (TCHMI_CONSOLE_LOG_LEVEL >= 1 /* TcHmi.System.LOG_LEVEL.Error */) {
                                TcHmi.Log.errorEx('[Source=Control, Module=' +
                                    this.__type +
                                    (__classPrivateFieldGet(BaseControlTs, _a, "f", _BaseControlTs_tchmiFQN) !== this.__type ? ', Origin=' + __classPrivateFieldGet(BaseControlTs, _a, "f", _BaseControlTs_tchmiFQN) : '') +
                                    ', Id=' +
                                    this.getId() +
                                    ', Attribute=TextColor] Resolving symbols from object failed with error: ' +
                                    TcHmi.Log.buildMessage(data.details));
                            }
                            return;
                        }
                        if (tchmi_equal(data.value, this.__textColor)) {
                            return;
                        }
                        this.__textColor = data.value;
                        TcHmi.EventProvider.raise(this.__id + '.onPropertyChanged', { propertyName: 'TextColor' });
                        this.__processTextColor();
                    };
                }
                /**
                  * If raised, the control object exists in control cache and constructor of each inheritation level was called.
                  * Call attribute processor functions here to initialize default values!
                  */
                __previnit() {
                    // Fetch template root element
                    this.__elementTemplateRoot = this.__element.find('.TcHmi_Controls_TcHmiOpenHabControls_BaseControlTs-Template');
                    if (this.__elementTemplateRoot.length === 0) {
                        throw new Error('Invalid Template.html');
                    }
                    this.__elementContainer = this.__elementTemplateRoot.find('.label');
                    // Call __previnit of base class
                    super.__previnit();
                }
                /**
                 * Is called during control initialize phase after attribute setter have been called based on it's default or initial html dom values.
                 * @returns {void}
                 */
                __init() {
                    super.__init();
                }
                /**
                * Is called by the system after the control instance gets part of the current DOM.
                * Is only allowed to be called from the framework itself!
                */
                __attach() {
                    super.__attach();
                    /**
                     * Initialize everything which is only available while the control is part of the active dom.
                     */
                }
                /**
                * Is called by the system after the control instance is no longer part of the current DOM.
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
                /**
                 * E N D   Text properties/attributes
                 */
                /** ###############################################################################
                 *
                 * S T A R T   TextColor
                 *
                 */
                setTextColor(valueNew) {
                    let convertedValue = TcHmi.ValueConverter.toObject(valueNew);
                    if (convertedValue === null) {
                        convertedValue = this.getAttributeDefaultValueInternal('TextColor');
                    }
                    let resolverInfo = this.__objectResolvers.get('textColor');
                    if (resolverInfo) {
                        if (resolverInfo.watchDestroyer) {
                            resolverInfo.watchDestroyer();
                        }
                        resolverInfo.resolver.destroy();
                    }
                    let resolver = new TcHmi.Symbol.ObjectResolver(convertedValue);
                    this.__objectResolvers.set('textColor', {
                        resolver: resolver,
                        watchCallback: this.__onResolverForTextColorWatchCallback,
                        watchDestroyer: resolver.watch(this.__onResolverForTextColorWatchCallback),
                    });
                }
                getTextColor() {
                    return this.__textColor;
                }
                __processTextColor() {
                    if (this.__elementContainer != null)
                        TcHmi.StyleProvider.processTextColor(this.__elementContainer, this.__textColor);
                    if (this.__elementContainerSub != null)
                        TcHmi.StyleProvider.processTextColor(this.__elementContainerSub, this.__textColor);
                    if (this.__elementContainerSub2 != null)
                        TcHmi.StyleProvider.processTextColor(this.__elementContainerSub2, this.__textColor);
                }
                /**
                 *
                 * E N D   TextColor
                 *
                 */
                /** ###############################################################################
                 *
                 * S T A R T   TextFontFamily
                 *
                 */
                setTextFontFamily(valueNew) {
                    let convertedValue = TcHmi.ValueConverter.toFontFamily(valueNew);
                    if (convertedValue === null) {
                        convertedValue = this.getAttributeDefaultValueInternal('TextFontFamily');
                    }
                    if (convertedValue === this.__textFontFamily) {
                        return;
                    }
                    this.__textFontFamily = convertedValue;
                    TcHmi.EventProvider.raise(this.__id + '.onPropertyChanged', { propertyName: 'TextFontFamily' });
                    this.__processTextFontFamily();
                }
                getTextFontFamily() {
                    return this.__textFontFamily;
                }
                __processTextFontFamily() {
                    if (this.__elementContainer != null)
                        TcHmi.StyleProvider.processFontFamily(this.__elementContainer, this.__textFontFamily);
                    if (this.__elementContainerSub != null)
                        TcHmi.StyleProvider.processFontFamily(this.__elementContainerSub, this.__textFontFamily);
                    if (this.__elementContainerSub2 != null)
                        TcHmi.StyleProvider.processFontFamily(this.__elementContainerSub2, this.__textFontFamily);
                }
                /**
                 *
                 * E N D   TextFontFamily
                 *
                 */
                /** ###############################################################################
                 *
                 * S T A R T   setTextFontSize
                 *
                 */
                setTextFontSize(valueNew) {
                    let convertedValue = TcHmi.ValueConverter.toNumber(valueNew);
                    if (convertedValue === null) {
                        convertedValue = this.getAttributeDefaultValueInternal('TextFontSize');
                    }
                    if (convertedValue === this.__textFontSize) {
                        return;
                    }
                    this.__textFontSize = convertedValue;
                    TcHmi.EventProvider.raise(this.__id + '.onPropertyChanged', { propertyName: 'TextFontSize' });
                    this.__processTextFontSize();
                }
                getTextFontSize() {
                    return this.__textFontSize;
                }
                __processTextFontSize() {
                    if (this.__elementContainer != null)
                        TcHmi.StyleProvider.processFontSize(this.__elementContainer, this.__textFontSize, this.__textFontSizeUnit);
                    if (this.__elementContainerSub != null)
                        TcHmi.StyleProvider.processFontSize(this.__elementContainerSub, this.__textFontSize, this.__textFontSizeUnit);
                    if (this.__elementContainerSub2 != null)
                        TcHmi.StyleProvider.processFontSize(this.__elementContainerSub2, this.__textFontSize, this.__textFontSizeUnit);
                }
                /**
                 *
                 * E N D   setTextFontSize
                 *
                 */
                /** ###############################################################################
                 *
                 * S T A R T   setTextFontSizeUnit
                 *
                 */
                setTextFontSizeUnit(valueNew) {
                    let convertedValue = TcHmi.ValueConverter.toFontSizeUnit(valueNew);
                    if (convertedValue === null) {
                        convertedValue = this.getAttributeDefaultValueInternal('TextFontSizeUnit');
                    }
                    if (convertedValue === this.__textFontSizeUnit) {
                        return;
                    }
                    this.__textFontSizeUnit = convertedValue;
                    TcHmi.EventProvider.raise(this.__id + '.onPropertyChanged', { propertyName: 'TextFontSizeUnit' });
                    this.__processTextFontSizeUnit();
                }
                getTextFontSizeUnit() {
                    return this.__textFontSizeUnit;
                }
                __processTextFontSizeUnit() {
                    if (this.__elementContainer != null)
                        TcHmi.StyleProvider.processFontSize(this.__elementContainer, this.__textFontSize, this.__textFontSizeUnit);
                    if (this.__elementContainerSub != null)
                        TcHmi.StyleProvider.processFontSize(this.__elementContainerSub, this.__textFontSize, this.__textFontSizeUnit);
                    if (this.__elementContainerSub2 != null)
                        TcHmi.StyleProvider.processFontSize(this.__elementContainerSub2, this.__textFontSize, this.__textFontSizeUnit);
                }
                /**
                 *
                 * E N D   setTextFontSizeUnit
                 *
                 */
                /** ###############################################################################
                 *
                 * S T A R T   setTextFontStyle
                 *
                 */
                setTextFontStyle(valueNew) {
                    let convertedValue = TcHmi.ValueConverter.toFontStyle(valueNew);
                    if (convertedValue === null) {
                        convertedValue = this.getAttributeDefaultValueInternal('TextFontStyle');
                    }
                    if (convertedValue === this.__textFontStyle) {
                        return;
                    }
                    this.__textFontStyle = convertedValue;
                    TcHmi.EventProvider.raise(this.__id + '.onPropertyChanged', { propertyName: 'TextFontStyle' });
                    this.__processTextFontStyle();
                }
                getTextFontStyle() {
                    return this.__textFontStyle;
                }
                __processTextFontStyle() {
                    if (this.__elementContainer != null)
                        TcHmi.StyleProvider.processFontStyle(this.__elementContainer, this.__textFontStyle);
                    if (this.__elementContainerSub != null)
                        TcHmi.StyleProvider.processFontStyle(this.__elementContainerSub, this.__textFontStyle);
                    if (this.__elementContainerSub2 != null)
                        TcHmi.StyleProvider.processFontStyle(this.__elementContainerSub2, this.__textFontStyle);
                }
                /**
                 *
                 * E N D   setTextFontStyle
                 *
                 */
                /** ###############################################################################
                 *
                 * S T A R T   setTextFontWeight
                 *
                 */
                setTextFontWeight(valueNew) {
                    let convertedValue = TcHmi.ValueConverter.toFontWeight(valueNew);
                    if (convertedValue === null) {
                        convertedValue = this.getAttributeDefaultValueInternal('TextFontWeight');
                    }
                    if (convertedValue === this.__textFontWeight) {
                        return;
                    }
                    this.__textFontWeight = convertedValue;
                    TcHmi.EventProvider.raise(this.__id + '.onPropertyChanged', { propertyName: 'TextFontWeight' });
                    this.__processTextFontWeight();
                }
                getTextFontWeight() {
                    return this.__textFontWeight;
                }
                __processTextFontWeight() {
                    if (this.__elementContainer != null)
                        TcHmi.StyleProvider.processFontWeight(this.__elementContainer, this.__textFontWeight);
                    if (this.__elementContainerSub != null)
                        TcHmi.StyleProvider.processFontWeight(this.__elementContainerSub, this.__textFontWeight);
                    if (this.__elementContainerSub2 != null)
                        TcHmi.StyleProvider.processFontWeight(this.__elementContainerSub2, this.__textFontWeight);
                }
            }
            _a = BaseControlTs;
            _BaseControlTs_tchmiFQN = { value: 'TcHmi.Controls.TcHmiOpenHabControls.' + _a.name };
            TcHmiOpenHabControls.BaseControlTs = BaseControlTs;
        })(TcHmiOpenHabControls = Controls.TcHmiOpenHabControls || (Controls.TcHmiOpenHabControls = {}));
    })(Controls = TcHmi.Controls || (TcHmi.Controls = {}));
})(TcHmi || (TcHmi = {}));
/**
* Register Control
*/
TcHmi.Controls.registerEx('BaseControlTs', 'TcHmi.Controls.TcHmiOpenHabControls', TcHmi.Controls.TcHmiOpenHabControls.BaseControlTs);
//# sourceMappingURL=BaseControlTs.js.map