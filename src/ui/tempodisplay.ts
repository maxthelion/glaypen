import GrooveBox from "../groovebox";
import Renderable from "../interfaces/renderable";
import UI from "../ui";

export default class TempoDisplay implements Renderable {
    grooveBox: GrooveBox;
    ui: UI;
    element: HTMLElement;
    lastTempo: number = -1;
    tempoLCD: HTMLElement;

    constructor(ui:UI, grooveBox: GrooveBox) {
        this.ui = ui;
        this.grooveBox = grooveBox;
        this.element = document.querySelector("#tempocontrols")!;
        this.element.innerHTML = "";
        this.tempoLCD = document.createElement("div");
        this.tempoLCD.classList.add("tempolcd");
        this.element.appendChild(this.tempoLCD);
        
        let tempoButtons = document.createElement("div");
        tempoButtons.classList.add("tempobuttons");
        let upButton = document.createElement("a");
        upButton.href = "#";
        upButton.textContent = "+";
        tempoButtons.appendChild(upButton);

        upButton.addEventListener("click", (e) => {
            this.grooveBox.transport.increaseTempo();
        })
        let downButton = document.createElement("a");
        downButton.href = "#";
        downButton.textContent = "-";
        tempoButtons.appendChild(downButton);
        downButton.addEventListener("click", (e) => {
            this.grooveBox.transport.decreaseTempo();
        })
        this.element.appendChild(tempoButtons);
    }

    update(): void {
        if(this.grooveBox.transport.loop.step !== this.lastTempo){
            let displayOutput = this.grooveBox.transport.tempo.toString();
            this.tempoLCD.innerHTML = displayOutput;
            this.lastTempo = this.grooveBox.transport.tempo;
        }


    }
}