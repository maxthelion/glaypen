import GrooveBox from "../../groovebox";
import Renderable from "../../interfaces/renderable";
import UI from "../../ui";
import PianoNoteView from "../pianonoteview.js";
import RotaryControl from "../rotarycontrol.js";
import BaseControlSet from "./basecontrolset.js";

export default class PitchControl extends BaseControlSet {
    pianoNoteView: PianoNoteView;
    scaleSelect: HTMLSelectElement;

    constructor(ui: UI, grooveBox: GrooveBox) {
        super(ui, grooveBox);
        this.setSubControls(0);
        this.pianoNoteView = new PianoNoteView(ui, grooveBox);
        this.headElement.appendChild(this.pianoNoteView.element);
        this.renderables.push(this.pianoNoteView);
    }

    getSubModeLabels(): string[]{
        return "Scale Chord Manual".split(" ");
    }

    update(): void {
        super.update();
        this.setScaleValue()
    }
    
    setPitchGenMode(mode: number){
        this.grooveBox.setPitchGen(mode);
    }

    setSubControls(mode: number){
        this.subModeIndex = mode;
        let ui = this.ui;
        let grooveBox = this.grooveBox;
        let controlSet = this.controlSet;
        this.setPitchGenMode(mode);
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
                this.scaleSelect = document.createElement("select");
                this.scaleSelect.classList.add("genparam");
                this.scaleSelect.name = "scale";
                this.scaleSelect.id = "scale";
                this.scaleSelect.dataset.paramid = "scaleIndex";
                this.scaleSelect.addEventListener("change", (e) => {
                    let element = e.target as HTMLSelectElement;
                    let value = element.value;
                    this.grooveBox.setGeneratorParam("scaleIndex", parseInt(value));
                })
                div.appendChild(this.scaleSelect);
                controlSet.appendChild(div);

                let scales = this.grooveBox.scales;
                for(var i = 0; i < scales.length; i++){
                    let option = document.createElement("option");
                    option.value = i.toString();
                    option.text = scales[i][0];
                    if (this.grooveBox.generatorParams.scaleIndex == i){
                        option.selected = true;
                    }
                    this.scaleSelect.add(option);
                }
                break;
            case 1:

                // something
                break;
        }

    }

    setScaleValue(){
        this.scaleSelect.value = this.grooveBox.generatorParams.scaleIndex.toString();
    }
}

