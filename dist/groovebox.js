import Transport from "./transport.js";
import UI from "./ui.js";
import Sequencer from "./sequencer.js";
import ClipSequencer from "./clipsequencer.js";
import Clip from "./clip.js";
import PitchHistory from "./pitchhistory.js";
import ClipSaver from "./clipsaver.js";
var GrooveBox = /** @class */ (function () {
    function GrooveBox(selectedOutput) {
        var _this = this;
        this.ui = new UI(this);
        this.selectedOutput = selectedOutput;
        this.sequencer = new Sequencer(this);
        this.transport = new Transport(this);
        this.pitchHistory = new PitchHistory();
        this.clipSaver = new ClipSaver(this);
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
        console.log("selectedSteps", selectedSteps);
        var clip = new Clip(this, selectedSteps);
        this.sequencer = new ClipSequencer(this, clip);
    };
    GrooveBox.prototype.playPitch = function (pitch) {
        console.log("playPitch", pitch);
        var noteOnMessage = [0x90, pitch, 0x7f]; // Note on, middle C, full velocity
        this.selectedOutput.send(noteOnMessage); // Send note on message to first MIDI output device
        var noteOffMessage = [0x80, pitch, 0x40]; // Note off, middle C,
        this.selectedOutput.send(noteOffMessage, window.performance.now() + 400.0); // In one second
    };
    GrooveBox.prototype.saveClipToIndex = function (index) {
        var clip = this.sequencer.clip;
        if (clip != undefined) {
            this.clipSaver.saveClipToIndex(clip, index);
        }
    };
    GrooveBox.prototype.saveOrLoadClipAtIndex = function (index) {
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
    GrooveBox.prototype.getMidiOutputs = function () {
        return navigator.requestMIDIAccess().then(function (midiAccess) {
            var outputs = Array.from(midiAccess.outputs.values());
            return outputs;
        });
    };
    GrooveBox.prototype.setMidiOutput = function (outputId) {
        var groooveBox = this;
        navigator.requestMIDIAccess().then(function (midiAccess) {
            var selectedOutput = midiAccess.outputs.get(outputId);
            if (selectedOutput) {
                groooveBox.selectedOutput = selectedOutput;
            }
        });
    };
    return GrooveBox;
}());
export default GrooveBox;
