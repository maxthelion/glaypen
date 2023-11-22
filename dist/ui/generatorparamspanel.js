import RotaryDial from "./rotarydial.js";
import RotaryControl from "./rotarycontrol.js";
var GeneratorParamsPanel = /** @class */ (function () {
    function GeneratorParamsPanel(ui, grooveBox) {
        var _this = this;
        this.renderables = [];
        this.grooveBox = grooveBox;
        this.ui = ui;
        this.element = document.querySelector("#generatorparams");
        this.renderables = [];
        // tonic rotary
        var tonicRotary = new RotaryControl(ui, grooveBox);
        tonicRotary.setValue = function (value) {
            var tonicValue = Math.floor(value * 128);
            this.grooveBox.setGeneratorParam("tonic", tonicValue);
        };
        tonicRotary.readValue = function () { return this.grooveBox.generatorParams.tonic / 128; };
        tonicRotary.displayValue = function () {
            var pitches = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
            return pitches[this.grooveBox.generatorParams.tonic % 12];
        };
        tonicRotary.setLabel("Root note");
        this.element.prepend(tonicRotary.element);
        this.renderables.push(tonicRotary);
        // pitchProbability Rotary 
        var pitchRangeRotary = new RotaryControl(ui, grooveBox);
        pitchRangeRotary.setValue = function (value) {
            var modifiedValue = Math.floor(value * 12);
            this.grooveBox.setGeneratorParam("pitchRange", modifiedValue);
        };
        pitchRangeRotary.readValue = function () { return this.grooveBox.generatorParams.pitchRange / 12; };
        pitchRangeRotary.displayValue = function () { return this.grooveBox.generatorParams.pitchRange.toString(); };
        pitchRangeRotary.getIncrement = function () { return 1 / 12; };
        pitchRangeRotary.setLabel("Pitch range");
        this.element.prepend(pitchRangeRotary.element);
        this.renderables.push(pitchRangeRotary);
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
        this.paramElements = this.element.querySelectorAll(".genparam");
        var scaleSelect = this.element.querySelector("#scale");
        var scales = this.grooveBox.scales;
        for (var i = 0; i < scales.length; i++) {
            var option = document.createElement("option");
            option.value = i.toString();
            option.text = scales[i][0];
            if (this.grooveBox.generatorParams.scaleIndex == i) {
                option.selected = true;
            }
            scaleSelect.add(option);
        }
        this.paramElements.forEach(function (paramElement) {
            if (paramElement.id !== "scale") {
                var paramId_1 = paramElement.dataset.paramid;
                var value = _this.grooveBox.generatorParams[paramId_1];
                paramElement.value = value.toString();
            }
            var paramId = paramElement.dataset.paramid;
            paramElement.addEventListener("input", function (e) {
                var element = e.target;
                var value = element.value;
                _this.grooveBox.setGeneratorParam(paramId, parseInt(value));
            });
        });
        var rotaries = this.element.querySelectorAll(".rotary");
        var array = Array.from(rotaries);
        this.rotaryElements = array.map(function (element) {
            return new RotaryDial(ui, grooveBox, element);
        });
        this.renderables = this.renderables.concat(this.rotaryElements);
    }
    GeneratorParamsPanel.prototype.update = function () {
        var _a;
        (_a = this.element) === null || _a === void 0 ? void 0 : _a.style.setProperty("border-color", this.grooveBox.generatorParams.color);
        this.renderables.forEach(function (renderable) {
            renderable.update();
        });
    };
    return GeneratorParamsPanel;
}());
export default GeneratorParamsPanel;
