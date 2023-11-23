import GrooveBox from "../groovebox";

export default class PitchGenerator {

    grooveBox: GrooveBox;

    constructor(grooveBox: GrooveBox) {
        this.grooveBox = grooveBox;
    }

    generateRandomPitch() {
        let pitch =  1;
        return pitch;
    }

    availablePitches() {
        let tonic = this.grooveBox.generatorParams.tonic;
        let scaleIndex = this.grooveBox.generatorParams.scaleIndex;
        let scalePitches = this.grooveBox.scales[scaleIndex][1];
        let pitchRange = this.grooveBox.generatorParams.pitchRange;
        let pitches = [];
        for (let i = 0; i < pitchRange; i++) {
            let pitch = tonic + scalePitches[i];
            pitches.push(pitch);
        }
        return pitches;
    }
}