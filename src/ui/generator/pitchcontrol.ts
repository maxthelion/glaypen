import GeneratorManager from "../../generatormanager";
import GrooveBox from "../../groovebox";
import Renderable from "../../interfaces/renderable";
import UI from "../../ui";
import PianoNoteView from "../pianonoteview.js";
import RotaryControl from "../rotarycontrol.js";
import BaseControlSet from "./basecontrolset.js";

export default class PitchControl extends BaseControlSet {
    pianoNoteView: PianoNoteView;
    scaleSelect: HTMLSelectElement;
    generatorManager: GeneratorManager;

    constructor(ui: UI, grooveBox: GrooveBox) {
        super(ui, grooveBox);
        this.pianoNoteView = new PianoNoteView(ui, grooveBox);
        this.headElement.appendChild(this.pianoNoteView.element);
        this.renderables.push(this.pianoNoteView);
        this.generatorManager = grooveBox.generatorManager;
        console.log("pitch control constructor", this.generatorManager)
    }

    getSubModeLabels(): string[]{
        return "Scale Chord Manual".split(" ");
    }

    onModeChange(mode: number): void {
        this.grooveBox.setPitchGen(mode);
        this.setSubControls();
    }

    update(): void {
        super.update();
        this.setScaleValue()
    }

    getSubModeIndex(): number {
        // console.log("getSubModeIndex", this.generatorManager)
        return this.grooveBox.generatorManager.getPitchModeIndex();
    }

    setSubControls(){
        super.setSubControls();

        switch(this.getSubModeIndex()){
            case 0:
                // tonic rotary
                let tonicRotary = this.addRotaryControl("tonic", "Root note", 12);
                tonicRotary.displayValue = function () {
                    let pitches = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A","A#", "B"]
                    return pitches[ this.readValue() % 12 ];
                }
                
                // pitchProbability Rotary
                this.addRotaryControl("pitchRange", "Pitch range", 12);

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
                this.controlSet.appendChild(div);

                let scales = this.grooveBox.scales;
                for(var i = 0; i < scales.length; i++){
                    let option = document.createElement("option");
                    option.value = i.toString();
                    option.text = scales[i][0];
                    if (this.grooveBox.generatorManager.getCurrentAttribute("scaleIndex") == i){
                        option.selected = true;
                    }
                    this.scaleSelect.add(option);
                }
                break;
            case 1:
                //
                // chordRoot rotary
                let chordRootRotary = this.addRotaryControl("chordRoot", "Root note", 12);
                
                chordRootRotary.displayValue = function () {
                    let pitches = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A","A#", "B"]
                    // console.log("this.displayValue")
                    return pitches[ this.grooveBox.generatorManager.currentGeneratorParams.chordRoot % 12 ];
                }

                let chordDiv = document.createElement("div");
                this.scaleSelect = document.createElement("select");
                this.scaleSelect.addEventListener("change", (e) => {
                    let element = e.target as HTMLSelectElement;
                    let value = element.value;
                    this.grooveBox.setGeneratorParam("chordIndex", parseInt(value));
                })
                chordDiv.appendChild(this.scaleSelect);
                this.controlSet.appendChild(chordDiv);

                let chords = this.grooveBox.getChords();
                for(var i = 0; i < chords.length; i++){
                    let option = document.createElement("option");
                    option.value = i.toString();
                    option.text = chords[i][0];
                    if (this.grooveBox.generatorManager.currentGeneratorParams.chordIndex == i){
                        option.selected = true;
                    }
                    this.scaleSelect.add(option);
                }
                // something
                break;
        }

    }


    addRotaryControl(paramName: string, label: string, valueScale: number){
        let rotary = new RotaryControl(this.ui, this.grooveBox);
        rotary.valueScale = valueScale;
        rotary.paramName = paramName;
        rotary.setLabel(label);
        this.controlSet.appendChild(rotary.element);
        this.subRenderables.push(rotary);
        return rotary;
    }

    setScaleValue(){
        if (this.scaleSelect !== undefined) {
            this.scaleSelect.value = this.generatorManager.currentGeneratorParams.scaleIndex.toString();
        }
    }
}

