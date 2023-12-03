import GrooveBox from "./groovebox.js";
import UI from "./ui.js";
import RotaryControl from "./ui/rotarycontrol.js";

export default class MouseHandler {

    dragging: boolean = false;
    initialX: number = 0;
    initialY: number = 0;
    childMouseMove?: Function;
    intervalDragging: boolean = false;
    rotaryDragging: boolean = false;
    targetRotary?: RotaryControl;

    constructor(ui: UI, grooveBox: GrooveBox) {
        document.addEventListener("mouseup", (e) => {    
            this.clearMouseListeners();
        });

        document.addEventListener("mousemove", (e) => {
            this.onMouseMove(e);
        })
    }

    setDragging(e: MouseEvent, onMove: Function, onUp: Function){
        console.log("setDragging", e);
        this.dragging = true;
        this.initialX = e.clientX;
        this.initialY = e.clientY;
        // this.childMouseMove = onMove;
    }

    addMouseListener(initialX: number, initialY: number){
        
    }

    startIntervalDrag(e: MouseEvent, intervalNumber: string) {
        this.intervalDragging = true;
        
    }

    startRotaryDrag(e: MouseEvent, rotary: RotaryControl) {
        this.rotaryDragging = true;
        this.initialX = e.clientX;
        this.initialY = e.clientY;
        this.targetRotary = rotary;
    }

    clearMouseListeners(){
        this.childMouseMove = undefined;
        this.dragging = false;
        this.intervalDragging = false;
        this.rotaryDragging = false;
    }

    onMouseMove(event: MouseEvent) {
        if (this.rotaryDragging == true && this.targetRotary !== undefined) {
            let x = event.clientX;
            let y = event.clientY;
            this.targetRotary.onMouseMove(this.initialX - x, this.initialY - y);
            return;
        }
        // if (this.dragging == true && this.childMouseMove !== undefined) {
        //     let x = event.clientX;
        //     let y = event.clientY;
        //     this.childMouseMove(this.initialX - x, this.initialY - y);
        //     return;
        // }
        // // console.log(x, y)
        // // this.grooveBox.setMousePosition(grooveBoxX, grooveBoxY);
        return false;
    }

}