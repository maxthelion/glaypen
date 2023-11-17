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
        let displayOutput = "";
        displayOutput += Math.floor(this.grooveBox.transport.loop.step / 16);
        displayOutput += ":";
        let stepOutput = ("0" + this.grooveBox.transport.loop.step % 16).slice(-2);
        displayOutput += stepOutput;

        this.element.innerHTML = displayOutput;
    }
}