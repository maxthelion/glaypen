import GrooveBox from "../groovebox.js";
import StepGenerator from "./stepgenerator.js";

export default class ManualStepGenerator extends StepGenerator {
    constructor(grooveBox: GrooveBox) {
        super(grooveBox);
    }

    stepProbability(step: number) {
        // console.log("manual step generator", step, this.grooveBox.generatorParams.manualSteps);
        if (this.grooveBox.generatorParams.manualSteps !== undefined) {
            if (this.grooveBox.generatorParams.manualSteps[step] !== undefined) {
                let probability = this.grooveBox.generatorParams.manualSteps[step] / 128;
                return probability;
            }
        } 
        return 0;
    }
}