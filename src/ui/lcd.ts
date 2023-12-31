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
            this.drawOctaves();
            var stepHeight = this.canvasHeight / 128;
            if (this.grooveBox.modeIndex === 1 || this.grooveBox.modeIndex === 2) {
                let clip = this.grooveBox.clipSequencer?.clip!;
                this.htmlCanvas.style.backgroundColor = clip.color;
                var stepWidth = this.canvasWidth / clip.clipLength;
                clip.steps.forEach((step, index) => {
                    if (step !== undefined && step !== null) {
                        if (index === this.grooveBox.clipSequencer?.currentStep) {
                            this.ctx!.fillStyle = "rgba(255, 255, 255, 1)";
                        } else {
                            this.ctx!.fillStyle = "rgba(255, 255, 255, 0.2)";
                        }
                        this.renderStepPitches(step, step.stepNumber, stepWidth, stepHeight);
                    }
                })

            } else if (this.grooveBox.modeIndex === 0){
                this.htmlCanvas.style.backgroundColor = "#000000";
                let maxStep = this.grooveBox.pitchHistory.maxStep;
                let windowLength = this.grooveBox.pitchHistory.windowLength;
                var stepWidth = this.canvasWidth / windowLength;
                this.grooveBox.pitchHistory.stepsForCurrentWindow().rawSteps.forEach((step, index) => {
                    // console.log("step", step);
                    this.ctx!.fillStyle = "rgba(255, 255, 255, 1)";
                    this.renderStepPitches(step, index, stepWidth, stepHeight);
                })
            } else if (this.grooveBox.modeIndex === 3){
                let clip = this.grooveBox.songSequencer?.clip!;
                if (clip !== undefined){
                    this.htmlCanvas.style.backgroundColor = clip.color;
                    var stepWidth = this.canvasWidth / clip.clipLength;
                    clip.steps.forEach((step, index) => {
                        if (step !== undefined && step !== null) {
                            if (index === this.grooveBox.currentSequencer()!.currentStep) {
                                this.ctx!.fillStyle = "rgba(255, 255, 255, 1)";
                            } else {
                                this.ctx!.fillStyle = "rgba(255, 255, 255, 0.2)";
                            }
                            this.renderStepPitches(step, step.stepNumber, stepWidth, stepHeight);
                        }
                    })
                }
            }
        }
    }

    drawOctaves() {
        for(let i = 0; i < 11; i++) {
            
            this.ctx!.fillStyle = "rgba(255, 255, 255, " + (0.5- ((i * 0.1) / 2 )) + ")";
            this.ctx!.fillRect(0, i * 12 * this.cellHeight(), this.canvasWidth, this.cellHeight() * 12);
        }
    }

    cellHeight() {
        return this.canvasHeight / 128;
    }

    renderStepPitches(step: Step, index: number, stepWidth: number, stepHeight: number) {
        step.pitches.forEach((pitch) => {
            if (pitch !== null) {
                this.ctx!.fillRect(
                    index * stepWidth, 
                    (128 - step.pitches[0]) * stepHeight, 
                    stepWidth, 
                    stepHeight
                );
            }
        });
    }

}