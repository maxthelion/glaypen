var Clip = /** @class */ (function () {
    function Clip(groooveBox, clipData) {
        this.steps = [];
        this.steps = new Array(16);
        for (var i = 0; i < clipData.length; i++) {
            this.steps[clipData[i][0]] = clipData[i];
        }
    }
    return Clip;
}());
export default Clip;
