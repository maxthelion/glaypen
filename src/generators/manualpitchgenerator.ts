import GrooveBox from "../groovebox";
import PitchGenerator from "./pitchgenerator.js";

export default class ManualPitchGenerator extends PitchGenerator{

    constructor(grooveBox: GrooveBox) {
        super(grooveBox);
    }

    availablePitches(): number[] {
        let pitches = this.grooveBox.manualPitchOptions;
        return pitches;
    }

    getNextPitch() {
        let chordIndex = this.grooveBox.generatorParams.chordIndex;
        let scalePitches = this.grooveBox.chords[chordIndex][1];
        let root = this.grooveBox.generatorParams.chordRoot;
        let pitchRange = scalePitches.length;
        // let octaveRange = this.grooveBox.generatorParams.octaveRange;
        // let octaveProbability = this.grooveBox.generatorParams.octaveProbability / 128;
        var pitchInterval = Math.floor( Math.random() * pitchRange);
        pitchInterval = pitchInterval % scalePitches.length;
        var pitch = root + scalePitches[pitchInterval];
        return pitch;
    }

}