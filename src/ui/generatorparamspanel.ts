import GrooveBox from "../groovebox";
import UI from "../ui";
import RotaryDial from "./rotarydial.js";
import Renderable from "../interfaces/renderable";
import RotaryControl from "./rotarycontrol.js";
import PitchControl from "./generator/pitchcontrol.js";
import StepControl from "./generator/stepcontrol.js";

export default class GeneratorParamsPanel {
    grooveBox: GrooveBox;
    ui: UI;
    element: HTMLElement | null;
    paramElements: NodeListOf<HTMLElement>;
    rotaryElements: RotaryDial[];
    renderables: Renderable[] = [];
    genPanels: Renderable[] = [];
    currentPart: Renderable;
    pitchPanel: PitchControl;
    stepPanel: StepControl;

    constructor(ui: UI, grooveBox: GrooveBox) {
        this.grooveBox = grooveBox;
        this.ui = ui;
        this.element = document.querySelector("#generatorparams")!;
        this.renderables = [];

        this.pitchPanel = new PitchControl(ui, grooveBox);
        this.genPanels.push(this.pitchPanel);

        this.stepPanel = new StepControl(ui, grooveBox);
        this.genPanels.push(this.stepPanel);
        
        // generator parts tabs
        let generatorPartsTabs = document.querySelector("#generatorpartstabs") as HTMLDivElement;
        let generatorPartsTabsButtons = generatorPartsTabs.querySelectorAll(".generatorpartstab");
        generatorPartsTabsButtons.forEach((button) => {
            button.addEventListener("click", (e) => {
                let element = e.target as HTMLElement;
                let partid = element.dataset.partid;
                this.setGeneratorPart(partid!);
            })
        })
        this.setGeneratorPart("0")
        

        this.paramElements = this.element.querySelectorAll(".genparam");
        

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

    setGeneratorPart(partId: string) {
        let generatorPartsTabs = document.querySelector("#generatorpartstabs") as HTMLDivElement;
        let generatorPartsTabsButtons = generatorPartsTabs.querySelectorAll(".generatorpartstab");
        generatorPartsTabsButtons.forEach((button) => {
            let buttonEl = button as HTMLButtonElement;
            if (buttonEl.dataset.partid !== partId){
                buttonEl.classList.remove("selected");
            } else {
                buttonEl.classList.add("selected");
            }
        })
        switch (partId) {
            case "0":
                this.currentPart = this.pitchPanel;
                break;
            case "1":
                this.currentPart = this.stepPanel;
                break;
            default:
                break;
        }
        let panelIndex = parseInt(partId);
        this.element!.innerHTML = "";
        this.element?.appendChild(this.genPanels[panelIndex].element!);

    }

    update() {
        this.element?.style.setProperty("border-color", this.grooveBox.generatorManager.getColor());
        this.currentPart.update();
        this.renderables.forEach((renderable) => {
            renderable.update();
        })
    }
}