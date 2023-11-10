import Clip, { ClipRawData } from "./clip";
import { GeneratorParams } from "./groovebox";

export default class StorageBox {
    storage: Storage;
    defaultGeneratorParams: GeneratorParams = {
        tonic: 48,
        scaleIndex: 4,
        stepsInBar: 16,
        stepProbability: 0.8,
        pitchRange: 4,
        octaveRange: 2,
        octaveProbability: 0.1
    }

    constructor() {
        this.storage = window.localStorage;
    }

    getOutputId(): string {
        return this.storage.getItem("outputPortId") || "";
    }

    setOutputId(outputId: string) {
        this.storage.setItem("outputPortId", outputId);
    }

    setGeneratorParams(generatorParams: GeneratorParams) {
        this.storage.setItem("generatorParams", JSON.stringify(generatorParams));
    }

    getGeneratorParams(): GeneratorParams {
        if (this.storage.getItem("generatorParams") != null && this.storage.getItem("generatorParams") != undefined) {
            return JSON.parse(this.storage.getItem("generatorParams")!)
        } else {
            return this.defaultGeneratorParams;
        }
    }

    setClipAtIndex(clipRawData: ClipRawData, index: number) {
        console.log(`set clip ${index}`);
        this.storage.setItem(`clip${index}`, JSON.stringify(clipRawData));
    }

    getClipAtIndex(index: number): ClipRawData | undefined {
        let clipJSON = this.storage.getItem(`clip${index}`);
        if (clipJSON != null) {
            return JSON.parse(clipJSON);
        } else {
            return undefined;
        }
    }

    getAllClips(): (ClipRawData| undefined)[] {
        return Array(16).fill(0).map((_, index) => this.getClipAtIndex(index));
    }
}