import GrooveBox from "../groovebox.js";
import StepGenerator from "./stepgenerator.js";

export default class ManualStepGenerator extends StepGenerator {
    constructor(grooveBox: GrooveBox) {
        super(grooveBox);
    }

    stepProbability(step: number) {
        let params = this.grooveBox.generatorManager.currentGeneratorParams;
        // console.log("manual step generator", step, this.grooveBox.generatorParams.manualSteps);
        if (params.manualSteps !== undefined) {
            if (params.manualSteps[step] !== undefined) {
                let probability = params .manualSteps[step] / 128;
                return probability;
            }
        } 
        return 0;
    }
}