import GrooveBox from "../../groovebox";
import Renderable from "../../interfaces/renderable";
import UI from "../../ui";


export default class BaseControlSet implements Renderable {
    element: HTMLElement;
    renderables: Renderable[];
    headElement: HTMLElement;
    grooveBox: GrooveBox;
    controlSet: HTMLElement;
    ui: UI;
    modeButtons: HTMLElement[] = [];
    subModeIndex: number = 0;

    // overload in subclass
    setSubModeIndex(index: number){
        this.subModeIndex = index;
    }

    subModeLabels: string[] = "SubMode1 SubMode2 SubMode3".split(" ");

    constructor(ui: UI, grooveBox: GrooveBox) {
        console.log("BaseControlSet constructor")
        this.grooveBox = grooveBox;
        this.ui = ui;
        this.element = document.createElement("div");
        this.headElement = document.createElement("div");
        this.element.appendChild(this.headElement);
        this.controlSet = document.createElement("div");
        this.controlSet.classList.add("pitchcontrol");
        this.controlSet.classList.add("gencontrolset");
        this.element.appendChild(this.controlSet);

        this.addModeButtons(this.getSubModeLabels());
        this.renderables = [];

        this.setSubControls(0);
    }

    getSubModeLabels(): string[]{
        console.log("getSubModeLabels", this.subModeLabels)
        return this.subModeLabels;
    }

    addModeButtons(modes: string[]){
        let stepGenMode = document.createElement("div");
        stepGenMode.classList.add("stepgenmode");
        for(var i = 0; i < modes.length; i++){
            let mode = modes[i];
            let button = document.createElement("a");
            button.classList.add("stepgenmodebutton");
            button.textContent = mode;
            button.href = "#";
            button.dataset.modeIndex = i.toString();
            this.modeButtons.push(button);
            stepGenMode.appendChild(button);
            button.addEventListener("click", (e) => {
                let element = e.target as HTMLElement;
                let modeIndex = element.dataset.modeIndex!;
                this.grooveBox.setGeneratorParam("pitchmodeindex", parseInt(modeIndex));
                this.subModeIndex = parseInt(modeIndex);
                this.setSubControls(parseInt(modeIndex));
            })
        }
        this.headElement.appendChild(stepGenMode);
    }

    setSubControls(mode: number){

    }

    update(): void {
        this.modeButtons.forEach((button) => {
            button.classList.remove("selected");
        });
        this.modeButtons[this.subModeIndex].classList.add("selected");

        this.renderables.forEach((renderable) => {
            renderable.update();
        });
    }
}