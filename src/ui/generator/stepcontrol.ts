import GrooveBox from "../../groovebox";
import Renderable from "../../interfaces/renderable";
import UI from "../../ui";
import RotaryControl from "../rotarycontrol.js";
import BaseControlSet from "./basecontrolset.js";
import ManualStepControl from "./manualstepcontrol.js";

export default class StepControl extends BaseControlSet {

    constructor(ui: UI, grooveBox: GrooveBox) {
        super(ui, grooveBox);
    }

    getSubModeLabels(): string[]{
        return "Random Euclidean Manual".split(" ");
    }

    onModeChange(mode: number): void {
        // console.log("StepControl onModeChange", mode)
        this.grooveBox.setStepGen(mode);
        this.setSubControls();
    }

    getSubModeIndex(): number {
        return this.grooveBox.generatorParams.stepMode;
    }
    
    setSubControls(){
        super.setSubControls();

        switch(this.getSubModeIndex()){
            case 0:

                // stepProbability Rotary
                let stepProbabilityRotary = new RotaryControl(this.ui, this.grooveBox);
                stepProbabilityRotary.setValue = function (value: number) {
                    let modifiedValue = Math.floor(value * 128);
                    this.grooveBox.setGeneratorParam("stepProbability", modifiedValue);
                }
                stepProbabilityRotary.readValue = function () { return this.grooveBox.generatorParams.stepProbability /  128; }
                stepProbabilityRotary.displayValue = function () { return this.grooveBox.generatorParams.stepProbability.toString(); }
                stepProbabilityRotary.getIncrement = function() { return 1 / 128; }
                stepProbabilityRotary.setLabel("Step probability");
                this.controlSet.appendChild(stepProbabilityRotary.element);
                this.subRenderables.push(stepProbabilityRotary);

                // stepsInBar Rotary
                let stepsInBarRotary = new RotaryControl(this.ui, this.grooveBox);
                stepsInBarRotary.setValue = function (value: number) {
                    let modifiedValue = Math.floor(value * 4) * 4;
                    this.grooveBox.setGeneratorParam("stepsInBar", modifiedValue);
                }
                stepsInBarRotary.readValue = function () { return this.grooveBox.generatorParams.stepsInBar /  16; }
                stepsInBarRotary.displayValue = function () { return this.grooveBox.generatorParams.stepsInBar.toString(); }
                stepsInBarRotary.getIncrement = function() { return 1 / 4; }
                stepsInBarRotary.setLabel("Steps in bar");
                this.controlSet.appendChild(stepsInBarRotary.element);
                this.subRenderables.push(stepsInBarRotary);
                break;
            case 1:
                console.log("Euclidean mode")
                // stepProbability Rotary
                let stepPulseNumberRotary = new RotaryControl(this.ui, this.grooveBox);
                stepPulseNumberRotary.setValue = function (value: number) {
                    let modifiedValue = Math.floor(value * 16);
                    this.grooveBox.setGeneratorParam("stepPulseNumber", modifiedValue);
                }
                stepPulseNumberRotary.readValue = function () { return this.grooveBox.generatorParams.stepPulseNumber /  16; }
                stepPulseNumberRotary.displayValue = function () { return this.grooveBox.generatorParams.stepPulseNumber.toString(); }
                stepPulseNumberRotary.getIncrement = function() { return 1 / 16; }
                stepPulseNumberRotary.setLabel("Steps");
                this.controlSet.appendChild(stepPulseNumberRotary.element);
                this.subRenderables.push(stepPulseNumberRotary);
                break;
                // // stepsInBar Rotary
                // let stepsInBarRotary = new RotaryControl(ui, grooveBox);
                // stepsInBarRotary.setValue = function (value: number) {
                //     let modifiedValue = Math.floor(value * 4) * 4;
                //     this.grooveBox.setGeneratorParam("stepsInBar", modifiedValue);
                // }
                // stepsInBarRotary.readValue = function () { return this.grooveBox.generatorParams.stepsInBar /  16; }
                // stepsInBarRotary.displayValue = function () { return this.grooveBox.generatorParams.stepsInBar.toString(); }
                // stepsInBarRotary.getIncrement = function() { return 1 / 4; }
                // stepsInBarRotary.setLabel("Steps in bar");
                // controlSet.appendChild(stepsInBarRotary.element);
                // this.renderables.push(stepsInBarRotary);
            case 2:
                let manualStepControl = new ManualStepControl(this.ui, this.grooveBox);
                this.controlSet.appendChild(manualStepControl.element);
                this.subRenderables.push(manualStepControl);
                break
        }
    }

}