var Clip = /** @class */ (function () {
    function Clip(groooveBox, clipData) {
        this.steps = [];
        this.color = "#000000";
        this.originalSteps = [];
        this.clipData = clipData;
        this.color = clipData.color || "#000000";
        this.clipLength = clipData.clipLength || 16;
        this.steps = new Array(this.clipLength);
        for (var i = 0; i < this.clipLength; i++) {
            this.steps[i] = clipData.rawSteps[i];
        }
        this.originalSteps = this.steps.slice();
    }
    Clip.prototype.clipRawData = function () {
        return this.clipData;
    };
    Clip.prototype.shiftLeft = function () {
        this.steps.push(this.steps.shift());
    };
    Clip.prototype.shiftRight = function () {
        this.steps.unshift(this.steps.pop());
    };
    Clip.prototype.shufflePitches = function () {
        console.log("shufflePitches", this.steps);
        var pitches = this.availablePitches();
        this.steps.forEach(function (step) {
            console.log("step", pitches);
            if (step != undefined) {
                var randomPitch = pitches[Math.floor(Math.random() * pitches.length)];
                step[1] = randomPitch;
            }
        });
    };
    Clip.prototype.availablePitches = function () {
        return this.originalSteps.filter(function (step) {
            return step != undefined;
        }).map(function (step) {
            return step[1];
        });
    };
    Clip.prototype.randomUsedPitch = function () {
        var pitches = this.availablePitches();
        return pitches[Math.floor(Math.random() * pitches.length)];
    };
    Clip.prototype.shuffleSteps = function () {
        var _this = this;
        console.log("shuffleSteps", this.steps);
        var steps = this.steps.filter(function (step) {
            return step != undefined;
        });
        var availableStepsNumbers = new Array(16);
        for (var i = 0; i < availableStepsNumbers.length; i++) {
            availableStepsNumbers[i] = i;
        }
        this.steps = new Array(16);
        steps.forEach(function (step) {
            var randomStepIndex = Math.floor(Math.random() * availableStepsNumbers.length);
            var randomStep = availableStepsNumbers.splice(randomStepIndex, 1);
            _this.steps[randomStep] = step;
        });
    };
    Clip.prototype.density = function () {
        var density = 0;
        this.steps.forEach(function (step) {
            if (step != undefined) {
                density++;
            }
        });
        return density;
    };
    Clip.prototype.getClipLength = function () {
        return this.steps.length;
    };
    // this.grooveBox.setClipEnd(parseInt(value));
    Clip.prototype.setClipDensity = function (density) {
        var currentDensity = this.density();
        var densityDifference = density - currentDensity;
        if (densityDifference > 0) {
            this.addSteps(densityDifference);
        }
        else if (densityDifference < 0) {
            for (var i = 0; i < Math.abs(densityDifference); i++) {
                var randomStep = Math.floor(Math.random() * this.steps.length);
                this.steps[randomStep] = undefined;
            }
        }
    };
    Clip.prototype.addSteps = function (stepsToAdd) {
        var unnocupiedSteps = [];
        for (var i = 0; i < this.steps.length; i++) {
            if (this.steps[i] == undefined) {
                unnocupiedSteps.push(i);
            }
        }
        for (var i = 0; i < stepsToAdd; i++) {
            var unnocupiedStepIndex = unnocupiedSteps.splice(Math.floor(Math.random() * unnocupiedSteps.length), 1);
            console.log("unnocupiedStepIndex", unnocupiedStepIndex);
            this.steps[unnocupiedStepIndex] = [unnocupiedStepIndex, this.randomUsedPitch()];
        }
    };
    Clip.prototype.setLength = function (length) {
    };
    return Clip;
}());
export default Clip;
