import ChordGenerator from "./generators/chordgenerator.js";
import EuclidianStepGenerator from "./generators/euclidianstepgenerator.js";
import ManualStepGenerator from "./generators/manualstepgenerator.js";
import PitchGenerator from "./generators/pitchgenerator.js";
import StepGenerator from "./generators/stepgenerator.js";
var GeneratorManager = /** @class */ (function () {
    function GeneratorManager(grooveBox) {
        this.defaultGeneratorParams = {
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
            manualSteps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        };
        this.grooveBox = grooveBox;
        var storedParams = this.grooveBox.storageBox.getGeneratorParams();
        if (storedParams !== undefined && storedParams !== null) {
            if (storedParams.stepMode === undefined) {
                storedParams.stepMode = 0;
            }
            if (storedParams.pitchMode === undefined) {
                storedParams.pitchMode = 0;
            }
            this.currentGeneratorParams = storedParams;
        }
        else {
            this.currentGeneratorParams = this.defaultGeneratorParams;
        }
    }
    GeneratorManager.prototype.setManualStepProbability = function (step, probability) {
        if (this.currentGeneratorParams.manualSteps === undefined) {
            this.currentGeneratorParams.manualSteps = this.defaultGeneratorParams.manualSteps;
        }
        this.currentGeneratorParams.manualSteps[step] = probability;
        this.grooveBox.storageBox.setGeneratorParams(this.currentGeneratorParams);
    };
    GeneratorManager.prototype.getCurrentParams = function () {
        return this.currentGeneratorParams;
    };
    GeneratorManager.prototype.getCurrentAttribute = function (attribute) {
        return this.currentGeneratorParams[attribute];
    };
    GeneratorManager.prototype.buildCurrentStepGenerator = function () {
        switch (this.currentGeneratorParams.stepMode) {
            case 0:
                return new StepGenerator(this.grooveBox);
            case 1:
                return new EuclidianStepGenerator(this.grooveBox);
            case 2:
                return new ManualStepGenerator(this.grooveBox);
            default:
                throw new Error("Invalid stepMode " + this.currentGeneratorParams.stepMode);
        }
    };
    GeneratorManager.prototype.buildCurrentPitchGenerator = function () {
        switch (this.currentGeneratorParams.pitchMode) {
            case 0:
                return new PitchGenerator(this.grooveBox);
            case 1:
                return new ChordGenerator(this.grooveBox);
            case 2:
                return new PitchGenerator(this.grooveBox);
            default:
                throw new Error("Invalid pitchMode");
        }
    };
    return GeneratorManager;
}());
export default GeneratorManager;
