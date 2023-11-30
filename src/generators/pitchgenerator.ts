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

    availablePitches() {
        let tonic = this.generatorManager.currentGeneratorParams.tonic;
        let scaleIndex = this.generatorManager.currentGeneratorParams.scaleIndex;
        let scalePitches = this.grooveBox.scales[scaleIndex][1];
        let pitchRange = this.generatorManager.currentGeneratorParams.pitchRange;
        let pitches = [];
        for (let i = 0; i < pitchRange; i++) {
            let pitch = tonic + scalePitches[i];
            pitches.push(pitch);
        }
        return pitches;
    }

    getNextPitch() {
        
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
        var pitch = tonic + scalePitches[pitchInterval];
        if (Math.random() > (octaveProbability) ) {
            let octaveChange = Math.floor( Math.random() * octaveRange) - Math.floor(octaveRange / 2);
            pitch += (octaveChange * 12);
        }  
        return pitch;
    }
}