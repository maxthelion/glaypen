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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import StepGenerator from "./stepgenerator.js";
var EuclidianStepGenerator = /** @class */ (function (_super) {
    __extends(EuclidianStepGenerator, _super);
    function EuclidianStepGenerator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EuclidianStepGenerator.prototype.stepProbability = function (step) {
        var stepsInBar = 16;
        var probability = this.euclidianRhythm(this.grooveBox.generatorParams.stepPulseNumber, stepsInBar)[step];
        console.log("stepProbability", step, probability);
        return probability;
    };
    EuclidianStepGenerator.prototype.euclidianRhythm = function (pulses, totalSteps) {
        var groups = [];
        for (var i = 0; i < totalSteps; i++) {
            groups.push([Number(i < pulses)]);
        }
        var l;
        while (l = groups.length - 1) {
            var start = 0, first = groups[0];
            while (start < l && this.compareArrays(first, groups[start])) {
                start++;
            }
            if (start === l) {
                break;
            }
            var end = l, last = groups[l];
            while (end > 0 && this.compareArrays(last, groups[end])) {
                end--;
            }
            if (end === 0) {
                break;
            }
            var count = Math.min(start, l - end);
            groups = __spreadArray(__spreadArray([], groups.slice(0, count).map(function (group, i) { return group.concat(groups[l - i]); }), true), groups.slice(count, -count), true);
        }
        return groups.flat();
    };
    ;
    EuclidianStepGenerator.prototype.compareArrays = function (a, b) {
        return a.map(function (a) { return a.toString(); }).join('') === b.map(function (a) { return a.toString(); }).join('');
    };
    ;
    return EuclidianStepGenerator;
}(StepGenerator));
export default EuclidianStepGenerator;
