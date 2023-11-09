import GrooveBox from "../groovebox";
import UI from "../ui";

export default class GeneratorParamsPanel {
    grooveBox: GrooveBox;
    ui: UI;
    element: HTMLElement | null;

    constructor(ui: UI, grooveBox: GrooveBox) {
        this.grooveBox = grooveBox;
        this.ui = ui;
        this.element = document.querySelector("#generatorparams")!;
        
    }

    update() {
        
    }
}