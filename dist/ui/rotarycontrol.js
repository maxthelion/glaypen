var RotaryControl = /** @class */ (function () {
    function RotaryControl(ui, grooveBox) {
        this.cachedValue = -1;
        this.lastReadTime = 0;
        this.valueScale = 128;
        this.paramName = "";
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
        this.rotaryCanvas.height = 60;
        // this.renderCircle();
        this.labelElement = document.createElement("div");
        this.labelElement.textContent = "label";
        this.labelElement.classList.add("rotarynamelabel");
        this.element.appendChild(this.labelElement);
        this.renderWithValue(0.2);
        this.update();
        this.element.addEventListener("wheel", this.onWheel.bind(this));
    }
    RotaryControl.prototype.update = function () {
        if (this.cachedValue !== this.readValue()) {
            console.log("update", this.labelElement.textContent, this.readValue());
            this.valueLabel.textContent = this.displayValue();
            this.renderWithValue(this.readValue());
            this.cachedValue = this.readValue();
        }
    };
    RotaryControl.prototype.setLabel = function (label) {
        this.labelElement.textContent = label;
    };
    RotaryControl.prototype.onWheel = function (e) {
        if (Date.now() - this.lastReadTime < 20) {
            e.preventDefault();
            return false;
        }
        var speed = Math.ceil(Math.abs(e.deltaY) / (500 * this.getIncrement()));
        var increment = this.getIncrement();
        var newValue = this.readValue();
        if (e.deltaY > 0) {
            newValue += increment * speed;
        }
        else {
            newValue -= increment * speed;
        }
        if (newValue > 1) {
            newValue = 1;
        }
        if (newValue < 0) {
            newValue = 0;
        }
        this.setValue(newValue);
        this.lastReadTime = Date.now();
        e.preventDefault();
        return false;
    };
    RotaryControl.prototype.setValue = function (value) {
        var modifiedValue = Math.floor(value * this.getValueScale());
        // console.log("setValue", value, modifiedValue)
        this.grooveBox.setGeneratorParam(this.paramName, modifiedValue);
    };
    RotaryControl.prototype.readValue = function () {
        var value = this.grooveBox.generatorManager.getNumberAttribute(this.paramName) / this.getValueScale();
        // console.log("readValue", value)
        return value;
    };
    RotaryControl.prototype.displayValue = function () {
        var value = this.grooveBox.generatorManager.getNumberAttribute(this.paramName);
        return (value != undefined) ? value.toString() : "0";
    };
    RotaryControl.prototype.getIncrement = function () {
        var increment = 1 / this.getValueScale();
        // console.log("getIncrement", this.getValueScale(), increment)
        return increment;
    };
    RotaryControl.prototype.getValueScale = function () {
        return this.valueScale;
    };
    RotaryControl.prototype.renderCircle = function () {
        if (this.rotaryCanvas) {
            var ctx = this.rotaryCanvas.getContext("2d");
            ctx.beginPath();
            ctx.strokeStyle = "white";
            ctx.lineWidth = 5;
            ctx.fillStyle = "grey";
            var radius = 30;
            var holderWidth = this.element.clientWidth;
            var holderHeight = this.element.clientHeight;
            var left = (holderWidth / 2);
            var top = (holderHeight / 2);
            ctx.beginPath();
            ctx.arc(left, top, 30, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.closePath();
            ctx.fill();
        }
    };
    RotaryControl.prototype.renderWithValue = function (value) {
        // console.log("renderWithValue", value)
        // this.textLabel.innerHTML = value.toString();
        if (value != undefined) {
            var ctx = this.rotaryCanvas.getContext('2d');
            ctx.lineWidth = this.rotaryCanvas.height * 0.1;
            ctx.strokeStyle = "black";
            var min = 0 + 0.25;
            var max = 2 - 0.25;
            var range = max - min;
            min = (min + 0.5);
            max = (max + 0.5);
            var displayedValue = min + (value * range);
            var x = this.rotaryCanvas.width * .5;
            var y = this.rotaryCanvas.height * .5;
            // console.log("displayedValue", value, displayedValue, min,max)
            ctx.clearRect(0, 0, this.rotaryCanvas.width, this.rotaryCanvas.height);
            ctx.beginPath();
            var radius = this.rotaryCanvas.width * .4;
            ctx.arc(x, y, radius, min * Math.PI, max * Math.PI);
            ctx.stroke();
            ctx.strokeStyle = "yellow";
            ctx.beginPath();
            ctx.arc(x, y, radius, min * Math.PI, displayedValue * Math.PI);
            ctx.stroke();
        }
    };
    return RotaryControl;
}());
export default RotaryControl;
