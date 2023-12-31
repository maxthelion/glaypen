import GrooveBox from "../groovebox";
import Renderable from "../interfaces/renderable";
import UI from "../ui";

export default class RotaryControl implements Renderable {

    element: HTMLElement;
    valueLabel: HTMLElement;
    labelElement: HTMLElement;
    cachedValue: number = -1;
    rotaryCanvas: HTMLCanvasElement;
    grooveBox: GrooveBox;
    ui: UI;
    lastReadTime: number = 0;
    valueScale: number = 128;
    paramName: string = "";


    constructor(ui: UI, grooveBox:GrooveBox) {
        this.grooveBox = grooveBox;
        this.ui = ui;
        this.element = document.createElement("div");
        this.element.classList.add("rotarycontrol");
        this.rotaryCanvas = document.createElement("canvas");
        this.element.appendChild(this.rotaryCanvas);
        this.valueLabel = document.createElement("div");
        this.valueLabel.classList.add("rotaryvaluelabel");
        this.element.appendChild(this.valueLabel);
        this.rotaryCanvas.width = 60;
        this.rotaryCanvas.height = 50;
        // this.renderCircle();

        this.labelElement = document.createElement("div");
        this.labelElement.textContent = "label";
        this.labelElement.classList.add("rotarynamelabel");
        this.element.appendChild(this.labelElement);
        this.renderWithValue(0.2);
        this.update();
        this.element.addEventListener("wheel", this.onWheel.bind(this));
        this.element.addEventListener("mousedown", (e) => {
            this.ui.mouseHandler.startRotaryDrag(e, this);
            e.preventDefault();
            return false;
        })
    }

    onMouseMove(x: number, y: number) {
        let maxy = 60;
        if (y > maxy) { 
            y = maxy;
        } else if (y < -maxy) {
            y = -maxy;
        }
        let value = ((y + 100) / 2) / maxy;
        this.setValue(value);
    }
    
    update(): void {
        if (this.cachedValue !== this.readValue()){
            console.log("update",this.labelElement.textContent, this.readValue())
            this.valueLabel.textContent = this.displayValue();
            this.renderWithValue(this.readValue());
            this.cachedValue = this.readValue();
        }
    }

    setLabel(label: string){
        this.labelElement.textContent = label;
    }

    onWheel(e: WheelEvent) {
        if ( Date.now() - this.lastReadTime  < 20){
            e.preventDefault();
            return false;
        }
        let speed = Math.ceil(Math.abs(e.deltaY) / (500 * this.getIncrement()));
        let increment = this.getIncrement();
        let newValue = this.readValue();
        if (e.deltaY > 0) {
            newValue += increment * speed; 
        } else {
            newValue -= increment * speed;
        }
        if (newValue > 1) { newValue = 1;}
        if (newValue < 0) { newValue = 0;}
        this.setValue(newValue);
        this.lastReadTime = Date.now();
        e.preventDefault();
        return false;
    }

    setValue(value: number) {
        let modifiedValue = Math.floor(value * this.getValueScale() );
        // console.log("setValue", value, modifiedValue)
        this.grooveBox.setGeneratorParam(this.paramName, modifiedValue);
    }

    readValue() { 
        let value = this.grooveBox.generatorManager.getNumberAttribute(this.paramName) /  this.getValueScale();
        // console.log("readValue", value)
        return  value;
    }
    displayValue() { 
        let value = this.grooveBox.generatorManager.getNumberAttribute(this.paramName);
        return (value != undefined) ? value.toString() : "0"; 
    }
    getIncrement() { 
        let increment = 1 / this.getValueScale();
        // console.log("getIncrement", this.getValueScale(), increment)
        return increment; 
    }

    getValueScale() {
        return this.valueScale;
    }

    renderCircle(){
        if(this.rotaryCanvas) {
            var ctx = this.rotaryCanvas.getContext("2d")!;
            ctx.beginPath();
            ctx.strokeStyle = "white";
            ctx.lineWidth = 5;
            ctx.fillStyle = "grey";
            var radius = 30;
            var holderWidth = this.element.clientWidth;
            var holderHeight = this.element.clientHeight;
            var left = (holderWidth/2);
            var top = (holderHeight/2);
            ctx.beginPath();
            ctx.arc(left, top, 30, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.closePath();
            ctx.fill();
        }
    }

    renderWithValue(value: number) {
        // console.log("renderWithValue", value)
        // this.textLabel.innerHTML = value.toString();
        if (value != undefined){
            let ctx = this.rotaryCanvas.getContext('2d')!;
            ctx.lineWidth = this.rotaryCanvas.height * 0.1;
            ctx.strokeStyle = "black";
            let min = 0+0.25;
            let max = 2-0.25;
            let range = max - min;
            min = (min + 0.5);
            max = (max + 0.5);
            let displayedValue = min + (value * range);
            let x = this.rotaryCanvas.width    * .5;
            let y = this.rotaryCanvas.height   * .6;
            // console.log("displayedValue", value, displayedValue, min,max)
            ctx.clearRect(0, 0, this.rotaryCanvas.width, this.rotaryCanvas.height);
            ctx.beginPath();
            let radius = this.rotaryCanvas.width * .4
            ctx.arc(x, y, radius, min * Math.PI, max * Math.PI);
            ctx.stroke();
            ctx.strokeStyle = "yellow";
            ctx.beginPath();
            ctx.arc(x, y, radius, min * Math.PI, displayedValue * Math.PI);
            ctx.stroke();
        }
        
    }
}