import GrooveBox from "../../groovebox";
import Renderable from "../../interfaces/renderable";
import UI from "../../ui";
import RotaryControl from "../rotarycontrol.js";

export default class StepControl implements Renderable {
    element: HTMLElement;
    renderables: Renderable[];

    constructor(ui: UI, grooveBox: GrooveBox) {
        this.element = document.createElement("div");
        this.element.classList.add("pitchcontrol");
        this.element.classList.add("gencontrolset");
        this.renderables = [];
        // stepProbability Rotary
        let stepProbabilityRotary = new RotaryControl(ui, grooveBox);
        stepProbabilityRotary.setValue = function (value: number) {
            let modifiedValue = Math.floor(value * 128);
            this.grooveBox.setGeneratorParam("stepProbability", modifiedValue);
        }
        stepProbabilityRotary.readValue = function () { return this.grooveBox.generatorParams.stepProbability /  128; }
        stepProbabilityRotary.displayValue = function () { return this.grooveBox.generatorParams.stepProbability.toString(); }
        stepProbabilityRotary.getIncrement = function() { return 1 / 128; }
        stepProbabilityRotary.setLabel("Step probability");
        this.element.prepend(stepProbabilityRotary.element);
        this.renderables.push(stepProbabilityRotary);
    }

    update(): void {
        this.renderables.forEach((renderable) => {
            renderable.update();
        });
    }
}