import GeneratorManager from "../generatormanager";
import GrooveBox from "../groovebox";

export default class PitchGenerator {

    grooveBox: GrooveBox;
    direction: number = 1;
    lastPitch: number = -1;
    generatorManager: GeneratorManager;

    constructor(grooveBox: GrooveBox) {
        this.grooveBox = grooveBox;
        this.generatorManager = this.grooveBox.generatorManager;
    }

    generateRandomPitch() {
        let pitch =  1;
        return pitch;
    }

    availableIntervals() {
        let scaleKey = this.generatorManager.currentGeneratorParams.scaleKey;
        let intervals = [];
        let tonic = this.generatorManager.currentGeneratorParams.tonic;
        for (let i = 0; i < this.availablePitches().length; i++) {
            let interval = scaleKey + i;
            
            intervals.push(i + tonic);
        }
        return intervals;
    }

    availablePitches() {
        let tonic = this.generatorManager.currentGeneratorParams.tonic;
        let scaleOctaveRoot = this.generatorManager.currentGeneratorParams.scaleOctaveRoot;
        let scaleKey = this.generatorManager.currentGeneratorParams.scaleKey;
        let scaleStart = scaleKey + (scaleOctaveRoot * 12);
        let scaleIndex = this.generatorManager.currentGeneratorParams.scaleIndex;
        let scalePitches = this.grooveBox.scales[scaleIndex][1];
        let pitchRange = this.generatorManager.currentGeneratorParams.pitchRange;
        let pitches = [];
        for (let i = 0; i < pitchRange; i++) {
            let pitch = scaleStart + scalePitches[((i + tonic) % scalePitches.length)];
            pitches.push(pitch);
        }
        return pitches;
    }

    getNextPitch() {
        let scaleOctaveRoot = this.generatorManager.currentGeneratorParams.scaleOctaveRoot;
        let scaleKey = this.generatorManager.currentGeneratorParams.scaleKey;
        let scaleStart = scaleKey + (scaleOctaveRoot * 12);
        let scaleIndex = this.generatorManager.currentGeneratorParams.scaleIndex;
        let scalePitches = this.grooveBox.scales[scaleIndex][1];
        let tonic = this.generatorManager.currentGeneratorParams.tonic;
        let pitchRange = this.generatorManager.currentGeneratorParams.pitchRange;
        let octaveRange = this.generatorManager.currentGeneratorParams.octaveRange;
        let octaveProbability = this.generatorManager.currentGeneratorParams.octaveProbability / 128;
        if (this.lastPitch == -1) {
            this.lastPitch = tonic;
        }
        var pitchInterval = Math.floor( Math.random() * pitchRange);

        // var pitchInterval = this.lastPitch + this.direction;
        // if (pitchInterval < 0) {
        //     pitchInterval = 0;
        //     this.direction = 1;
        // } else if (pitchInterval > pitchRange - 1) {
        //     pitchInterval = pitchRange - 1;
        //     this.direction = -1;
        // }
        // this.lastPitch = pitchInterval;
        pitchInterval = pitchInterval % scalePitches.length;
        var pitch = scaleStart + scalePitches[((pitchInterval + tonic) % scalePitches.length)];
        if (Math.random() > (octaveProbability) ) {
            let octaveChange = Math.floor( Math.random() * octaveRange) - Math.floor(octaveRange / 2);
            pitch += (octaveChange * 12);
        }  
        return pitch;
    }
}