import GrooveBox from "../groovebox";
import Renderable from "../interfaces/renderable";
import UI from "../ui";

export default class GenChangeCanvas implements Renderable {
    htmlCanvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D | null;
    grooveBox: GrooveBox;
    canvasWidth: number;
    canvasHeight: number;
    ui: UI;

    constructor(ui:UI, grooveBox: GrooveBox) {
        this.htmlCanvas = <HTMLCanvasElement>document.querySelector("#genchangecanvas");
        this.ctx = this.htmlCanvas.getContext("2d");
        this.grooveBox = grooveBox;
        this.ui = ui;
        this.canvasWidth = this.htmlCanvas.width;
        this.canvasHeight = this.htmlCanvas.height;
    }

    update(): void {
        let index = 0;
        for(let i = 0; i < this.grooveBox.genChanges.length; i++) {
            let genParams = this.grooveBox.genChanges[i][0];
            let stepNumber = this.grooveBox.genChanges[i][1];
            this.ctx!.fillStyle = genParams.color;
            let stepWidth = this.canvasWidth / this.grooveBox.pitchHistory.maxStep;
            let nextItem = this.grooveBox.genChanges[i + 1];
            let nextStepIndex;
            if (nextItem === undefined){
                nextStepIndex = this.grooveBox.pitchHistory.maxStep;
            } else {
                nextStepIndex = nextItem[1];
            }
            this.ctx!.fillRect(stepNumber * stepWidth, 0, stepWidth * nextStepIndex, this.canvasHeight);
            
        }

    }

}