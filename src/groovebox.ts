import Transport from "./transport.js";
import UI from "./ui.js";
import Loop from "./loop.js";
import Sequencer from "./sequencer.js";
import ClipSequencer from "./clipsequencer.js";
import Clip from "./clip.js";
import PitchHistory from "./pitchhistory.js";
import ClipSaver from "./clipsaver.js";
import StorageBox from "./storagebox.js";
import MidiInputHandler from "./midiinputhandler.js";

export interface GeneratorParams {
    [key: string]: number;
    "tonic": number;
    "scaleIndex": number;
    "stepsInBar": number;
    "stepProbability": number;
    "pitchRange": number;
    "octaveRange": number;
    "octaveProbability": number;
}
type ScalePair = [string, number[]];

export default class GrooveBox {
    pitchHistory: PitchHistory;
    transport: Transport;
    ui: UI;
    selectedOutput: MIDIOutput;
    sequencer: Sequencer;
    windowStart?: number;
    clipSaver: ClipSaver;
    generatorParams: GeneratorParams;
    manualPitchOptions: number[] = [];
    lastPitchReadAt?: number;
    scales: ScalePair[] = [
        ["Major", [0, 2, 4, 5, 7, 9, 11]],
        ["Harmonic Minor", [0, 2, 3, 5, 7, 8, 11]],
        ["Melodic Minor", [0, 2, 3, 5, 7, 9, 11]],
        ["Major Pentatonic", [0, 2, 4, 7, 9]],
        ["Minor Pentatonic", [0, 3, 5, 7, 10]],
        ["Blues", [0, 3, 5, 6, 7, 10]],
        ["Akebono", [0, 2, 3, 7, 8]],
        ["Japanese Mode", [0, 1, 5, 7, 8]],
        ["Hirajoshi", [0, 2, 3, 7, 8]],
    
    ]
    modeIndex: number = 0;
    storageBox: StorageBox = new StorageBox();
    midiAccess: MIDIAccess;
    generativeSequencer?: Sequencer;
    clockInput: MIDIInput;
    midiInputHandler: MidiInputHandler;

    constructor(midiAccess: MIDIAccess) {
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
        setInterval(() => {
            this.ui.update();
        }, 50);
    }

    moveWindow(direction: number) {
        if (this.windowStart){
            this.windowStart += direction;
        } else {
            let clipWindowLength = 16;
            let minStep = this.pitchHistory.maxStep - clipWindowLength;
            this.windowStart = minStep;
        }
        let selectedSteps = this.pitchHistory.stepsForWindow(this.windowStart)
        let clip = new Clip(this, selectedSteps);
        clip.color = this.randomColor(this.windowStart);
        this.sequencer = new ClipSequencer(this, clip);
        this.setMode(1);
    }
    
    playPitch(pitch: number) {
        var noteOnMessage = [0x90, pitch, 0x7f];    // Note on, middle C, full velocity
        this.selectedOutput.send(noteOnMessage);  // Send note on message to first MIDI output device
        var noteOffMessage = [0x80, pitch, 0x40];   // Note off, middle C,
        this.selectedOutput.send(noteOffMessage, window.performance.now() + 1000.0); // In one second
    }

    setMode(modeIndex: number) {
        this.modeIndex = modeIndex;
        if (modeIndex == 0) {
            if (this.generativeSequencer != undefined) {
                this.sequencer = this.generativeSequencer
            } else {
                this.generativeSequencer = undefined;
                this.sequencer = new Sequencer(this);
            }
        }
        if (modeIndex == 1) {
            this.generativeSequencer = this.sequencer
        }
        if (modeIndex == 2) {
            this.generativeSequencer = this.sequencer
        }
        this.ui.setMode(modeIndex);
    }

    saveClipToIndex(index: number) {
        let clip = this.sequencer.clip;
        if (clip != undefined){
            this.clipSaver.saveClipToIndex(clip, index);
        }
    }

    saveOrLoadClipAtIndex(index: number) {
        this.setMode(2);
        let clip = this.clipSaver.savedClips[index];
        if (clip != undefined){
            this.sequencer = new ClipSequencer(this, clip);
        } else {
            this.saveClipToIndex(index);
        }
    }

    showPrefsModal() {
        this.ui.showPrefsModal();
    }
    closePrefsModal() {
        this.ui.closePrefsModal();
    }

    getMidiOutput(): MIDIOutput {
        let outputId = this.storageBox.getOutputId();
        return this.midiAccess.outputs.get(outputId)
    }

    getMidiOutputs(): MIDIOutput[] {
        var outputs = Array.from(this.midiAccess.outputs.values());
        return outputs;
    }

    setMidiOutput(outputId: string) {
        var groooveBox = this;
        navigator.requestMIDIAccess().then(function(midiAccess) {
            var selectedOutput = midiAccess.outputs.get(outputId);
            if (selectedOutput) {
                groooveBox.storageBox.setOutputId(outputId);
                groooveBox.selectedOutput = selectedOutput;
            }
        });
    }

    setGeneratorParam(paramName: string, value: number) {
        this.generatorParams[paramName] = value;
        this.storageBox.setGeneratorParams(this.generatorParams);
    }

    setClipParam(paramName: string, value: number) {
        console.log("setClipParams", paramName, value);
    }

    clipStartLeft() {
        this.sequencer.clip.shiftLeft();
    }

    clipStartRight() {
        this.sequencer.clip.shiftRight();
    }

    getMidiInput(): MIDIInput {
        let inputId = "-1687982579"
        return this.midiAccess.inputs.get(inputId)
    }
    
    noteOn(pitch: number) {
        if (this.readingPitchOptions()){
            this.manualPitchOptions.push(pitch);
        } else {
            this.manualPitchOptions = [pitch];
        }
        this.lastPitchReadAt = window.performance.now();
    }

    readingPitchOptions(): boolean {
        return this.lastPitchReadAt != undefined && window.performance.now() - this.lastPitchReadAt < 200;
    }

    randomColor(seed: number): string {
        let random = new SeededRandom(seed);
        let r = Math.floor(random.next() * 256);
        let g = Math.floor(random.next() * 256);
        let b = Math.floor(random.next() * 256);
        return `rgb(${r},${g},${b})`;
    }
}

class SeededRandom {
    private seed: number;

    constructor(seed: number) {
        this.seed = seed;
    }

    next() {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    }
}