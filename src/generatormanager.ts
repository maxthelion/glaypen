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
        scaleOctaveRoot: 0,
        scaleIntervalProbabilities: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        chordOctaveRoot: 0,
        chordKey: 60,
        chordScaleIndex: 0,
        chordIndex: 0,
        chordRoot: 0,
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
            for (const key in this.defaultGeneratorParams) {
                if (!storedParams.hasOwnProperty(key)) {
                    storedParams[key] = this.defaultGeneratorParams[key];
                }
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

    getScale(){
        return this.grooveBox.scales[this.currentGeneratorParams.scaleIndex][1];
    }

    getChordScale(){
        return this.grooveBox.scales[this.currentGeneratorParams.chordScaleIndex][1];
    }

    setIntervalProbability(index: number, probability: number) {
        console.log("setIntervalProbability", index, probability);
        this.currentGeneratorParams.scaleIntervalProbabilities[index] = probability;
        this.grooveBox.storageBox.setGeneratorParams(this.currentGeneratorParams);
    }

    getIntervalProbability(index?: number) {
        if (index !== undefined) {
            return this.currentGeneratorParams.scaleIntervalProbabilities[index];
        } else {
            return 1;
        }
    }

    getIntervalProbabilities()  {
        return this.currentGeneratorParams.scaleIntervalProbabilities;
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

    loadOrSaveAtIndex(index: number) {
        let savedParams = this.presetAtIndex(index)
        if (savedParams !== null) {
            this.currentGeneratorParams = savedParams;
            this.generatorParamsArray.push(this.currentGeneratorParams);
            this.currentGenParamIndex = this.generatorParamsArray.length - 1;
            this.genChanges.push([this.currentGenParamIndex, this.grooveBox.currentSequencer()!.absoluteStep]);
            this.genParamPresetIndex = index;
        } else {
            this.genParamPresetIndex = index;
            this.storageBox.set(`genParam${index}`, JSON.stringify(this.currentGeneratorParams));
        }
    }

    loadedPresetIndex() {
        return this.genParamPresetIndex;
    }

    clearPresetAtIndex(index: number) {
        this.storageBox.clear(`genParam${index}`);
    }

    presetAtIndex(index: number) {
        let storedPreset = this.storageBox.get(`genParam${index}`);
        if (storedPreset !== null) {
            return JSON.parse(storedPreset);
        }
        return null;
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
        let hue = (generatorParams.scaleIndex / this.grooveBox.scales.length) * 360;
        let saturation = (this.stepDensity() * 50) + 25;
        let lightness = (this.pitchRoot() * 50) + 25;
        let hsl = `hsl(${hue},${saturation}%,${lightness}%)`;
        return hsl;
    }

    // for generating colors
    pitchRoot() {
        return (this.currentGeneratorParams.scaleOctaveRoot / 10);
    }

    // for generating colors
    stepDensity() {
        let stepsInBar = this.currentGeneratorParams.stepsInBar;
        let stepProbability = this.currentGeneratorParams.stepProbability;
        return (stepsInBar / 16) * (stepProbability / 128);
    }

    generateRandomSettings() {
        this.currentGeneratorParams = {
            "tonic": 64 + (32 - Math.floor(Math.random() * 64)),
            "scaleIndex": Math.floor(Math.random() * this.scales.length),
            "stepsInBar": (Math.floor(Math.random() * 4) +1) * 4,
            "stepProbability": Math.floor(Math.random() * 128),
            "pitchRange": Math.floor(Math.random() * 12) + 1,
            "octaveRange": Math.floor(Math.random() * 5) + 1,
            "octaveProbability": Math.floor(Math.random() * 128),
        }
    }
}
