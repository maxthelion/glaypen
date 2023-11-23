var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var StepGenerator = /** @class */ (function () {
    function StepGenerator(grooveBox) {
        this.grooveBox = grooveBox;
    }
    // stepProbability(step: number) {
    //     return this.grooveBox.generatorParams.stepProbability / 128;
    // }
    StepGenerator.prototype.stepProbability = function (step) {
        var probability = this.euclidianRhythm(9, 16)[step];
        console.log("stepProbability", step, probability);
        return probability;
    };
    StepGenerator.prototype.euclidianRhythm = function (pulses, totalSteps) {
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
    StepGenerator.prototype.compareArrays = function (a, b) {
        return a.map(function (a) { return a.toString(); }).join('') === b.map(function (a) { return a.toString(); }).join('');
    };
    ;
    return StepGenerator;
}());
export default StepGenerator;
