import GrooveBox from "../groovebox";
import UI from "../ui";

export default class GeneratorParamsPanel {
    grooveBox: GrooveBox;
    ui: UI;
    element: HTMLElement | null;
    paramElements: NodeListOf<HTMLElement>;

    constructor(ui: UI, grooveBox: GrooveBox) {
        this.grooveBox = grooveBox;
        this.ui = ui;
        this.element = document.querySelector("#generatorparams")!;
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
    }

    update() {

    }
}