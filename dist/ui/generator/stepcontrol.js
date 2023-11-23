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
        var _this = _super.call(this, ui, grooveBox) || this;
        _this.setSubControls(0);
        return _this;
    }
    StepControl.prototype.getSubModeLabels = function () {
        return "Random Euclidean Manual".split(" ");
    };
    StepControl.prototype.setStepGenMode = function (mode) {
        this.grooveBox.setStepGen(mode);
    };
    StepControl.prototype.setSubControls = function (mode) {
        this.subModeIndex = mode;
        var ui = this.ui;
        var grooveBox = this.grooveBox;
        var controlSet = this.controlSet;
        this.setStepGenMode(mode);
        controlSet.innerHTML = "";
        switch (mode) {
            case 0:
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
                controlSet.appendChild(stepProbabilityRotary.element);
                this.renderables.push(stepProbabilityRotary);
                // stepsInBar Rotary
                var stepsInBarRotary = new RotaryControl(ui, grooveBox);
                stepsInBarRotary.setValue = function (value) {
                    var modifiedValue = Math.floor(value * 4) * 4;
                    this.grooveBox.setGeneratorParam("stepsInBar", modifiedValue);
                };
                stepsInBarRotary.readValue = function () { return this.grooveBox.generatorParams.stepsInBar / 16; };
                stepsInBarRotary.displayValue = function () { return this.grooveBox.generatorParams.stepsInBar.toString(); };
                stepsInBarRotary.getIncrement = function () { return 1 / 4; };
                stepsInBarRotary.setLabel("Steps in bar");
                controlSet.appendChild(stepsInBarRotary.element);
                this.renderables.push(stepsInBarRotary);
            case 1:
                // stepProbability Rotary
                var stepPulseNumberRotary = new RotaryControl(ui, grooveBox);
                stepPulseNumberRotary.setValue = function (value) {
                    var modifiedValue = Math.floor(value * 16);
                    this.grooveBox.setGeneratorParam("stepPulseNumber", modifiedValue);
                };
                stepPulseNumberRotary.readValue = function () { return this.grooveBox.generatorParams.stepPulseNumber / 16; };
                stepPulseNumberRotary.displayValue = function () { return this.grooveBox.generatorParams.stepPulseNumber.toString(); };
                stepPulseNumberRotary.getIncrement = function () { return 1 / 16; };
                stepPulseNumberRotary.setLabel("Steps");
                controlSet.appendChild(stepPulseNumberRotary.element);
                this.renderables.push(stepPulseNumberRotary);
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
