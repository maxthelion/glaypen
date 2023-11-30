import GrooveBox from "../groovebox";
import PitchGenerator from "./pitchgenerator.js";

export default class ChordGenerator extends PitchGenerator{

    constructor(grooveBox: GrooveBox) {
        super(grooveBox);
    }

    availablePitches(): number[] {
        let chords = this.grooveBox.chords;
        let chordRoot = this.grooveBox.generatorManager.getNumberAttribute("chordRoot");
        let chordIndex = this.grooveBox.generatorManager.getNumberAttribute("chordIndex");
        let chordPitches = chords[chordIndex][1];
        let pitches = [];
        for (let i = 0; i < chordPitches.length; i++) {
            let pitch = chordRoot + chordPitches[i];
            pitches.push(pitch);
        }
        return pitches;
    }

    getNextPitch() {
        let chordIndex = this.grooveBox.generatorManager.getNumberAttribute("chordIndex");
        let scalePitches = this.grooveBox.chords[chordIndex][1];
        let root = this.grooveBox.generatorManager.getNumberAttribute("chordRoot");
        let pitchRange = scalePitches.length;
        // let octaveRange = this.grooveBox.generatorManager.getNumberAttribute("octaveRange");
        // let octaveProbability = this.grooveBox.generatorManager.getNumberAttribute("octaveProbability") / 128;
        var pitchInterval = Math.floor( Math.random() * pitchRange);
        pitchInterval = pitchInterval % scalePitches.length;
        var pitch = root + scalePitches[pitchInterval];
        return pitch;
    }

}