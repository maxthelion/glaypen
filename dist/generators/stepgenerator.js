var StepGenerator = /** @class */ (function () {
    function StepGenerator(grooveBox) {
        this.grooveBox = grooveBox;
    }
    StepGenerator.prototype.stepProbability = function (step) {
        var probability = this.grooveBox.generatorParams.stepProbability / 128;
        return probability;
    };
    return StepGenerator;
}());
export default StepGenerator;
