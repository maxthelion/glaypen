import ChordGenerator from "./generators/chordgenerator.js";
import EuclidianStepGenerator from "./generators/euclidianstepgenerator.js";
import PitchGenerator from "./generators/pitchgenerator.js";
import StepGenerator from "./generators/stepgenerator.js";
import GrooveBox, { GeneratorParams } from "./groovebox.js";
import Step from "./step.js";

export default class GeneratorManager {
    currentGeneratorParams: GeneratorParams;
    grooveBox: GrooveBox;
    defaultGeneratorParams: GeneratorParams = {
        tonic: 48,
        scaleIndex: 4,
        stepsInBar: 16,
        stepProbability: 128,
        pitchRange: 4,
        octaveRange: 2,
        octaveProbability: 0.1,
        stepMode: 0,
        pitchMode: 0,
        color: "#000000",
        stepPulseNumber: 4,
    }

    constructor(grooveBox: GrooveBox) {
        this.grooveBox = grooveBox;
        let storedParams = this.grooveBox.storageBox.getGeneratorParams();
        if (storedParams !== undefined && storedParams !== null) {
            this.currentGeneratorParams = storedParams!;
        } else {
            this.currentGeneratorParams = this.defaultGeneratorParams;
        }
    }

    getCurrentParams() {
        return this.currentGeneratorParams;
    }

    getCurrentAttribute(attribute: string) {
        return this.currentGeneratorParams[attribute];
    }

    buildCurrentStepGenerator() {
        switch(this.currentGeneratorParams.stepMode) {
            case 0:
                return new StepGenerator(this.grooveBox);
            case 1:
                return new EuclidianStepGenerator(this.grooveBox);
            default:
                throw new Error("Invalid stepMode" + this.currentGeneratorParams.stepMode);
        }
    }

    buildCurrentPitchGenerator() {
        switch(this.currentGeneratorParams.pitchMode) {
            case 0:
                return new PitchGenerator(this.grooveBox);
            case 1:
                return new ChordGenerator(this.grooveBox);
            case 2:
                return new PitchGenerator(this.grooveBox);
            default:
                throw new Error("Invalid pitchMode");
        }
    }
}
