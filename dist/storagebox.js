var StorageBox = /** @class */ (function () {
    function StorageBox() {
        this.defaultGeneratorParams = {
            tonic: 48,
            scaleIndex: 4,
            stepsInBar: 16,
            stepProbability: 0.8,
            pitchRange: 4,
            octaveRange: 2,
            octaveProbability: 0.1
        };
        this.storage = window.localStorage;
    }
    StorageBox.prototype.getOutputId = function () {
        return this.storage.getItem("outputPortId") || "";
    };
    StorageBox.prototype.setOutputId = function (outputId) {
        this.storage.setItem("outputPortId", outputId);
    };
    StorageBox.prototype.setGeneratorParams = function (generatorParams) {
        this.storage.setItem("generatorParams", JSON.stringify(generatorParams));
    };
    StorageBox.prototype.getGeneratorParams = function () {
        if (this.storage.getItem("generatorParams") != null && this.storage.getItem("generatorParams") != undefined) {
            return JSON.parse(this.storage.getItem("generatorParams"));
        }
        else {
            return this.defaultGeneratorParams;
        }
    };
    StorageBox.prototype.setClipAtIndex = function (clipRawData, index) {
        console.log("set clip ".concat(index));
        this.storage.setItem("clip".concat(index), JSON.stringify(clipRawData));
    };
    StorageBox.prototype.getClipAtIndex = function (index) {
        var clipJSON = this.storage.getItem("clip".concat(index));
        if (clipJSON != null) {
            return JSON.parse(clipJSON);
        }
        else {
            return undefined;
        }
    };
    StorageBox.prototype.getAllClips = function () {
        var _this = this;
        return Array(16).fill(0).map(function (_, index) { return _this.getClipAtIndex(index); });
    };
    return StorageBox;
}());
export default StorageBox;
