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
        this.manualPitchOptions = [];
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
        this.selectedOutput = this.getMidiOutput();
        this.clockInput = this.getMidiInput();
        this.midiInputHandler = new MidiInputHandler(this, this.clockInput);
        this.sequencer = new Sequencer(this);
        this.transport = new Transport(this);
        this.pitchHistory = new PitchHistory();
        this.setMode(0);
        // draw loop
        setInterval(function () {
            _this.ui.update();
        }, 50);
    }
    GrooveBox.prototype.moveWindow = function (direction) {
        if (this.windowStart) {
            this.windowStart += direction;
        }
        else {
            var clipWindowLength = 16;
            var minStep = this.pitchHistory.maxStep - clipWindowLength;
            this.windowStart = minStep;
        }
        var selectedSteps = this.pitchHistory.stepsForWindow(this.windowStart);
        var clip = new Clip(this, selectedSteps);
        clip.color = this.randomColor(this.windowStart);
        this.sequencer = new ClipSequencer(this, clip);
        this.setMode(1);
    };
    GrooveBox.prototype.playPitch = function (pitch) {
        var noteOnMessage = [0x90, pitch, 0x7f]; // Note on, middle C, full velocity
        this.selectedOutput.send(noteOnMessage); // Send note on message to first MIDI output device
        var noteOffMessage = [0x80, pitch, 0x40]; // Note off, middle C,
        this.selectedOutput.send(noteOffMessage, window.performance.now() + 1000.0); // In one second
    };
    GrooveBox.prototype.setMode = function (modeIndex) {
        this.modeIndex = modeIndex;
        if (modeIndex == 0) {
            if (this.generativeSequencer != undefined) {
                this.sequencer = this.generativeSequencer;
            }
            else {
                this.generativeSequencer = undefined;
                this.sequencer = new Sequencer(this);
            }
        }
        if (modeIndex == 1) {
            this.generativeSequencer = this.sequencer;
        }
        if (modeIndex == 2) {
            this.generativeSequencer = this.sequencer;
        }
        this.ui.setMode(modeIndex);
    };
    GrooveBox.prototype.saveClipToIndex = function (index) {
        var clip = this.sequencer.clip;
        if (clip != undefined) {
            this.clipSaver.saveClipToIndex(clip, index);
        }
    };
    GrooveBox.prototype.saveOrLoadClipAtIndex = function (index) {
        this.setMode(2);
        var clip = this.clipSaver.savedClips[index];
        if (clip != undefined) {
            this.sequencer = new ClipSequencer(this, clip);
        }
        else {
            this.saveClipToIndex(index);
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
        return this.midiAccess.outputs.get(outputId);
    };
    GrooveBox.prototype.getMidiOutputs = function () {
        var outputs = Array.from(this.midiAccess.outputs.values());
        return outputs;
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
    GrooveBox.prototype.setGeneratorParam = function (paramName, value) {
        this.generatorParams[paramName] = value;
        this.storageBox.setGeneratorParams(this.generatorParams);
    };
    GrooveBox.prototype.setClipParam = function (paramName, value) {
        console.log("setClipParams", paramName, value);
    };
    GrooveBox.prototype.clipStartLeft = function () {
        this.sequencer.clip.shiftLeft();
    };
    GrooveBox.prototype.clipStartRight = function () {
        this.sequencer.clip.shiftRight();
    };
    GrooveBox.prototype.getMidiInput = function () {
        var inputId = "-1687982579";
        return this.midiAccess.inputs.get(inputId);
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
    GrooveBox.prototype.readingPitchOptions = function () {
        return this.lastPitchReadAt != undefined && window.performance.now() - this.lastPitchReadAt < 200;
    };
    GrooveBox.prototype.randomColor = function (seed) {
        var random = new SeededRandom(seed);
        var r = Math.floor(random.next() * 256);
        var g = Math.floor(random.next() * 256);
        var b = Math.floor(random.next() * 256);
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
