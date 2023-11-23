import GrooveBox from "../../groovebox";
import Renderable from "../../interfaces/renderable";
import UI from "../../ui";
import RotaryControl from "../rotarycontrol.js";
import BaseControlSet from "./basecontrolset.js";

export default class PitchControl extends BaseControlSet {

    constructor(ui: UI, grooveBox: GrooveBox) {
        super(ui, grooveBox);
        this.setSubControls(0);
    }

    getSubModeLabels(): string[]{
        return "Scale Chord Manual".split(" ");
    }
    
    setSubControls(mode: number){
        this.subModeIndex = mode;
        let ui = this.ui;
        let grooveBox = this.grooveBox;
        let controlSet = this.controlSet;
        controlSet.innerHTML = "";

        switch(mode){
            case 0:
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
                controlSet.appendChild(tonicRotary.element);
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
                controlSet.appendChild(pitchRangeRotary.element);
                this.renderables.push(pitchRangeRotary);


                // <div>
                // <select class="genparam" name="scale" id="scale" data-paramid="scaleIndex">
                // </select>
                // <label for="scale">Scale</label>
                // </div>
                let div = document.createElement("div");
                let scaleSelect = document.createElement("select");
                scaleSelect.classList.add("genparam");
                scaleSelect.name = "scale";
                scaleSelect.id = "scale";
                scaleSelect.dataset.paramid = "scaleIndex";
                div.appendChild(scaleSelect);
                controlSet.appendChild(div);

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
                break;
            case 1:

                // something
                break;
        }

    }
}