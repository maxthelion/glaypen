var PitchHistory = /** @class */ (function () {
    function PitchHistory() {
        this.pitches = [];
        this.maxStep = 0;
        this.steps = [];
        this.pitches = [];
        this.windowStart = undefined;
        this.windowLength = 16;
    }
    PitchHistory.prototype.addPitch = function (step, pitch) {
        this.pitches.push([step, pitch]);
    };
    PitchHistory.prototype.addStep = function (stepNumber, step) {
        console.log("addStep", stepNumber, step);
        this.steps[stepNumber] = step;
    };
    PitchHistory.prototype.moveWindow = function (direction) {
        if (this.windowStart != undefined) {
            var newWindowStart = this.windowStart + direction;
            if (newWindowStart > 0 && newWindowStart <= this.maxStep - this.windowLength) {
                this.windowStart = newWindowStart;
            }
        }
        else {
            var clipWindowLength = this.windowLength;
            var minStep = this.maxStep - clipWindowLength;
            if (minStep < 0) {
                minStep = 0;
            }
            this.windowStart = minStep;
        }
    };
    PitchHistory.prototype.incrementMaxStep = function () {
        this.maxStep += 1;
    };
    PitchHistory.prototype.stepsForWindow = function (windowStart) {
        var minStep = windowStart;
        var clipData = {
            clipData: {},
            color: "#000000",
            clipLength: this.windowLength,
            rawSteps: new Array(this.windowLength)
        };
        for (var i = minStep; i < minStep + this.windowLength; i++) {
            if (this.steps[i] != undefined) {
                clipData.rawSteps[i - minStep] = this.steps[i];
            }
        }
        return clipData;
    };
    PitchHistory.prototype.stepsForCurrentWindow = function () {
        if (this.windowStart == undefined) {
            return this.stepsForWindow(this.maxStep - this.windowLength);
        }
        else {
            return this.stepsForWindow(this.windowStart);
        }
    };
    PitchHistory.prototype.setLength = function (length) {
        this.windowLength = length;
    };
    return PitchHistory;
}());
export default PitchHistory;
