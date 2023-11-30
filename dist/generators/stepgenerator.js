var StepGenerator = /** @class */ (function () {
    function StepGenerator(grooveBox) {
        this.grooveBox = grooveBox;
    }
    StepGenerator.prototype.stepProbability = function (step) {
        var probability = this.grooveBox.generatorManager.getNumberAttribute("stepProbability") / 128;
        return probability;
    };
    return StepGenerator;
}());
export default StepGenerator;
