import GrooveBox from "../groovebox.js";
import StorageBox from "../storagebox.js";
import MidiInputHandler from "./midiinputhandler.js";
import MidiNoteInputHandler from "./midinotehandler.js";
import MidiNoteOutput from "./midinoteoutput.js";

export default class MidiManager {
    midiAccess: MIDIAccess
    noteInput;
    clockInput;
    noteOutput;
    storageBox: StorageBox;
    grooveBox: GrooveBox;
    noteInputHandler: MidiNoteInputHandler;
    clockInputHandler: MidiInputHandler;
    noteOutputHandler: MidiNoteOutput;
    
    constructor(grooveBox: GrooveBox, midiAccess: MIDIAccess) {
        this.midiAccess = midiAccess;
        this.storageBox = grooveBox.storageBox;
        this.grooveBox = grooveBox;
        this.clockInput = this.getClockInput();
        this.noteInput = this.getNoteInput();
        this.noteOutput = this.getOutput();
        this.clockInputHandler = new MidiInputHandler(this.grooveBox, this.clockInput!);
        this.noteInputHandler = new MidiNoteInputHandler(this.grooveBox, this.noteInput!);
        this.noteOutputHandler = new MidiNoteOutput(this.grooveBox, this.noteOutput!);
    }

    playPitch(pitch: number, velocity: number) {
        this.noteOutputHandler.playPitch(pitch, velocity);
    }
    
    getOutputIdFromStorage(): string {
        let outputId = this.storageBox.get("outputPortId");
        return outputId ||  "";
    }

    getNoteInputIdFromStorage(): string {
        let inputId = this.storageBox.get("noteInputPortId");
        console.log("getNoteInputIdFromStorage", inputId)
        return inputId ||  "";
    }

    getClockInputIdFromStorage(): string {
        let inputId = this.storageBox.get("clockInputPortId");
        return inputId ||  "";
    }

    writeIdToStorage(key: string, value: string) {
        this.storageBox.set(key, value);
    }

    // getMidiOutput(): MIDIOutput|undefined {
    //     let outputId = this.storageBox.getOutputId();
    //     if (outputId == undefined) {
    //         return undefined;
    //     }
    //     let output = this.midiAccess.outputs.get(outputId)
    //     return output;
    // }

    currentOutput(){
        return this.noteOutput || this.getMidiOutput();
    }

    getMidiOutputs(): MIDIOutput[] {
        var outputs = Array.from(this.midiAccess.outputs.values());
        return outputs;
    }

    getMidiInputs(): MIDIInput[] {
        var inputs = Array.from(this.midiAccess.inputs.values());
        return inputs;
    }

    getClockInput(): MIDIInput {
        return this.clockInput || this.midiAccess.inputs.get(this.getClockInputIdFromStorage())
    }
    getNoteInput(): MIDIInput {
        return this.noteInput || this.midiAccess.inputs.get(this.getNoteInputIdFromStorage())
    }
    getOutput(): MIDIOutput {
        return this.noteOutput || this.midiAccess.outputs.get(this.getOutputIdFromStorage())
    }

    getMidiInputById(inputId:string): MIDIInput {
        return this.midiAccess.inputs.get(inputId)
    }
    getMidiNoteInputById(inputId:string): MIDIInput {
        return this.midiAccess.inputs.get(inputId)
    }
    getMidiOutputById(outputId: string): MIDIOutput {
        return this.midiAccess.outputs.get(outputId)
    }

    setMidiOutput(outputId: string) {
        var selectedOutput = this.midiAccess.outputs.get(outputId);
        if (selectedOutput) {
            this.writeIdToStorage("outputPortId", outputId);
            this.noteOutput = selectedOutput;
        }

    }

    setClockInput(inputId: string) {
        let selectedInput = this.midiAccess.inputs.get(inputId);
        if (selectedInput) {
            this.writeIdToStorage("clockInputPortId", inputId);;
            this.clockInput = selectedInput;
            this.clockInputHandler = new MidiInputHandler(this.grooveBox, this.clockInput!);
        }
    }

    setNoteInput(inputId: string) {
        let selectedInput = this.midiAccess.inputs.get(inputId);
        console.log("setNoteInput", inputId)
        if (selectedInput) {
            this.writeIdToStorage("noteInputPortId", inputId);;
            this.noteInput = selectedInput;
            this.noteInputHandler = new MidiNoteInputHandler(this.grooveBox, this.noteInput!);
        }
    }

    needsPrefs() {
        return (this.noteInput == null || this.noteInput == undefined ||
            this.clockInput == null || this.clockInput == undefined ||
            this.noteOutput == null || this.noteOutput == undefined);
    }
}