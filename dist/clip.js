var Clip = /** @class */ (function () {
    function Clip(groooveBox, clipData) {
        this.steps = [];
        this.color = "#000000";
        this.clipData = clipData;
        this.steps = new Array(16);
        for (var i = 0; i < clipData.length; i++) {
            this.steps[clipData[i][0]] = clipData[i];
        }
    }
    Clip.prototype.clipRawData = function () {
        return {
            clipData: this.clipData,
            color: this.color
        };
    };
    Clip.prototype.shiftLeft = function () {
        this.steps.push(this.steps.shift());
    };
    Clip.prototype.shiftRight = function () {
        this.steps.unshift(this.steps.pop());
    };
    return Clip;
}());
export default Clip;
