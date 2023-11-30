import ChordGenerator from "./generators/chordgenerator.js";
import EuclidianStepGenerator from "./generators/euclidianstepgenerator.js";
import ManualStepGenerator from "./generators/manualstepgenerator.js";
import PitchGenerator from "./generators/pitchgenerator.js";
import StepGenerator from "./generators/stepgenerator.js";
import GrooveBox from "./groovebox.js";
import GeneratorParamsInterface from "./interfaces/generatorinterface.js";
import Step from "./step.js";
import StorageBox from "./storagebox.js";

export default class GeneratorManager {
    currentGeneratorParams: GeneratorParamsInterface;
    grooveBox: GrooveBox;
    defaultGeneratorParams: GeneratorParamsInterface = {
        tonic: 48,
        scaleIndex: 4,
        stepsInBar: 16,
        stepProbability: 128,
        pitchRange: 4,
        octaveRange: 2,
        octaveProbability: 0.1,
        stepMode: 0,
        pitchMode: 0,
        scaleKey: 60,
        chordKey: 60,
        color: "#000000",
        stepPulseNumber: 4,
        manualSteps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0 ,0 ,0 ,0 ,0 ,0],
    };

    // generatorParams: GeneratorParams;
    // for the buttons under the params
    genParamPresetIndex?: number;
    // for the history view
    currentGenParamStepIndex?: number;
    currentGenParamIndex?: number;
    storedGenParams: GeneratorParamsInterface[] = [];
    generatorParamsArray: GeneratorParamsInterface[] = [];
    genChanges: [number, number][] = [];
    storageBox: StorageBox;


    constructor(grooveBox: GrooveBox) {
        this.storageBox = grooveBox.storageBox;
        this.grooveBox = grooveBox;
        let storedParams = this.grooveBox.storageBox.getGeneratorParams();
        if (storedParams !== undefined && storedParams !== null) {
            if (storedParams.stepMode === undefined) {
                storedParams.stepMode = 0;
            }
            if (storedParams.pitchMode === undefined) {
                storedParams.pitchMode = 0;
            }
            this.currentGeneratorParams = storedParams!;
        } else {
            this.currentGeneratorParams = this.defaultGeneratorParams;
        }
        this.generatorParamsArray.push(this.currentGeneratorParams);
        this.genChanges.push([0, 0]);
        this.currentGenParamStepIndex = 0;
    }

    setManualStepProbability(step: number, probability: number) {
        if (this.currentGeneratorParams.manualSteps === undefined) {
            this.currentGeneratorParams.manualSteps = this.defaultGeneratorParams.manualSteps;
        }
        this.currentGeneratorParams.manualSteps[step] = probability;
        this.grooveBox.storageBox.setGeneratorParams(this.currentGeneratorParams);
    }

    getCurrentParams() {
        return this.currentGeneratorParams;
    }

    getNumberAttribute(attribute: string) : number {
        return parseInt(this.currentGeneratorParams[attribute]);
    }

    getCurrentAttribute(attribute: string) {
        return this.currentGeneratorParams[attribute];
    }

    getPitchModeIndex() {
        // console.log("getPitchModeIndex", this.currentGeneratorParams)
        return this.currentGeneratorParams.pitchMode;
    }

    getStepModeIndex() {
        return this.currentGeneratorParams.stepMode;
    }

    getColor() : string {
        return this.currentGeneratorParams.color;
    }

    noteOn(pitch: number) {
        if (this.getPitchModeIndex() == 0) {
            this.setGeneratorParam("tonic", pitch);
        } else if (this.getPitchModeIndex() == 1) {
            this.setGeneratorParam("chordRoot", pitch);
        }
    }

    setGeneratorParam(paramName: string, value: number) {
        this.currentGeneratorParams[paramName] = value;
        // this.grooveBox.setGeneratorParam(param, value);
        // Duplicate the generatorParams object
        const newGeneratorParams = { ...this.currentGeneratorParams };

        // Update the duplicated object with the new value
        newGeneratorParams[paramName] = value;
        newGeneratorParams.color = this.colorFromGenParams(newGeneratorParams);

        // Update the original object reference
        this.currentGeneratorParams = newGeneratorParams;
        this.generatorParamsArray.push(newGeneratorParams)
        this.currentGenParamIndex = this.generatorParamsArray.length - 1;
        this.genChanges.push([this.currentGenParamIndex, this.grooveBox.currentSequencer()!.absoluteStep]);
        this.storageBox.setGeneratorParams(this.currentGeneratorParams);
    }

    setGenParamsFromIndex(index: number) {
        let matchedParams = this.genChanges.filter((genChange) => {
            return genChange[1] <= index;
        }).pop();
        if (matchedParams != undefined
            // don't record a step change if the params haven't changed
            && this.currentGenParamStepIndex != matchedParams[1] ) {

            let foundIndex = matchedParams[0];
            const newGeneratorParams = this.getGenParamsByIndex(foundIndex);
            this.currentGeneratorParams = newGeneratorParams;
            this.currentGenParamStepIndex = matchedParams[1];
            this.currentGenParamIndex = foundIndex;
            this.genChanges.push([foundIndex, this.grooveBox.currentSequencer()!.absoluteStep]);

        }
    }

    getGenParamsByIndex(index: number): GeneratorParamsInterface {
        // console.log(index, this.generatorParamsArray)
        return this.generatorParamsArray[index];
    }

    buildCurrentStepGenerator() {
        switch(this.currentGeneratorParams.stepMode) {
            case 0:
                return new StepGenerator(this.grooveBox);
            case 1:
                return new EuclidianStepGenerator(this.grooveBox);
            case 2:
                return new ManualStepGenerator(this.grooveBox);
            default:
                throw new Error("Invalid stepMode " + this.currentGeneratorParams.stepMode);
        }
    }

    buildCurrentPitchGenerator() {
        switch(this.currentGeneratorParams.pitchMode) {
            case 0:
                return new PitchGenerator(this.grooveBox);
            case 1:
                return new ChordGenerator(this.grooveBox);
            case 2:
                return new PitchGenerator(this.grooveBox);
            default:
                throw new Error("Invalid pitchMode");
        }
    }

    colorFromGenParams(generatorParams: GeneratorParamsInterface): string {
        let maxCol = 64
        let tonicColor = generatorParams.tonic / 2;
        let scaleColor = generatorParams.scaleIndex / this.grooveBox.scales.length * maxCol;
        let stepsInBarColor = generatorParams.stepsInBar / 16 * maxCol;
        let stepProbabilityColor = generatorParams.stepProbability / 2;
        let pitchRangeColor = generatorParams.pitchRange / 12 * maxCol;
        let octaveRangeColor = generatorParams.octaveRange / 5 * maxCol;
        let octaveProbabilityColor = generatorParams.octaveProbability / 2;
        let r = 192 - Math.floor(tonicColor + scaleColor + stepsInBarColor);
        let g = 192 - Math.floor(stepProbabilityColor + pitchRangeColor );
        let b = 192 - Math.floor(octaveProbabilityColor + octaveRangeColor);
        return `rgb(${r},${g},${b})`;
    }

    generateRandomSettings() {
        this.generatorParams = {
            "tonic": 64 + (32 - Math.floor(Math.random() * 64)),
            "scaleIndex": Math.floor(Math.random() * this.scales.length),
            "stepsInBar": (Math.floor(Math.random() * 4) +1) * 4,
            "stepProbability": Math.floor(Math.random() * 128),
            "pitchRange": Math.floor(Math.random() * 12) + 1,
            "octaveRange": Math.floor(Math.random() * 5) + 1,
            "octaveProbability": Math.floor(Math.random() * 128),
            color: this.randomColor(Math.floor(Math.random() * 1000))
        }
    }
}
