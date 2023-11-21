import GrooveBox from "../groovebox";
import UI from "../ui";
import RotaryDial from "./rotarydial.js";
import Renderable from "../interfaces/renderable";
import RotaryControl from "./rotarycontrol.js";

export default class GeneratorParamsPanel {
    grooveBox: GrooveBox;
    ui: UI;
    element: HTMLElement | null;
    paramElements: NodeListOf<HTMLElement>;
    rotaryElements: RotaryDial[];
    renderables: Renderable[] = [];

    constructor(ui: UI, grooveBox: GrooveBox) {
        this.grooveBox = grooveBox;
        this.ui = ui;
        this.element = document.querySelector("#generatorparams")!;
        this.renderables = [];

        // tonic rotary
        let tonicRotary = new RotaryControl(ui, grooveBox);
        tonicRotary.setValue = function (value: number) {
            let tonicValue = Math.floor(value * 128);
            this.grooveBox.setGeneratorParam("tonic", tonicValue);
        }
        tonicRotary.readValue = function () { return this.grooveBox.generatorParams.tonic /  128; }
        tonicRotary.displayValue = function () {
            let pitches = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A","A#", "B"]
            return pitches[ this.grooveBox.generatorParams.tonic % 12 ];
        }
        tonicRotary.setLabel("Root note");
        this.element.prepend(tonicRotary.element);
        this.renderables.push(tonicRotary);
        
        // pitchProbability Rotary 
        let pitchRangeRotary = new RotaryControl(ui, grooveBox);
        pitchRangeRotary.setValue = function (value: number) {
            let modifiedValue = Math.floor(value * 12);
            this.grooveBox.setGeneratorParam("pitchRange", modifiedValue);
        }
        pitchRangeRotary.readValue = function () { return this.grooveBox.generatorParams.pitchRange /  12; }
        pitchRangeRotary.displayValue = function () { return this.grooveBox.generatorParams.pitchRange.toString(); }
        pitchRangeRotary.getIncrement = function() { return 1 / 12; }
        pitchRangeRotary.setLabel("Pitch range");
        this.element.prepend(pitchRangeRotary.element);
        this.renderables.push(pitchRangeRotary);

        this.paramElements = this.element.querySelectorAll(".genparam");
        
        let scaleSelect = this.element.querySelector("#scale") as HTMLSelectElement;
        let scales = this.grooveBox.scales;
        for(var i = 0; i < scales.length; i++){
            let option = document.createElement("option");
            option.value = i.toString();
            option.text = scales[i][0];
            if (this.grooveBox.generatorParams.scaleIndex == i){
                option.selected = true;
            }
            scaleSelect.add(option);
        }
        this.paramElements.forEach((paramElement) => {
            if (paramElement.id !== "scale") {
                let paramId = paramElement.dataset.paramid;
                let value = this.grooveBox.generatorParams[paramId!];
                (paramElement as HTMLInputElement).value = value.toString();
            }
            let paramId = paramElement.dataset.paramid;
            paramElement.addEventListener("input", (e) => {
                let element = e.target as HTMLInputElement;
                let value = element.value;
                this.grooveBox.setGeneratorParam(paramId!, parseInt(value));
            })
        })
        let rotaries = this.element.querySelectorAll(".rotary");
        const array = Array.from(rotaries);
        this.rotaryElements = array.map((element) => {
            return new RotaryDial(ui, grooveBox, element as HTMLElement);
        })
        this.renderables = this.renderables.concat(this.rotaryElements);
    }

    update() {
        this.element?.style.setProperty("border-color", this.grooveBox.generatorParams.color);
        this.renderables.forEach((renderable) => {
            renderable.update();
        })
    }
}