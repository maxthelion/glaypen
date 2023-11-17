import Transport from "./transport.js";
import UI from "./ui.js";
import Sequencer from "./sequencer.js";
import ClipSequencer from "./clipsequencer.js";
import Clip from "./clip.js";
import PitchHistory from "./pitchhistory.js";
import ClipSaver from "./clipsaver.js";
import StorageBox from "./storagebox.js";
import MidiInputHandler from "./midiinputhandler.js";
var GrooveBox = /** @class */ (function () {
    function GrooveBox(midiAccess) {
        var _this = this;
        this.maxClips = 64;
        this.manualPitchOptions = [];
        this.playingPitches = {};
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
        this.generatorParams[paramName] = value;
        this.storageBox.setGeneratorParams(this.generatorParams);
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
        return this.clipSequencer.clip;
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
