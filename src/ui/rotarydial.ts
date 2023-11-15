import GrooveBox from "../groovebox";
import Renderable from "../interfaces/renderable";
import UI from "../ui";

export default class RotaryDial implements Renderable {
    element: HTMLElement;
    valueLabel: HTMLElement;
    paramId: string;
    grooveBox: GrooveBox;
    ui: UI;

    constructor(ui: UI, grooveBox: GrooveBox, rotary: HTMLElement) {
        // console.log("RotaryDial constructor")
        this.element = rotary
        this.valueLabel = this.element.querySelector(".rotaryvalue") as HTMLElement;
        this.paramId = this.element.dataset.paramid!;
        
        // this.element.addEventListener("click", (e) => {
        //     let element = e.target as HTMLElement;
        //     let value = element.dataset.value;
        //     grooveBox.setParam("rotary", parseInt(value!));
        // })
        this.grooveBox = grooveBox;
        this.ui = ui;
    }

    update(): void {
        this.valueLabel.textContent = this.getParamValue().toString();
    }

    getParamValue(): number {
        return this.grooveBox.generatorParams[this.paramId];
    }
}