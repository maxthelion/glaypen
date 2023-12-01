import GrooveBox from "../groovebox";
import Renderable from "../interfaces/renderable";
import UI from "../ui";

export default class IntervalProbabilityControl implements Renderable{
    element: HTMLElement;
    grooveBox: GrooveBox;   
    ui: UI;
    probabilityControl: HTMLElement;
    amountBar: HTMLElement;
    probability: number = 1;
    dragging: boolean = false;

    constructor(ui: UI, grooveBox: GrooveBox, index: number) {
        this.grooveBox = grooveBox;
        this.ui = ui;
        this.element  = document.createElement("div");
        this.element.classList.add("intervalholder");
        let button = document.createElement("a");
        button.href = "#";
        button.classList.add("chordbutton");
        button.classList.add("intervalbutton");
        button.textContent = (index + 1).toString();

        this.probabilityControl = document.createElement("div");
        this.probabilityControl.classList.add("intervalprobabilitycontrol");
        this.probabilityControl.dataset.intervalNumber = index.toString();
        this.amountBar = document.createElement("div");
        this.amountBar.classList.add("intervalamountbar");
        this.probabilityControl.appendChild(this.amountBar);

        this.element.appendChild(this.probabilityControl);
        this.element.appendChild(button);
        this.probabilityControl.addEventListener("click", (e) => {
            let element = e.target as HTMLElement;
            let intervalNumber = element.dataset.intervalNumber!;
            let y = e.offsetY;
            let height = element.clientHeight;
            let probability = 1 - (y / height);
            console.log("intervalNumber", intervalNumber, y, probability);
            this.probability = probability;
        })
        this.probabilityControl.style.cursor = "pointer";
        this.probabilityControl.addEventListener("mousedown", (e) => {
            let element = e.target as HTMLElement;
            let intervalNumber = element.dataset.intervalNumber!;
            this.ui.mouseHandler.setDragging(e, ((x:number, y:number) => {
                console.log("dragging",this, intervalNumber, x, y);
                if (y < 0){
                    y = 0;
                } else if (y > 50){
                    y = 50;
                }
                let probability = (y / 50);
                this.probability = probability;
            }).bind(this), () => {});
            e.preventDefault();
            return false;
        })
        this.probabilityControl.addEventListener("mouseup", (e) => {
            this.dragging = false;
        })
        this.probabilityControl.addEventListener("mousemove", (e) => {
            if (this.dragging){
                let element = e.target as HTMLElement;
                let intervalNumber = element.dataset.intervalNumber!;
                let y = e.offsetY;
                let height = element.clientHeight;
                let probability = 1 - (y / height);
                console.log("intervalNumber", intervalNumber, y, probability);
                //this.probability = probability;
            }
        })
    }

    update(): void {
        let button = this.probabilityControl;
        let intervals  = this.grooveBox.currentSequencer()?.pitchGenerator.availableIntervals()
        // if (this.probability < 1){
            this.amountBar.style.height = (100 - (this.probability * 100)).toString() + "%";
        // }

        if (intervals.includes(parseInt(button.dataset.intervalNumber))){
            this.probabilityControl.classList.add("active");
        } else {
            this.probabilityControl.classList.remove("active");
        }
    }
}