import Step from "./step.js";
import StepGenerator from "./generators/stepgenerator.js";
import PitchGenerator from "./generators/pitchgenerator.js";
import EuclidianStepGenerator from "./generators/euclidianstepgenerator.js";
import ChordGenerator from "./generators/chordgenerator.js";
import ManualStepGenerator from "./generators/manualstepgenerator.js";
import ManualPitchGenerator from "./generators/manualpitchgenerator.js";
var Sequencer = /** @class */ (function () {
    function Sequencer(grooveBox) {
        this.grooveBox = grooveBox;
        this.minorScalePitches = [0, 2, 3, 5, 7, 8, 10];
        this.currentStep = 0;
        this.clip = undefined;
        this.absoluteStep = 0;
        this.stepGenerators = [
            new StepGenerator(this.grooveBox),
            new EuclidianStepGenerator(this.grooveBox),
            new ManualStepGenerator(this.grooveBox),
        ];
        this.pitchGenerators = [
            new PitchGenerator(this.grooveBox),
            new ChordGenerator(this.grooveBox),
            new ManualPitchGenerator(this.grooveBox),
        ];
        this.stepGenerator = this.grooveBox.generatorManager.buildCurrentStepGenerator();
        this.pitchGenerator = this.grooveBox.generatorManager.buildCurrentPitchGenerator();
    }
    Sequencer.prototype.step = function (loopStep) {
        this.absoluteStep += 1;
        this.currentStep = this.absoluteStep % 16;
        this.update(this.absoluteStep);
    };
    Sequencer.prototype.availablePitches = function () {
        return this.pitchGenerator.availablePitches();
    };
    Sequencer.prototype.update = function (absoluteStep) {
        // console.log("update", absoluteStep);
        var currentStep = absoluteStep % 16;
        var stepsInBar = this.grooveBox.generatorManager.getNumberAttribute("stepsInBar");
        var stepProbability = this.stepGenerator.stepProbability(currentStep);
        var scalePitches;
        if (this.grooveBox.manualPitchOptions.length > 0) {
            scalePitches = this.grooveBox.manualPitchOptions;
        }
        if (currentStep % (16 / stepsInBar) == 0) {
            if (Math.random() <= (stepProbability)) {
                if (this.grooveBox.manualPitchOptions.length > 0) {
                    var pitchInterval = Math.floor(Math.random() * scalePitches.length);
                    var pitch = scalePitches[pitchInterval];
                }
                else {
                    var pitch = this.pitchGenerator.getNextPitch();
                }
                if (pitch < 0) {
                    pitch = 0;
                }
                else if (pitch > 127) {
                    pitch = 127;
                }
                var step = new Step(currentStep, 120, [pitch]);
                // this.grooveBox.playPitch(pitch);
                this.grooveBox.playStep(step);
                this.grooveBox.pitchHistory.addStep(absoluteStep, step);
            }
        }
        this.grooveBox.pitchHistory.incrementMaxStep();
    };
    Sequencer.prototype.setStepMode = function (stepMode) {
        this.stepGenerator = this.stepGenerators[stepMode];
    };
    Sequencer.prototype.setPitchMode = function (pitchMode) {
        this.pitchGenerator = this.pitchGenerators[pitchMode];
    };
    return Sequencer;
}());
export default Sequencer;
