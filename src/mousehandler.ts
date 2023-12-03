import GrooveBox from "./groovebox.js";
import UI from "./ui.js";

export default class MouseHandler {

    dragging: boolean = false;
    initialX: number = 0;
    initialY: number = 0;
    childMouseMove?: Function;
    intervalDragging: boolean = false;

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

    clearMouseListeners(){
        //document.removeEventListener("mousemove", this.mouseMoveListener);
        //document.removeEventListener("mouseup", this.mouseUpListener);
        this.childMouseMove = undefined;
        this.dragging = false;
        this.intervalDragging = false;
    }

    onMouseMove(event: MouseEvent) {
        
        // if (this.dragging == true && this.childMouseMove !== undefined) {
        //     let x = event.clientX;
        //     let y = event.clientY;
        //     this.childMouseMove(this.initialX - x, this.initialY - y);
        //     return;
        // }
        // // console.log(x, y)
        // // this.grooveBox.setMousePosition(grooveBoxX, grooveBoxY);
        // return false;
    }

}