import MidiInputHandler from "./midiinputhandler.js";
import MidiNoteInputHandler from "./midinotehandler.js";
var MidiManager = /** @class */ (function () {
    function MidiManager(grooveBox, midiAccess) {
        this.midiAccess = midiAccess;
        this.storageBox = grooveBox.storageBox;
        this.grooveBox = grooveBox;
        this.clockInput = this.getClockInput();
        this.noteInput = this.getNoteInput();
        this.noteOutput = this.getOutput();
        this.clockInputHandler = new MidiInputHandler(this.grooveBox, this.clockInput);
        this.noteInputHandler = new MidiNoteInputHandler(this.grooveBox, this.noteInput);
    }
    MidiManager.prototype.getOutputIdFromStorage = function () {
        var outputId = this.storageBox.get("outputPortId");
        return outputId || "";
    };
    MidiManager.prototype.getNoteInputIdFromStorage = function () {
        var inputId = this.storageBox.get("noteInputPortId");
        console.log("getNoteInputIdFromStorage", inputId);
        return inputId || "";
    };
    MidiManager.prototype.getClockInputIdFromStorage = function () {
        var inputId = this.storageBox.get("clockInputPortId");
        return inputId || "";
    };
    MidiManager.prototype.writeIdToStorage = function (key, value) {
        this.storageBox.set(key, value);
    };
    // getMidiOutput(): MIDIOutput|undefined {
    //     let outputId = this.storageBox.getOutputId();
    //     if (outputId == undefined) {
    //         return undefined;
    //     }
    //     let output = this.midiAccess.outputs.get(outputId)
    //     return output;
    // }
    MidiManager.prototype.currentOutput = function () {
        return this.noteOutput || this.getMidiOutput();
    };
    MidiManager.prototype.getMidiOutputs = function () {
        var outputs = Array.from(this.midiAccess.outputs.values());
        return outputs;
    };
    MidiManager.prototype.getMidiInputs = function () {
        var inputs = Array.from(this.midiAccess.inputs.values());
        return inputs;
    };
    MidiManager.prototype.getClockInput = function () {
        return this.clockInput || this.midiAccess.inputs.get(this.getClockInputIdFromStorage());
    };
    MidiManager.prototype.getNoteInput = function () {
        return this.noteInput || this.midiAccess.inputs.get(this.getNoteInputIdFromStorage());
    };
    MidiManager.prototype.getOutput = function () {
        return this.noteOutput || this.midiAccess.outputs.get(this.getOutputIdFromStorage());
    };
    MidiManager.prototype.getMidiInputById = function (inputId) {
        return this.midiAccess.inputs.get(inputId);
    };
    MidiManager.prototype.getMidiNoteInputById = function (inputId) {
        return this.midiAccess.inputs.get(inputId);
    };
    MidiManager.prototype.getMidiOutputById = function (outputId) {
        return this.midiAccess.outputs.get(outputId);
    };
    MidiManager.prototype.setMidiOutput = function (outputId) {
        var selectedOutput = this.midiAccess.outputs.get(outputId);
        if (selectedOutput) {
            this.writeIdToStorage("outputPortId", outputId);
            this.noteOutput = selectedOutput;
        }
    };
    MidiManager.prototype.setClockInput = function (inputId) {
        var selectedInput = this.midiAccess.inputs.get(inputId);
        if (selectedInput) {
            this.writeIdToStorage("clockInputPortId", inputId);
            ;
            this.clockInput = selectedInput;
            this.clockInputHandler = new MidiInputHandler(this.grooveBox, this.clockInput);
        }
    };
    MidiManager.prototype.setNoteInput = function (inputId) {
        var selectedInput = this.midiAccess.inputs.get(inputId);
        console.log("setNoteInput", inputId);
        if (selectedInput) {
            this.writeIdToStorage("noteInputPortId", inputId);
            ;
            this.noteInput = selectedInput;
            this.noteInputHandler = new MidiNoteInputHandler(this.grooveBox, this.noteInput);
        }
    };
    MidiManager.prototype.needsPrefs = function () {
        return (this.noteInput == null || this.noteInput == undefined ||
            this.clockInput == null || this.clockInput == undefined ||
            this.noteOutput == null || this.noteOutput == undefined);
    };
    return MidiManager;
}());
export default MidiManager;
