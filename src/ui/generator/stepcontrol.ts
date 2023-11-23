import GrooveBox from "../../groovebox";
import Renderable from "../../interfaces/renderable";
import UI from "../../ui";
import RotaryControl from "../rotarycontrol.js";
import BaseControlSet from "./basecontrolset.js";

export default class StepControl extends BaseControlSet {

    constructor(ui: UI, grooveBox: GrooveBox) {
        super(ui, grooveBox);
        this.setSubControls(0);
    }

    getSubModeLabels(): string[]{
        return "Random Euclidean Manual".split(" ");
    }

    setStepGenMode(mode: number){
        this.grooveBox.setStepGen(mode);
    }
    
    setSubControls(mode: number){
        this.subModeIndex = mode;
        let ui = this.ui;
        let grooveBox = this.grooveBox;
        let controlSet = this.controlSet;
        this.setStepGenMode(mode);
        controlSet.innerHTML = "";

        switch(mode){
            case 0:

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
                controlSet.appendChild(stepProbabilityRotary.element);
                this.renderables.push(stepProbabilityRotary);

                // stepsInBar Rotary
                let stepsInBarRotary = new RotaryControl(ui, grooveBox);
                stepsInBarRotary.setValue = function (value: number) {
                    let modifiedValue = Math.floor(value * 4) * 4;
                    this.grooveBox.setGeneratorParam("stepsInBar", modifiedValue);
                }
                stepsInBarRotary.readValue = function () { return this.grooveBox.generatorParams.stepsInBar /  16; }
                stepsInBarRotary.displayValue = function () { return this.grooveBox.generatorParams.stepsInBar.toString(); }
                stepsInBarRotary.getIncrement = function() { return 1 / 4; }
                stepsInBarRotary.setLabel("Steps in bar");
                controlSet.appendChild(stepsInBarRotary.element);
                this.renderables.push(stepsInBarRotary);

            case 1:
                // stepProbability Rotary
                let stepPulseNumberRotary = new RotaryControl(ui, grooveBox);
                stepPulseNumberRotary.setValue = function (value: number) {
                    let modifiedValue = Math.floor(value * 16);
                    this.grooveBox.setGeneratorParam("stepPulseNumber", modifiedValue);
                }
                stepPulseNumberRotary.readValue = function () { return this.grooveBox.generatorParams.stepPulseNumber /  16; }
                stepPulseNumberRotary.displayValue = function () { return this.grooveBox.generatorParams.stepPulseNumber.toString(); }
                stepPulseNumberRotary.getIncrement = function() { return 1 / 16; }
                stepPulseNumberRotary.setLabel("Steps");
                controlSet.appendChild(stepPulseNumberRotary.element);
                this.renderables.push(stepPulseNumberRotary);

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
        }
    }

}