import GrooveBox from "../groovebox";

export default class StepGenerator {
    grooveBox: GrooveBox;

    constructor(grooveBox: GrooveBox) {
        this.grooveBox = grooveBox;
    }

    stepProbability(step: number) {
        let probability = this.grooveBox.generatorManager.getNumberAttribute("stepProbability") / 128;
        return probability;
    }
}