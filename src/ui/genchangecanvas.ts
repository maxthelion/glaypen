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
        this.htmlCanvas.addEventListener("wheel", this.onWheel.bind(this.ui));
        this.htmlCanvas.addEventListener("click", this.onHistoryClick.bind(this));
    }

    onWheel(e: WheelEvent) {

    }
    
    onHistoryClick(e: MouseEvent) {
        let x = e.offsetX;
        let stepWidth = this.canvasWidth / this.grooveBox.pitchHistory.maxStep;
        let stepNumber = Math.floor(x / stepWidth);
        this.grooveBox.setGenParamsFromIndex(stepNumber);
    }

    update(): void {
        let index = 0;
        for(let i = 0; i < this.grooveBox.genChanges.length; i++) {
            let genParamsIndex: number = this.grooveBox.genChanges[i][0];
            let genParams = this.grooveBox.getGenParamsByIndex(genParamsIndex);
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
            if (genParamsIndex == this.grooveBox.currentGenParamIndex) {
                this.ctx!.fillStyle = "rgba(255, 255, 255, 1)";
                this.ctx!.fillRect(stepNumber * stepWidth, 0, stepWidth * nextStepIndex, 2);
            }
        }

    }

}