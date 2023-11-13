import GrooveBox from "../groovebox";
import Renderable from "../interfaces/renderable";
import Step from "../step";
import UI from "../ui";

export default class LCD implements Renderable {
    htmlCanvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D | null;
    grooveBox: GrooveBox;
    canvasWidth: number;
    canvasHeight: number;
    ui: UI;

    constructor(ui:UI, grooveBox: GrooveBox) {
        this.htmlCanvas = <HTMLCanvasElement>document.querySelector("#lcd")!;
        this.ctx = this.htmlCanvas.getContext("2d")!;
        this.grooveBox = grooveBox;
        this.ui = ui;
        this.canvasWidth = this.htmlCanvas.width;
        this.canvasHeight = this.htmlCanvas.height;
        // this.htmlCanvas.addEventListener("wheel", this.ui.onWheel.bind(this.ui));
    }

    update() {
        if (this.ctx !== null) {
            this.ctx.clearRect(0, 0, this.htmlCanvas.width, this.htmlCanvas.height);
            var stepHeight = this.canvasHeight / 128;
            if (this.grooveBox.modeIndex !== 0) {
                let clip = this.grooveBox.sequencer.clip!;
                this.htmlCanvas.style.backgroundColor = clip.color;
                var stepWidth = this.canvasWidth / clip.clipLength;
                clip.steps.forEach((step, index) => {
                    if (step !== undefined) {
                        if (index === this.grooveBox.sequencer.currentStep) {
                            this.ctx!.fillStyle = "rgba(255, 255, 255, 1)";
                        } else {
                            this.ctx!.fillStyle = "rgba(255, 255, 255, 0.5)";
                        }
                        this.renderStepPitches(step, index, stepWidth, stepHeight);
                    }
                })

            } else {
                let maxStep = this.grooveBox.pitchHistory.maxStep;
                let windowLength = this.grooveBox.pitchHistory.windowLength;
                var stepWidth = this.canvasWidth / windowLength;
                this.grooveBox.pitchHistory.stepsForCurrentWindow().rawSteps.forEach((step, index) => {
                    // console.log("step", step);
                    this.ctx!.fillStyle = "rgba(255, 255, 255, 1)";
                    this.renderStepPitches(step, index, stepWidth, stepHeight);
                })
            }  
        }
    }
    renderStepPitches(step: Step, index: number, stepWidth: number, stepHeight: number) {
        step.pitches.forEach((pitch) => {
            this.ctx!.fillRect(
                index * stepWidth, 
                step.pitches[0] * stepHeight, 
                stepWidth, 
                stepHeight
            );
        });
    }

}