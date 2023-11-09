import Transport from "./transport.js";
import UI from "./ui.js";
import Loop from "./loop.js";
import Sequencer from "./sequencer.js";
import ClipSequencer from "./clipsequencer.js";
import Clip from "./clip.js";
import PitchHistory from "./pitchhistory.js";
import ClipSaver from "./clipsaver.js";

interface GeneratorParams {
    tonic: number;
    scaleIndex: number;
    stepsInBar: number;
    stepProbability: number;
    pitchRange: number;
    octaveRange: number;
    octaveProbability: number;
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
    scales: ScalePair[] = [
        ["Major", [0, 2, 4, 5, 7, 9, 11]],
        ["Harmonic Minor", [0, 2, 3, 5, 7, 8, 11]],
        ["Melodic Minor", [0, 2, 3, 5, 7, 9, 11]],
        ["Major Pentatonic", [0, 2, 4, 7, 9]],
        ["Minor Pentatonic", [0, 3, 5, 7, 10]],
    ]
    modeIndex: number = 0;

    constructor(selectedOutput: MIDIOutput) {
        this.ui = new UI(this);
        this.selectedOutput = selectedOutput;
        this.sequencer = new Sequencer(this);
        this.transport = new Transport(this);
        this.pitchHistory = new PitchHistory();
        this.clipSaver = new ClipSaver(this);
        this.generatorParams = {
            tonic: 48,
            scaleIndex: 4,
            stepsInBar: 16,
            stepProbability: 0.8,
            pitchRange: 4,
            octaveRange: 2,
            octaveProbability: 0.1
        }
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
        console.log("playPitch", pitch);
        var noteOnMessage = [0x90, pitch, 0x7f];    // Note on, middle C, full velocity
        this.selectedOutput.send(noteOnMessage);  // Send note on message to first MIDI output device
        var noteOffMessage = [0x80, pitch, 0x40];   // Note off, middle C,
        this.selectedOutput.send(noteOffMessage, window.performance.now() + 400.0); // In one second
    }

    setMode(modeIndex: number) {
        this.modeIndex = modeIndex;
        if (modeIndex == 0) {
            this.sequencer = new Sequencer(this);
        }
    }

    saveClipToIndex(index: number) {
        let clip = this.sequencer.clip;
        if (clip != undefined){
            this.clipSaver.saveClipToIndex(clip, index);
        }
    }

    saveOrLoadClipAtIndex(index: number) {
        let clip = this.clipSaver.savedClips[index];
        if (clip != undefined){
            this.sequencer = new ClipSequencer(this, clip);
        } else {
            this.saveClipToIndex(index);
        }
        this.setMode(2);
    }

    showPrefsModal() {
        this.ui.showPrefsModal();
    }
    closePrefsModal() {
        this.ui.closePrefsModal();
    }

    getMidiOutputs(): Promise<MIDIOutput[]> {
        return navigator.requestMIDIAccess().then(function(midiAccess) {
            var outputs = Array.from(midiAccess.outputs.values());
            return outputs;
        });
    }

    setMidiOutput(outputId: MIDIOutput) {
        var groooveBox = this;
        navigator.requestMIDIAccess().then(function(midiAccess) {
            var selectedOutput = midiAccess.outputs.get(outputId);
            if (selectedOutput) {
                groooveBox.selectedOutput = selectedOutput;
            }
        });
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