var MouseHandler = /** @class */ (function () {
    function MouseHandler(ui, grooveBox) {
        var _this = this;
        this.dragging = false;
        this.initialX = 0;
        this.initialY = 0;
        this.intervalDragging = false;
        document.addEventListener("mouseup", function (e) {
            _this.clearMouseListeners();
        });
        document.addEventListener("mousemove", function (e) {
            _this.onMouseMove(e);
        });
    }
    MouseHandler.prototype.setDragging = function (e, onMove, onUp) {
        console.log("setDragging", e);
        this.dragging = true;
        this.initialX = e.clientX;
        this.initialY = e.clientY;
        // this.childMouseMove = onMove;
    };
    MouseHandler.prototype.addMouseListener = function (initialX, initialY) {
    };
    MouseHandler.prototype.startIntervalDrag = function (e, intervalNumber) {
        this.intervalDragging = true;
    };
    MouseHandler.prototype.clearMouseListeners = function () {
        //document.removeEventListener("mousemove", this.mouseMoveListener);
        //document.removeEventListener("mouseup", this.mouseUpListener);
        this.childMouseMove = undefined;
        this.dragging = false;
        this.intervalDragging = false;
    };
    MouseHandler.prototype.onMouseMove = function (event) {
        // if (this.dragging == true && this.childMouseMove !== undefined) {
        //     let x = event.clientX;
        //     let y = event.clientY;
        //     this.childMouseMove(this.initialX - x, this.initialY - y);
        //     return;
        // }
        // // console.log(x, y)
        // // this.grooveBox.setMousePosition(grooveBoxX, grooveBoxY);
        // return false;
    };
    return MouseHandler;
}());
export default MouseHandler;
