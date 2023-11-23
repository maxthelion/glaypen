class BaseGenerator {

    constructor() {
        this._template = "";
        
    }

    euclidianRhythm(steps: number, pulses: number) {
        var pattern = [];
        for (var i = 0; i < steps; i++) {
            pattern.push(0);
        }
        var counts = [];
        for (var i = 0; i < pulses; i++) {
            counts.push(0);
        }
        var countsIndex = 0;
        for (var i = 0; i < steps; i++) {
            if (counts[countsIndex] < pulses) {
                pattern[i] = 1;
                counts[countsIndex] += 1;
            }
            countsIndex += 1;
            if (countsIndex >= counts.length) {
                countsIndex = 0;
            }
        }
        return pattern;
    }

    generate() {
        return this._template;
    }
}