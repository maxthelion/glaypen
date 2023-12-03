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
import StepGenerator from "./stepgenerator.js";
var ManualStepGenerator = /** @class */ (function (_super) {
    __extends(ManualStepGenerator, _super);
    function ManualStepGenerator(grooveBox) {
        return _super.call(this, grooveBox) || this;
    }
    ManualStepGenerator.prototype.stepProbability = function (step) {
        var params = this.grooveBox.generatorManager.currentGeneratorParams;
        // console.log("manual step generator", step, this.grooveBox.generatorParams.manualSteps);
        if (params.manualSteps !== undefined) {
            if (params.manualSteps[step] !== undefined) {
                var probability = params.manualSteps[step] / 128;
                return probability;
            }
        }
        return 0;
    };
    return ManualStepGenerator;
}(StepGenerator));
export default ManualStepGenerator;
