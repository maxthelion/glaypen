var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import ChordGenerator from "./generators/chordgenerator.js";
import EuclidianStepGenerator from "./generators/euclidianstepgenerator.js";
import ManualStepGenerator from "./generators/manualstepgenerator.js";
import PitchGenerator from "./generators/pitchgenerator.js";
import StepGenerator from "./generators/stepgenerator.js";
var GeneratorManager = /** @class */ (function () {
    function GeneratorManager(grooveBox) {
        this.defaultGeneratorParams = {
            tonic: 48,
            scaleIndex: 4,
            stepsInBar: 16,
            stepProbability: 128,
            pitchRange: 4,
            octaveRange: 2,
            octaveProbability: 0.1,
            stepMode: 0,
            pitchMode: 0,
            scaleKey: 60,
            scaleOctaveRoot: 0,
            scaleIntervalProbabilities: [0, 0, 0, 0, 0, 0, 0, 0, 0],
            chordOctaveRoot: 0,
            chordKey: 60,
            chordScaleIndex: 0,
            chordIndex: 0,
            chordRoot: 0,
            color: "#000000",
            stepPulseNumber: 4,
            manualSteps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        };
        this.storedGenParams = [];
        this.generatorParamsArray = [];
        this.genChanges = [];
        this.storageBox = grooveBox.storageBox;
        this.grooveBox = grooveBox;
        var storedParams = this.grooveBox.storageBox.getGeneratorParams();
        if (storedParams !== undefined && storedParams !== null) {
            for (var key in this.defaultGeneratorParams) {
                if (!storedParams.hasOwnProperty(key)) {
                    storedParams[key] = this.defaultGeneratorParams[key];
                }
            }
            this.currentGeneratorParams = storedParams;
        }
        else {
            this.currentGeneratorParams = this.defaultGeneratorParams;
        }
        this.generatorParamsArray.push(this.currentGeneratorParams);
        this.genChanges.push([0, 0]);
        this.currentGenParamStepIndex = 0;
    }
    GeneratorManager.prototype.setManualStepProbability = function (step, probability) {
        if (this.currentGeneratorParams.manualSteps === undefined) {
            this.currentGeneratorParams.manualSteps = this.defaultGeneratorParams.manualSteps;
        }
        this.currentGeneratorParams.manualSteps[step] = probability;
        this.grooveBox.storageBox.setGeneratorParams(this.currentGeneratorParams);
    };
    GeneratorManager.prototype.getScale = function () {
        return this.grooveBox.scales[this.currentGeneratorParams.scaleIndex][1];
    };
    GeneratorManager.prototype.getChordScale = function () {
        return this.grooveBox.scales[this.currentGeneratorParams.chordScaleIndex][1];
    };
    GeneratorManager.prototype.setIntervalProbability = function (index, probability) {
        console.log("setIntervalProbability", index, probability);
        this.currentGeneratorParams.scaleIntervalProbabilities[index] = probability;
        this.grooveBox.storageBox.setGeneratorParams(this.currentGeneratorParams);
    };
    GeneratorManager.prototype.getIntervalProbability = function (index) {
        if (index !== undefined) {
            return this.currentGeneratorParams.scaleIntervalProbabilities[index];
        }
        else {
            return 1;
        }
    };
    GeneratorManager.prototype.getIntervalProbabilities = function () {
        return this.currentGeneratorParams.scaleIntervalProbabilities;
    };
    GeneratorManager.prototype.getCurrentParams = function () {
        return this.currentGeneratorParams;
    };
    GeneratorManager.prototype.getNumberAttribute = function (attribute) {
        return parseInt(this.currentGeneratorParams[attribute]);
    };
    GeneratorManager.prototype.getCurrentAttribute = function (attribute) {
        return this.currentGeneratorParams[attribute];
    };
    GeneratorManager.prototype.getPitchModeIndex = function () {
        // console.log("getPitchModeIndex", this.currentGeneratorParams)
        return this.currentGeneratorParams.pitchMode;
    };
    GeneratorManager.prototype.getStepModeIndex = function () {
        return this.currentGeneratorParams.stepMode;
    };
    GeneratorManager.prototype.getColor = function () {
        return this.currentGeneratorParams.color;
    };
    GeneratorManager.prototype.noteOn = function (pitch) {
        if (this.getPitchModeIndex() == 0) {
            this.setGeneratorParam("tonic", pitch);
        }
        else if (this.getPitchModeIndex() == 1) {
            this.setGeneratorParam("chordRoot", pitch);
        }
    };
    GeneratorManager.prototype.setGeneratorParam = function (paramName, value) {
        this.currentGeneratorParams[paramName] = value;
        // this.grooveBox.setGeneratorParam(param, value);
        // Duplicate the generatorParams object
        var newGeneratorParams = __assign({}, this.currentGeneratorParams);
        // Update the duplicated object with the new value
        newGeneratorParams[paramName] = value;
        newGeneratorParams.color = this.colorFromGenParams(newGeneratorParams);
        // Update the original object reference
        this.currentGeneratorParams = newGeneratorParams;
        this.generatorParamsArray.push(newGeneratorParams);
        this.currentGenParamIndex = this.generatorParamsArray.length - 1;
        this.genChanges.push([this.currentGenParamIndex, this.grooveBox.currentSequencer().absoluteStep]);
        this.storageBox.setGeneratorParams(this.currentGeneratorParams);
    };
    GeneratorManager.prototype.loadOrSaveAtIndex = function (index) {
        var savedParams = this.presetAtIndex(index);
        if (savedParams !== null) {
            this.currentGeneratorParams = savedParams;
            this.generatorParamsArray.push(this.currentGeneratorParams);
            this.currentGenParamIndex = this.generatorParamsArray.length - 1;
            this.genChanges.push([this.currentGenParamIndex, this.grooveBox.currentSequencer().absoluteStep]);
            this.genParamPresetIndex = index;
        }
        else {
            this.genParamPresetIndex = index;
            this.storageBox.set("genParam".concat(index), JSON.stringify(this.currentGeneratorParams));
        }
    };
    GeneratorManager.prototype.loadedPresetIndex = function () {
        return this.genParamPresetIndex;
    };
    GeneratorManager.prototype.clearPresetAtIndex = function (index) {
        this.storageBox.clear("genParam".concat(index));
    };
    GeneratorManager.prototype.presetAtIndex = function (index) {
        var storedPreset = this.storageBox.get("genParam".concat(index));
        if (storedPreset !== null) {
            return JSON.parse(storedPreset);
        }
        return null;
    };
    GeneratorManager.prototype.setGenParamsFromIndex = function (index) {
        var matchedParams = this.genChanges.filter(function (genChange) {
            return genChange[1] <= index;
        }).pop();
        if (matchedParams != undefined
            // don't record a step change if the params haven't changed
            && this.currentGenParamStepIndex != matchedParams[1]) {
            var foundIndex = matchedParams[0];
            var newGeneratorParams = this.getGenParamsByIndex(foundIndex);
            this.currentGeneratorParams = newGeneratorParams;
            this.currentGenParamStepIndex = matchedParams[1];
            this.currentGenParamIndex = foundIndex;
            this.genChanges.push([foundIndex, this.grooveBox.currentSequencer().absoluteStep]);
        }
    };
    GeneratorManager.prototype.getGenParamsByIndex = function (index) {
        // console.log(index, this.generatorParamsArray)
        return this.generatorParamsArray[index];
    };
    GeneratorManager.prototype.buildCurrentStepGenerator = function () {
        switch (this.currentGeneratorParams.stepMode) {
            case 0:
                return new StepGenerator(this.grooveBox);
            case 1:
                return new EuclidianStepGenerator(this.grooveBox);
            case 2:
                return new ManualStepGenerator(this.grooveBox);
            default:
                throw new Error("Invalid stepMode " + this.currentGeneratorParams.stepMode);
        }
    };
    GeneratorManager.prototype.buildCurrentPitchGenerator = function () {
        switch (this.currentGeneratorParams.pitchMode) {
            case 0:
                return new PitchGenerator(this.grooveBox);
            case 1:
                return new ChordGenerator(this.grooveBox);
            case 2:
                return new PitchGenerator(this.grooveBox);
            default:
                throw new Error("Invalid pitchMode");
        }
    };
    GeneratorManager.prototype.colorFromGenParams = function (generatorParams) {
        var hue = (generatorParams.scaleIndex / this.grooveBox.scales.length) * 360;
        var saturation = (this.stepDensity() * 50) + 25;
        var lightness = (this.pitchRoot() * 50) + 25;
        var hsl = "hsl(".concat(hue, ",").concat(saturation, "%,").concat(lightness, "%)");
        return hsl;
    };
    // for generating colors
    GeneratorManager.prototype.pitchRoot = function () {
        return (this.currentGeneratorParams.scaleOctaveRoot / 10);
    };
    // for generating colors
    GeneratorManager.prototype.stepDensity = function () {
        var stepsInBar = this.currentGeneratorParams.stepsInBar;
        var stepProbability = this.currentGeneratorParams.stepProbability;
        return (stepsInBar / 16) * (stepProbability / 128);
    };
    GeneratorManager.prototype.generateRandomSettings = function () {
        this.currentGeneratorParams = {
            "tonic": 64 + (32 - Math.floor(Math.random() * 64)),
            "scaleIndex": Math.floor(Math.random() * this.scales.length),
            "stepsInBar": (Math.floor(Math.random() * 4) + 1) * 4,
            "stepProbability": Math.floor(Math.random() * 128),
            "pitchRange": Math.floor(Math.random() * 12) + 1,
            "octaveRange": Math.floor(Math.random() * 5) + 1,
            "octaveProbability": Math.floor(Math.random() * 128),
        };
    };
    return GeneratorManager;
}());
export default GeneratorManager;
