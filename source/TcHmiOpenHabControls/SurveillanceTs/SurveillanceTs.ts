module TcHmi {
    export module Controls {
        export module TcHmiOpenHabControls {
            export class SurveillanceTs extends TcHmi.Controls.Beckhoff.TcHmiImage {

                static readonly #tchmiFQN = 'TcHmi.Controls.Beckhoff.' + this.name;

                constructor(element: JQuery, pcElement: JQuery, attrs: TcHmi.Controls.ControlAttributeList) {
                    /** Call base class constructor */
                    super(element, pcElement, attrs);
                }

                protected __elementTemplateRoot!: JQuery;

                public __previnit() {
                    this.__elementTemplateRoot = this.__element.find('.TcHmi_Controls_Beckhoff_TcHmiImage-template');
                    if (this.__elementTemplateRoot.length === 0) {
                        throw new Error('Invalid Template.html');
                    }
                    // Call __previnit of base class
                    super.__previnit();
                }

                public __init() {
                    super.__init();

                    let outsideThis = this;

                    // init image source
                    let addr = TcHmi.Environment.getControlBasePathEx(this);
                    outsideThis.setSrc(addr + "/Icons/novideo.gif");
                }

                public __attach() {
                    super.__attach();

                    let outsideThis = this;

                    outsideThis.__elementTemplateRoot.on("click", () => {
                        outsideThis.showCameraInFront();
                    });
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

                public showCameraInFront() {
                    let outsideThis = this;

                    let imgCamera = TcHmi.ControlFactory.createEx(
                        "TcHmi.Controls.Beckhoff.TcHmiImage", 'dialogCamera_' + this.__id,
                        {
                            "data-tchmi-width": 800,
                            "data-tchmi-height": 480,
                            "data-tchmi-src": outsideThis.getSrc()
                        }
                    );

                    let imgElement = imgCamera?.getElement();

                    TcHmi.TopMostLayer.add(this, imgElement, {
                        centerHorizontal: true,
                        centerVertical: true,
                        removeCb: (data) => {
                            if (data.canceled) {
                                // user clicked on background
                            }

                            imgCamera?.destroy();
                        }
                    });
                }

                public hideCameraInFront() {

                }
            }
        }
    }
}

/**
* Register Control
*/
TcHmi.Controls.registerEx('SurveillanceTs', 'TcHmi.Controls.TcHmiOpenHabControls', TcHmi.Controls.TcHmiOpenHabControls.SurveillanceTs);
