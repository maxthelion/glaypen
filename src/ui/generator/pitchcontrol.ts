import GeneratorManager from "../../generatormanager";
import GrooveBox from "../../groovebox";
import Renderable from "../../interfaces/renderable";
import UI from "../../ui";
import IntervalProbabilityControl from "../intervalprobabilitycontrol.js";
import PianoNoteView from "../pianonoteview.js";
import RotaryControl from "../rotarycontrol.js";
import BaseControlSet from "./basecontrolset.js";

export default class PitchControl extends BaseControlSet {
    pianoNoteView: PianoNoteView;
    scaleSelect: HTMLSelectElement;
    generatorManager: GeneratorManager;
    intervalProbabilityControls: IntervalProbabilityControl[] = [];

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
        this.highlightInterval();
    }

    highlightInterval(){
        
        if (this.intervalProbabilityControls.length > 0){
            this.intervalProbabilityControls.forEach((button) => {
                button.update();
            })
        }
    }

    getSubModeIndex(): number {
        // console.log("getSubModeIndex", this.generatorManager)
        return this.grooveBox.generatorManager.getPitchModeIndex();
    }

    setSubControls(){
        super.setSubControls();

        switch(this.getSubModeIndex()){
            case 0:
                let keyRotary = this.addRotaryControl("scaleKey", "Key", 12);
                keyRotary.displayValue = function () {
                    let pitches = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A","A#", "B"]
                    return pitches[ Math.round(this.readValue() * 12) % 12 ];
                }

                this.addScaleSelect();

                // tonic rotary
                let tonicRotary = this.addRotaryControl("tonic", "Scale offset", 0);
                tonicRotary.getValueScale = function () {
                    return this.grooveBox.generatorManager.getScale().length;
                }
                // tonicRotary.displayValue = function () {
                //     let pitches = 
                //     let octave = Math.floor((this.readValue() * this.valueScale) / 12);
                //     return pitches[ Math.round(this.readValue() * this.valueScale) % 12 ] + octave.toString();
                // }
                
                let octaveRotary = this.addRotaryControl("scaleOctaveRoot", "Octave", 10);

                // pitchProbability Rotary
                this.addRotaryControl("pitchRange", "Pitch range", 12);

                this.addIntervalChooser();
                break;
            case 1:
                //
                // chordRoot rotary
                let chordRootRotary = this.addRotaryControl("chordRoot", "Chord offset", 12);
                chordRootRotary.getValueScale = function () {
                    return this.grooveBox.generatorManager.getChordScale().length;
                }
                this.addScaleSelect("chordScaleIndex", "Chord scale");

                let chordOctaveRotary = this.addRotaryControl("chordOctaveRoot", "Octave", 10);                
                let chordKey = this.addRotaryControl("chordKey", "Key", 12);
                chordKey.displayValue = function () {
                    let pitches = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A","A#", "B"]
                    return pitches[ Math.round(this.readValue() * 12) % 12 ];
                }

                this.addChordChooser();
                this.addChordSelect();
                // something
                break;
        }

    }

    addChordChooser(){
        let div = document.createElement("div");
        div.classList.add("chordchooser");
        let chordNames = ["I", "ii", "iii", "IV", "V", "vi", "vii"];
        let chordModes = ["maj", "min", "min", "maj", "maj", "min", "dim"];
        for (var i = 0; i < 7; i++){
            let button = document.createElement("a");
            button.href = "#";
            button.classList.add("chordbutton");
            button.textContent = chordNames[i];
            button.dataset.chordIndex = this.mapModeToChordIndex(chordModes[i])!.toString();
            button.dataset.chordRoot = i.toString();
            div.appendChild(button);
            button.addEventListener("click", (e) => {
                let element = e.target as HTMLElement;
                let chordRoot = element.dataset.chordRoot!;
                let chordIndex = element.dataset.chordIndex!;
                this.grooveBox.setGeneratorParam("chordRoot", parseInt(chordRoot));
                this.grooveBox.setGeneratorParam("chordIndex", parseInt(chordIndex));
            })
        }
        this.footElement.appendChild(div);
    }

    addIntervalChooser(){
        let div = document.createElement("div");
        div.classList.add("intervalchooser");
        let intervals = [];
        for (var i = 0; i < 12; i++){
            intervals.push(i);
        }
        this.intervalProbabilityControls = [];
        for (var i = 0; i < intervals.length; i++){
            let intervalProbabilityControl = new IntervalProbabilityControl(this.ui, this.grooveBox, i);
            div.appendChild(intervalProbabilityControl.element);
            this.subRenderables.push(intervalProbabilityControl);
            this.intervalProbabilityControls.push(intervalProbabilityControl);
        }
        this.footElement.appendChild(div);
    }

    mapModeToChordIndex(mode:string){
        switch(mode){
            case "maj":
                return 0;
            case "min":
                return 1;
            case "dim":
                return 2;
        }
    }

    addScaleSelect(paramName: string = "scaleIndex", label: string = "Scale"){
        let div = document.createElement("div");
        this.scaleSelect = document.createElement("select");
        this.scaleSelect.dataset.paramid = paramName;
        this.scaleSelect.addEventListener("change", (e) => {
            let element = e.target as HTMLSelectElement;
            let value = element.value;
            this.grooveBox.setGeneratorParam(paramName, parseInt(value));
        })
        div.appendChild(this.scaleSelect);
        this.controlSet.appendChild(div);

        let scales = this.grooveBox.scales;
        for(var i = 0; i < scales.length; i++){
            let option = document.createElement("option");
            option.value = i.toString();
            option.text = scales[i][0];
            if (this.grooveBox.generatorManager.getCurrentAttribute(paramName) == i){
                option.selected = true;
            }
            this.scaleSelect.add(option);
        }
    }

    addChordSelect(){
        let chordDiv = document.createElement("div");
        this.scaleSelect = document.createElement("select");
        this.scaleSelect.addEventListener("change", (e) => {
            let element = e.target as HTMLSelectElement;
            let value = element.value;
            this.grooveBox.setGeneratorParam("chordIndex", parseInt(value));
        })
        chordDiv.appendChild(this.scaleSelect);
        this.footElement.appendChild(chordDiv);

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

