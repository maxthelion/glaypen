var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import Step from "./step.js";
var Clip = /** @class */ (function () {
    function Clip(groooveBox, clipData) {
        this.index = 0;
        this.steps = [];
        this.color = "#000000";
        this.originalSteps = [];
        this.grooveBox = groooveBox;
        this.clipData = clipData;
        this.color = clipData.color || "#000000";
        this.clipLength = clipData.clipLength || 16;
        this.steps = new Array(this.clipLength);
        for (var i = 0; i < this.clipLength; i++) {
            var rawStep = clipData.rawSteps[i];
            if (rawStep !== undefined && rawStep !== null) {
                this.steps[rawStep.stepNumber] = new Step(rawStep.stepNumber, rawStep.velocity, rawStep.pitches);
            }
        }
        this.originalSteps = this.steps.slice();
    }
    Clip.prototype.clipRawData = function () {
        this.clipData.clipLength = this.clipLength;
        this.clipData.rawSteps = this.generateRawSteps();
        return this.clipData;
    };
    Clip.prototype.generateRawSteps = function () {
        var steps = [];
        for (var i = 0; i < this.steps.length; i++) {
            if (this.steps[i] != undefined && this.steps[i] != null) {
                var step = this.steps[i];
                step.stepNumber = i;
                steps.push(step.stepRawData());
            }
        }
        return steps;
    };
    Clip.prototype.shiftLeft = function () {
        console.log("shiftLeft", this.steps);
        this.steps.push(this.steps.shift());
        this.save();
    };
    Clip.prototype.shiftRight = function () {
        this.steps.unshift(this.steps.pop());
        this.save();
    };
    Clip.prototype.shufflePitches = function () {
        console.log("shufflePitches", this.steps);
        var pitches = this.availablePitches();
        this.steps.forEach(function (step) {
            console.log("step", pitches);
            if (step != undefined) {
                var randomPitch = pitches[Math.floor(Math.random() * pitches.length)];
                step.pitches = [randomPitch];
            }
        });
        this.save();
    };
    Clip.prototype.availablePitches = function () {
        var pitches = [];
        this.originalSteps.forEach(function (step) {
            if (step !== undefined && step !== null) {
                step.pitches.forEach(function (pitch) {
                    pitches.push(pitch);
                });
            }
        });
        return pitches;
    };
    Clip.prototype.randomUsedPitch = function () {
        var pitches = this.availablePitches();
        return pitches[Math.floor(Math.random() * pitches.length)];
    };
    Clip.prototype.shuffleSteps = function () {
        var _this = this;
        console.log("shuffleSteps", this.steps);
        var occupiedSteps = this.getOccupiedSteps();
        var availableStepsNumbers = new Array(this.getClipLength());
        for (var i = 0; i < availableStepsNumbers.length; i++) {
            availableStepsNumbers[i] = i;
        }
        // make a new steps array
        this.steps = new Array(this.getClipLength());
        occupiedSteps.forEach(function (step) {
            var randomStepIndex = Math.floor(Math.random() * availableStepsNumbers.length);
            var newStepIndex = availableStepsNumbers.splice(randomStepIndex, 1)[0];
            _this.steps[newStepIndex] = step;
        });
        this.save();
    };
    Clip.prototype.getOccupiedSteps = function () {
        return this.steps.filter(function (step) {
            return step != undefined && step != null;
        });
    };
    Clip.prototype.getOccupiedStepIndexes = function () {
        var occupiedStepIndexes = [];
        this.steps.forEach(function (step, index) {
            if (step != undefined && step != null) {
                occupiedStepIndexes.push(index);
            }
        });
        return occupiedStepIndexes;
    };
    Clip.prototype.getDensity = function () {
        var density = 0;
        this.steps.forEach(function (step) {
            if (step != undefined && step != null) {
                density++;
            }
        });
        return density;
    };
    Clip.prototype.densityPercentage = function () {
        return this.getDensity() / this.getClipLength();
    };
    Clip.prototype.getClipLength = function () {
        return this.steps.length;
    };
    // this.grooveBox.setClipEnd(parseInt(value));
    Clip.prototype.setClipDensity = function (density) {
        console.log("setClipDensity", density);
        var currentDensity = this.getDensity();
        var requiredDensity = Math.round(density * this.getClipLength());
        var densityDifferenceInSteps = requiredDensity - currentDensity;
        console.log("densityDifferenceInSteps", densityDifferenceInSteps);
        if (densityDifferenceInSteps > 0) {
            this.addSteps(densityDifferenceInSteps);
        }
        else if (densityDifferenceInSteps < 0) {
            var occupiedStepIndexes = this.getOccupiedStepIndexes();
            for (var i = 0; i < Math.abs(densityDifferenceInSteps); i++) {
                var randomStep = Math.floor(Math.random() * occupiedStepIndexes.length);
                var indexForDeletion = occupiedStepIndexes.splice(randomStep, 1)[0];
                this.steps[indexForDeletion] = undefined;
            }
        }
        this.save();
    };
    Clip.prototype.setClipLength = function (length) {
        console.log("setClipLength", length);
        this.clipLength = length;
        if (this.steps.length < length) {
            var newSteps = new Array(length);
            newSteps.splice.apply(newSteps, __spreadArray([0, this.originalSteps.length], this.originalSteps, false));
            this.steps = newSteps;
            console.log("this.steps", this.steps);
        }
        else if (this.steps.length > length) {
            this.steps = this.steps.slice(0, length);
        }
        this.save();
    };
    Clip.prototype.getStepAtPosition = function (position) {
        return this.steps[position % this.steps.length];
    };
    Clip.prototype.addSteps = function (stepsToAdd) {
        var unnocupiedSteps = [];
        for (var i = 0; i < this.steps.length; i++) {
            if (this.steps[i] == undefined || this.steps[i] == null) {
                unnocupiedSteps.push(i);
            }
        }
        for (var i = 0; i < stepsToAdd; i++) {
            var unnocupiedStepIndex = unnocupiedSteps.splice(Math.floor(Math.random() * unnocupiedSteps.length), 1)[0];
            console.log("unnocupiedStepIndex", unnocupiedStepIndex);
            this.steps[unnocupiedStepIndex] = new Step(unnocupiedStepIndex, 100, [this.randomUsedPitch()]);
        }
    };
    Clip.prototype.setLength = function (length) {
    };
    Clip.prototype.getParam = function (param) {
        return this.clipData[param];
    };
    Clip.prototype.save = function () {
        this.grooveBox.saveClip(this);
    };
    return Clip;
}());
export default Clip;
