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
import RotaryControl from "../rotarycontrol.js";
import BaseControlSet from "./basecontrolset.js";
var StepControl = /** @class */ (function (_super) {
    __extends(StepControl, _super);
    function StepControl(ui, grooveBox) {
        return _super.call(this, ui, grooveBox) || this;
    }
    StepControl.prototype.getSubModeLabels = function () {
        return "Random Euclidean Manual".split(" ");
    };
    StepControl.prototype.onModeChange = function (mode) {
        // console.log("StepControl onModeChange", mode)
        this.grooveBox.setStepGen(mode);
        this.setSubControls();
    };
    StepControl.prototype.getSubModeIndex = function () {
        return this.grooveBox.generatorParams.stepMode;
    };
    StepControl.prototype.setSubControls = function () {
        _super.prototype.setSubControls.call(this);
        switch (this.getSubModeIndex()) {
            case 0:
                // stepProbability Rotary
                var stepProbabilityRotary = new RotaryControl(this.ui, this.grooveBox);
                stepProbabilityRotary.setValue = function (value) {
                    var modifiedValue = Math.floor(value * 128);
                    this.grooveBox.setGeneratorParam("stepProbability", modifiedValue);
                };
                stepProbabilityRotary.readValue = function () { return this.grooveBox.generatorParams.stepProbability / 128; };
                stepProbabilityRotary.displayValue = function () { return this.grooveBox.generatorParams.stepProbability.toString(); };
                stepProbabilityRotary.getIncrement = function () { return 1 / 128; };
                stepProbabilityRotary.setLabel("Step probability");
                this.controlSet.appendChild(stepProbabilityRotary.element);
                this.subRenderables.push(stepProbabilityRotary);
                // stepsInBar Rotary
                var stepsInBarRotary = new RotaryControl(this.ui, this.grooveBox);
                stepsInBarRotary.setValue = function (value) {
                    var modifiedValue = Math.floor(value * 4) * 4;
                    this.grooveBox.setGeneratorParam("stepsInBar", modifiedValue);
                };
                stepsInBarRotary.readValue = function () { return this.grooveBox.generatorParams.stepsInBar / 16; };
                stepsInBarRotary.displayValue = function () { return this.grooveBox.generatorParams.stepsInBar.toString(); };
                stepsInBarRotary.getIncrement = function () { return 1 / 4; };
                stepsInBarRotary.setLabel("Steps in bar");
                this.controlSet.appendChild(stepsInBarRotary.element);
                this.subRenderables.push(stepsInBarRotary);
                break;
            case 1:
                console.log("Euclidean mode");
                // stepProbability Rotary
                var stepPulseNumberRotary = new RotaryControl(this.ui, this.grooveBox);
                stepPulseNumberRotary.setValue = function (value) {
                    var modifiedValue = Math.floor(value * 16);
                    this.grooveBox.setGeneratorParam("stepPulseNumber", modifiedValue);
                };
                stepPulseNumberRotary.readValue = function () { return this.grooveBox.generatorParams.stepPulseNumber / 16; };
                stepPulseNumberRotary.displayValue = function () { return this.grooveBox.generatorParams.stepPulseNumber.toString(); };
                stepPulseNumberRotary.getIncrement = function () { return 1 / 16; };
                stepPulseNumberRotary.setLabel("Steps");
                this.controlSet.appendChild(stepPulseNumberRotary.element);
                this.subRenderables.push(stepPulseNumberRotary);
                break;
            // // stepsInBar Rotary
            // let stepsInBarRotary = new RotaryControl(ui, grooveBox);
            // stepsInBarRotary.setValue = function (value: number) {
            //     let modifiedValue = Math.floor(value * 4) * 4;
            //     this.grooveBox.setGeneratorParam("stepsInBar", modifiedValue);
            // }
            // stepsInBarRotary.readValue = function () { return this.grooveBox.generatorParams.stepsInBar /  16; }
            // stepsInBarRotary.displayValue = function () { return this.grooveBox.generatorParams.stepsInBar.toString(); }
            // stepsInBarRotary.getIncrement = function() { return 1 / 4; }
            // stepsInBarRotary.setLabel("Steps in bar");
            // controlSet.appendChild(stepsInBarRotary.element);
            // this.renderables.push(stepsInBarRotary);
        }
    };
    return StepControl;
}(BaseControlSet));
export default StepControl;
