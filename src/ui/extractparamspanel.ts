import GrooveBox from "../groovebox";
import Renderable from "../interfaces/renderable";
import UI from "../ui";
import RotaryDial from "./rotarydial.js";

export default class ExtractParamsPanel implements Renderable {
    element: HTMLElement;
    renderables: Renderable[] = [];

    constructor(ui:UI, grooveBox: GrooveBox) {
        this.element = document.querySelector("#extractpane")!;
        let extractLenghtInput = document.querySelector("#extractlength") as HTMLInputElement;
        extractLenghtInput.addEventListener("input", (e) => {
            let element = e.target as HTMLInputElement;
            let value = element.value;
            grooveBox.setExtractLength(parseInt(value));
        })

        let rotaries = this.element.querySelectorAll(".rotary");
        const array = Array.from(rotaries);
        let rotaryElements = array.map((element) => {
            let r = new RotaryDial(ui, grooveBox, element as HTMLElement);
            r.getParamValue = function () {
                return this.grooveBox.sequencer.clip!.clipLength;
            }
            return r;
        })
        this.renderables = this.renderables.concat(rotaryElements);
    }

    update() {
        this.renderables.forEach((renderable) => {
            renderable.update();
        })
    }
}