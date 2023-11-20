var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import Sequencer from "./sequencer.js";
import Step from "./step.js";
var Part = /** @class */ (function () {
    function Part(pitch, stepWeights, density) {
        this.occupiedSteps = [];
        this.pitch = pitch;
        this.stepWeights = stepWeights;
        this.density = density;
    }
    Part.prototype.generatePitchFor = function (stepNumber) {
        if (stepNumber % 16 == 0) {
            this.generateOccupiedSteps();
        }
        if (this.occupiedSteps.indexOf(stepNumber % 16) == -1) {
            return undefined;
        }
        return this.pitch;
    };
    Part.prototype.generateOccupiedSteps = function () {
        var totalStepWeights = this.stepWeights.reduce(function (a, b) { return a + b; }, 0);
        this.occupiedSteps = [];
        for (var index = 0; index < this.density; index++) {
            var randomWeight = Math.floor(Math.random() * totalStepWeights);
            var currentWeight = 0;
            for (var stepNumber = 0; stepNumber < this.stepWeights.length; stepNumber++) {
                currentWeight += this.stepWeights[stepNumber];
                if (randomWeight < currentWeight) {
                    this.occupiedSteps.push(stepNumber);
                    break;
                }
            }
        }
    };
    return Part;
}());
var DrumSequencer = /** @class */ (function (_super) {
    __extends(DrumSequencer, _super);
    function DrumSequencer(grooveBox) {
        var _this = _super.call(this, grooveBox) || this;
        _this.parts = [];
        _this.parts = [];
        // this.parts.push(new Part(60, 
        //                             [10, 3, 5, 9, 10, 0, 5, 0, 10, 0, 3, 5, 10, 0, 0, 4],
        //                             5
        //                             ));
        // this.parts.push(new Part(62, [0, 0, 0, 0, 1, 0, 0, 0.3, 0, 0, 0, 0.5, 1, 0.3, 0.4, 0.2], 3));
        // this.parts.push(new Part(66, [0.3, 0.5, 1, 0.5, 1, 0.2, 1, 0.3, 1, 0.5, 1, 0, 1, 0.8, 1, 0], 12));
        // this.parts.push(new Part(68, [0.3, 0.5, 1, 0.5, 1, 0.2, 1, 0.3, 1, 0.5, 1, 0, 1, 0.8, 1, 0], 2));
        // this.parts.push(new Part(61, [0.3, 0.5, 1, 0.5, 1, 0.2, 1, 0.3, 1, 0.5, 1, 0, 1, 0.8, 1, 0], 1));
        _this.parts.push(new Part(60, [10, 0, 0, 0, 10, 0, 0, 0, 10, 0, 0, 0, 10, 0, 0, 4], 4));
        _this.parts.push(new Part(62, [0, 0, 0, 0, 1, 0, 0, 0.3, 0, 0, 0, 0.5, 1, 0, 0, 0], 5));
        _this.parts.push(new Part(66, [0.3, 0.5, 1, 0.5, 1, 0.2, 1, 0.3, 1, 0.5, 1, 0, 1, 0.8, 1, 0], 16));
        _this.parts.push(new Part(68, [0.3, 0.5, 1, 0.5, 1, 0.2, 1, 0.3, 1, 0.5, 1, 0, 1, 0.8, 1, 0], 5));
        _this.parts.push(new Part(61, [0.3, 0.5, 1, 0.5, 1, 0.2, 1, 0.3, 1, 0.5, 1, 0, 1, 0.8, 1, 0], 5));
        return _this;
    }
    DrumSequencer.prototype.step = function (loopStep) {
        this.absoluteStep += 1;
        this.currentStep = this.absoluteStep % 16;
        this.update(this.absoluteStep);
    };
    DrumSequencer.prototype.update = function (absoluteStep) {
        var _this = this;
        var pitches = [];
        this.parts.forEach(function (part) {
            var pitch = part.generatePitchFor(_this.currentStep);
            if (pitch != undefined) {
                pitches.push(pitch - 24);
            }
        });
        // console.log("update", absoluteStep);
        var currentStep = absoluteStep % 16;
        var step = new Step(currentStep, 120 - Math.floor(Math.random() * 40), pitches);
        this.grooveBox.playStep(step);
        this.grooveBox.pitchHistory.addStep(absoluteStep, step);
        this.grooveBox.pitchHistory.incrementMaxStep();
    };
    return DrumSequencer;
}(Sequencer));
export default DrumSequencer;
