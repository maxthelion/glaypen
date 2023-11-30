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
import ManualStepControl from "./manualstepcontrol.js";
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
        return this.grooveBox.generatorManager.getStepModeIndex();
    };
    StepControl.prototype.setSubControls = function () {
        _super.prototype.setSubControls.call(this);
        switch (this.getSubModeIndex()) {
            case 0:
                this.addRotaryControl("stepProbability", "Step probability", 128);
                this.addRotaryControl("stepsInBar", "Steps in bar", 16);
                break;
            case 1:
                this.addRotaryControl("stepPulseNumber", "Steps", 16);
                break;
            case 2:
                var manualStepControl = new ManualStepControl(this.ui, this.grooveBox);
                this.controlSet.appendChild(manualStepControl.element);
                this.subRenderables.push(manualStepControl);
                break;
        }
    };
    StepControl.prototype.addRotaryControl = function (paramName, label, valueScale) {
        var rotary = new RotaryControl(this.ui, this.grooveBox);
        rotary.valueScale = valueScale;
        rotary.paramName = paramName;
        rotary.setLabel(label);
        this.controlSet.appendChild(rotary.element);
        this.subRenderables.push(rotary);
        return rotary;
    };
    return StepControl;
}(BaseControlSet));
export default StepControl;
