import RotaryControl from "../rotarycontrol.js";
var StepControl = /** @class */ (function () {
    function StepControl(ui, grooveBox) {
        this.element = document.createElement("div");
        this.element.classList.add("pitchcontrol");
        this.element.classList.add("gencontrolset");
        this.renderables = [];
        // stepProbability Rotary
        var stepProbabilityRotary = new RotaryControl(ui, grooveBox);
        stepProbabilityRotary.setValue = function (value) {
            var modifiedValue = Math.floor(value * 128);
            this.grooveBox.setGeneratorParam("stepProbability", modifiedValue);
        };
        stepProbabilityRotary.readValue = function () { return this.grooveBox.generatorParams.stepProbability / 128; };
        stepProbabilityRotary.displayValue = function () { return this.grooveBox.generatorParams.stepProbability.toString(); };
        stepProbabilityRotary.getIncrement = function () { return 1 / 128; };
        stepProbabilityRotary.setLabel("Step probability");
        this.element.prepend(stepProbabilityRotary.element);
        this.renderables.push(stepProbabilityRotary);
    }
    StepControl.prototype.update = function () {
        this.renderables.forEach(function (renderable) {
            renderable.update();
        });
    };
    return StepControl;
}());
export default StepControl;
