module TcHmi {
    export module Controls {
        export module TcHmiOpenHabControls {
            export class BaseControlTs extends TcHmi.Controls.System.TcHmiControl {
                static readonly #tchmiFQN = 'TcHmi.Controls.TcHmiOpenHabControls.' + this.name;

                public constructor(element: JQuery, pcElement: JQuery, attrs: TcHmi.Controls.ControlAttributeList) {
                    /** Call base class constructor */
                    super(element, pcElement, attrs);
                }

                protected __elementTemplateRoot!: JQuery;

                /**
                 * This ist the element which get the font settings applied.
                 * E.g. `this.__elementContainer = this.__elementTemplateRoot.find('.label');`
                 * Should be called by all specializations of this control.
                 */
                protected __elementContainer: JQuery | null;
                protected __elementContainerSub: JQuery | null;
                protected __elementContainerSub2: JQuery | null;

                /**
                  * If raised, the control object exists in control cache and constructor of each inheritation level was called.
                  * Call attribute processor functions here to initialize default values!
                  */
                public __previnit() {
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
                public __init() {
                    super.__init();
                }

                /**
                * Is called by the system after the control instance gets part of the current DOM.
                * Is only allowed to be called from the framework itself!
                */
                public __attach() {
                    super.__attach();

                    /**
                     * Initialize everything which is only available while the control is part of the active dom.
                     */
                }

                /**
                * Is called by the system after the control instance is no longer part of the current DOM.
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
                 * S T A R T   Text properties/attributes
                 */

                protected __textColor: TcHmi.SolidColor | null | undefined;
                protected __textFontFamily: FontFamily | null | undefined;
                protected __textFontSize: number | undefined;
                protected __textFontSizeUnit: FontSizeUnit | undefined;
                protected __textFontStyle: FontStyle | undefined;
                protected __textFontWeight: FontWeight | undefined;

                /**
                 * E N D   Text properties/attributes
                 */

                /** ###############################################################################
                 *
                 * S T A R T   TextColor
                 *
                 */

                public setTextColor(valueNew: SolidColor | null) {
                    let convertedValue = TcHmi.ValueConverter.toObject<SolidColor>(valueNew);
                    if (convertedValue === null) {
                        convertedValue = this.getAttributeDefaultValueInternal('TextColor') as SolidColor;
                    }

                    let resolverInfo = this.__objectResolvers.get('textColor');

                    if (resolverInfo) {
                        if (resolverInfo.watchDestroyer) {
                            resolverInfo.watchDestroyer();
                        }
                        resolverInfo.resolver.destroy();
                    }

                    let resolver = new Symbol.ObjectResolver(convertedValue);

                    this.__objectResolvers.set('textColor', {
                        resolver: resolver,
                        watchCallback: this.__onResolverForTextColorWatchCallback,
                        watchDestroyer: resolver.watch(this.__onResolverForTextColorWatchCallback),
                    });
                }

                public getTextColor() {
                    return this.__textColor;
                }

                protected __onResolverForTextColorWatchCallback = (
                    data: Symbol.ObjectResolver.IWatchResultObject<SolidColor>
                ) => {
                    if (this.__isAttached === false) {
                        // While not attached attribute should only be processed once during initializing phase.
                        this.__suspendObjectResolver('textColor');
                    }

                    if (data.error !== TcHmi.Errors.NONE) {
                        if (TCHMI_CONSOLE_LOG_LEVEL >= TcHmi.System.LOG_LEVEL.Error) {
                            TcHmi.Log.errorEx(
                                '[Source=Control, Module=' +
                                this.__type +
                                (BaseControlTs.#tchmiFQN !== this.__type ? ', Origin=' + BaseControlTs.#tchmiFQN : '') +
                                ', Id=' +
                                this.getId() +
                                ', Attribute=TextColor] Resolving symbols from object failed with error: ' +
                                TcHmi.Log.buildMessage(data.details)
                            );
                        }
                        return;
                    }

                    if (tchmi_equal(data.value, this.__textColor)) {
                        return;
                    }

                    this.__textColor = data.value;

                    TcHmi.EventProvider.raise(this.__id + '.onPropertyChanged', { propertyName: 'TextColor' });

                    this.__processTextColor();
                }

                protected __processTextColor() {
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

                public setTextFontFamily(valueNew: FontFamily | null) {
                    let convertedValue = TcHmi.ValueConverter.toFontFamily(valueNew);
                    if (convertedValue === null) {
                        convertedValue = this.getAttributeDefaultValueInternal('TextFontFamily') as FontFamily;
                    }

                    if (convertedValue === this.__textFontFamily) {
                        return;
                    }

                    this.__textFontFamily = convertedValue;

                    TcHmi.EventProvider.raise(this.__id + '.onPropertyChanged', { propertyName: 'TextFontFamily' });

                    this.__processTextFontFamily();
                }

                public getTextFontFamily() {
                    return this.__textFontFamily;
                }

                protected __processTextFontFamily() {
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

                public setTextFontSize(valueNew: number | null) {
                    let convertedValue = TcHmi.ValueConverter.toNumber(valueNew);
                    if (convertedValue === null) {
                        convertedValue = this.getAttributeDefaultValueInternal('TextFontSize');
                    }

                    if (convertedValue === this.__textFontSize) {
                        return;
                    }

                    this.__textFontSize = convertedValue as number;

                    TcHmi.EventProvider.raise(this.__id + '.onPropertyChanged', { propertyName: 'TextFontSize' });

                    this.__processTextFontSize();
                }

                public getTextFontSize() {
                    return this.__textFontSize;
                }

                protected __processTextFontSize() {
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

                public setTextFontSizeUnit(valueNew: FontSizeUnit | null) {
                    let convertedValue = TcHmi.ValueConverter.toFontSizeUnit(valueNew);
                    if (convertedValue === null) {
                        convertedValue = this.getAttributeDefaultValueInternal('TextFontSizeUnit') as FontSizeUnit;
                    }

                    if (convertedValue === this.__textFontSizeUnit) {
                        return;
                    }

                    this.__textFontSizeUnit = convertedValue as FontSizeUnit;

                    TcHmi.EventProvider.raise(this.__id + '.onPropertyChanged', { propertyName: 'TextFontSizeUnit' });

                    this.__processTextFontSizeUnit();
                }

                public getTextFontSizeUnit() {
                    return this.__textFontSizeUnit;
                }

                protected __processTextFontSizeUnit() {
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

                public setTextFontStyle(valueNew: FontStyle | null) {
                    let convertedValue = TcHmi.ValueConverter.toFontStyle(valueNew);
                    if (convertedValue === null) {
                        convertedValue = this.getAttributeDefaultValueInternal('TextFontStyle') as FontStyle;
                    }

                    if (convertedValue === this.__textFontStyle) {
                        return;
                    }

                    this.__textFontStyle = convertedValue as FontStyle;

                    TcHmi.EventProvider.raise(this.__id + '.onPropertyChanged', { propertyName: 'TextFontStyle' });

                    this.__processTextFontStyle();
                }

                public getTextFontStyle() {
                    return this.__textFontStyle;
                }

                protected __processTextFontStyle() {
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

                public setTextFontWeight(valueNew: FontWeight | null) {
                    let convertedValue = TcHmi.ValueConverter.toFontWeight(valueNew);
                    if (convertedValue === null) {
                        convertedValue = this.getAttributeDefaultValueInternal('TextFontWeight') as FontWeight;
                    }

                    if (convertedValue === this.__textFontWeight) {
                        return;
                    }

                    this.__textFontWeight = convertedValue as FontWeight;

                    TcHmi.EventProvider.raise(this.__id + '.onPropertyChanged', { propertyName: 'TextFontWeight' });

                    this.__processTextFontWeight();
                }

                public getTextFontWeight() {
                    return this.__textFontWeight;
                }

                protected __processTextFontWeight() {
                    if (this.__elementContainer != null)
                        TcHmi.StyleProvider.processFontWeight(this.__elementContainer, this.__textFontWeight);
                    if (this.__elementContainerSub != null)
                        TcHmi.StyleProvider.processFontWeight(this.__elementContainerSub, this.__textFontWeight);
                    if (this.__elementContainerSub2 != null)
                        TcHmi.StyleProvider.processFontWeight(this.__elementContainerSub2, this.__textFontWeight);
                }

                /**
                 *
                 * E N D   setTextFontWeight
                 *             
                 */

            }
        }
    }
}

/**
* Register Control
*/
TcHmi.Controls.registerEx('BaseControlTs', 'TcHmi.Controls.TcHmiOpenHabControls', TcHmi.Controls.TcHmiOpenHabControls.BaseControlTs);
