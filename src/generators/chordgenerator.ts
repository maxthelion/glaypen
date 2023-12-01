import GrooveBox from "../groovebox";
import PitchGenerator from "./pitchgenerator.js";

export default class ChordGenerator extends PitchGenerator{

    constructor(grooveBox: GrooveBox) {
        super(grooveBox);
    }

    availablePitches(): number[] {
        let chords = this.grooveBox.chords;
        let chordKey = this.grooveBox.generatorManager.getNumberAttribute("chordKey");
        let chordOctaveRoot = this.grooveBox.generatorManager.getNumberAttribute("chordOctaveRoot");
        let chordScaleIndex = this.grooveBox.generatorManager.getNumberAttribute("chordScaleIndex");
        let chordRoot = this.grooveBox.generatorManager.getNumberAttribute("chordRoot");
        let chordIndex = this.grooveBox.generatorManager.getNumberAttribute("chordIndex");
        let scaleStart = chordKey + (chordOctaveRoot * 12);
        let scalePitches = this.grooveBox.scales[chordScaleIndex][1];

        let chordPitches = chords[chordIndex][1];
        let pitches = [];
        for (let i = 0; i < chordPitches.length; i++) {
            let pitch = scaleStart + chordPitches[i] + chordRoot;
            pitches.push(pitch);
        }
        return pitches;
    }

    getNextPitch() {
        let pitches = this.availablePitches();
        let pitchRange = pitches.length;
        let pitchInterval = Math.floor( Math.random() * pitchRange);
        let pitch = pitches[pitchInterval];
        return pitch;
    }

}