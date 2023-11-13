import GrooveBox from "../groovebox";
import Renderable from "../interfaces/renderable";
import UI from "../ui";

export default class TransportDisplay implements Renderable {
    grooveBox: GrooveBox;
    ui: UI;
    element: HTMLElement;
    constructor(ui:UI, grooveBox: GrooveBox) {
        this.ui = ui;
        this.grooveBox = grooveBox;
        console.log("TransportDisplay constructor");
        this.element = document.querySelector("#transportdisplay")!;
    }

    update(): void {
        this.element.innerHTML = this.grooveBox.transport.loop.step.toString();
    }
}