var Step = /** @class */ (function () {
    function Step(stepNumber, velocity, pitches) {
        this.pitches = [];
        this.velocity = 0;
        this.stepNumber = stepNumber;
        this.velocity = velocity;
        this.pitches = pitches;
    }
    Step.prototype.stepRawData = function () {
        return {
            pitches: this.pitches,
            velocity: this.velocity,
            stepNumber: this.stepNumber
        };
    };
    return Step;
}());
export default Step;
