import Clip, { ClipRawData } from "./clip";
import { GeneratorParams } from "./groovebox";

export default class StorageBox {
    storage: Storage;

    constructor() {
        this.storage = window.localStorage;
    }

    getOutputId(): string {
        return this.storage.getItem("outputPortId") || "";
    }

    setOutputId(outputId: string) {
        this.storage.setItem("outputPortId", outputId);
    }

    setInputId(inputId: string) {
        this.storage.setItem("inputPortId", inputId);
    }

    setGeneratorParams(generatorParams: GeneratorParams) {
        this.storage.setItem("generatorParams", JSON.stringify(generatorParams));
    }

    getGeneratorParams(): GeneratorParams | undefined {
        if (this.storage.getItem("generatorParams") != null && this.storage.getItem("generatorParams") != undefined) {
            return JSON.parse(this.storage.getItem("generatorParams")!)
        } else {
            return undefined;
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

    clearClipAtIndex(index: number) {
        this.storage.removeItem(`clip${index}`);
    }
}