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
        return this.grooveBox.generatorManager.getStepModeIndex();
    }
    
    setSubControls(){
        super.setSubControls();

        switch(this.getSubModeIndex()){
            case 0:
                this.addRotaryControl("stepProbability", "Step probability", 128)
                this.addRotaryControl("stepsInBar", "Steps in bar", 16)
                break;
            case 1:
                this.addRotaryControl("stepPulseNumber", "Steps", 16)
                break;
            case 2:
                let manualStepControl = new ManualStepControl(this.ui, this.grooveBox);
                this.controlSet.appendChild(manualStepControl.element);
                this.subRenderables.push(manualStepControl);
                break
        }
    }

    addRotaryControl(paramName: string, label: string, valueScale: number){
        let rotary = new RotaryControl(this.ui, this.grooveBox);
        rotary.valueScale = valueScale;
        rotary.paramName = paramName;
        rotary.setLabel(label);
        this.controlSet.appendChild(rotary.element);
        this.subRenderables.push(rotary);
        return rotary;
    }

}