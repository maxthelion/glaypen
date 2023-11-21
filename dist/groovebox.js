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
import Transport from "./transport.js";
import UI from "./ui.js";
import Sequencer from "./sequencer.js";
import ClipSequencer from "./clipsequencer.js";
import Clip from "./clip.js";
import PitchHistory from "./pitchhistory.js";
import ClipSaver from "./clipsaver.js";
import StorageBox from "./storagebox.js";
import MidiInputHandler from "./midiinputhandler.js";
import SongSequencer from "./songsequencer.js";
var GrooveBox = /** @class */ (function () {
    function GrooveBox(midiAccess) {
        var _this = this;
        this.maxClips = 64;
        this.storedGenParams = [];
        this.generatorParamsArray = [];
        this.manualPitchOptions = [];
        this.playingPitches = {};
        this.genChanges = [];
        this.scales = [
            ["Major", [0, 2, 4, 5, 7, 9, 11]],
            ["Harmonic Minor", [0, 2, 3, 5, 7, 8, 11]],
            ["Melodic Minor", [0, 2, 3, 5, 7, 9, 11]],
            ["Major Pentatonic", [0, 2, 4, 7, 9]],
            ["Minor Pentatonic", [0, 3, 5, 7, 10]],
            ["Blues", [0, 3, 5, 6, 7, 10]],
            ["Akebono", [0, 2, 3, 7, 8]],
            ["Japanese Mode", [0, 1, 5, 7, 8]],
            ["Hirajoshi", [0, 2, 3, 7, 8]],
        ];
        this.modeIndex = 0;
        this.storageBox = new StorageBox();
        this.clipSaver = new ClipSaver(this);
        this.generatorParams = this.storageBox.getGeneratorParams();
        this.generatorParamsArray.push(this.generatorParams);
        this.genChanges.push([0, 0]);
        this.currentGenParamStepIndex = 0;
        this.ui = new UI(this);
        this.midiAccess = midiAccess;
        var midiOutput = this.getMidiOutput();
        var midiInput = this.getMidiInput();
        if (midiInput == undefined || midiOutput == undefined) {
            this.ui.showPrefsModal("No MIDI devices set");
        }
        else {
            this.selectedOutput = midiOutput;
            this.clockInput = midiInput;
            this.midiInputHandler = new MidiInputHandler(this, this.clockInput);
        }
        this.clipSequencer = undefined;
        this.songSequencer = new SongSequencer(this);
        this.generativeSequencer = new Sequencer(this);
        this.transport = new Transport(this);
        this.pitchHistory = new PitchHistory();
        this.setMode(0);
        // draw loop
        setInterval(function () {
            _this.ui.update();
            _this.clearExpiredNotes();
        }, 50);
    }
    GrooveBox.prototype.moveWindow = function (direction) {
        this.pitchHistory.moveWindow(direction);
        this.adjustWindow();
        if (this.modeIndex != 1) {
            this.setMode(1);
        }
    };
    GrooveBox.prototype.adjustWindow = function () {
        var clipRawData = this.pitchHistory.stepsForCurrentWindow();
        clipRawData.color = this.randomColor(this.pitchHistory.windowStart);
        var clip = new Clip(this, clipRawData);
        this.clipSequencer = new ClipSequencer(this, clip);
    };
    GrooveBox.prototype.changeWindowLength = function (length) {
        this.pitchHistory.setLength(length);
        this.adjustWindow();
    };
    GrooveBox.prototype.setHistoryIndex = function (index) {
        this.pitchHistory.moveWindowToPosition(index);
        this.adjustWindow();
        if (this.modeIndex != 1) {
            this.setMode(1);
        }
    };
    GrooveBox.prototype.playPitch = function (pitch, velocity) {
        if (velocity === void 0) { velocity = 127; }
        var maxLength = 1000;
        if (this.playingPitches[pitch] != undefined) {
            var noteOffMessage = [0x80, pitch, 0x40];
            this.selectedOutput.send(noteOffMessage);
            this.playingPitches[pitch] = undefined;
        }
        // console.log("playPitch", pitch, velocity);
        var velocityInHex = velocity.toString(16);
        var noteOnMessage = [0x90, pitch, Number('0x' + velocityInHex)]; // Note on, middle C, full velocity
        this.playingPitches[pitch] = window.performance.now();
        this.selectedOutput.send(noteOnMessage); // Send note on message to first MIDI output device
    };
    GrooveBox.prototype.clearExpiredNotes = function () {
        for (var key in this.playingPitches) {
            if (Object.prototype.hasOwnProperty.call(this.playingPitches, key)) {
                var time = this.playingPitches[key];
                var pitch = parseInt(key);
                // console.log("time", key, time, pitch, this.playingPitches);
                if (time != undefined && window.performance.now() - time > 500) {
                    var noteOffMessage = [0x80, pitch, 0x40];
                    this.selectedOutput.send(noteOffMessage);
                    this.playingPitches[pitch] = undefined;
                }
            }
        }
    };
    GrooveBox.prototype.playStep = function (step) {
        var _this = this;
        step.pitches.forEach(function (pitch) {
            _this.playPitch(pitch, step.velocity);
        });
    };
    GrooveBox.prototype.setMode = function (modeIndex) {
        this.modeIndex = modeIndex;
        if (modeIndex !== 3) {
            this.phraseIndex = undefined;
        }
        if (modeIndex == 0) {
            this.pitchHistory.clearWindow();
            this.clipIndex = undefined;
        }
        if (modeIndex == 1) {
            this.clipIndex = undefined;
            this.adjustWindow();
        }
        if (modeIndex == 2) {
        }
        if (modeIndex == 3) {
            if (this.phraseIndex !== undefined) {
                this.songSequencer.rowIndex = this.phraseIndex;
            }
            else if (this.clipIndex !== undefined) {
                this.songSequencer.rowIndex = Math.floor(this.clipIndex / 8);
            }
            this.songSequencer.updateClipData();
        }
        this.ui.setMode(modeIndex);
    };
    GrooveBox.prototype.currentSequencer = function () {
        switch (this.modeIndex) {
            case 0:
                return this.generativeSequencer;
                break;
            case 1:
                return this.clipSequencer;
                break;
            case 2:
                return this.clipSequencer;
                break;
            case 3:
                return this.songSequencer;
                break;
        }
    };
    GrooveBox.prototype.saveClipToIndex = function (index) {
        var clip = this.clipSequencer.clip;
        if (clip != undefined) {
            this.clipSaver.saveClipToIndex(clip, index);
        }
    };
    GrooveBox.prototype.saveOrLoadClipAtIndex = function (index) {
        this.setMode(2);
        var clip = this.clipSaver.savedClips[index];
        this.clipIndex = index;
        if (clip != undefined) {
            this.clipSequencer = new ClipSequencer(this, clip);
        }
        else if (this.clipSequencer.clip != undefined) {
            this.saveClipToIndex(index);
        }
        else {
            // can't switch to clip mode because there is no clip
            return undefined;
        }
    };
    GrooveBox.prototype.clearAllClips = function () {
        for (var i = 0; i < this.maxClips; i++) {
            this.clipSaver.clearClipAtIndex(i);
        }
    };
    GrooveBox.prototype.clearClipAtIndex = function (index) {
        this.clipSaver.clearClipAtIndex(index);
    };
    GrooveBox.prototype.showPrefsModal = function () {
        this.ui.showPrefsModal();
    };
    GrooveBox.prototype.closePrefsModal = function () {
        this.ui.closePrefsModal();
    };
    GrooveBox.prototype.getMidiOutput = function () {
        var outputId = this.storageBox.getOutputId();
        if (outputId == undefined) {
            return undefined;
        }
        var output = this.midiAccess.outputs.get(outputId);
        return output;
    };
    GrooveBox.prototype.getMidiOutputs = function () {
        var outputs = Array.from(this.midiAccess.outputs.values());
        return outputs;
    };
    GrooveBox.prototype.getMidiInputs = function () {
        var inputs = Array.from(this.midiAccess.inputs.values());
        return inputs;
    };
    GrooveBox.prototype.getMidiInput = function () {
        var inputId = "-1687982579";
        return this.midiAccess.inputs.get(inputId);
    };
    GrooveBox.prototype.setMidiOutput = function (outputId) {
        var groooveBox = this;
        navigator.requestMIDIAccess().then(function (midiAccess) {
            var selectedOutput = midiAccess.outputs.get(outputId);
            if (selectedOutput) {
                groooveBox.storageBox.setOutputId(outputId);
                groooveBox.selectedOutput = selectedOutput;
            }
        });
    };
    GrooveBox.prototype.setMidiInput = function (inputId) {
        var selectedInput = this.midiAccess.inputs.get(inputId);
        if (selectedInput) {
            this.storageBox.setInputId(inputId);
            this.clockInput = selectedInput;
            this.midiInputHandler = new MidiInputHandler(this, this.clockInput);
        }
    };
    GrooveBox.prototype.setGeneratorParam = function (paramName, value) {
        // Duplicate the generatorParams object
        var newGeneratorParams = __assign({}, this.generatorParams);
        // Update the duplicated object with the new value
        newGeneratorParams[paramName] = value;
        newGeneratorParams.color = this.colorFromGenParams(newGeneratorParams);
        // Update the original object reference
        this.generatorParams = newGeneratorParams;
        this.generatorParamsArray.push(newGeneratorParams);
        this.currentGenParamIndex = this.generatorParamsArray.length - 1;
        this.genChanges.push([this.currentGenParamIndex, this.currentSequencer().absoluteStep]);
        this.storageBox.setGeneratorParams(this.generatorParams);
    };
    GrooveBox.prototype.setGenParamsFromIndex = function (index) {
        var matchedParams = this.genChanges.filter(function (genChange) {
            return genChange[1] <= index;
        }).pop();
        if (matchedParams != undefined
            // don't record a step change if the params haven't changed
            && this.currentGenParamStepIndex != matchedParams[1]) {
            var foundIndex = matchedParams[0];
            var newGeneratorParams = this.getGenParamsByIndex(foundIndex);
            this.generatorParams = newGeneratorParams;
            this.currentGenParamStepIndex = matchedParams[1];
            this.currentGenParamIndex = foundIndex;
            this.genChanges.push([foundIndex, this.currentSequencer().absoluteStep]);
        }
    };
    GrooveBox.prototype.getGenParamsByIndex = function (index) {
        console.log(index, this.generatorParamsArray);
        return this.generatorParamsArray[index];
    };
    GrooveBox.prototype.colorFromGenParams = function (generatorParams) {
        var maxCol = 64;
        var tonicColor = generatorParams.tonic / 2;
        var scaleColor = generatorParams.scaleIndex / this.scales.length * maxCol;
        var stepsInBarColor = generatorParams.stepsInBar / 16 * maxCol;
        var stepProbabilityColor = generatorParams.stepProbability / 2;
        var pitchRangeColor = generatorParams.pitchRange / 12 * maxCol;
        var octaveRangeColor = generatorParams.octaveRange / 5 * maxCol;
        var octaveProbabilityColor = generatorParams.octaveProbability / 2;
        var r = 192 - Math.floor(tonicColor + scaleColor + stepsInBarColor);
        var g = 192 - Math.floor(stepProbabilityColor + pitchRangeColor);
        var b = 192 - Math.floor(octaveProbabilityColor + octaveRangeColor);
        return "rgb(".concat(r, ",").concat(g, ",").concat(b, ")");
    };
    GrooveBox.prototype.setClipParam = function (paramName, value) {
        console.log("setClipParams", paramName, value);
    };
    GrooveBox.prototype.clipStartLeft = function () {
        var _a;
        (_a = this.clipSequencer) === null || _a === void 0 ? void 0 : _a.clip.shiftLeft();
    };
    GrooveBox.prototype.clipStartRight = function () {
        var _a;
        (_a = this.clipSequencer) === null || _a === void 0 ? void 0 : _a.clip.shiftRight();
    };
    GrooveBox.prototype.shuffleClipPitches = function () {
        if (this.currentClip() != undefined) {
            this.currentClip().shufflePitches();
        }
    };
    GrooveBox.prototype.shuffleClipSteps = function () {
        if (this.currentClip() != undefined) {
            this.currentClip().shuffleSteps();
        }
    };
    GrooveBox.prototype.currentClip = function () {
        if (this.modeIndex == 1 || this.modeIndex == 2) {
            return this.clipSequencer.clip;
        }
        else if (this.modeIndex == 3) {
            return this.songSequencer.clip;
        }
    };
    GrooveBox.prototype.rotaryTarget = function () {
        var _a, _b;
        switch (this.modeIndex) {
            case 0:
                return this.generatorParams;
                break;
            case 1:
                return (_a = this.clipSequencer) === null || _a === void 0 ? void 0 : _a.clip;
                break;
            case 2:
                return (_b = this.clipSequencer) === null || _b === void 0 ? void 0 : _b.clip;
                break;
        }
    };
    GrooveBox.prototype.saveClip = function (clip) {
        if (this.clipIndex != undefined) {
            this.clipSaver.saveClipToIndex(clip, this.clipIndex);
        }
    };
    GrooveBox.prototype.noteOn = function (pitch) {
        if (this.readingPitchOptions()) {
            this.manualPitchOptions.push(pitch);
        }
        else {
            this.manualPitchOptions = [pitch];
        }
        this.lastPitchReadAt = window.performance.now();
    };
    GrooveBox.prototype.setExtractLength = function (length) {
        this.pitchHistory.setLength(length);
        var clipRawData = this.pitchHistory.stepsForCurrentWindow();
        clipRawData.color = this.randomColor(this.pitchHistory.windowStart);
        var clip = new Clip(this, clipRawData);
        this.clipSequencer = new ClipSequencer(this, clip);
    };
    GrooveBox.prototype.readingPitchOptions = function () {
        return this.lastPitchReadAt != undefined && window.performance.now() - this.lastPitchReadAt < 200;
    };
    GrooveBox.prototype.generateRandomSettings = function () {
        this.generatorParams = {
            "tonic": 64 + (32 - Math.floor(Math.random() * 64)),
            "scaleIndex": Math.floor(Math.random() * this.scales.length),
            "stepsInBar": (Math.floor(Math.random() * 4) + 1) * 4,
            "stepProbability": Math.floor(Math.random() * 128),
            "pitchRange": Math.floor(Math.random() * 12) + 1,
            "octaveRange": Math.floor(Math.random() * 5) + 1,
            "octaveProbability": Math.floor(Math.random() * 128),
            color: this.randomColor(Math.floor(Math.random() * 1000))
        };
    };
    GrooveBox.prototype.generatorButtonPressed = function (index) {
        console.log("generatorButtonPressed", index);
        if (this.storedGenParams[index] != undefined) {
            this.generatorParams = Object.assign({}, this.storedGenParams[index]);
            this.genParamPresetIndex = index;
        }
        else {
            this.storedGenParams[index] = __assign({}, this.generatorParams);
            this.genParamPresetIndex = index;
        }
    };
    GrooveBox.prototype.randomColor = function (seed) {
        var random = new SeededRandom(seed);
        var r = 64 + Math.floor(random.next() * 64);
        var b = 64 + Math.floor(random.next() * 64);
        var g = 64 + Math.floor(random.next() * 64);
        return "rgb(".concat(r, ",").concat(g, ",").concat(b, ")");
    };
    return GrooveBox;
}());
export default GrooveBox;
var SeededRandom = /** @class */ (function () {
    function SeededRandom(seed) {
        this.seed = seed;
    }
    SeededRandom.prototype.next = function () {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    };
    return SeededRandom;
}());
