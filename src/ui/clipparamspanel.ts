import GrooveBox from "../groovebox";
import Renderable from "../interfaces/renderable";
import UI from "../ui";

export default class ClipParamsPanel implements Renderable {
    grooveBox: GrooveBox;
    ui: UI;
    element: HTMLElement;
    paramElements: NodeListOf<HTMLElement>;

    constructor(ui:UI, grooveBox: GrooveBox) {
        this.grooveBox = grooveBox;
        this.ui = ui;
        this.element = document.querySelector("#clippane") as HTMLElement;
        this.paramElements = this.element.querySelectorAll(".clipparam");
        let clipLeftBtn = this.element.querySelector("#clipstartleftbtn") as HTMLButtonElement;
        clipLeftBtn.addEventListener("click", (e) => {
            this.grooveBox.clipStartLeft();
        })
        let clipRightBtn = this.element.querySelector("#clipstartrightbtn") as HTMLButtonElement;
        clipRightBtn.addEventListener("click", (e) => {
            this.grooveBox.clipStartRight();
        })
        this.paramElements.forEach((paramElement) => {
            let paramId = paramElement.dataset.paramid;

            let clip = this.grooveBox.sequencer.clip;

            paramElement.addEventListener("input", (e) => {
                let element = e.target as HTMLInputElement;
                let value = element.value;
                this.grooveBox.setClipParam(paramId!, parseInt(value));
            })
        });
    }

    update() {

    }

}