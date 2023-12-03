import GrooveBox from "../groovebox";
import Renderable from "../interfaces/renderable";
import UI from "../ui";

export default class PianoNoteView implements Renderable {

    ctx: CanvasRenderingContext2D | null;
    canvas: HTMLCanvasElement;
    renderables: Renderable[];
    element: HTMLElement;
    grooveBox: GrooveBox;
    ui: UI;


    constructor(ui: UI, grooveBox: GrooveBox) {
        this.grooveBox = grooveBox;
        this.ui = ui;
        this.renderables = [];
        this.element = document.createElement('div');
        this.element.className = "pianoNoteView";
        this.element.innerHTML = "";
        this.canvas = document.createElement('canvas');
        this.canvas.width = 350;
        this.canvas.height = 30;
        this.ctx = this.canvas.getContext('2d');
        this.element.appendChild(this.canvas);
    }

    currentPitchGenerator(){
        return this.grooveBox.currentSequencer()!.pitchGenerator;
    }

    update() {
        let inputPitches = this.currentPitchGenerator().availablePitches();
        if (this.ctx !== null && 
            inputPitches !== undefined && 
            inputPitches.length > 0){
            
            let highlightColor = "yellow"
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            let blacknotes = [1,3,6,8,10];
            let whitenotes = [0,2,4,5,7,9,11];
            let inputPitchIntervals = inputPitches.map((pitch:number) => { return pitch % 12 });
            let width = this.canvas.width / 8;
            this.ctx.strokeStyle = "black";
            this.ctx.lineWidth = 2;
            for(let i = 0; i < 12; i++){
                this.ctx.fillStyle = "#999";
                if (inputPitchIntervals.includes(whitenotes[i % 7])){
                    this.ctx.fillStyle = "yellow";
                }
                this.ctx.fillRect((i* width) + 1, 0, width, 100);
                this.ctx.strokeRect((i* width) + 1, 0, width, 100);
            }
    
            let blackKeyWidth = width * 0.6;
            let blackIndex = 0;
            for(let i = 0; i < 12; i++){
                if(i % 7 != 2 && i % 7 != 6){
                    let pitch = i;
                    var x = (i + 1) * width - (blackKeyWidth/2);
                    // Draw the black key at the x-coordinate
                    this.ctx.fillStyle = "black";
                    if (inputPitchIntervals.includes(blacknotes[blackIndex])){
                        this.ctx.fillStyle = "yellow";
                    }
                    this.ctx.fillRect(x, 0, blackKeyWidth, this.canvas.height/2);

                    this.ctx.strokeRect(x, 0, blackKeyWidth, this.canvas.height/2);
                    blackIndex++;
                }
                
            }
            for(let i = 0; i < inputPitchIntervals.length; i++){
                let note = inputPitchIntervals[i];
                this.ctx.fillStyle = "yellow";
            }
        }
        
    }
}