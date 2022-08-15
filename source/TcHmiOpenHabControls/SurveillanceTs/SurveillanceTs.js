var TcHmi;
(function (TcHmi) {
    let Controls;
    (function (Controls) {
        let TcHmiOpenHabControls;
        (function (TcHmiOpenHabControls) {
            var _a, _SurveillanceTs_tchmiFQN;
            class SurveillanceTs extends TcHmi.Controls.Beckhoff.TcHmiImage {
                constructor(element, pcElement, attrs) {
                    /** Call base class constructor */
                    super(element, pcElement, attrs);
                }
                __previnit() {
                    this.__elementTemplateRoot = this.__element.find('.TcHmi_Controls_Beckhoff_TcHmiImage-template');
                    if (this.__elementTemplateRoot.length === 0) {
                        throw new Error('Invalid Template.html');
                    }
                    // Call __previnit of base class
                    super.__previnit();
                }
                __init() {
                    super.__init();
                    let outsideThis = this;
                    // init image source
                    let addr = TcHmi.Environment.getControlBasePathEx(this);
                    outsideThis.setSrc(addr + "/Icons/novideo.gif");
                }
                __attach() {
                    super.__attach();
                    let outsideThis = this;
                    outsideThis.__elementTemplateRoot.on("click", () => {
                        outsideThis.showCameraInFront();
                    });
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
                showCameraInFront() {
                    let outsideThis = this;
                    let imgCamera = TcHmi.ControlFactory.createEx("TcHmi.Controls.Beckhoff.TcHmiImage", 'dialogCamera_' + this.__id, {
                        "data-tchmi-width": 800,
                        "data-tchmi-height": 480,
                        "data-tchmi-src": outsideThis.getSrc()
                    });
                    let imgElement = imgCamera === null || imgCamera === void 0 ? void 0 : imgCamera.getElement();
                    TcHmi.TopMostLayer.add(this, imgElement, {
                        centerHorizontal: true,
                        centerVertical: true,
                        removeCb: (data) => {
                            if (data.canceled) {
                                // user clicked on background
                            }
                            imgCamera === null || imgCamera === void 0 ? void 0 : imgCamera.destroy();
                        }
                    });
                }
                hideCameraInFront() {
                }
            }
            _a = SurveillanceTs;
            _SurveillanceTs_tchmiFQN = { value: 'TcHmi.Controls.Beckhoff.' + _a.name };
            TcHmiOpenHabControls.SurveillanceTs = SurveillanceTs;
        })(TcHmiOpenHabControls = Controls.TcHmiOpenHabControls || (Controls.TcHmiOpenHabControls = {}));
    })(Controls = TcHmi.Controls || (TcHmi.Controls = {}));
})(TcHmi || (TcHmi = {}));
/**
* Register Control
*/
TcHmi.Controls.registerEx('SurveillanceTs', 'TcHmi.Controls.TcHmiOpenHabControls', TcHmi.Controls.TcHmiOpenHabControls.SurveillanceTs);
//# sourceMappingURL=SurveillanceTs.js.map