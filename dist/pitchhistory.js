var PitchHistory = /** @class */ (function () {
    function PitchHistory() {
        this.pitches = [];
        this.maxStep = 0;
        this.pitches = [];
    }
    PitchHistory.prototype.addPitch = function (step, pitch) {
        this.pitches.push([step, pitch]);
        this.incrementMaxStep();
    };
    PitchHistory.prototype.incrementMaxStep = function () {
        this.maxStep += 1;
    };
    PitchHistory.prototype.stepsForWindow = function (windowStart) {
        var minStep = windowStart;
        var selectedSteps = this.pitches.filter(function (midiStepPitchPair) {
            return midiStepPitchPair[0] > minStep && midiStepPitchPair[0] <= minStep + 16;
        });
        selectedSteps = selectedSteps.map(function (midiStepPitchPair) {
            return [midiStepPitchPair[0] - minStep, midiStepPitchPair[1]];
        });
        return selectedSteps;
    };
    return PitchHistory;
}());
export default PitchHistory;
