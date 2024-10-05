var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Utils;
(function (Utils) {
    var AssetLoader = (function () {
        function AssetLoader(_lang, _aFileData, _ctx, _canvasWidth, _canvasHeight, _showBar) {
            if (_showBar === void 0) { _showBar = true; }
            this.oAssetData = {};
            this.assetsLoaded = 0;
            this.textData = {};
            this.scale = 1;
            this.frameInc = 0;
            this.fps = 15;
            this.curFrame = 0;
            this.totalAssets = _aFileData.length;
            this.showBar = _showBar;
            for (var i = 0; i < _aFileData.length; i++) {
                if (_aFileData[i].file.indexOf(".json") != -1) {
                    this.loadJSON(_aFileData[i]);
                }
                else {
                    this.loadImage(_aFileData[i]);
                }
            }
            if (_showBar) {
                this.oLoaderImgData = preAssetLib.getData("loader");
            }
        }
        AssetLoader.prototype.render = function () {
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            var tempScale = Math.min(Math.min(canvas.width / 900, 1), canvas.height / 800);
            var bX = this.oLoaderImgData.oData.oAtlasData[oImageIds.logo].x;
            var bY = this.oLoaderImgData.oData.oAtlasData[oImageIds.logo].y;
            var bWidth = this.oLoaderImgData.oData.oAtlasData[oImageIds.logo].width;
            var bHeight = this.oLoaderImgData.oData.oAtlasData[oImageIds.logo].height;
            ctx.drawImage(this.oLoaderImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - (bWidth / 2) * tempScale, canvas.height / 2 - 70 - (bHeight / 2) * tempScale, bWidth * tempScale, bHeight * tempScale);
            var bX = this.oLoaderImgData.oData.oAtlasData[oImageIds.underBar].x;
            var bY = this.oLoaderImgData.oData.oAtlasData[oImageIds.underBar].y;
            var bWidth = this.oLoaderImgData.oData.oAtlasData[oImageIds.underBar].width;
            var bHeight = this.oLoaderImgData.oData.oAtlasData[oImageIds.underBar].height;
            ctx.drawImage(this.oLoaderImgData.img, bX, bY, Math.max((bWidth / this.totalAssets) * this.assetsLoaded, 1), bHeight, canvas.width / 2 - (bWidth / 2) * tempScale, canvas.height / 2 + 140 - (bHeight / 2) * tempScale, Math.max((bWidth / this.totalAssets) * this.assetsLoaded, 1) * tempScale, bHeight * tempScale);
            var bX = this.oLoaderImgData.oData.oAtlasData[oImageIds.overBar].x;
            var bY = this.oLoaderImgData.oData.oAtlasData[oImageIds.overBar].y;
            var bWidth = this.oLoaderImgData.oData.oAtlasData[oImageIds.overBar].width;
            var bHeight = this.oLoaderImgData.oData.oAtlasData[oImageIds.overBar].height;
            ctx.drawImage(this.oLoaderImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - (bWidth / 2) * tempScale, canvas.height / 2 + 140 - (bHeight / 2) * tempScale, bWidth * tempScale, bHeight * tempScale);
        };
        AssetLoader.prototype.displayNumbers = function () {
            ctx.textAlign = "left";
            ctx.font = "bold 40px arial";
            ctx.fillStyle = "#ffffff";
            ctx.fillText(Math.round((this.assetsLoaded / this.totalAssets) * 100) + "%", canvas.width / 2 + 0, canvas.height / 2 + 51);
        };
        AssetLoader.prototype.loadExtraAssets = function (_callback, _aFileData) {
            this.showBar = false;
            this.totalAssets = _aFileData.length;
            this.assetsLoaded = 0;
            this.loadedCallback = _callback;
            for (var i = 0; i < _aFileData.length; i++) {
                if (_aFileData[i].file.indexOf(".json") != -1) {
                    this.loadJSON(_aFileData[i]);
                }
                else {
                    this.loadImage(_aFileData[i]);
                }
            }
        };
        AssetLoader.prototype.loadJSON = function (_oData) {
            var _this = this;
            var xobj = new XMLHttpRequest();
            xobj.open('GET', _oData.file, true);
            xobj.onreadystatechange = function () {
                if (xobj.readyState == 4 && xobj.status == 200) {
                    _this.textData[_oData.id] = JSON.parse(xobj.responseText);
                    ++_this.assetsLoaded;
                    _this.checkLoadComplete();
                }
            };
            xobj.send(null);
        };
        AssetLoader.prototype.loadImage = function (_oData) {
            var _this = this;
            var img = new Image();
            img.onload = function () {
                _this.oAssetData[_oData.id] = {};
                _this.oAssetData[_oData.id].img = img;
                _this.oAssetData[_oData.id].oData = {};
                var aSpriteSize = _this.getSpriteSize(_oData.file);
                if (aSpriteSize[0] != 0) {
                    _this.oAssetData[_oData.id].oData.spriteWidth = aSpriteSize[0];
                    _this.oAssetData[_oData.id].oData.spriteHeight = aSpriteSize[1];
                }
                else {
                    _this.oAssetData[_oData.id].oData.spriteWidth = _this.oAssetData[_oData.id].img.width;
                    _this.oAssetData[_oData.id].oData.spriteHeight = _this.oAssetData[_oData.id].img.height;
                }
                if (_oData.oAnims) {
                    _this.oAssetData[_oData.id].oData.oAnims = _oData.oAnims;
                }
                if (_oData.oAtlasData) {
                    _this.oAssetData[_oData.id].oData.oAtlasData = _oData.oAtlasData;
                }
                else {
                    _this.oAssetData[_oData.id].oData.oAtlasData = { none: { x: 0, y: 0, width: _this.oAssetData[_oData.id].oData.spriteWidth, height: _this.oAssetData[_oData.id].oData.spriteHeight } };
                }
                ++_this.assetsLoaded;
                _this.checkLoadComplete();
            };
            img.src = _oData.file;
        };
        AssetLoader.prototype.getSpriteSize = function (_file) {
            var aNew = new Array();
            var sizeY = "";
            var sizeX = "";
            var stage = 0;
            var inc = _file.lastIndexOf(".");
            var canCont = true;
            while (canCont) {
                inc--;
                if (stage == 0 && this.isNumber(_file.charAt(inc))) {
                    sizeY = _file.charAt(inc) + sizeY;
                }
                else if (stage == 0 && sizeY.length > 0 && _file.charAt(inc) == "x") {
                    inc--;
                    stage = 1;
                    sizeX = _file.charAt(inc) + sizeX;
                }
                else if (stage == 1 && this.isNumber(_file.charAt(inc))) {
                    sizeX = _file.charAt(inc) + sizeX;
                }
                else if (stage == 1 && sizeX.length > 0 && _file.charAt(inc) == "_") {
                    canCont = false;
                    aNew = [parseInt(sizeX), parseInt(sizeY)];
                }
                else {
                    canCont = false;
                    aNew = [0, 0];
                }
            }
            return aNew;
        };
        AssetLoader.prototype.isNumber = function (n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        };
        AssetLoader.prototype.checkLoadComplete = function () {
            if (this.assetsLoaded == this.totalAssets) {
                this.loadedCallback();
            }
        };
        AssetLoader.prototype.onReady = function (_func) {
            this.loadedCallback = _func;
        };
        AssetLoader.prototype.getImg = function (_id) {
            return this.oAssetData[_id].img;
        };
        AssetLoader.prototype.getData = function (_id) {
            return this.oAssetData[_id];
        };
        return AssetLoader;
    }());
    Utils.AssetLoader = AssetLoader;
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var AnimSprite = (function () {
        function AnimSprite(_oImgData, _fps, _radius, _animId) {
            this.x = 0;
            this.y = 0;
            this.rotation = 0;
            this.radius = 10;
            this.removeMe = false;
            this.frameInc = 0;
            this.animType = "loop";
            this.offsetX = 0;
            this.offsetY = 0;
            this.scaleX = 1;
            this.scaleY = 1;
            this.alpha = 1;
            this.oImgData = _oImgData;
            this.oAnims = this.oImgData.oData.oAnims;
            this.fps = _fps;
            this.radius = _radius;
            this.animId = _animId;
            this.centreX = Math.round(this.oImgData.oData.spriteWidth / 2);
            this.centreY = Math.round(this.oImgData.oData.spriteHeight / 2);
        }
        AnimSprite.prototype.updateAnimation = function (_delta) {
            this.frameInc += this.fps * _delta;
        };
        AnimSprite.prototype.changeImgData = function (_newImgData, _animId) {
            this.oImgData = _newImgData;
            this.oAnims = this.oImgData.oData.oAnims;
            this.animId = _animId;
            this.centreX = Math.round(this.oImgData.oData.spriteWidth / 2);
            this.centreY = Math.round(this.oImgData.oData.spriteHeight / 2);
            this.resetAnim();
        };
        AnimSprite.prototype.resetAnim = function () {
            this.frameInc = 0;
        };
        AnimSprite.prototype.setFrame = function (_frameNum) {
            this.fixedFrame = _frameNum;
        };
        AnimSprite.prototype.setAnimType = function (_type, _animId, _reset) {
            if (_reset === void 0) { _reset = true; }
            this.animId = _animId;
            this.animType = _type;
            if (_reset) {
                this.resetAnim();
            }
            switch (_type) {
                case "loop":
                    break;
                case "once":
                    this.maxIdx = this.oAnims[this.animId].length - 1;
                    break;
            }
        };
        AnimSprite.prototype.render = function (_ctx) {
            _ctx.save();
            _ctx.translate(this.x, this.y);
            _ctx.rotate(this.rotation);
            _ctx.scale(this.scaleX, this.scaleY);
            _ctx.globalAlpha = this.alpha;
            if (this.animId != null) {
                var max = this.oAnims[this.animId].length;
                var idx = Math.floor(this.frameInc);
                this.curFrame = this.oAnims[this.animId][idx % max];
                var imgX = (this.curFrame * this.oImgData.oData.spriteWidth) % this.oImgData.img.width;
                var imgY = Math.floor(this.curFrame / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
                if (this.animType == "once") {
                    if (idx > this.maxIdx) {
                        this.fixedFrame = this.oAnims[this.animId][max - 1];
                        this.animId = null;
                        if (this.animEndedFunc != null) {
                            this.animEndedFunc();
                        }
                        var imgX = (this.fixedFrame * this.oImgData.oData.spriteWidth) % this.oImgData.img.width;
                        var imgY = Math.floor(this.fixedFrame / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
                    }
                }
            }
            else {
                var imgX = (this.fixedFrame * this.oImgData.oData.spriteWidth) % this.oImgData.img.width;
                var imgY = Math.floor(this.fixedFrame / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
            }
            _ctx.drawImage(this.oImgData.img, imgX, imgY, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight, -this.centreX + this.offsetX, -this.centreY + this.offsetY, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight);
            _ctx.restore();
        };
        AnimSprite.prototype.renderSimple = function (_ctx) {
            if (this.animId != null) {
                var max = this.oAnims[this.animId].length;
                var idx = Math.floor(this.frameInc);
                this.curFrame = this.oAnims[this.animId][idx % max];
                var imgX = (this.curFrame * this.oImgData.oData.spriteWidth) % this.oImgData.img.width;
                var imgY = Math.floor(this.curFrame / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
                if (this.animType == "once") {
                    if (idx > this.maxIdx) {
                        this.fixedFrame = this.oAnims[this.animId][max - 1];
                        this.animId = null;
                        if (this.animEndedFunc != null) {
                            this.animEndedFunc();
                        }
                        var imgX = (this.fixedFrame * this.oImgData.oData.spriteWidth) % this.oImgData.img.width;
                        var imgY = Math.floor(this.fixedFrame / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
                    }
                }
            }
            else {
                var imgX = (this.fixedFrame * this.oImgData.oData.spriteWidth) % this.oImgData.img.width;
                var imgY = Math.floor(this.fixedFrame / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
            }
            _ctx.drawImage(this.oImgData.img, imgX, imgY, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight, this.x - (this.centreX - this.offsetX) * this.scaleX, this.y - (this.centreY - this.offsetY) * this.scaleY, this.oImgData.oData.spriteWidth * this.scaleX, this.oImgData.oData.spriteHeight * this.scaleY);
        };
        return AnimSprite;
    }());
    Utils.AnimSprite = AnimSprite;
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var BasicSprite = (function () {
        function BasicSprite(_oImgData, _radius, _frame) {
            if (_frame === void 0) { _frame = 0; }
            this.x = 0;
            this.y = 0;
            this.rotation = 0;
            this.radius = 10;
            this.removeMe = false;
            this.offsetX = 0;
            this.offsetY = 0;
            this.scaleX = 1;
            this.scaleY = 1;
            this.oImgData = _oImgData;
            this.radius = _radius;
            this.setFrame(_frame);
        }
        BasicSprite.prototype.setFrame = function (_frameNum) {
            this.frameNum = _frameNum;
        };
        BasicSprite.prototype.render = function (_ctx) {
            _ctx.save();
            _ctx.translate(this.x, this.y);
            _ctx.rotate(this.rotation);
            _ctx.scale(this.scaleX, this.scaleY);
            var imgX = (this.frameNum * this.oImgData.oData.spriteWidth) % this.oImgData.img.width;
            var imgY = Math.floor(this.frameNum / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
            _ctx.drawImage(this.oImgData.img, imgX, imgY, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight, -this.oImgData.oData.spriteWidth / 2 + this.offsetX, -this.oImgData.oData.spriteHeight / 2 + this.offsetY, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight);
            _ctx.restore();
        };
        return BasicSprite;
    }());
    Utils.BasicSprite = BasicSprite;
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var UserInput = (function () {
        function UserInput(_canvas, _isBugBrowser) {
            var _this = this;
            this.prevHitTime = 0;
            this.pauseIsOn = false;
            this.isDown = false;
            this.allowClick = false;
            this.isBugBrowser = _isBugBrowser;
            this.keyDownEvtFunc = function (e) {
                _this.keyDown(e);
            };
            this.keyUpEvtFunc = function (e) {
                _this.keyUp(e);
            };
            _canvas.addEventListener('contextmenu', function (event) { return event.preventDefault(); });
            _canvas.addEventListener("click", function (event) {
                if (_this.allowClick) {
                    butEventHandler("copyLinkFromGameEnd1", null);
                    _this.allowClick = false;
                }
            });
            _canvas.addEventListener("touchstart", function (e) {
                for (var i = 0; i < e.changedTouches.length; i++) {
                    _this.hitDown(e, e.changedTouches[i].pageX, e.changedTouches[i].pageY, e.changedTouches[i].identifier);
                }
            }, false);
            _canvas.addEventListener("touchend", function (e) {
                if (!_this.allowClick) {
                    for (var i = 0; i < e.changedTouches.length; i++) {
                        _this.hitUp(e, e.changedTouches[i].pageX, e.changedTouches[i].pageY, e.changedTouches[i].identifier);
                    }
                }
            }, false);
            _canvas.addEventListener("touchcancel", function (e) {
                if (!_this.allowClick) {
                    for (var i = 0; i < e.changedTouches.length; i++) {
                        _this.hitCancel(e, e.changedTouches[i].pageX, e.changedTouches[i].pageY, e.changedTouches[i].identifier);
                    }
                }
            }, false);
            _canvas.addEventListener("touchmove", function (e) {
                if (!_this.allowClick) {
                    for (var i = 0; i < e.changedTouches.length; i++) {
                        _this.move(e, e.changedTouches[i].pageX, e.changedTouches[i].pageY, e.changedTouches[i].identifier, true);
                    }
                }
            }, false);
            _canvas.addEventListener("mousedown", function (e) {
                _this.isDown = true;
                _this.hitDown(e, e.pageX, e.pageY, 1);
            }, false);
            _canvas.addEventListener("mouseup", function (e) {
                _this.isDown = false;
                _this.hitUp(e, e.pageX, e.pageY, 1);
            }, false);
            _canvas.addEventListener("mousemove", function (e) {
                _this.move(e, e.pageX, e.pageY, 1, _this.isDown);
            }, false);
            _canvas.addEventListener("mouseout", function (e) {
                if (e.button == 2) {
                    return;
                }
                clearButtonOvers();
                _this.isDown = false;
                _this.hitCancel(e, Math.abs(e.pageX), Math.abs(e.pageY), 1);
            }, false);
            this.aHitAreas = new Array();
            this.aKeys = new Array();
        }
        UserInput.prototype.hitDown = function (e, _posX, _posY, _identifer) {
            if (!hasFocus) {
                visibleResume();
            }
            if (this.pauseIsOn) {
                return;
            }
            var curHitTime = new Date().getTime();
            _posX *= canvasScale;
            _posY *= canvasScale;
            for (var i = 0; i < this.aHitAreas.length; i++) {
                if (this.aHitAreas[i].rect) {
                    var aX = canvas.width * this.aHitAreas[i].align[0];
                    var aY = canvas.height * this.aHitAreas[i].align[1];
                    if (_posX > aX + this.aHitAreas[i].area[0] && _posY > aY + this.aHitAreas[i].area[1] && _posX < aX + this.aHitAreas[i].area[2] && _posY < aY + this.aHitAreas[i].area[3]) {
                        this.aHitAreas[i].aTouchIdentifiers.push(_identifer);
                        this.aHitAreas[i].oData.hasLeft = false;
                        if (!this.aHitAreas[i].oData.isDown) {
                            this.aHitAreas[i].oData.isDown = true;
                            this.aHitAreas[i].oData.x = _posX;
                            this.aHitAreas[i].oData.y = _posY;
                            if ((curHitTime - this.prevHitTime < 500 && (gameState != "game" || this.aHitAreas[i].id == "pause")) && isBugBrowser) {
                                return;
                            }
                            if (this.aHitAreas[i].id == "copyLinkFromGameEnd1") {
                                this.allowClick = true;
                            }
                            else {
                                this.aHitAreas[i].callback(this.aHitAreas[i].id, this.aHitAreas[i].oData);
                            }
                        }
                        break;
                    }
                }
                else {
                }
            }
            this.prevHitTime = curHitTime;
            if (!this.allowClick) {
                e.preventDefault();
                e.stopPropagation();
            }
        };
        UserInput.prototype.hitUp = function (e, _posX, _posY, _identifer) {
            if (!ios9FirstTouch) {
                playSound("silence");
                ios9FirstTouch = true;
            }
            if (this.pauseIsOn) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            _posX *= canvasScale;
            _posY *= canvasScale;
            for (var i = 0; i < this.aHitAreas.length; i++) {
                if (this.aHitAreas[i].rect) {
                    var aX = canvas.width * this.aHitAreas[i].align[0];
                    var aY = canvas.height * this.aHitAreas[i].align[1];
                    if (_posX > aX + this.aHitAreas[i].area[0] && _posY > aY + this.aHitAreas[i].area[1] && _posX < aX + this.aHitAreas[i].area[2] && _posY < aY + this.aHitAreas[i].area[3]) {
                        for (var j = 0; j < this.aHitAreas[i].aTouchIdentifiers.length; j++) {
                            if (this.aHitAreas[i].aTouchIdentifiers[j] == _identifer) {
                                this.aHitAreas[i].aTouchIdentifiers.splice(j, 1);
                                j -= 1;
                            }
                        }
                        if (this.aHitAreas[i].aTouchIdentifiers.length == 0) {
                            this.aHitAreas[i].oData.isDown = false;
                            if (this.aHitAreas[i].oData.multiTouch) {
                                this.aHitAreas[i].oData.x = _posX;
                                this.aHitAreas[i].oData.y = _posY;
                                this.aHitAreas[i].callback(this.aHitAreas[i].id, this.aHitAreas[i].oData);
                            }
                        }
                        break;
                    }
                }
                else {
                }
            }
        };
        UserInput.prototype.hitCancel = function (e, _posX, _posY, _identifer) {
            e.preventDefault();
            e.stopPropagation();
            _posX *= canvasScale;
            _posY *= canvasScale;
            for (var i = 0; i < this.aHitAreas.length; i++) {
                if (this.aHitAreas[i].oData.isDown) {
                    this.aHitAreas[i].oData.isDown = false;
                    this.aHitAreas[i].aTouchIdentifiers = new Array();
                    if (this.aHitAreas[i].oData.multiTouch) {
                        this.aHitAreas[i].oData.x = _posX;
                        this.aHitAreas[i].oData.y = _posY;
                        this.aHitAreas[i].callback(this.aHitAreas[i].id, this.aHitAreas[i].oData);
                    }
                }
            }
        };
        UserInput.prototype.move = function (e, _posX, _posY, _identifer, _isDown) {
            if (this.pauseIsOn) {
                return;
            }
            _posX *= canvasScale;
            _posY *= canvasScale;
            this.mouseX = _posX;
            this.mouseY = _posY;
            if (_isDown) {
                for (var i = 0; i < this.aHitAreas.length; i++) {
                    if (this.aHitAreas[i].rect) {
                        var aX = canvas.width * this.aHitAreas[i].align[0];
                        var aY = canvas.height * this.aHitAreas[i].align[1];
                        if (_posX > aX + this.aHitAreas[i].area[0] && _posY > aY + this.aHitAreas[i].area[1] && _posX < aX + this.aHitAreas[i].area[2] && _posY < aY + this.aHitAreas[i].area[3]) {
                            this.aHitAreas[i].oData.hasLeft = false;
                            if (this.aHitAreas[i].oData.isDraggable && !this.aHitAreas[i].oData.isDown) {
                                this.aHitAreas[i].oData.isDown = true;
                                this.aHitAreas[i].oData.isBeingDragged = true;
                                this.aHitAreas[i].oData.x = _posX;
                                this.aHitAreas[i].oData.y = _posY;
                                this.aHitAreas[i].aTouchIdentifiers.push(_identifer);
                                if (this.aHitAreas[i].oData.multiTouch) {
                                    this.aHitAreas[i].callback(this.aHitAreas[i].id, this.aHitAreas[i].oData);
                                }
                            }
                            if (this.aHitAreas[i].oData.isDraggable) {
                                this.aHitAreas[i].oData.isBeingDragged = true;
                                this.aHitAreas[i].oData.x = _posX;
                                this.aHitAreas[i].oData.y = _posY;
                                this.aHitAreas[i].callback(this.aHitAreas[i].id, this.aHitAreas[i].oData);
                                if (this.aHitAreas[i]) {
                                    this.aHitAreas[i].oData.isBeingDragged = false;
                                }
                            }
                        }
                        else if (this.aHitAreas[i].oData.isDown && !this.aHitAreas[i].oData.hasLeft) {
                            for (var j = 0; j < this.aHitAreas[i].aTouchIdentifiers.length; j++) {
                                if (this.aHitAreas[i].aTouchIdentifiers[j] == _identifer) {
                                    this.aHitAreas[i].aTouchIdentifiers.splice(j, 1);
                                    j -= 1;
                                }
                            }
                            if (this.aHitAreas[i].aTouchIdentifiers.length == 0) {
                                this.aHitAreas[i].oData.hasLeft = true;
                                if (!this.aHitAreas[i].oData.isBeingDragged) {
                                    this.aHitAreas[i].oData.isDown = false;
                                }
                                if (this.aHitAreas[i].oData.multiTouch) {
                                    this.aHitAreas[i].callback(this.aHitAreas[i].id, this.aHitAreas[i].oData);
                                }
                            }
                        }
                    }
                }
            }
        };
        UserInput.prototype.keyDown = function (e) {
            for (var i = 0; i < this.aKeys.length; i++) {
                if (e.keyCode == this.aKeys[i].keyCode) {
                    e.preventDefault();
                    this.aKeys[i].oData.isDown = true;
                    this.aKeys[i].callback(this.aKeys[i].id, this.aKeys[i].oData);
                }
            }
        };
        UserInput.prototype.keyUp = function (e) {
            for (var i = 0; i < this.aKeys.length; i++) {
                if (e.keyCode == this.aKeys[i].keyCode) {
                    e.preventDefault();
                    this.aKeys[i].oData.isDown = false;
                    this.aKeys[i].callback(this.aKeys[i].id, this.aKeys[i].oData);
                }
            }
        };
        UserInput.prototype.checkKeyFocus = function () {
            window.focus();
            if (this.aKeys.length > 0) {
                window.removeEventListener('keydown', this.keyDownEvtFunc, false);
                window.removeEventListener('keyup', this.keyUpEvtFunc, false);
                window.addEventListener('keydown', this.keyDownEvtFunc, false);
                window.addEventListener('keyup', this.keyUpEvtFunc, false);
            }
        };
        UserInput.prototype.addKey = function (_id, _callback, _oCallbackData, _keyCode) {
            if (_oCallbackData == null) {
                _oCallbackData = new Object();
            }
            this.aKeys.push({ id: _id, callback: _callback, oData: _oCallbackData, keyCode: _keyCode });
            this.checkKeyFocus();
        };
        UserInput.prototype.removeKey = function (_id) {
            for (var i = 0; i < this.aKeys.length; i++) {
                if (this.aKeys[i].id == _id) {
                    this.aKeys.splice(i, 1);
                    i -= 1;
                }
            }
        };
        UserInput.prototype.addHitArea = function (_id, _callback, _oCallbackData, _type, _oAreaData, _isUnique) {
            if (_isUnique === void 0) { _isUnique = false; }
            if (_oCallbackData == null) {
                _oCallbackData = new Object();
            }
            if (_isUnique) {
                this.removeHitArea(_id);
            }
            if (!_oAreaData.scale) {
                _oAreaData.scale = 1;
            }
            if (!_oAreaData.align) {
                _oAreaData.align = [0, 0];
            }
            var aTouchIdentifiers = new Array();
            switch (_type) {
                case "image":
                    var aRect;
                    aRect = new Array(_oAreaData.aPos[0] - (_oAreaData.oImgData.oData.oAtlasData[_oAreaData.id].width / 2) * _oAreaData.scale, _oAreaData.aPos[1] - (_oAreaData.oImgData.oData.oAtlasData[_oAreaData.id].height / 2) * _oAreaData.scale, _oAreaData.aPos[0] + (_oAreaData.oImgData.oData.oAtlasData[_oAreaData.id].width / 2) * _oAreaData.scale, _oAreaData.aPos[1] + (_oAreaData.oImgData.oData.oAtlasData[_oAreaData.id].height / 2) * _oAreaData.scale);
                    this.aHitAreas.push({ id: _id, aTouchIdentifiers: aTouchIdentifiers, callback: _callback, oData: _oCallbackData, rect: true, area: aRect, align: _oAreaData.align });
                    break;
                case "rect":
                    this.aHitAreas.push({ id: _id, aTouchIdentifiers: aTouchIdentifiers, callback: _callback, oData: _oCallbackData, rect: true, area: _oAreaData.aRect, align: _oAreaData.align });
                    break;
            }
        };
        UserInput.prototype.removeHitArea = function (_id) {
            for (var i = 0; i < this.aHitAreas.length; i++) {
                if (this.aHitAreas[i].id == _id) {
                    this.aHitAreas.splice(i, 1);
                    i -= 1;
                }
            }
        };
        UserInput.prototype.resetAll = function () {
            for (var i = 0; i < this.aHitAreas.length; i++) {
                this.aHitAreas[i].oData.isDown = false;
                this.aHitAreas[i].oData.isBeingDragged = false;
                this.aHitAreas[i].aTouchIdentifiers = new Array();
            }
            this.isDown = false;
        };
        return UserInput;
    }());
    Utils.UserInput = UserInput;
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var FpsMeter = (function () {
        function FpsMeter(_canvasHeight) {
            this.updateFreq = 10;
            this.updateInc = 0;
            this.frameAverage = 0;
            this.display = 1;
            this.log = "";
            this.render = function (_ctx) {
                this.frameAverage += this.delta / this.updateFreq;
                if (++this.updateInc >= this.updateFreq) {
                    this.updateInc = 0;
                    this.display = this.frameAverage;
                    this.frameAverage = 0;
                }
                _ctx.textAlign = "left";
                ctx.font = "10px Helvetica";
                _ctx.fillStyle = "#333333";
                _ctx.beginPath();
                _ctx.rect(0, this.canvasHeight - 15, 40, 15);
                _ctx.closePath();
                _ctx.fill();
                _ctx.fillStyle = "#ffffff";
                _ctx.fillText(Math.round(1000 / (this.display * 1000)) + " fps " + this.log, 5, this.canvasHeight - 5);
            };
            this.canvasHeight = _canvasHeight;
        }
        FpsMeter.prototype.update = function (_delta) {
            this.delta = _delta;
        };
        return FpsMeter;
    }());
    Utils.FpsMeter = FpsMeter;
})(Utils || (Utils = {}));
var Elements;
(function (Elements) {
    var Background = (function () {
        function Background() {
            this.x = 0;
            this.y = 0;
            this.targY = 0;
            this.incY = 0;
            this.renderState = null;
            this.oImgData = assetLib.getData("horizon0");
        }
        Background.prototype.render = function () {
            if (canvas.width > canvas.height) {
                ctx.drawImage(this.oImgData.img, 0, ((1 - canvas.height / canvas.width) / 2) * this.oImgData.img.height, this.oImgData.img.width, (canvas.height / canvas.width) * this.oImgData.img.height, 0, 0, canvas.width, canvas.height);
            }
            else {
                ctx.drawImage(this.oImgData.img, ((1 - canvas.width / canvas.height) / 2) * this.oImgData.img.width, 0, (canvas.width / canvas.height) * this.oImgData.img.width, this.oImgData.img.height, 0, 0, canvas.width, canvas.height);
            }
        };
        return Background;
    }());
    Elements.Background = Background;
})(Elements || (Elements = {}));
var Elements;
(function (Elements) {
    var Panel = (function () {
        function Panel(_panelType, _aButs) {
            this.timer = .3;
            this.endTime = 0;
            this.posY = 0;
            this.numberSpace = 65;
            this.incY = 0;
            this.flareRot = 0;
            this.cashInc = 0;
            this.lightningX = 0;
            this.lightningY = 0;
            this.lightningScale = 1;
            this.posInc = 0;
            this.startInc = 100;
            this.startNum = 3;
            this.tutInc = 100;
            this.jaggedFrameScale = 2;
            this.screenTweenIndex = 0;
            this.aMapPoints = new Array([-39, -39], [198, 41], [188, -148], [-109, -164], [-68, 131]);
            this.lightningZapInc = 0;
            this.lightningZapId = -1000;
            this.copySuccess = 0;
            this.oSplashLogoImgData = assetLib.getData("splashLogo");
            this.oUiElementsImgData = assetLib.getData("uiElements");
            this.oGameElementsImgData = assetLib.getData("gameElements");
            this.oNumbers0ImgData = assetLib.getData("numbers0");
            this.oNumbers1ImgData = assetLib.getData("numbers1");
            this.oNumbers2ImgData = assetLib.getData("numbers2");
            this.panelType = _panelType;
            this.aButs = _aButs;
            this.oTopFlareImgData = assetLib.getData("flare");
        }
        Panel.prototype.update = function () {
            this.incY += 10 * delta;
        };
        Panel.prototype.tweenCharInfo = function () {
            if (this.panelTween) {
                this.panelTween.kill();
            }
            this.panelY = 100;
            this.panelTween = TweenLite.to(this, .5, { panelY: 0, ease: "Cubic.easeOut" });
        };
        Panel.prototype.startSequence = function () {
            if (this.startTween) {
                this.startTween.kill();
            }
            this.startNum = 4;
            this.nextStartNumber();
        };
        Panel.prototype.tweenFinish = function () {
            this.endInc = 500;
            TweenLite.to(this, .5, { endInc: 0, ease: "Cubic.easeOut" });
            playSound("raceEnd");
            userInput.removeHitArea("pause");
            userInput.removeHitArea("steerLeft");
            userInput.removeHitArea("steerRight");
            userInput.removeKey("steerRight");
            userInput.removeKey("steerLeft");
            setTimeout(function () {
                if (gameType == 0) {
                    initGameEnd0();
                }
                else {
                    initGameEnd1();
                }
            }, 3000);
        };
        Panel.prototype.nextStartNumber = function () {
            var _this = this;
            this.startNum--;
            playSound("countDown");
            this.startTween = TweenLite.to(this, .2, {
                startInc: 0, ease: "Back.easeOut",
                onComplete: function () {
                    _this.startTween = TweenLite.to(_this, .1, {
                        startInc: 49, delay: .6, ease: "Cubic.easeIn",
                        onComplete: function () {
                            if (_this.startNum > 1) {
                                _this.nextStartNumber();
                            }
                            else {
                                _this.startInc = 50;
                                playSound("raceStart");
                                if (firstRun) {
                                    _this.tutInc = 100;
                                    _this.tutTween = TweenLite.to(_this, .3, {
                                        tutInc: 0, ease: "Cubic.easeOut",
                                        onComplete: function () {
                                            _this.tutTween = TweenLite.to(_this, .3, {
                                                tutInc: 100, delay: 3, ease: "Cubic.easeIn",
                                                onComplete: function () {
                                                    firstRun = false;
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        }
                    });
                }
            });
        };
        Panel.prototype.lightningHit = function (_x, _y) {
            var _this = this;
            if (this.lightningTween) {
                this.lightningTween.kill();
            }
            this.lightningX = _x;
            this.lightningY = _y;
            this.lightningScale = 1;
            this.lightningTween = TweenLite.to(this, .2, {
                lightningScale: 0, ease: "Bounce.easeOut",
                onComplete: function () {
                    _this.lightningTween = TweenLite.to(_this, .2, {
                        lightningScale: 1, ease: "Cubic.easeIn",
                        onComplete: function () {
                            _this.lightningZapInc = _this.incY;
                        }
                    });
                }
            });
        };
        Panel.prototype.jigglePos = function () {
            if (this.cashTween) {
                this.cashTween.kill();
            }
            this.posInc = -50;
            this.posTween = TweenLite.to(this, 1, { posInc: 0, ease: "Elastic.easeOut" });
        };
        Panel.prototype.jiggleCash = function () {
            if (this.cashTween) {
                this.cashTween.kill();
            }
            this.cashInc = -50;
            this.cashTween = TweenLite.to(this, 1, { cashInc: 0, ease: "Elastic.easeOut" });
        };
        Panel.prototype.startTween1 = function () {
            this.posY = 500;
            TweenLite.to(this, .5, { posY: 0, ease: "Back.easeOut" });
            this.charY = 500;
            TweenLite.to(this, .5, { charY: 0, ease: "Cubic.easeOut" });
            this.butsY = 500;
            TweenLite.to(this, .5, { butsY: 0, ease: "Cubic.easeOut" });
        };
        Panel.prototype.endScreenTween0 = function () {
            var _a;
            var _this = this;
            if (this.screenTween) {
                this.screenTween.kill();
            }
            if (this.screenTweenIndex == 0) {
                this.aScreenIncs = new Array(1000, 1000, 1000, 1000, 1000);
            }
            this.screenTween = TweenLite.to(this.aScreenIncs, .2, (_a = {},
                _a[this.screenTweenIndex] = 0,
                _a.ease = "Cubic.easeOut",
                _a.onComplete = function () {
                    _this.screenTweenIndex++;
                    if (_this.screenTweenIndex < _this.aScreenIncs.length) {
                        _this.endScreenTween0();
                    }
                    else {
                        if (prevGameState != "upgrades") {
                            playSound("earnCoins" + Math.floor(Math.random() * 4));
                            for (var i = 0; i < (14 - userCharPos) * 2; i++) {
                                var temp = new Elements.CoinShower(assetLib.getData("coin"), Math.random() * (canvas.width / 2) + canvas.width * .25, Math.random() * (canvas.height / 2) + canvas.height * .25);
                                aEffects.push(temp);
                            }
                            if (gameState == "gameEnd0") {
                                saveDataHandler.updateCash(aPosPoints[userCharPos] * 25 + 50);
                            }
                            else {
                                saveDataHandler.updateCash((aPosPoints[userCharPos] * 25 + 50) * 2);
                            }
                            saveDataHandler.saveData();
                            _this.jiggleCash();
                        }
                    }
                },
                _a));
        };
        Panel.prototype.endScreenTween1 = function () {
            var tempCoins;
            if (challengeTime == -1) {
                tempCoins = 20;
            }
            else if (raceTime > challengeTime) {
                tempCoins = 5;
            }
            else {
                tempCoins = 20;
            }
            playSound("earnCoins" + Math.floor(Math.random() * 4));
            for (var i = 0; i < tempCoins; i++) {
                var temp = new Elements.CoinShower(assetLib.getData("coin"), Math.random() * (canvas.width / 2) + canvas.width * .25, Math.random() * (canvas.height / 2) + canvas.height * .25);
                aEffects.push(temp);
            }
            saveDataHandler.updateCash(tempCoins * 5);
            saveDataHandler.saveData();
            this.jiggleCash();
        };
        Panel.prototype.removeBut = function (_id) {
            for (var i = 0; i < this.aButs.length; i++) {
                if (this.aButs[i].id == _id) {
                    this.aButs.splice(i, 1);
                    i -= 1;
                }
            }
        };
        Panel.prototype.switchBut = function (_id0, _id1, _id1Over, _aNewAPos, _aNewAlign) {
            if (_aNewAPos === void 0) { _aNewAPos = null; }
            if (_aNewAlign === void 0) { _aNewAlign = null; }
            var oButData = null;
            for (var i = 0; i < this.aButs.length; i++) {
                if (this.aButs[i].id == _id0) {
                    this.aButs[i].id = _id1;
                    this.aButs[i].idOver = _id1Over;
                    oButData = this.aButs[i];
                    if (_aNewAPos) {
                        this.aButs[i].aPos = _aNewAPos;
                    }
                    if (_aNewAlign) {
                        this.aButs[i].align = _aNewAlign;
                    }
                }
            }
            return oButData;
        };
        Panel.prototype.addTextBar = function (_x, _y, _width, _height, _col) {
            ctx.fillStyle = _col;
            ctx.fillRect(_x, _y, _width, _height);
            ctx.beginPath();
            ctx.arc(_x, _y + _height / 2, _height / 2, 0, 2 * Math.PI);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(_x + _width, _y + _height / 2, _height / 2, 0, 2 * Math.PI);
            ctx.fill();
        };
        Panel.prototype.render = function (_butsOnTop) {
            if (_butsOnTop === void 0) { _butsOnTop = true; }
            if (!_butsOnTop) {
                this.addButs(ctx);
            }
            switch (this.panelType) {
                case "splash":
                    ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(this.oSplashLogoImgData.img, canvas.width / 2 - this.oSplashLogoImgData.img.width / 2, canvas.height / 2 - this.oSplashLogoImgData.img.height / 2 - this.posY);
                    break;
                case "start":
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.jaggedFrame].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.jaggedFrame].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.jaggedFrame].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.jaggedFrame].height;
                    var tempScale = 1 + (Math.sin(this.incY * .5) * .1 + .1);
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, 0 - ((canvas.width * tempScale) - canvas.width) * .5, 0 - ((canvas.height * tempScale) - canvas.height) * .5, canvas.width * tempScale, canvas.height * tempScale);
                    var tempImgData = assetLib.getData("titleLogo");
                    var tempScale = 1;
                    var tempTY = canvas.height * .42 - (tempImgData.img.height / 2);
                    if (canvas.height > canvas.width - 200 || challengeTime != -1) {
                        tempTY = Math.max(canvas.height * .55 - 330 - (tempImgData.img.height / 2), -15);
                    }
                    ctx.drawImage(tempImgData.img, 0, 0, tempImgData.img.width, tempImgData.img.height, canvas.width / 2 - (tempImgData.img.width / 2) * tempScale, tempTY + Math.sin(this.incY * .4) * 10 + this.posY, tempImgData.img.width * tempScale, tempImgData.img.height * tempScale);
                    var tempMidY = canvas.height * .55;
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar0"]].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar0"]].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar0"]].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar0"]].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, -this.charY + Math.abs(Math.sin(this.incY * .3) * 20) - 20, tempMidY - bHeight / 2 - 150, bWidth, bHeight);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar1"]].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar1"]].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar1"]].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar1"]].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, -this.charY * .5 + Math.abs(Math.sin(this.incY * .28 + 1) * 20) - 20, tempMidY - bHeight / 2, bWidth, bHeight);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar3"]].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar3"]].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar3"]].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar3"]].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, -this.charY + Math.abs(Math.sin(this.incY * .26 + 2) * 20) - 20, tempMidY - bHeight / 2 + 100, bWidth, bHeight);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar2"]].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar2"]].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar2"]].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar2"]].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, -this.charY * 2 + Math.abs(Math.sin(this.incY * .24 + 3) * 20) - 20, tempMidY - bHeight / 2 - 30, bWidth, bHeight);
                    tempMidY = canvas.height * .55;
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar5"]].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar5"]].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar5"]].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar5"]].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width - bWidth + this.charY * .5 - Math.abs(Math.sin(this.incY * .3) * 20) + 20, tempMidY - bHeight / 2, bWidth, bHeight);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar4"]].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar4"]].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar4"]].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar4"]].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width - bWidth + this.charY - Math.abs(Math.sin(this.incY * .28 + 1) * 20) + 20, tempMidY - bHeight / 2 - 135, bWidth, bHeight);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar6"]].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar6"]].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar6"]].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar6"]].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width - bWidth + this.charY * 2 - Math.abs(Math.sin(this.incY * .26 + 2) * 20) + 20, tempMidY - bHeight / 2 - 20, bWidth, bHeight);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar7"]].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar7"]].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar7"]].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar7"]].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width - bWidth + this.charY - Math.abs(Math.sin(this.incY * .24 + 3) * 20) + 20, tempMidY - bHeight / 2 + 90, bWidth, bHeight);
                    if (challengeTime == -1) {
                    }
                    else {
                        var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.acceptChallengeBg].x;
                        var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.acceptChallengeBg].y;
                        var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.acceptChallengeBg].width;
                        var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.acceptChallengeBg].height;
                        ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2, canvas.height * .75 - bHeight / 2 - 15 + this.butsY, bWidth, bHeight);
                        var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + challengeChar]].x;
                        var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + challengeChar]].y;
                        var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + challengeChar]].width;
                        var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + challengeChar]].height;
                        tempCharScale = .5;
                        ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - 236, canvas.height * .75 - bHeight * tempCharScale + this.butsY + 109, bWidth * tempCharScale, bHeight * tempCharScale);
                        addText(1, 40, 390, "center", canvas.width / 2, canvas.height * .75 - 95 + this.butsY, "youHaveBeen", "#FFFFFF");
                        addText(0, 25, 390, "center", canvas.width / 2, canvas.height * .75 + 95 + this.butsY, "acceptChallenge", "#FFFFFF");
                    }
                    break;
                case "credits":
                    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    var tempImgData = assetLib.getData("info");
                    ctx.drawImage(tempImgData.img, 0, 0, tempImgData.img.width, tempImgData.img.height, canvas.width / 2 - tempImgData.img.width / 2, canvas.height / 2 - tempImgData.img.height / 2 + this.posY, tempImgData.img.width, tempImgData.img.height);
                    addText(0, 23, 700, "center", canvas.width / 2, canvas.height / 2 - 170 + this.posY, "producedFor", "#FFFFFF");
                    addText(0, 23, 700, "center", canvas.width / 2, canvas.height / 2 + 83 + this.posY, "createdBy", "#FFFFFF");
                    addText(0, 23, 200, "right", canvas.width - 95, canvas.height - 36 + this.butsY, "resetGame", "#FFFFFF");
                    ctx.fillStyle = "#FFFFFF";
                    ctx.textAlign = "center";
                    ctx.font = "italic 15px Helvetica";
                    ctx.fillText("v1.1.8", canvas.width / 2, canvas.height / 2 + 200 + this.posY);
                    if (resetConfirmOn) {
                        var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.areYouSurePanel].x;
                        var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.areYouSurePanel].y;
                        var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.areYouSurePanel].width;
                        var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.areYouSurePanel].height;
                        ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width - bWidth - 10, canvas.height - bHeight - 90, bWidth, bHeight);
                        addText(0, 23, 270, "center", canvas.width - bWidth / 2 - 10, canvas.height - 220, "areYouSure", "#FFFFFF");
                    }
                    break;
                case "charSelect":
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.jaggedFrame].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.jaggedFrame].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.jaggedFrame].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.jaggedFrame].height;
                    var tempScale = 1 + (Math.sin(this.incY * .5) * .1 + .1);
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, 0 - ((canvas.width * tempScale) - canvas.width) * .5, 0 - ((canvas.height * tempScale) - canvas.height) * .5, canvas.width * tempScale, canvas.height * tempScale);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.screenTitlePanel1].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.screenTitlePanel1].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.screenTitlePanel1].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.screenTitlePanel1].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, 5, 1 - this.butsY, bWidth, bHeight);
                    addText(2, 40, 360, "left", 35, 52 - this.butsY, "selectCharacter", "#FFFFFF");
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.uiCoin0].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.uiCoin0].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.uiCoin0].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.uiCoin0].height;
                    var tempScale = .6;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width * .72 - bWidth * tempScale + this.cashInc, 39 - (bHeight / 2) * tempScale - this.butsY, bWidth * tempScale, bHeight * tempScale);
                    var tempCash = saveDataHandler.getCash().toString();
                    while (tempCash.length < 3) {
                        tempCash = "0" + tempCash;
                    }
                    for (var i = 0; i < tempCash.length; i++) {
                        var id = parseFloat(tempCash.charAt(i));
                        var imgX = (id * this.oNumbers0ImgData.oData.spriteWidth) % this.oNumbers0ImgData.img.width;
                        var imgY = Math.floor(id / (this.oNumbers0ImgData.img.width / this.oNumbers0ImgData.oData.spriteWidth)) * this.oNumbers0ImgData.oData.spriteHeight;
                        tempScale = Math.min(((canvas.width - 100) - (canvas.width * .72)) / (this.numberSpace * tempCash.length), .6);
                        ctx.drawImage(this.oNumbers0ImgData.img, imgX, imgY, this.oNumbers0ImgData.oData.spriteWidth, this.oNumbers0ImgData.oData.spriteHeight, canvas.width * .72 + i * this.numberSpace * tempScale + this.cashInc, 39 - this.butsY - (this.oNumbers0ImgData.oData.spriteHeight / 2) * tempScale, this.oNumbers0ImgData.oData.spriteWidth * tempScale, this.oNumbers0ImgData.oData.spriteHeight * tempScale);
                    }
                    if (this.panelY < 100) {
                        var tempScaleOffsetY = -Math.max((canvas.height - 460) - 400, 0) * .75;
                        var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.charPanel].x;
                        var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.charPanel].y;
                        var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.charPanel].width;
                        var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.charPanel].height;
                        ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2, canvas.height - bHeight - 35 + this.panelY + tempScaleOffsetY, bWidth, bHeight);
                        var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + curChar]].x;
                        var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + curChar]].y;
                        var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + curChar]].width;
                        var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + curChar]].height;
                        ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - 331, canvas.height - bHeight - 114 + this.panelY * 2 + tempScaleOffsetY, bWidth, bHeight);
                        var tempVehicleId = curChar;
                        var aTemp = saveDataHandler.getVehicleData(curChar);
                        for (var i = 0; i < aTemp.length; i++) {
                            if (aTemp[i] == 2) {
                                tempVehicleId = parseInt((14 + i).toString() + aCharData[curChar].vehicleType);
                                break;
                            }
                        }
                        var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["vehicle" + tempVehicleId]].x;
                        var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["vehicle" + tempVehicleId]].y;
                        var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["vehicle" + tempVehicleId]].width;
                        var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["vehicle" + tempVehicleId]].height;
                        ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2 + Math.sin(this.incY * .5) * 5 + 20, canvas.height - bHeight - 6 + this.panelY * 2 + tempScaleOffsetY, bWidth, bHeight);
                        var tempUpgradeId = -1;
                        for (var i = 0; i < 3; i++) {
                            if (saveDataHandler.getUpgradeLockStatus(curChar, i + 6) == 2) {
                                tempUpgradeId = i;
                                break;
                            }
                        }
                        if (tempUpgradeId > -1) {
                            var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["upgradePreview" + tempUpgradeId]].x;
                            var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["upgradePreview" + tempUpgradeId]].y;
                            var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["upgradePreview" + tempUpgradeId]].width;
                            var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["upgradePreview" + tempUpgradeId]].height;
                            if (aCharData[curChar].vehicleType == 0) {
                                ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2 - Math.sin(this.incY * .5) * 5 + 60, canvas.height - bHeight - 90 + this.panelY * 2 + tempScaleOffsetY, bWidth, bHeight);
                            }
                            else {
                                ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2 - Math.sin(this.incY * .5) * 5 - 45, canvas.height - bHeight - 110 + this.panelY * 2 + tempScaleOffsetY, bWidth, bHeight);
                            }
                        }
                        var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["logo" + aCharData[curChar].logo]].x;
                        var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["logo" + aCharData[curChar].logo]].y;
                        var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["logo" + aCharData[curChar].logo]].width;
                        var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["logo" + aCharData[curChar].logo]].height;
                        ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - 220 - bWidth / 2, canvas.height - 60 - bHeight / 2 + this.panelY * 2 + tempScaleOffsetY, bWidth, bHeight);
                        ctx.fillStyle = "#BF4407";
                        ctx.fillRect(canvas.width / 2 + 165, canvas.height - 285 + this.panelY + tempScaleOffsetY, 120, 15);
                        ctx.fillStyle = "#FFFFFF";
                        ctx.fillRect(canvas.width / 2 + 165, canvas.height - 285 + this.panelY + tempScaleOffsetY, 120 * aCharData[curChar].stats[0], 15);
                        ctx.fillStyle = "#FFE230";
                        ctx.fillRect(canvas.width / 2 + 165 + 120 * aCharData[curChar].stats[0], canvas.height - 285 + this.panelY + tempScaleOffsetY, saveDataHandler.getStatBonus(0) * 5, 15);
                        addText(2, 25, 120, "left", canvas.width / 2 + 165, canvas.height - 248 + this.panelY + tempScaleOffsetY, "acceleration", "#FFFFFF");
                        ctx.fillStyle = "#BF4407";
                        ctx.fillRect(canvas.width / 2 + 165, canvas.height - 238 + this.panelY + tempScaleOffsetY, 120, 15);
                        ctx.fillStyle = "#FFFFFF";
                        ctx.fillRect(canvas.width / 2 + 165, canvas.height - 238 + this.panelY + tempScaleOffsetY, 120 * aCharData[curChar].stats[1], 15);
                        ctx.fillStyle = "#FFE230";
                        ctx.fillRect(canvas.width / 2 + 165 + 120 * aCharData[curChar].stats[1], canvas.height - 238 + this.panelY + tempScaleOffsetY, saveDataHandler.getStatBonus(1) * 5, 15);
                        addText(2, 25, 120, "left", canvas.width / 2 + 165, canvas.height - 201 + this.panelY + tempScaleOffsetY, "steering", "#FFFFFF");
                        ctx.fillStyle = "#BF4407";
                        ctx.fillRect(canvas.width / 2 + 165, canvas.height - 190 + this.panelY + tempScaleOffsetY, 120, 15);
                        ctx.fillStyle = "#FFFFFF";
                        ctx.fillRect(canvas.width / 2 + 165, canvas.height - 190 + this.panelY + tempScaleOffsetY, 120 * aCharData[curChar].stats[2], 15);
                        ctx.fillStyle = "#FFE230";
                        ctx.fillRect(canvas.width / 2 + 165 + 120 * aCharData[curChar].stats[2], canvas.height - 190 + this.panelY + tempScaleOffsetY, saveDataHandler.getStatBonus(2) * 5, 15);
                        addText(2, 25, 120, "left", canvas.width / 2 + 165, canvas.height - 153 + this.panelY + tempScaleOffsetY, "topSpeed", "#FFFFFF");
                        addText(2, 32, 180, "center", canvas.width / 2, canvas.height - 274 + this.panelY + tempScaleOffsetY, "char" + curChar, "#FF5500");
                    }
                    break;
                case "upgrades":
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.jaggedFrame].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.jaggedFrame].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.jaggedFrame].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.jaggedFrame].height;
                    var tempScale = 1 + (Math.sin(this.incY * .5) * .1 + .1);
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, 0 - ((canvas.width * tempScale) - canvas.width) * .5, 0 - ((canvas.height * tempScale) - canvas.height) * .5, canvas.width * tempScale, canvas.height * tempScale);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.screenTitlePanel1].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.screenTitlePanel1].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.screenTitlePanel1].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.screenTitlePanel1].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, 5, 1 - this.butsY, bWidth, bHeight);
                    addText(2, 40, 360, "left", 35, 52 - this.butsY, "upgrades", "#FFFFFF");
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.uiCoin0].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.uiCoin0].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.uiCoin0].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.uiCoin0].height;
                    var tempScale = .6;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width * .72 - bWidth * tempScale + this.cashInc, 39 - (bHeight / 2) * tempScale - this.butsY, bWidth * tempScale, bHeight * tempScale);
                    var tempCash = saveDataHandler.getCash().toString();
                    while (tempCash.length < 3) {
                        tempCash = "0" + tempCash;
                    }
                    for (var i = 0; i < tempCash.length; i++) {
                        var id = parseFloat(tempCash.charAt(i));
                        var imgX = (id * this.oNumbers0ImgData.oData.spriteWidth) % this.oNumbers0ImgData.img.width;
                        var imgY = Math.floor(id / (this.oNumbers0ImgData.img.width / this.oNumbers0ImgData.oData.spriteWidth)) * this.oNumbers0ImgData.oData.spriteHeight;
                        tempScale = Math.min(((canvas.width - 100) - (canvas.width * .72)) / (this.numberSpace * tempCash.length), .6);
                        ctx.drawImage(this.oNumbers0ImgData.img, imgX, imgY, this.oNumbers0ImgData.oData.spriteWidth, this.oNumbers0ImgData.oData.spriteHeight, canvas.width * .72 + i * this.numberSpace * tempScale + this.cashInc, 39 - this.butsY - (this.oNumbers0ImgData.oData.spriteHeight / 2) * tempScale, this.oNumbers0ImgData.oData.spriteWidth * tempScale, this.oNumbers0ImgData.oData.spriteHeight * tempScale);
                    }
                    var tempScaleOffsetY = -Math.max((canvas.height - 460) - 400, 0) * .75;
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.charPanel].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.charPanel].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.charPanel].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.charPanel].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2, canvas.height - bHeight - 35 + this.panelY + tempScaleOffsetY, bWidth, bHeight);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + curChar]].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + curChar]].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + curChar]].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + curChar]].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - 331, canvas.height - bHeight - 114 + this.panelY * 2 + tempScaleOffsetY, bWidth, bHeight);
                    var tempVehicleId = curChar;
                    var aTemp = saveDataHandler.getVehicleData(curChar);
                    for (var i = 0; i < aTemp.length; i++) {
                        if (aTemp[i] == 2) {
                            tempVehicleId = parseInt((14 + i).toString() + aCharData[curChar].vehicleType);
                            break;
                        }
                    }
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["vehicle" + tempVehicleId]].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["vehicle" + tempVehicleId]].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["vehicle" + tempVehicleId]].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["vehicle" + tempVehicleId]].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2 + Math.sin(this.incY * .5) * 5 + 20, canvas.height - bHeight - 6 + this.panelY * 2 + tempScaleOffsetY, bWidth, bHeight);
                    var tempUpgradeId = -1;
                    for (var i = 0; i < 3; i++) {
                        if (saveDataHandler.getUpgradeLockStatus(curChar, i + 6) == 2) {
                            tempUpgradeId = i;
                            break;
                        }
                    }
                    if (tempUpgradeId > -1) {
                        var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["upgradePreview" + tempUpgradeId]].x;
                        var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["upgradePreview" + tempUpgradeId]].y;
                        var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["upgradePreview" + tempUpgradeId]].width;
                        var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["upgradePreview" + tempUpgradeId]].height;
                        if (aCharData[curChar].vehicleType == 0) {
                            ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2 - Math.sin(this.incY * .5) * 5 + 60, canvas.height - bHeight - 90 + this.panelY * 2 + tempScaleOffsetY, bWidth, bHeight);
                        }
                        else {
                            ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2 - Math.sin(this.incY * .5) * 5 - 45, canvas.height - bHeight - 110 + this.panelY * 2 + tempScaleOffsetY, bWidth, bHeight);
                        }
                    }
                    ctx.fillStyle = "#BF4407";
                    ctx.fillRect(canvas.width / 2 + 165, canvas.height - 285 + this.panelY + tempScaleOffsetY, 120, 15);
                    ctx.fillStyle = "#FFFFFF";
                    ctx.fillRect(canvas.width / 2 + 165, canvas.height - 285 + this.panelY + tempScaleOffsetY, 120 * aCharData[curChar].stats[0], 15);
                    ctx.fillStyle = "#FFE230";
                    ctx.fillRect(canvas.width / 2 + 165 + 120 * aCharData[curChar].stats[0], canvas.height - 285 + this.panelY + tempScaleOffsetY, saveDataHandler.getStatBonus(0) * 5, 15);
                    addText(2, 25, 120, "left", canvas.width / 2 + 165, canvas.height - 248 + this.panelY + tempScaleOffsetY, "acceleration", "#FFFFFF");
                    ctx.fillStyle = "#BF4407";
                    ctx.fillRect(canvas.width / 2 + 165, canvas.height - 238 + this.panelY + tempScaleOffsetY, 120, 15);
                    ctx.fillStyle = "#FFFFFF";
                    ctx.fillRect(canvas.width / 2 + 165, canvas.height - 238 + this.panelY + tempScaleOffsetY, 120 * aCharData[curChar].stats[1], 15);
                    ctx.fillStyle = "#FFE230";
                    ctx.fillRect(canvas.width / 2 + 165 + 120 * aCharData[curChar].stats[1], canvas.height - 238 + this.panelY + tempScaleOffsetY, saveDataHandler.getStatBonus(1) * 5, 15);
                    addText(2, 25, 120, "left", canvas.width / 2 + 165, canvas.height - 201 + this.panelY + tempScaleOffsetY, "steering", "#FFFFFF");
                    ctx.fillStyle = "#BF4407";
                    ctx.fillRect(canvas.width / 2 + 165, canvas.height - 190 + this.panelY + tempScaleOffsetY, 120, 15);
                    ctx.fillStyle = "#FFFFFF";
                    ctx.fillRect(canvas.width / 2 + 165, canvas.height - 190 + this.panelY + tempScaleOffsetY, 120 * aCharData[curChar].stats[2], 15);
                    ctx.fillStyle = "#FFE230";
                    ctx.fillRect(canvas.width / 2 + 165 + 120 * aCharData[curChar].stats[2], canvas.height - 190 + this.panelY + tempScaleOffsetY, saveDataHandler.getStatBonus(2) * 5, 15);
                    addText(2, 25, 120, "left", canvas.width / 2 + 165, canvas.height - 153 + this.panelY + tempScaleOffsetY, "topSpeed", "#FFFFFF");
                    addText(2, 32, 180, "center", canvas.width / 2, canvas.height - 274 + this.panelY + tempScaleOffsetY, "char" + curChar, "#FF5500");
                    break;
                case "game":
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.jaggedFrame].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.jaggedFrame].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.jaggedFrame].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.jaggedFrame].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, 0 - ((canvas.width * this.jaggedFrameScale) - canvas.width) * .5, 0 - ((canvas.height * this.jaggedFrameScale) - canvas.height) * .5, canvas.width * this.jaggedFrameScale, canvas.height * this.jaggedFrameScale);
                    if (this.lightningScale < 1) {
                        var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds.lightning].x;
                        var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds.lightning].y;
                        var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds.lightning].width;
                        var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.lightning].height;
                        var tempLScale = this.lightningY / bHeight;
                        ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, this.lightningX - (bWidth / 2) * tempLScale + Math.random() * 10 - 5, -this.lightningScale * (bHeight * tempLScale), bWidth * tempLScale, bHeight * tempLScale);
                    }
                    if (gameType == 0) {
                        var tempCoinId = 0;
                        if (ground.magnetCount > 0) {
                            var tempCoinId = Math.floor(this.incY * .5) % 2;
                        }
                        var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["uiCoin" + tempCoinId]].x;
                        var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["uiCoin" + tempCoinId]].y;
                        var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["uiCoin" + tempCoinId]].width;
                        var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["uiCoin" + tempCoinId]].height;
                        var tempScale = .6;
                        ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width * .72 - bWidth * tempScale, 39 - (bHeight / 2) * tempScale - this.butsY + this.cashInc, bWidth * tempScale, bHeight * tempScale);
                        var tempNum = saveDataHandler.getCash().toString();
                        var tempNumScale;
                        while (tempNum.length < 3) {
                            tempNum = "0" + tempNum;
                        }
                        for (var i = 0; i < tempNum.length; i++) {
                            var id = parseFloat(tempNum.charAt(i));
                            var imgX = (id * this.oNumbers0ImgData.oData.spriteWidth) % this.oNumbers0ImgData.img.width;
                            var imgY = Math.floor(id / (this.oNumbers0ImgData.img.width / this.oNumbers0ImgData.oData.spriteWidth)) * this.oNumbers0ImgData.oData.spriteHeight;
                            tempNumScale = Math.min(((canvas.width - 100) - (canvas.width * .72)) / (this.numberSpace * tempNum.length), .6);
                            ctx.drawImage(this.oNumbers0ImgData.img, imgX, imgY, this.oNumbers0ImgData.oData.spriteWidth, this.oNumbers0ImgData.oData.spriteHeight, canvas.width * .72 + i * this.numberSpace * tempNumScale, 39 - this.butsY - (this.oNumbers0ImgData.oData.spriteHeight / 2) * tempNumScale + this.cashInc, this.oNumbers0ImgData.oData.spriteWidth * tempNumScale, this.oNumbers0ImgData.oData.spriteHeight * tempNumScale);
                        }
                    }
                    else {
                        tempScale = Math.min(((canvas.width - 100) - (canvas.width * .72)) / 200, .6);
                        var id;
                        var mins = Math.floor(raceTime / 6000).toString();
                        var tempX = canvas.width * .72 - 120 * tempScale;
                        var tempY = 39 - this.butsY - (this.oNumbers1ImgData.oData.spriteHeight / 2) * tempScale;
                        var secs = Math.floor((raceTime - Math.floor(raceTime / 6000) * 6000) / 100).toString();
                        if (secs.length < 2) {
                            secs = "0" + secs;
                        }
                        var tenths = raceTime.toString().charAt(raceTime.toString().length - 2) + raceTime.toString().charAt(raceTime.toString().length - 1);
                        if (tenths.length < 2) {
                            tenths = "0" + tenths;
                        }
                        for (var i = 0; i < 2; i++) {
                            id = parseFloat(mins.charAt(i));
                            if (mins.length < 2) {
                                if (i == 0) {
                                    continue;
                                }
                                else {
                                    id = parseFloat(mins.charAt(0));
                                }
                            }
                            var imgX = (id * this.oNumbers0ImgData.oData.spriteWidth) % this.oNumbers0ImgData.img.width;
                            var imgY = Math.floor(id / (this.oNumbers0ImgData.img.width / this.oNumbers0ImgData.oData.spriteWidth)) * this.oNumbers0ImgData.oData.spriteHeight;
                            ctx.drawImage(this.oNumbers0ImgData.img, imgX, imgY, this.oNumbers0ImgData.oData.spriteWidth, this.oNumbers0ImgData.oData.spriteHeight, tempX, tempY, this.oNumbers0ImgData.oData.spriteWidth * tempScale, this.oNumbers0ImgData.oData.spriteHeight * tempScale);
                        }
                        id = 10;
                        var imgX = (id * this.oNumbers0ImgData.oData.spriteWidth) % this.oNumbers0ImgData.img.width;
                        var imgY = Math.floor(id / (this.oNumbers0ImgData.img.width / this.oNumbers0ImgData.oData.spriteWidth)) * this.oNumbers0ImgData.oData.spriteHeight;
                        ctx.drawImage(this.oNumbers0ImgData.img, imgX, imgY, this.oNumbers0ImgData.oData.spriteWidth, this.oNumbers0ImgData.oData.spriteHeight, tempX + 50 * tempScale, tempY, this.oNumbers0ImgData.oData.spriteWidth * tempScale, this.oNumbers0ImgData.oData.spriteHeight * tempScale);
                        for (var i = 0; i < 2; i++) {
                            id = parseFloat(secs.charAt(i));
                            var imgX = (id * this.oNumbers0ImgData.oData.spriteWidth) % this.oNumbers0ImgData.img.width;
                            var imgY = Math.floor(id / (this.oNumbers0ImgData.img.width / this.oNumbers0ImgData.oData.spriteWidth)) * this.oNumbers0ImgData.oData.spriteHeight;
                            ctx.drawImage(this.oNumbers0ImgData.img, imgX, imgY, this.oNumbers0ImgData.oData.spriteWidth, this.oNumbers0ImgData.oData.spriteHeight, tempX + 100 * tempScale + i * this.numberSpace * tempScale, tempY, this.oNumbers0ImgData.oData.spriteWidth * tempScale, this.oNumbers0ImgData.oData.spriteHeight * tempScale);
                        }
                        for (var i = 0; i < 2; i++) {
                            id = parseFloat(tenths.charAt(i));
                            var imgX = (id * this.oNumbers0ImgData.oData.spriteWidth) % this.oNumbers0ImgData.img.width;
                            var imgY = Math.floor(id / (this.oNumbers0ImgData.img.width / this.oNumbers0ImgData.oData.spriteWidth)) * this.oNumbers0ImgData.oData.spriteHeight;
                            ctx.drawImage(this.oNumbers0ImgData.img, imgX, imgY, this.oNumbers0ImgData.oData.spriteWidth, this.oNumbers0ImgData.oData.spriteHeight, tempX + 235 * tempScale + i * this.numberSpace * .6 * tempScale, tempY + 4, this.oNumbers0ImgData.oData.spriteWidth * .6 * tempScale, this.oNumbers0ImgData.oData.spriteHeight * .6 * tempScale);
                        }
                    }
                    tempScale = .75;
                    tempNum = (userCharPos + 1).toString();
                    while (tempNum.length < 2) {
                        tempNum = "0" + tempNum;
                    }
                    for (var i = 0; i < tempNum.length; i++) {
                        var id = parseFloat(tempNum.charAt(i));
                        var imgX = (id * this.oNumbers1ImgData.oData.spriteWidth) % this.oNumbers1ImgData.img.width;
                        var imgY = Math.floor(id / (this.oNumbers1ImgData.img.width / this.oNumbers1ImgData.oData.spriteWidth)) * this.oNumbers1ImgData.oData.spriteHeight;
                        ctx.drawImage(this.oNumbers1ImgData.img, imgX, imgY, this.oNumbers1ImgData.oData.spriteWidth, this.oNumbers1ImgData.oData.spriteHeight, canvas.width * .26 + i * this.numberSpace * tempScale - 2 * this.numberSpace * tempScale, 39 - this.butsY - (this.oNumbers1ImgData.oData.spriteHeight / 2) * tempScale - this.posInc, this.oNumbers1ImgData.oData.spriteWidth * tempScale, this.oNumbers1ImgData.oData.spriteHeight * tempScale);
                    }
                    var id = 10;
                    tempScale = .5;
                    var imgX = (id * this.oNumbers2ImgData.oData.spriteWidth) % this.oNumbers2ImgData.img.width;
                    var imgY = Math.floor(id / (this.oNumbers2ImgData.img.width / this.oNumbers2ImgData.oData.spriteWidth)) * this.oNumbers2ImgData.oData.spriteHeight;
                    ctx.drawImage(this.oNumbers2ImgData.img, imgX, imgY, this.oNumbers2ImgData.oData.spriteWidth, this.oNumbers1ImgData.oData.spriteHeight, canvas.width * .26 + 2, 39 - this.butsY - (this.oNumbers2ImgData.oData.spriteHeight / 2) * tempScale + this.posInc, this.oNumbers2ImgData.oData.spriteWidth * tempScale, this.oNumbers2ImgData.oData.spriteHeight * tempScale);
                    tempNum = (14).toString();
                    for (var i = 0; i < tempNum.length; i++) {
                        var id = parseFloat(tempNum.charAt(i));
                        var imgX = (id * this.oNumbers2ImgData.oData.spriteWidth) % this.oNumbers2ImgData.img.width;
                        var imgY = Math.floor(id / (this.oNumbers2ImgData.img.width / this.oNumbers2ImgData.oData.spriteWidth)) * this.oNumbers2ImgData.oData.spriteHeight;
                        ctx.drawImage(this.oNumbers2ImgData.img, imgX, imgY, this.oNumbers2ImgData.oData.spriteWidth, this.oNumbers2ImgData.oData.spriteHeight, canvas.width * .26 + (i + 1) * this.numberSpace * tempScale, 39 - this.butsY - (this.oNumbers2ImgData.oData.spriteHeight / 2) * tempScale + this.posInc, this.oNumbers2ImgData.oData.spriteWidth * tempScale, this.oNumbers2ImgData.oData.spriteHeight * tempScale);
                    }
                    ctx.fillStyle = "#2877A6";
                    ctx.fillRect(canvas.width * .42 - 2, 20 - this.butsY - 2, canvas.width * .2 + 4, 38 + 4);
                    var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds.uiDistEnd].x;
                    var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds.uiDistEnd].y;
                    var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds.uiDistEnd].width;
                    var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.uiDistEnd].height;
                    ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width * .62 - bWidth - 1, 39 - (bHeight / 2) - this.butsY, bWidth, bHeight);
                    tempScale = (canvas.width * .2 - 25) * Math.min((ground.aRoad[0].id / raceLength), 1);
                    var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds.uiDistBar].x;
                    var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds.uiDistBar].y;
                    var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds.uiDistBar].width;
                    var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.uiDistBar].height;
                    ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width * .42 + 2, 39 - (bHeight / 2) - this.butsY, tempScale + 1, bHeight);
                    var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds.uiDistCap].x;
                    var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds.uiDistCap].y;
                    var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds.uiDistCap].width;
                    var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.uiDistCap].height;
                    ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width * .42 + tempScale + 1, 39 - (bHeight / 2) - this.butsY, bWidth, bHeight);
                    if (this.startInc < 50) {
                        var tempYPos = canvas.height * .25;
                        if (canvas.width > canvas.height) {
                            tempYPos = 100;
                        }
                        ctx.fillStyle = "#FFFFFF";
                        ctx.beginPath();
                        ctx.arc(canvas.width / 2, tempYPos + 84 - this.startInc, Math.max(100 - this.startInc * 5, 0), 0, 2 * Math.PI);
                        ctx.fill();
                        ctx.fillStyle = "#7C2E16";
                        ctx.beginPath();
                        ctx.arc(canvas.width / 2, tempYPos + 84 - this.startInc, Math.max(95 - this.startInc * 5, 0), 0, 2 * Math.PI);
                        ctx.fill();
                        ctx.fillStyle = "#FF6C00";
                        ctx.beginPath();
                        ctx.arc(canvas.width / 2, tempYPos + 84 - this.startInc, Math.max(90 - this.startInc * 5, 0), 0, 2 * Math.PI);
                        ctx.fill();
                        var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds.raceFlag0].x;
                        var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds.raceFlag0].y;
                        var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds.raceFlag0].width;
                        var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.raceFlag0].height;
                        ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - 50 - bWidth - this.startInc, tempYPos, bWidth, bHeight);
                        var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds.raceFlag1].x;
                        var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds.raceFlag1].y;
                        var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds.raceFlag1].width;
                        var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.raceFlag1].height;
                        ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 + 50 + this.startInc, tempYPos, bWidth, bHeight);
                        var imgX = (this.startNum * this.oNumbers1ImgData.oData.spriteWidth) % this.oNumbers1ImgData.img.width;
                        var imgY = Math.floor(this.startNum / (this.oNumbers1ImgData.img.width / this.oNumbers1ImgData.oData.spriteWidth)) * this.oNumbers1ImgData.oData.spriteHeight;
                        tempScale = 1.3;
                        ctx.drawImage(this.oNumbers1ImgData.img, imgX, imgY, this.oNumbers1ImgData.oData.spriteWidth, this.oNumbers1ImgData.oData.spriteHeight, canvas.width / 2 - (this.oNumbers1ImgData.oData.spriteWidth / 2) * tempScale, tempYPos + 20 - this.startInc, this.oNumbers1ImgData.oData.spriteWidth * tempScale, this.oNumbers1ImgData.oData.spriteHeight * tempScale);
                    }
                    if (this.tutInc < 100) {
                        var tempType = "B";
                        if (isMobile) {
                            tempType = "A";
                        }
                        var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["tut" + tempType + Math.floor(this.incY * .1) % 2]].x;
                        var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["tut" + tempType + Math.floor(this.incY * .1) % 2]].y;
                        var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["tut" + tempType + Math.floor(this.incY * .1) % 2]].width;
                        var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["tut" + tempType + Math.floor(this.incY * .1) % 2]].height;
                        ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width - bWidth + this.tutInc, canvas.height - bHeight - 100, bWidth, bHeight);
                    }
                    if (this.endInc < 500) {
                        var tempYPos = canvas.height * .25;
                        if (canvas.width > canvas.height) {
                            tempYPos = 100;
                        }
                        ctx.fillStyle = "#FFFFFF";
                        ctx.beginPath();
                        ctx.arc(canvas.width / 2, tempYPos + 84 - this.endInc, Math.max(100 - this.endInc * 5, 0), 0, 2 * Math.PI);
                        ctx.fill();
                        ctx.fillStyle = "#7C2E16";
                        ctx.beginPath();
                        ctx.arc(canvas.width / 2, tempYPos + 84 - this.endInc, Math.max(95 - this.endInc * 5, 0), 0, 2 * Math.PI);
                        ctx.fill();
                        ctx.fillStyle = "#FF6C00";
                        ctx.beginPath();
                        ctx.arc(canvas.width / 2, tempYPos + 84 - this.endInc, Math.max(90 - this.endInc * 5, 0), 0, 2 * Math.PI);
                        ctx.fill();
                        var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds.raceFlag0].x;
                        var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds.raceFlag0].y;
                        var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds.raceFlag0].width;
                        var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.raceFlag0].height;
                        ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - 15 - bWidth - this.endInc - Math.sin(this.incY * .5) * 20, tempYPos - Math.sin(this.incY) * 10, bWidth, bHeight);
                        var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds.raceFlag1].x;
                        var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds.raceFlag1].y;
                        var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds.raceFlag1].width;
                        var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.raceFlag1].height;
                        ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 + 15 + this.endInc + Math.sin(this.incY * .5) * 20, tempYPos + Math.sin(this.incY) * 10, bWidth, bHeight);
                    }
                    break;
                case "pause":
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.jaggedFrame].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.jaggedFrame].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.jaggedFrame].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.jaggedFrame].height;
                    var tempScale = 1 + (Math.sin(this.incY * .5) * .1 + .1);
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, 0 - ((canvas.width * tempScale) - canvas.width) * .5, 0 - ((canvas.height * tempScale) - canvas.height) * .5, canvas.width * tempScale, canvas.height * tempScale);
                    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    var tempMidY = canvas.height * .35;
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar0"]].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar0"]].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar0"]].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar0"]].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, -this.charY + Math.abs(Math.sin(this.incY * .3) * 20) - 20, tempMidY - bHeight / 2 - 150, bWidth, bHeight);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar1"]].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar1"]].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar1"]].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar1"]].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, -this.charY * .5 + Math.abs(Math.sin(this.incY * .28 + 1) * 20) - 20, tempMidY - bHeight / 2, bWidth, bHeight);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar3"]].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar3"]].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar3"]].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar3"]].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, -this.charY + Math.abs(Math.sin(this.incY * .26 + 2) * 20) - 20, tempMidY - bHeight / 2 + 100, bWidth, bHeight);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar2"]].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar2"]].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar2"]].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar2"]].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, -this.charY * 2 + Math.abs(Math.sin(this.incY * .24 + 3) * 20) - 20, tempMidY - bHeight / 2 - 30, bWidth, bHeight);
                    tempMidY = canvas.height * .75;
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar5"]].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar5"]].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar5"]].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar5"]].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width - bWidth + this.charY * .5 - Math.abs(Math.sin(this.incY * .3) * 20) + 20, tempMidY - bHeight / 2, bWidth, bHeight);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar4"]].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar4"]].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar4"]].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar4"]].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width - bWidth + this.charY - Math.abs(Math.sin(this.incY * .28 + 1) * 20) + 20, tempMidY - bHeight / 2 - 135, bWidth, bHeight);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar6"]].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar6"]].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar6"]].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar6"]].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width - bWidth + this.charY * 2 - Math.abs(Math.sin(this.incY * .26 + 2) * 20) + 20, tempMidY - bHeight / 2 - 20, bWidth, bHeight);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar7"]].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar7"]].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar7"]].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar7"]].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width - bWidth + this.charY - Math.abs(Math.sin(this.incY * .24 + 3) * 20) + 20, tempMidY - bHeight / 2 + 90, bWidth, bHeight);
                    this.addTextBar(canvas.width / 2 - 100 - 75, canvas.height * .5 + 73 + this.butsY, 150, 36, "#FF5500");
                    addText(0, 23, 160, "center", canvas.width / 2 - 100, canvas.height * .5 + 97 + this.butsY, "continue", "#FFFFFF");
                    this.addTextBar(canvas.width / 2 + 100 - 75, canvas.height * .5 + 73 + this.butsY, 150, 36, "#4C6DFF");
                    if (gameType == 0) {
                        addText(0, 23, 160, "center", canvas.width / 2 + 100, canvas.height * .5 + 97 + this.butsY, "quitTournament", "#FFFFFF");
                    }
                    else {
                        addText(0, 23, 160, "center", canvas.width / 2 + 100, canvas.height * .5 + 97 + this.butsY, "quitChallenge", "#FFFFFF");
                    }
                    break;
                case "gameIntro":
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.jaggedFrame].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.jaggedFrame].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.jaggedFrame].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.jaggedFrame].height;
                    var tempScale = 1 + (Math.sin(this.incY * .5) * .1 + .1);
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, 0 - ((canvas.width * tempScale) - canvas.width) * .5, 0 - ((canvas.height * tempScale) - canvas.height) * .5, canvas.width * tempScale, canvas.height * tempScale);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.screenTitlePanel1].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.screenTitlePanel1].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.screenTitlePanel1].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.screenTitlePanel1].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, 5, 1 - this.butsY, bWidth, bHeight);
                    if (saveDataHandler.getCash() >= aUpgradeData[0].aCost[0] && !saveDataHandler.anyUpgradeBought(curChar)) {
                        this.addTextBar(canvas.width - 575 - 75, canvas.height - 89 + this.butsY, 150, 36, "#4F8CD0");
                        addText(0, 23, 160, "center", canvas.width - 575, canvas.height - 89 + 24 + this.butsY, "upgrades", "#FFFFFF");
                        var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.soloPointer].x;
                        var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.soloPointer].y;
                        var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.soloPointer].width;
                        var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.soloPointer].height;
                        ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width - 480 + Math.sin(this.incY * .7) * 10, canvas.height - 100 + this.butsY, bWidth, bHeight);
                    }
                    addText(2, 40, 290, "left", 35, 52 - this.butsY, "raceTitle" + raceNum, "#FFFFFF");
                    addDirectText(2, 40, 60, "right", 400, 52 - this.butsY, (raceNum + 1) + "/5", "#FFFFFF");
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.uiCoin0].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.uiCoin0].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.uiCoin0].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.uiCoin0].height;
                    var tempScale = .6;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width * .72 - bWidth * tempScale + this.cashInc, 39 - (bHeight / 2) * tempScale - this.butsY, bWidth * tempScale, bHeight * tempScale);
                    var tempCash = saveDataHandler.getCash().toString();
                    while (tempCash.length < 3) {
                        tempCash = "0" + tempCash;
                    }
                    for (var i = 0; i < tempCash.length; i++) {
                        var id = parseFloat(tempCash.charAt(i));
                        var imgX = (id * this.oNumbers0ImgData.oData.spriteWidth) % this.oNumbers0ImgData.img.width;
                        var imgY = Math.floor(id / (this.oNumbers0ImgData.img.width / this.oNumbers0ImgData.oData.spriteWidth)) * this.oNumbers0ImgData.oData.spriteHeight;
                        tempScale = Math.min(((canvas.width - 100) - (canvas.width * .72)) / (this.numberSpace * tempCash.length), .6);
                        ctx.drawImage(this.oNumbers0ImgData.img, imgX, imgY, this.oNumbers0ImgData.oData.spriteWidth, this.oNumbers0ImgData.oData.spriteHeight, canvas.width * .72 + i * this.numberSpace * tempScale + this.cashInc, 39 - this.butsY - (this.oNumbers0ImgData.oData.spriteHeight / 2) * tempScale, this.oNumbers0ImgData.oData.spriteWidth * tempScale, this.oNumbers0ImgData.oData.spriteHeight * tempScale);
                    }
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.map].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.map].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.map].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.map].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width * .5 - bWidth / 2 - this.posY, canvas.height * .45 - bHeight / 2, bWidth, bHeight);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + curChar]].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + curChar]].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + curChar]].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + curChar]].height;
                    tempScale = .7;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width * .5 - 258 - this.posY, canvas.height * .45 + 241 - bHeight * tempScale, bWidth * tempScale, bHeight * tempScale);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.mapSpeech].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.mapSpeech].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.mapSpeech].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.mapSpeech].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width * .5 - 120 - this.posY, canvas.height * .45 + 179, bWidth, bHeight);
                    addText(2, 30, 300, "left", canvas.width * .5 - 75 - this.posY, canvas.height * .45 + 213, "raceIntro" + raceNum, "#FFFFFF");
                    var tempCrossId = Math.floor(this.incY * .5) % 2;
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["mapCross" + tempCrossId]].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["mapCross" + tempCrossId]].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["mapCross" + tempCrossId]].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["mapCross" + tempCrossId]].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width * .5 - bWidth / 2 + this.aMapPoints[raceNum][0] - this.posY, canvas.height * .45 - bHeight / 2 + +this.aMapPoints[raceNum][1], bWidth, bHeight);
                    for (var i = 0; i < raceNum; i++) {
                        var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.mapRaceCompletePanel].x;
                        var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.mapRaceCompletePanel].y;
                        var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.mapRaceCompletePanel].width;
                        var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.mapRaceCompletePanel].height;
                        ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width * .5 - bWidth / 2 + this.aMapPoints[i][0] - this.posY, canvas.height * .45 - bHeight / 2 + +this.aMapPoints[i][1], bWidth, bHeight);
                        addText(1, 30, 45, "center", canvas.width * .5 - bWidth / 2 + this.aMapPoints[i][0] - this.posY + 40, canvas.height * .45 - bHeight / 2 + +this.aMapPoints[i][1] + 34, "pos" + aUserRaceResults[i], "#FFFFFF");
                    }
                    break;
                case "raceSelect":
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.jaggedFrame].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.jaggedFrame].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.jaggedFrame].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.jaggedFrame].height;
                    var tempScale = 1 + (Math.sin(this.incY * .5) * .1 + .1);
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, 0 - ((canvas.width * tempScale) - canvas.width) * .5, 0 - ((canvas.height * tempScale) - canvas.height) * .5, canvas.width * tempScale, canvas.height * tempScale);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.screenTitlePanel1].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.screenTitlePanel1].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.screenTitlePanel1].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.screenTitlePanel1].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, 5, 1 - this.butsY, bWidth, bHeight);
                    addText(2, 40, 290, "left", 35, 52 - this.butsY, "selectRace", "#FFFFFF");
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.uiCoin0].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.uiCoin0].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.uiCoin0].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.uiCoin0].height;
                    var tempScale = .6;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width * .72 - bWidth * tempScale + this.cashInc, 39 - (bHeight / 2) * tempScale - this.butsY, bWidth * tempScale, bHeight * tempScale);
                    var tempCash = saveDataHandler.getCash().toString();
                    while (tempCash.length < 3) {
                        tempCash = "0" + tempCash;
                    }
                    for (var i = 0; i < tempCash.length; i++) {
                        var id = parseFloat(tempCash.charAt(i));
                        var imgX = (id * this.oNumbers0ImgData.oData.spriteWidth) % this.oNumbers0ImgData.img.width;
                        var imgY = Math.floor(id / (this.oNumbers0ImgData.img.width / this.oNumbers0ImgData.oData.spriteWidth)) * this.oNumbers0ImgData.oData.spriteHeight;
                        tempScale = Math.min(((canvas.width - 100) - (canvas.width * .72)) / (this.numberSpace * tempCash.length), .6);
                        ctx.drawImage(this.oNumbers0ImgData.img, imgX, imgY, this.oNumbers0ImgData.oData.spriteWidth, this.oNumbers0ImgData.oData.spriteHeight, canvas.width * .72 + i * this.numberSpace * tempScale + this.cashInc, 39 - this.butsY - (this.oNumbers0ImgData.oData.spriteHeight / 2) * tempScale, this.oNumbers0ImgData.oData.spriteWidth * tempScale, this.oNumbers0ImgData.oData.spriteHeight * tempScale);
                    }
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.map].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.map].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.map].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.map].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width * .5 - bWidth / 2 - this.posY, canvas.height * .45 - bHeight / 2, bWidth, bHeight);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + curChar]].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + curChar]].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + curChar]].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + curChar]].height;
                    tempScale = .7;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width * .5 - 258 - this.posY, canvas.height * .45 + 241 - bHeight * tempScale, bWidth * tempScale, bHeight * tempScale);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.mapSpeech].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.mapSpeech].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.mapSpeech].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.mapSpeech].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width * .5 - 120 - this.posY, canvas.height * .45 + 179, bWidth, bHeight);
                    if (raceSelected != -1) {
                        var tempCrossId = Math.floor(this.incY * .5) % 2;
                        var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["mapCross" + tempCrossId]].x;
                        var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["mapCross" + tempCrossId]].y;
                        var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["mapCross" + tempCrossId]].width;
                        var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["mapCross" + tempCrossId]].height;
                        ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width * .5 - bWidth / 2 + this.aMapPoints[raceSelected][0] - this.posY, canvas.height * .45 - bHeight / 2 + +this.aMapPoints[raceSelected][1], bWidth, bHeight);
                    }
                    if (raceSelected == -1) {
                        addText(2, 30, 300, "left", canvas.width * .5 - 75 - this.posY, canvas.height * .45 + 213, "chooseLocation", "#FFFFFF");
                    }
                    else {
                        addText(2, 30, 300, "left", canvas.width * .5 - 75 - this.posY, canvas.height * .45 + 213, "raceTitle" + raceNum, "#FFFFFF");
                    }
                    break;
                case "gameEnd0":
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.jaggedFrame].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.jaggedFrame].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.jaggedFrame].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.jaggedFrame].height;
                    var tempScale = 1 + (Math.sin(this.incY * .5) * .1 + .1);
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, 0 - ((canvas.width * tempScale) - canvas.width) * .5, 0 - ((canvas.height * tempScale) - canvas.height) * .5, canvas.width * tempScale, canvas.height * tempScale);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.screenTitlePanel0].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.screenTitlePanel0].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.screenTitlePanel0].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.screenTitlePanel0].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, 5, 1 - this.butsY, bWidth, bHeight);
                    addText(2, 40, 290, "left", 35, 52 - this.butsY, "raceComplete", "#FFFFFF");
                    addDirectText(2, 40, 60, "right", 400, 52 - this.butsY, (raceNum + 1) + "/5", "#FFFFFF");
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.uiCoin0].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.uiCoin0].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.uiCoin0].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.uiCoin0].height;
                    var tempScale = .6;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width * .72 - bWidth * tempScale + this.cashInc, 39 - (bHeight / 2) * tempScale - this.butsY, bWidth * tempScale, bHeight * tempScale);
                    var tempCash = saveDataHandler.getCash().toString();
                    while (tempCash.length < 3) {
                        tempCash = "0" + tempCash;
                    }
                    for (var i = 0; i < tempCash.length; i++) {
                        var id = parseFloat(tempCash.charAt(i));
                        var imgX = (id * this.oNumbers0ImgData.oData.spriteWidth) % this.oNumbers0ImgData.img.width;
                        var imgY = Math.floor(id / (this.oNumbers0ImgData.img.width / this.oNumbers0ImgData.oData.spriteWidth)) * this.oNumbers0ImgData.oData.spriteHeight;
                        tempScale = Math.min(((canvas.width - 100) - (canvas.width * .72)) / (this.numberSpace * tempCash.length), .6);
                        ctx.drawImage(this.oNumbers0ImgData.img, imgX, imgY, this.oNumbers0ImgData.oData.spriteWidth, this.oNumbers0ImgData.oData.spriteHeight, canvas.width * .72 + i * this.numberSpace * tempScale + this.cashInc, 39 - this.butsY - (this.oNumbers0ImgData.oData.spriteHeight / 2) * tempScale, this.oNumbers0ImgData.oData.spriteWidth * tempScale, this.oNumbers0ImgData.oData.spriteHeight * tempScale);
                    }
                    var tempScale1;
                    var aPosData;
                    var tempCharScale;
                    if (canvas.width < canvas.height) {
                        tempScale1 = Math.min((canvas.height - (canvas.height * .18 + 340)) / this.oUiElementsImgData.oData.oAtlasData[oImageIds.endPanel2].height, 1);
                        aPosData = [
                            { x: canvas.width / 2 + this.aScreenIncs[0], y: canvas.height * .18 + 100 },
                            { x: canvas.width / 2 - 150 - this.aScreenIncs[1], y: canvas.height * .18 + 230 },
                            { x: canvas.width / 2 + 180 + this.aScreenIncs[2], y: canvas.height * .18 + 220 },
                            { x: canvas.width / 2 - this.aScreenIncs[3], y: canvas.height * .18 + 330 },
                            { x: canvas.width / 2 + 10 * tempScale1, y: Math.max(canvas.height * .5, canvas.height * .18 + 335) + this.aScreenIncs[4] },
                        ];
                    }
                    else {
                        tempScale1 = 1;
                        aPosData = [
                            { x: canvas.width * .3 - this.aScreenIncs[0] - 20, y: canvas.height * .2 + 100 },
                            { x: canvas.width * .3 - this.aScreenIncs[1] + 38 - 20, y: canvas.height * .2 + 227 },
                            { x: canvas.width * .3 - this.aScreenIncs[2] + 58 - 20, y: canvas.height * .2 + 339 },
                            { x: canvas.width * .3 - this.aScreenIncs[3] + 68 - 20, y: canvas.height * .2 + 430 },
                            { x: Math.max(canvas.width * .7 + this.aScreenIncs[4], canvas.width * .3 + 370), y: canvas.height * .2 },
                        ];
                    }
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endPanel0A].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endPanel0A].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endPanel0A].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endPanel0A].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, aPosData[0].x - bWidth / 2, aPosData[0].y - bHeight, bWidth, bHeight);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + aRacePositions[0].charId]].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + aRacePositions[0].charId]].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + aRacePositions[0].charId]].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + aRacePositions[0].charId]].height;
                    tempCharScale = .61;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, aPosData[0].x - 211, aPosData[0].y - bHeight * tempCharScale - 9, bWidth * tempCharScale, bHeight * tempCharScale);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endCup0].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endCup0].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endCup0].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endCup0].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, aPosData[0].x - 37 + Math.sin(this.incY) * 2, aPosData[0].y - 142, bWidth, bHeight);
                    addText(2, 35, 180, "center", aPosData[0].x + 50, aPosData[0].y - 33, "char" + aRacePositions[0].charId, "#4F8CD0");
                    addText(1, 70, 100, "left", aPosData[0].x + 45, aPosData[0].y - 85, "pos0", "#FFFFFF");
                    tempScale = .8;
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endPanel0A].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endPanel0A].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endPanel0A].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endPanel0A].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, aPosData[1].x - bWidth / 2 * tempScale, aPosData[1].y - bHeight * tempScale, bWidth * tempScale, bHeight * tempScale);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + aRacePositions[1].charId]].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + aRacePositions[1].charId]].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + aRacePositions[1].charId]].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + aRacePositions[1].charId]].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, aPosData[1].x - 211 * tempScale, aPosData[1].y - bHeight * tempCharScale * tempScale - 9 * tempScale, bWidth * tempCharScale * tempScale, bHeight * tempCharScale * tempScale);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endCup1].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endCup1].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endCup1].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endCup1].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, aPosData[1].x - 37 * tempScale + Math.sin(this.incY + 1) * 2, aPosData[1].y - 142 * tempScale, bWidth * tempScale, bHeight * tempScale);
                    addText(2, 35 * tempScale, 180 * tempScale, "center", aPosData[1].x + 50 * tempScale, aPosData[1].y - 33 * tempScale, "char" + aRacePositions[1].charId, "#4F8CD0");
                    addText(1, 70 * tempScale, 100 * tempScale, "left", aPosData[1].x + 45 * tempScale, aPosData[1].y - 85 * tempScale, "pos1", "#FFFFFF");
                    tempScale = .7;
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endPanel0A].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endPanel0A].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endPanel0A].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endPanel0A].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, aPosData[2].x - bWidth / 2 * tempScale, aPosData[2].y - bHeight * tempScale, bWidth * tempScale, bHeight * tempScale);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + aRacePositions[2].charId]].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + aRacePositions[2].charId]].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + aRacePositions[2].charId]].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + aRacePositions[2].charId]].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, aPosData[2].x - 211 * tempScale, aPosData[2].y - bHeight * tempCharScale * tempScale - 9 * tempScale, bWidth * tempCharScale * tempScale, bHeight * tempCharScale * tempScale);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endCup2].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endCup2].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endCup2].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endCup2].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, aPosData[2].x - 37 * tempScale + Math.sin(this.incY + 2) * 2, aPosData[2].y - 142 * tempScale, bWidth * tempScale, bHeight * tempScale);
                    addText(2, 35 * tempScale, 180 * tempScale, "center", aPosData[2].x + 50 * tempScale, aPosData[2].y - 33 * tempScale, "char" + aRacePositions[2].charId, "#4F8CD0");
                    addText(1, 70 * tempScale, 100 * tempScale, "left", aPosData[2].x + 45 * tempScale, aPosData[2].y - 85 * tempScale, "pos2", "#FFFFFF");
                    var tempYOffset = 0;
                    if (userCharPos > 2) {
                        tempScale = .65;
                        var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endPanel1].x;
                        var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endPanel1].y;
                        var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endPanel1].width;
                        var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endPanel1].height;
                        ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, aPosData[3].x - bWidth / 2, aPosData[3].y - bHeight, bWidth, bHeight);
                        var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + aRacePositions[userCharPos].charId]].x;
                        var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + aRacePositions[userCharPos].charId]].y;
                        var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + aRacePositions[userCharPos].charId]].width;
                        var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + aRacePositions[userCharPos].charId]].height;
                        ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, aPosData[3].x - 200 * tempScale, aPosData[3].y - bHeight * tempCharScale * tempScale - 0 * tempScale, bWidth * tempCharScale * tempScale, bHeight * tempCharScale * tempScale);
                        addText(2, 35 * tempScale, 180 * tempScale, "center", aPosData[3].x + 50 * tempScale, aPosData[3].y - 25 * tempScale, "char" + aRacePositions[userCharPos].charId, "#FFFFFF");
                        addText(1, 55 * tempScale, 100 * tempScale, "center", aPosData[3].x + 45 * tempScale, aPosData[3].y - 70 * tempScale, "pos" + userCharPos, "#4F8CD0");
                    }
                    else if (canvas.height > canvas.width) {
                        tempYOffset = -100;
                    }
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endPanel2].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endPanel2].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endPanel2].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endPanel2].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, aPosData[4].x - (bWidth / 2) * tempScale1, aPosData[4].y + tempYOffset, bWidth * tempScale1, bHeight * tempScale1);
                    addText(1, 42 * tempScale1, 230, "center", aPosData[4].x - 10 * tempScale1, aPosData[4].y + 67 * tempScale1 + tempYOffset, "leaderboard", "#FFFFFF");
                    var tempHadChar = false;
                    for (var i = 0; i < 6; i++) {
                        var tempIndex;
                        if (aLeaderboard[i].charId == curChar || (i == 5 && !tempHadChar)) {
                            tempIndex = null;
                            for (var j = 0; j < 6; j++) {
                                if (aRacePositions[j].charId == curChar) {
                                    tempIndex = j;
                                    break;
                                }
                            }
                            var tempIndex1;
                            for (var j = 0; j < aLeaderboard.length; j++) {
                                if (aLeaderboard[j].charId == curChar) {
                                    tempIndex1 = j;
                                    break;
                                }
                            }
                            ctx.fillStyle = "#FFFFFF";
                            ctx.fillRect(aPosData[4].x - 164 * tempScale1, aPosData[4].y + (107 + 38 * i) * tempScale1 + tempYOffset, 307 * tempScale1, 37 * tempScale1);
                            addDirectText(1, 32 * tempScale1, 50, "center", aPosData[4].x - 135 * tempScale1, aPosData[4].y + (135 + 38 * i) * tempScale1 + tempYOffset, (tempIndex1 + 1).toString(), "#4484CB");
                            addText(0, 24 * tempScale1, 150, "left", aPosData[4].x - 110 * tempScale1, aPosData[4].y + (135 + 38 * i) * tempScale1 - 2 * tempScale1 + tempYOffset, "char" + curChar, "#4484CB");
                            addDirectText(1, 32 * tempScale1, 50, "center", aPosData[4].x + 60 * tempScale1, aPosData[4].y + (135 + 38 * i) * tempScale1 + tempYOffset, aLeaderboard[tempIndex1].score.toString(), "#4484CB");
                            if (tempIndex != null) {
                                addDirectText(1, 25 * tempScale1, 50, "left", aPosData[4].x + 100 * tempScale1, aPosData[4].y + (135 + 38 * i) * tempScale1 - 6 * tempScale1 + tempYOffset, "+" + aPosPoints[tempIndex], "#FF5500");
                            }
                            tempHadChar = true;
                        }
                        else if (aLeaderboard[i].charId != curChar) {
                            tempIndex = null;
                            for (var j = 0; j < 6; j++) {
                                if (aRacePositions[j].charId == aLeaderboard[i].charId) {
                                    tempIndex = j;
                                    break;
                                }
                            }
                            addDirectText(1, 32 * tempScale1, 50, "center", aPosData[4].x - 135 * tempScale1, aPosData[4].y + (135 + 38 * i) * tempScale1 + tempYOffset, (i + 1).toString(), "#FFFFFF");
                            addText(0, 24 * tempScale1, 150, "left", aPosData[4].x - 110 * tempScale1, aPosData[4].y + (135 + 38 * i) * tempScale1 - 2 * tempScale1 + tempYOffset, "char" + aLeaderboard[i].charId, "#FFFFFF");
                            addDirectText(1, 32 * tempScale1, 50, "center", aPosData[4].x + 60 * tempScale1, aPosData[4].y + (135 + 38 * i) * tempScale1 + tempYOffset, aLeaderboard[i].score.toString(), "#FFFFFF");
                            if (tempIndex != null) {
                                addDirectText(1, 25 * tempScale1, 50, "left", aPosData[4].x + 100 * tempScale1, aPosData[4].y + (135 + 38 * i) * tempScale1 - 6 * tempScale1 + tempYOffset, "+" + aPosPoints[tempIndex], "#FFE230");
                            }
                        }
                    }
                    break;
                case "gameEnd1":
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.jaggedFrame].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.jaggedFrame].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.jaggedFrame].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.jaggedFrame].height;
                    var tempScale = 1 + (Math.sin(this.incY * .5) * .1 + .1);
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, 0 - ((canvas.width * tempScale) - canvas.width) * .5, 0 - ((canvas.height * tempScale) - canvas.height) * .5, canvas.width * tempScale, canvas.height * tempScale);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.screenTitlePanel0].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.screenTitlePanel0].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.screenTitlePanel0].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.screenTitlePanel0].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, 5, 1 - this.butsY, bWidth, bHeight);
                    addText(2, 40, 290, "left", 35, 52 - this.butsY, "raceComplete", "#FFFFFF");
                    if (saveDataHandler.getCash() >= aUpgradeData[0].aCost[0] && !saveDataHandler.anyUpgradeBought(curChar)) {
                        this.addTextBar(canvas.width - 575 - 75, canvas.height - 89 - 30 + this.butsY, 150, 36, "#4F8CD0");
                        addText(0, 23, 160, "center", canvas.width - 575, canvas.height - 89 + 24 - 30 + this.butsY, "upgrades", "#FFFFFF");
                        var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.soloPointer].x;
                        var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.soloPointer].y;
                        var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.soloPointer].width;
                        var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.soloPointer].height;
                        ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width - 480 + Math.sin(this.incY * .7) * 10, canvas.height - 100 - 30 + this.butsY, bWidth, bHeight);
                    }
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.uiCoin0].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.uiCoin0].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.uiCoin0].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.uiCoin0].height;
                    var tempScale = .6;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width * .72 - bWidth * tempScale + this.cashInc, 39 - (bHeight / 2) * tempScale - this.butsY, bWidth * tempScale, bHeight * tempScale);
                    var tempCash = saveDataHandler.getCash().toString();
                    while (tempCash.length < 3) {
                        tempCash = "0" + tempCash;
                    }
                    for (var i = 0; i < tempCash.length; i++) {
                        var id = parseFloat(tempCash.charAt(i));
                        var imgX = (id * this.oNumbers0ImgData.oData.spriteWidth) % this.oNumbers0ImgData.img.width;
                        var imgY = Math.floor(id / (this.oNumbers0ImgData.img.width / this.oNumbers0ImgData.oData.spriteWidth)) * this.oNumbers0ImgData.oData.spriteHeight;
                        tempScale = Math.min(((canvas.width - 100) - (canvas.width * .72)) / (this.numberSpace * tempCash.length), .6);
                        ctx.drawImage(this.oNumbers0ImgData.img, imgX, imgY, this.oNumbers0ImgData.oData.spriteWidth, this.oNumbers0ImgData.oData.spriteHeight, canvas.width * .72 + i * this.numberSpace * tempScale + this.cashInc, 39 - this.butsY - (this.oNumbers0ImgData.oData.spriteHeight / 2) * tempScale, this.oNumbers0ImgData.oData.spriteWidth * tempScale, this.oNumbers0ImgData.oData.spriteHeight * tempScale);
                    }
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.makeChallengeBg].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.makeChallengeBg].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.makeChallengeBg].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.makeChallengeBg].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2, canvas.height * .45 - bHeight / 2 + this.butsY, bWidth, bHeight);
                    if (challengeTime == -1) {
                        this.addTimeNumbers(raceTime, canvas.width * .5 - 149, canvas.height * .45 - 95 + this.butsY, .9);
                        addText(1, 40, 390, "center", canvas.width / 2, canvas.height * .45 - 155 + this.butsY, "challengeFriend", "#FFFFFF");
                        addText(0, 25, 390, "center", canvas.width / 2, canvas.height * .45 - 110 + this.butsY, "raceTime", "#FFFFFF");
                        addText(0, 25, 390, "center", canvas.width / 2, canvas.height * .45 + 20 + this.butsY, "shareLink", "#FFFFFF");
                        if (this.copySuccess == 0) {
                            addText(0, 25, 390, "center", canvas.width / 2, canvas.height * .45 + 174 + this.butsY, "canBeat", "#FFFFFF");
                        }
                        else if (this.copySuccess == 1) {
                            addText(0, 25, 390, "center", canvas.width / 2, canvas.height * .45 + 174 + this.butsY, "linkCopySuccess", "#FFFFFF");
                        }
                        else {
                            addText(0, 25, 390, "center", canvas.width / 2, canvas.height * .45 + 174 + this.butsY, "linkCopyFail", "#FFFFFF");
                        }
                    }
                    else if (raceTime > challengeTime) {
                        this.addTimeNumbers(challengeTime, canvas.width * .5 - 183, canvas.height * .45 - 102 + this.butsY, .75);
                        this.addTimeNumbers(raceTime, canvas.width * .5 - 54, canvas.height * .45 + 45 + this.butsY, .6);
                        var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.orangeCharBg0].x;
                        var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.orangeCharBg0].y;
                        var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.orangeCharBg0].width;
                        var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.orangeCharBg0].height;
                        ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2 + 125, canvas.height * .45 - bHeight / 2 - 70 + this.butsY, bWidth, bHeight);
                        var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.orangeCharBg1].x;
                        var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.orangeCharBg1].y;
                        var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.orangeCharBg1].width;
                        var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.orangeCharBg1].height;
                        ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2 - 125, canvas.height * .45 - bHeight / 2 + 65 + this.butsY, bWidth, bHeight);
                        var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + challengeChar]].x;
                        var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + challengeChar]].y;
                        var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + challengeChar]].width;
                        var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + challengeChar]].height;
                        ctx.save();
                        ctx.translate(canvas.width / 2 + 183, canvas.height * .45 - 11 + this.butsY);
                        ctx.scale(-.5, .5);
                        ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, 0, -bHeight, bWidth, bHeight);
                        ctx.restore();
                        var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + curChar]].x;
                        var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + curChar]].y;
                        var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + curChar]].width;
                        var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + curChar]].height;
                        tempCharScale = .5;
                        ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - 185, canvas.height * .45 - bHeight * tempCharScale + this.butsY + 125, bWidth * tempCharScale, bHeight * tempCharScale);
                        addText(1, 40, 390, "center", canvas.width / 2, canvas.height * .45 - 155 + this.butsY, "youLost", "#FFFFFF");
                        addText(0, 20, 250, "right", canvas.width / 2 + 50, canvas.height * .45 - 110 + this.butsY, "friendsRaceTime", "#FFFFFF");
                        addText(0, 20, 250, "left", canvas.width / 2 - 50, canvas.height * .45 + 38 + this.butsY, "yourRaceTime", "#FFFFFF");
                        addText(1, 40, 390, "center", canvas.width / 2, canvas.height * .45 + 170 + this.butsY, "tryAgain", "#FFFFFF");
                    }
                    else {
                        this.addTimeNumbers(raceTime, canvas.width * .5 - 55, canvas.height * .45 - 102 + this.butsY, .75);
                        this.addTimeNumbers(challengeTime, canvas.width * .5 - 135, canvas.height * .45 + 110 + this.butsY, .6);
                        var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.orangeCharBg1].x;
                        var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.orangeCharBg1].y;
                        var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.orangeCharBg1].width;
                        var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.orangeCharBg1].height;
                        ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2 - 125, canvas.height * .45 - bHeight / 2 - 70 + this.butsY, bWidth, bHeight);
                        var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.orangeCharBg0].x;
                        var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.orangeCharBg0].y;
                        var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.orangeCharBg0].width;
                        var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.orangeCharBg0].height;
                        ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2 + 125, canvas.height * .45 - bHeight / 2 + 125 + this.butsY, bWidth, bHeight);
                        var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + curChar]].x;
                        var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + curChar]].y;
                        var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + curChar]].width;
                        var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + curChar]].height;
                        tempCharScale = .5;
                        ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - 185, canvas.height * .45 - bHeight * tempCharScale + this.butsY - 10, bWidth * tempCharScale, bHeight * tempCharScale);
                        var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + challengeChar]].x;
                        var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + challengeChar]].y;
                        var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + challengeChar]].width;
                        var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + challengeChar]].height;
                        ctx.save();
                        ctx.translate(canvas.width / 2 + 183, canvas.height * .45 + 184 + this.butsY);
                        ctx.scale(-.5, .5);
                        ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, 0, -bHeight, bWidth, bHeight);
                        ctx.restore();
                        addText(1, 40, 390, "center", canvas.width / 2, canvas.height * .45 - 155 + this.butsY, "youWon", "#FFFFFF");
                        addText(0, 20, 250, "left", canvas.width / 2 - 55, canvas.height * .45 - 110 + this.butsY, "yourRaceTime", "#FFFFFF");
                        addText(0, 20, 250, "right", canvas.width / 2 + 55, canvas.height * .45 + 100 + this.butsY, "friendsRaceTime", "#FFFFFF");
                        addText(1, 50, 390, "center", canvas.width / 2, canvas.height * .45 + 40 + this.butsY, "congratulations", "#FFFFFF");
                    }
                    break;
                case "tournamentEnd":
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.jaggedFrame].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.jaggedFrame].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.jaggedFrame].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.jaggedFrame].height;
                    var tempScale = 1 + (Math.sin(this.incY * .5) * .1 + .1);
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, 0 - ((canvas.width * tempScale) - canvas.width) * .5, 0 - ((canvas.height * tempScale) - canvas.height) * .5, canvas.width * tempScale, canvas.height * tempScale);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.screenTitlePanel1].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.screenTitlePanel1].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.screenTitlePanel1].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.screenTitlePanel1].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, 5, 1 - this.butsY, bWidth, bHeight);
                    addText(2, 40, 290, "left", 35, 52 - this.butsY, "tournamentComplete", "#FFFFFF");
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.uiCoin0].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.uiCoin0].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.uiCoin0].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.uiCoin0].height;
                    var tempScale = .6;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width * .72 - bWidth * tempScale + this.cashInc, 39 - (bHeight / 2) * tempScale - this.butsY, bWidth * tempScale, bHeight * tempScale);
                    var tempCash = saveDataHandler.getCash().toString();
                    while (tempCash.length < 3) {
                        tempCash = "0" + tempCash;
                    }
                    for (var i = 0; i < tempCash.length; i++) {
                        var id = parseFloat(tempCash.charAt(i));
                        var imgX = (id * this.oNumbers0ImgData.oData.spriteWidth) % this.oNumbers0ImgData.img.width;
                        var imgY = Math.floor(id / (this.oNumbers0ImgData.img.width / this.oNumbers0ImgData.oData.spriteWidth)) * this.oNumbers0ImgData.oData.spriteHeight;
                        tempScale = Math.min(((canvas.width - 100) - (canvas.width * .72)) / (this.numberSpace * tempCash.length), .6);
                        ctx.drawImage(this.oNumbers0ImgData.img, imgX, imgY, this.oNumbers0ImgData.oData.spriteWidth, this.oNumbers0ImgData.oData.spriteHeight, canvas.width * .72 + i * this.numberSpace * tempScale + this.cashInc, 39 - this.butsY - (this.oNumbers0ImgData.oData.spriteHeight / 2) * tempScale, this.oNumbers0ImgData.oData.spriteWidth * tempScale, this.oNumbers0ImgData.oData.spriteHeight * tempScale);
                    }
                    var tempScale1;
                    var aPosData;
                    var tempCharScale;
                    if (canvas.width < canvas.height) {
                        tempScale1 = Math.min((canvas.height - (canvas.height * .18 + 340)) / this.oUiElementsImgData.oData.oAtlasData[oImageIds.endPanel2].height, 1);
                        aPosData = [
                            { x: canvas.width / 2 + this.aScreenIncs[0], y: canvas.height * .18 + 100 },
                            { x: canvas.width / 2 - 150 - this.aScreenIncs[1], y: canvas.height * .18 + 230 },
                            { x: canvas.width / 2 + 180 + this.aScreenIncs[2], y: canvas.height * .18 + 220 },
                            { x: canvas.width / 2 - this.aScreenIncs[3], y: canvas.height * .18 + 330 },
                            { x: canvas.width / 2 + 10 * tempScale1, y: Math.max(canvas.height * .5, canvas.height * .18 + 335) + this.aScreenIncs[4] },
                        ];
                    }
                    else {
                        tempScale1 = 1;
                        aPosData = [
                            { x: canvas.width * .3 - this.aScreenIncs[0] - 20, y: canvas.height * .2 + 100 },
                            { x: canvas.width * .3 - this.aScreenIncs[1] + 38 - 20, y: canvas.height * .2 + 227 },
                            { x: canvas.width * .3 - this.aScreenIncs[2] + 58 - 20, y: canvas.height * .2 + 339 },
                            { x: canvas.width * .3 - this.aScreenIncs[3] + 68 - 20, y: canvas.height * .2 + 430 },
                            { x: Math.max(canvas.width * .7 + this.aScreenIncs[4], canvas.width * .3 + 370), y: canvas.height * .2 },
                        ];
                    }
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endPanel0B].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endPanel0B].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endPanel0B].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endPanel0B].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, aPosData[0].x - bWidth / 2, aPosData[0].y - bHeight, bWidth, bHeight);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + aLeaderboard[0].charId]].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + aLeaderboard[0].charId]].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + aLeaderboard[0].charId]].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + aLeaderboard[0].charId]].height;
                    tempCharScale = .61;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, aPosData[0].x - 211, aPosData[0].y - bHeight * tempCharScale - 9, bWidth * tempCharScale, bHeight * tempCharScale);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endCup0].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endCup0].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endCup0].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endCup0].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, aPosData[0].x - 37 + Math.sin(this.incY) * 2, aPosData[0].y - 142, bWidth, bHeight);
                    addText(2, 35, 180, "center", aPosData[0].x + 50, aPosData[0].y - 33, "char" + aLeaderboard[0].charId, "#FF6900");
                    addText(1, 70, 100, "left", aPosData[0].x + 45, aPosData[0].y - 85, "pos0", "#FFFFFF");
                    tempScale = .8;
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endPanel0B].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endPanel0B].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endPanel0B].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endPanel0B].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, aPosData[1].x - bWidth / 2 * tempScale, aPosData[1].y - bHeight * tempScale, bWidth * tempScale, bHeight * tempScale);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + aLeaderboard[1].charId]].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + aLeaderboard[1].charId]].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + aLeaderboard[1].charId]].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + aLeaderboard[1].charId]].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, aPosData[1].x - 211 * tempScale, aPosData[1].y - bHeight * tempCharScale * tempScale - 9 * tempScale, bWidth * tempCharScale * tempScale, bHeight * tempCharScale * tempScale);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endCup1].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endCup1].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endCup1].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endCup1].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, aPosData[1].x - 37 * tempScale + Math.sin(this.incY + 1) * 2, aPosData[1].y - 142 * tempScale, bWidth * tempScale, bHeight * tempScale);
                    addText(2, 35 * tempScale, 180 * tempScale, "center", aPosData[1].x + 50 * tempScale, aPosData[1].y - 33 * tempScale, "char" + aLeaderboard[1].charId, "#FF6900");
                    addText(1, 70 * tempScale, 100 * tempScale, "left", aPosData[1].x + 45 * tempScale, aPosData[1].y - 85 * tempScale, "pos1", "#FFFFFF");
                    tempScale = .7;
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endPanel0B].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endPanel0B].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endPanel0B].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endPanel0B].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, aPosData[2].x - bWidth / 2 * tempScale, aPosData[2].y - bHeight * tempScale, bWidth * tempScale, bHeight * tempScale);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + aLeaderboard[2].charId]].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + aLeaderboard[2].charId]].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + aLeaderboard[2].charId]].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["charZoom" + aLeaderboard[2].charId]].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, aPosData[2].x - 211 * tempScale, aPosData[2].y - bHeight * tempCharScale * tempScale - 9 * tempScale, bWidth * tempCharScale * tempScale, bHeight * tempCharScale * tempScale);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endCup2].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endCup2].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endCup2].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endCup2].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, aPosData[2].x - 37 * tempScale + Math.sin(this.incY + 2) * 2, aPosData[2].y - 142 * tempScale, bWidth * tempScale, bHeight * tempScale);
                    addText(2, 35 * tempScale, 180 * tempScale, "center", aPosData[2].x + 50 * tempScale, aPosData[2].y - 33 * tempScale, "char" + aLeaderboard[2].charId, "#FF6900");
                    addText(1, 70 * tempScale, 100 * tempScale, "left", aPosData[2].x + 45 * tempScale, aPosData[2].y - 85 * tempScale, "pos2", "#FFFFFF");
                    var tempYOffset = 0;
                    if (canvas.height > canvas.width) {
                        tempYOffset = -100;
                    }
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endPanel2].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endPanel2].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endPanel2].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endPanel2].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, aPosData[4].x - (bWidth / 2) * tempScale1, aPosData[4].y + tempYOffset, bWidth * tempScale1, bHeight * tempScale1);
                    addText(1, 42 * tempScale1, 230, "center", aPosData[4].x - 10 * tempScale1, aPosData[4].y + 67 * tempScale1 + tempYOffset, "leaderboard", "#FFFFFF");
                    var tempHadChar = false;
                    for (var i = 0; i < 6; i++) {
                        var tempIndex;
                        if (aLeaderboard[i].charId == curChar || (i == 5 && !tempHadChar)) {
                            tempIndex = null;
                            for (var j = 0; j < 6; j++) {
                                if (aRacePositions[j].charId == curChar) {
                                    tempIndex = j;
                                    break;
                                }
                            }
                            var tempIndex1;
                            for (var j = 0; j < aLeaderboard.length; j++) {
                                if (aLeaderboard[j].charId == curChar) {
                                    tempIndex1 = j;
                                    break;
                                }
                            }
                            ctx.fillStyle = "#FFFFFF";
                            ctx.fillRect(aPosData[4].x - 164 * tempScale1, aPosData[4].y + (107 + 38 * i) * tempScale1 + tempYOffset, 307 * tempScale1, 37 * tempScale1);
                            addDirectText(1, 32 * tempScale1, 50, "center", aPosData[4].x - 135 * tempScale1, aPosData[4].y + (135 + 38 * i) * tempScale1 + tempYOffset, (tempIndex1 + 1).toString(), "#4484CB");
                            addText(0, 24 * tempScale1, 150, "left", aPosData[4].x - 110 * tempScale1, aPosData[4].y + (135 + 38 * i) * tempScale1 - 2 * tempScale1 + tempYOffset, "char" + curChar, "#4484CB");
                            addDirectText(1, 32 * tempScale1, 50, "center", aPosData[4].x + 60 * tempScale1, aPosData[4].y + (135 + 38 * i) * tempScale1 + tempYOffset, aLeaderboard[tempIndex1].score.toString(), "#4484CB");
                            tempHadChar = true;
                        }
                        else if (aLeaderboard[i].charId != curChar) {
                            tempIndex = null;
                            for (var j = 0; j < 6; j++) {
                                if (aRacePositions[j].charId == aLeaderboard[i].charId) {
                                    tempIndex = j;
                                    break;
                                }
                            }
                            addDirectText(1, 32 * tempScale1, 50, "center", aPosData[4].x - 135 * tempScale1, aPosData[4].y + (135 + 38 * i) * tempScale1 + tempYOffset, (i + 1).toString(), "#FFFFFF");
                            addText(0, 24 * tempScale1, 150, "left", aPosData[4].x - 110 * tempScale1, aPosData[4].y + (135 + 38 * i) * tempScale1 - 2 * tempScale1 + tempYOffset, "char" + aLeaderboard[i].charId, "#FFFFFF");
                            addDirectText(1, 32 * tempScale1, 50, "center", aPosData[4].x + 60 * tempScale1, aPosData[4].y + (135 + 38 * i) * tempScale1 + tempYOffset, aLeaderboard[i].score.toString(), "#FFFFFF");


                        }

                    } 
                    //  // save score to local storage
                    const  currScore = aLeaderboard.filter(i=>i.charId==curChar)
                    localStorage.setItem("skateRushScore",(currScore[0].score||0))
                    break;
            }
            if (_butsOnTop) {
                this.addButs(ctx);
            }
        };
        Panel.prototype.addTimeNumbers = function (_time, tempX, tempY, tempScale) {
            var secs = Math.floor((_time - Math.floor(_time / 6000) * 6000) / 100).toString();
            if (secs.length < 2) {
                secs = "0" + secs;
            }
            var tenths = _time.toString().charAt(_time.toString().length - 2) + _time.toString().charAt(_time.toString().length - 1);
            if (tenths.length < 2) {
                tenths = "0" + tenths;
            }
            var id;
            var mins = Math.floor(_time / 6000).toString();
            for (var i = 0; i < 2; i++) {
                id = parseFloat(mins.charAt(i));
                if (mins.length < 2) {
                    if (i == 0) {
                        continue;
                    }
                    else {
                        id = parseFloat(mins.charAt(0));
                    }
                }
                var imgX = (id * this.oNumbers0ImgData.oData.spriteWidth) % this.oNumbers0ImgData.img.width;
                var imgY = Math.floor(id / (this.oNumbers0ImgData.img.width / this.oNumbers0ImgData.oData.spriteWidth)) * this.oNumbers0ImgData.oData.spriteHeight;
                ctx.drawImage(this.oNumbers0ImgData.img, imgX, imgY, this.oNumbers0ImgData.oData.spriteWidth, this.oNumbers0ImgData.oData.spriteHeight, tempX, tempY, this.oNumbers0ImgData.oData.spriteWidth * tempScale, this.oNumbers0ImgData.oData.spriteHeight * tempScale);
            }
            id = 10;
            var imgX = (id * this.oNumbers0ImgData.oData.spriteWidth) % this.oNumbers0ImgData.img.width;
            var imgY = Math.floor(id / (this.oNumbers0ImgData.img.width / this.oNumbers0ImgData.oData.spriteWidth)) * this.oNumbers0ImgData.oData.spriteHeight;
            ctx.drawImage(this.oNumbers0ImgData.img, imgX, imgY, this.oNumbers0ImgData.oData.spriteWidth, this.oNumbers0ImgData.oData.spriteHeight, tempX + 50 * tempScale, tempY, this.oNumbers0ImgData.oData.spriteWidth * tempScale, this.oNumbers0ImgData.oData.spriteHeight * tempScale);
            for (var i = 0; i < 2; i++) {
                id = parseFloat(secs.charAt(i));
                var imgX = (id * this.oNumbers0ImgData.oData.spriteWidth) % this.oNumbers0ImgData.img.width;
                var imgY = Math.floor(id / (this.oNumbers0ImgData.img.width / this.oNumbers0ImgData.oData.spriteWidth)) * this.oNumbers0ImgData.oData.spriteHeight;
                ctx.drawImage(this.oNumbers0ImgData.img, imgX, imgY, this.oNumbers0ImgData.oData.spriteWidth, this.oNumbers0ImgData.oData.spriteHeight, tempX + 100 * tempScale + i * this.numberSpace * tempScale, tempY, this.oNumbers0ImgData.oData.spriteWidth * tempScale, this.oNumbers0ImgData.oData.spriteHeight * tempScale);
            }
            for (var i = 0; i < 2; i++) {
                id = parseFloat(tenths.charAt(i));
                var imgX = (id * this.oNumbers0ImgData.oData.spriteWidth) % this.oNumbers0ImgData.img.width;
                var imgY = Math.floor(id / (this.oNumbers0ImgData.img.width / this.oNumbers0ImgData.oData.spriteWidth)) * this.oNumbers0ImgData.oData.spriteHeight;
                ctx.drawImage(this.oNumbers0ImgData.img, imgX, imgY, this.oNumbers0ImgData.oData.spriteWidth, this.oNumbers0ImgData.oData.spriteHeight, tempX + 235 * tempScale + i * this.numberSpace * .6 * tempScale, tempY + 4, this.oNumbers0ImgData.oData.spriteWidth * .6 * tempScale, this.oNumbers0ImgData.oData.spriteHeight * .6 * tempScale);
            }
        };
        Panel.prototype.addButs = function (ctx) {
            var aButOver = false;
            for (var i = 0; i < this.aButs.length; i++) {
                if (this.aButs[i].isOver) {
                    aButOver = true;
                    break;
                }
            }
            for (var i = 0; i < this.aButs.length; i++) {
                var offsetPosY;
                var floatY = 0;
                if (this.incY != 0 && this.aButs[i].flash) {
                    if (this.aButs[i].isOver) {
                        floatY = Math.sin((this.incY + i * 2.5) * 2) * 3;
                    }
                    else {
                        floatY = Math.sin(this.incY + i * 2.5) * 3;
                    }
                }
                if (i % 2 == 0) {
                }
                if (!this.aButs[i].scale) {
                    this.aButs[i].scale = 1;
                }
                var bX;
                var bY;
                var bWidth;
                var bHeight;
                bX = this.aButs[i].oImgData.oData.oAtlasData[this.aButs[i].id].x;
                bY = this.aButs[i].oImgData.oData.oAtlasData[this.aButs[i].id].y;
                bWidth = this.aButs[i].oImgData.oData.oAtlasData[this.aButs[i].id].width;
                bHeight = this.aButs[i].oImgData.oData.oAtlasData[this.aButs[i].id].height;
                var aX = (canvas.width * this.aButs[i].align[0]);
                var aY = (canvas.height * this.aButs[i].align[1]);
                if (aY + this.aButs[i].aPos[1] > canvas.height / 2 && gameState != "charSelect") {
                    offsetPosY = this.butsY;
                }
                else {
                    offsetPosY = -this.butsY;
                }
                this.aButs[i].aOverData = new Array(aX + this.aButs[i].aPos[0] - (bWidth / 2) * (this.aButs[i].scale) - floatY / 2, aY + this.aButs[i].aPos[1] - (bHeight / 2) * (this.aButs[i].scale) + offsetPosY + floatY / 2, aX + this.aButs[i].aPos[0] + (bWidth / 2) * (this.aButs[i].scale) - floatY / 2, aY + this.aButs[i].aPos[1] + (bHeight / 2) * (this.aButs[i].scale) + offsetPosY + floatY / 2);
                if (this.aButs[i].isOver && this.aButs[i].flash) {
                    ctx.save();
                    ctx.translate(aX + this.aButs[i].aPos[0], aY + this.aButs[i].aPos[1]);
                    ctx.scale(.7 + floatY / 50, .7 + floatY / 50);
                    ctx.globalAlpha = 1;
                    ctx.rotate(this.incY / 7);
                    ctx.drawImage(this.oTopFlareImgData.img, -this.oTopFlareImgData.img.width / 2, -this.oTopFlareImgData.img.height / 2);
                    ctx.restore();
                }
                ctx.drawImage(this.aButs[i].oImgData.img, bX, bY, bWidth, bHeight, this.aButs[i].aOverData[0], this.aButs[i].aOverData[1], bWidth * (this.aButs[i].scale) + floatY, bHeight * (this.aButs[i].scale) - floatY);
                if (this.aButs[i].isOver || this.aButs[i].flash) {
                    ctx.save();
                    if (this.aButs[i].isOver) {
                        ctx.globalAlpha = 1;
                    }
                    else {
                        if (aButOver) {
                            ctx.globalAlpha = Math.max(Math.sin(this.incY / 2), 0) / 2;
                        }
                        else {
                            ctx.globalAlpha = Math.max(Math.sin(this.incY / 2 + i), 0);
                        }
                    }
                    bX = this.aButs[i].oImgData.oData.oAtlasData[this.aButs[i].idOver].x;
                    bY = this.aButs[i].oImgData.oData.oAtlasData[this.aButs[i].idOver].y;
                    bWidth = this.aButs[i].oImgData.oData.oAtlasData[this.aButs[i].idOver].width;
                    bHeight = this.aButs[i].oImgData.oData.oAtlasData[this.aButs[i].idOver].height;
                    ctx.drawImage(this.aButs[i].oImgData.img, bX, bY, bWidth, bHeight, this.aButs[i].aOverData[0], this.aButs[i].aOverData[1], bWidth * (this.aButs[i].scale) + floatY, bHeight * (this.aButs[i].scale) - floatY);
                    ctx.restore();
                }
            }
            if (gameState == "charSelect") {
                var tempScale = 1;
                var tempCash = saveDataHandler.getCash();
                if (canvas.height > canvas.width) {
                    for (var j = 0; j < 14; j++) {
                        tempScale = Math.min((canvas.height - 400) / 460, 1);
                        if (!saveDataHandler.getCharLockStatus(j)) {
                            var tempPanel = oImageIds["costPanel0"];
                            var tempCol = "#838383";
                            if (tempCash >= aCharData[j].cost) {
                                tempPanel = oImageIds["costPanel1"];
                                var tempCol = "#FF5600";
                            }
                            var bX = this.oUiElementsImgData.oData.oAtlasData[tempPanel].x;
                            var bY = this.oUiElementsImgData.oData.oAtlasData[tempPanel].y;
                            var bWidth = this.oUiElementsImgData.oData.oAtlasData[tempPanel].width;
                            var bHeight = this.oUiElementsImgData.oData.oAtlasData[tempPanel].height;
                            ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - (bWidth / 2) * tempScale + (j % 5) * (138 * tempScale) - 276 * tempScale, Math.floor(j / 5) * 148 * tempScale + 110 * tempScale + 75 + offsetPosY, bWidth * tempScale, bHeight * tempScale);
                            addDirectText(2, 28 * tempScale, 50, "left", canvas.width / 2 - (bWidth / 2) * tempScale + (j % 5) * (138 * tempScale) - 230 * tempScale, Math.floor(j / 5) * 148 * tempScale + 143 * tempScale + 73 + offsetPosY, aCharData[j].cost.toString(), tempCol);
                        }
                    }
                }
                else {
                    for (var j = 0; j < 14; j++) {
                        tempScale = Math.min((canvas.width - 20) / 965, 1);
                        if (!saveDataHandler.getCharLockStatus(j)) {
                            var tempPanel = oImageIds["costPanel0"];
                            var tempCol = "#838383";
                            if (tempCash >= aCharData[j].cost) {
                                tempPanel = oImageIds["costPanel1"];
                                var tempCol = "#FF5600";
                            }
                            var bX = this.oUiElementsImgData.oData.oAtlasData[tempPanel].x;
                            var bY = this.oUiElementsImgData.oData.oAtlasData[tempPanel].y;
                            var bWidth = this.oUiElementsImgData.oData.oAtlasData[tempPanel].width;
                            var bHeight = this.oUiElementsImgData.oData.oAtlasData[tempPanel].height;
                            ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - (bWidth / 2) * tempScale + (j % 7) * (138 * tempScale) - 414 * tempScale, Math.floor(j / 7) * 148 * tempScale + 110 * tempScale + 75 + offsetPosY, bWidth * tempScale, bHeight * tempScale);
                            addDirectText(2, 28 * tempScale, 50, "left", canvas.width / 2 - (bWidth / 2) * tempScale + (j % 7) * (138 * tempScale) - 368 * tempScale, Math.floor(j / 7) * 148 * tempScale + 143 * tempScale + 73 + offsetPosY, aCharData[j].cost.toString(), tempCol);
                        }
                    }
                }
            }
            else if (gameState == "upgrades") {
                var tempScale = 1;
                var tempCash = saveDataHandler.getCash();
                for (var j = 0; j < 9; j++) {
                    if (canvas.height > canvas.width) {
                        tempScale = Math.min((canvas.height - 400) / 460, 1);
                        if (saveDataHandler.getUpgradeLockStatus(curChar, j) == 0 || (j <= 2 && saveDataHandler.getUpgradeLockStatus(curChar, j) <= 4)) {
                            var tempPanel = oImageIds["costPanel0"];
                            var tempCol = "#838383";
                            var tempIndex = saveDataHandler.getStatBonus(j);
                            if (tempCash >= aUpgradeData[j].aCost[tempIndex]) {
                                tempPanel = oImageIds["costPanel1"];
                                var tempCol = "#FF5600";
                            }
                            var bX = this.oUiElementsImgData.oData.oAtlasData[tempPanel].x;
                            var bY = this.oUiElementsImgData.oData.oAtlasData[tempPanel].y;
                            var bWidth = this.oUiElementsImgData.oData.oAtlasData[tempPanel].width;
                            var bHeight = this.oUiElementsImgData.oData.oAtlasData[tempPanel].height;
                            ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - (bWidth / 2) * tempScale + (j % 3) * (138 * tempScale) - 138 * tempScale, Math.floor(j / 3) * 148 * tempScale + 110 * tempScale + 75 + offsetPosY, bWidth * tempScale, bHeight * tempScale);
                            addDirectText(2, 32 * tempScale, 50, "left", canvas.width / 2 - (bWidth / 2) * tempScale + (j % 3) * (138 * tempScale) - 92 * tempScale, Math.floor(j / 3) * 148 * tempScale + 143 * tempScale + 75 + offsetPosY, aUpgradeData[j].aCost[tempIndex].toString(), tempCol);
                        }
                        if (j <= 2) {
                            addText(2, 20 * tempScale, 70, "center", canvas.width / 2 + (j % 3) * (138 * tempScale) - 138 * tempScale, Math.floor(j / 3) * 148 * tempScale + 106 * tempScale + 75 + offsetPosY, "upgradeBut" + j, "#FFFFFF");
                        }
                    }
                    else {
                        tempScale = Math.min((canvas.width - 20) / 965, 1);
                        if (saveDataHandler.getUpgradeLockStatus(curChar, j) == 0 || (j <= 2 && saveDataHandler.getUpgradeLockStatus(curChar, j) <= 4)) {
                            var tempPanel = oImageIds["costPanel0"];
                            var tempCol = "#838383";
                            var tempIndex = saveDataHandler.getStatBonus(j);
                            if (tempCash >= aUpgradeData[j].aCost[tempIndex]) {
                                tempPanel = oImageIds["costPanel1"];
                                var tempCol = "#FF5600";
                            }
                            var bX = this.oUiElementsImgData.oData.oAtlasData[tempPanel].x;
                            var bY = this.oUiElementsImgData.oData.oAtlasData[tempPanel].y;
                            var bWidth = this.oUiElementsImgData.oData.oAtlasData[tempPanel].width;
                            var bHeight = this.oUiElementsImgData.oData.oAtlasData[tempPanel].height;
                            ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - (bWidth / 2) * tempScale + (j % 5) * (138 * tempScale) - 276 * tempScale, Math.floor(j / 5) * 148 * tempScale + 110 * tempScale + 75 + offsetPosY, bWidth * tempScale, bHeight * tempScale);
                            addDirectText(2, 32 * tempScale, 50, "left", canvas.width / 2 - (bWidth / 2) * tempScale + (j % 5) * (138 * tempScale) - 230 * tempScale, Math.floor(j / 5) * 148 * tempScale + 143 * tempScale + 75 + offsetPosY, aUpgradeData[j].aCost[tempIndex].toString(), tempCol);
                        }
                        if (j <= 2) {
                            addText(2, 20 * tempScale, 70, "center", canvas.width / 2 + (j % 5) * (138 * tempScale) - 276 * tempScale, Math.floor(j / 5) * 148 * tempScale + 106 * tempScale + 75 + offsetPosY, "upgradeBut" + j, "#FFFFFF");
                        }
                    }
                }
            }
            else if (gameState == "gameEnd1" && challengeTime == -1) {
                addText(2, 50, 280, "center", canvas.width / 2 + 20 - 1.5, canvas.height * .45 + 104 + this.butsY - 1.5, "copyLink", "#A43500");
                addText(2, 50, 280, "center", canvas.width / 2 + 20 + 1.5, canvas.height * .45 + 104 + this.butsY + 1.5, "copyLink", "#FFFFFF");
                addText(2, 50, 280, "center", canvas.width / 2 + 20, canvas.height * .45 + 104 + this.butsY, "copyLink", "#FF5500");
            }
        };
        return Panel;
    }());
    Elements.Panel = Panel;
})(Elements || (Elements = {}));
var Utils;
(function (Utils) {
    var TextDisplay = (function () {
        function TextDisplay() {
            this.oTextData = {};
            this.inc = 0;
            this.createTextObjects();
        }
        TextDisplay.prototype.createTextObjects = function () {
            var cnt = 0;
            for (var i in assetLib.textData.langText.text[curLang]) {
                this.oTextData[i] = {};
                this.oTextData[i].aLineData = this.getCharData(assetLib.textData.langText.text[curLang][i]["@text"], assetLib.textData.langText.text[curLang][i]["@fontId"]);
                this.oTextData[i].aLineWidths = this.getLineWidths(this.oTextData[i].aLineData);
                this.oTextData[i].blockWidth = this.getBlockWidth(this.oTextData[i].aLineData);
                this.oTextData[i].blockHeight = this.getBlockHeight(this.oTextData[i].aLineData, assetLib.textData.langText.text[curLang][i]["@fontId"]);
                this.oTextData[i].lineHeight = parseInt(assetLib.textData["fontData" + assetLib.textData.langText.text[curLang][i]["@fontId"]].text.common["@lineHeight"]);
                this.oTextData[i].oFontImgData = assetLib.getData("font" + assetLib.textData.langText.text[curLang][i]["@fontId"]);
            }
        };
        TextDisplay.prototype.getLineWidths = function (_aCharData) {
            var lineLength;
            var aLineWidths = new Array();
            for (var i = 0; i < _aCharData.length; i++) {
                lineLength = 0;
                for (var j = 0; j < _aCharData[i].length; j++) {
                    lineLength += parseInt(_aCharData[i][j]["@xadvance"]);
                    if (j == 0) {
                        lineLength -= parseInt(_aCharData[i][j]["@xoffset"]);
                    }
                    else if (j == _aCharData[i].length - 1) {
                        lineLength += parseInt(_aCharData[i][j]["@xoffset"]);
                    }
                }
                aLineWidths.push(lineLength);
            }
            return aLineWidths;
        };
        TextDisplay.prototype.getBlockWidth = function (_aCharData) {
            var lineLength;
            var longestLineLength = 0;
            for (var i = 0; i < _aCharData.length; i++) {
                lineLength = 0;
                for (var j = 0; j < _aCharData[i].length; j++) {
                    lineLength += parseInt(_aCharData[i][j]["@xadvance"]);
                    if (j == 0) {
                        lineLength -= parseInt(_aCharData[i][j]["@xoffset"]);
                    }
                    else if (j == _aCharData[i].length - 1) {
                        lineLength += parseInt(_aCharData[i][j]["@xoffset"]);
                    }
                }
                if (lineLength > longestLineLength) {
                    longestLineLength = lineLength;
                }
            }
            return longestLineLength;
        };
        TextDisplay.prototype.getBlockHeight = function (_aCharData, _fontId) {
            return _aCharData.length * parseInt(assetLib.textData["fontData" + _fontId].text.common["@lineHeight"]);
        };
        TextDisplay.prototype.getCharData = function (_aLines, _fontId) {
            var aCharData = new Array();
            for (var k = 0; k < _aLines.length; k++) {
                aCharData[k] = new Array();
                for (var i = 0; i < _aLines[k].length; i++) {
                    for (var j = 0; j < assetLib.textData["fontData" + _fontId].text.chars.char.length; j++) {
                        if (_aLines[k][i].charCodeAt(0) == assetLib.textData["fontData" + _fontId].text.chars.char[j]["@id"]) {
                            aCharData[k].push(assetLib.textData["fontData" + _fontId].text.chars.char[j]);
                        }
                    }
                }
            }
            return aCharData;
        };
        TextDisplay.prototype.renderText = function (_oTextDisplayData) {
            var aLinesToRender = this.oTextData[_oTextDisplayData.text].aLineData;
            var oFontImgData = this.oTextData[_oTextDisplayData.text].oFontImgData;
            var shiftX;
            var offsetX = 0;
            var offsetY = 0;
            var lineOffsetY = 0;
            var manualScale = 1;
            var animY = 0;
            if (_oTextDisplayData.lineOffsetY) {
                lineOffsetY = _oTextDisplayData.lineOffsetY;
            }
            if (_oTextDisplayData.scale) {
                manualScale = _oTextDisplayData.scale;
            }
            var textScale = 1 * manualScale;
            if (_oTextDisplayData.maxWidth && this.oTextData[_oTextDisplayData.text].blockWidth * manualScale > _oTextDisplayData.maxWidth) {
                textScale = _oTextDisplayData.maxWidth / this.oTextData[_oTextDisplayData.text].blockWidth;
            }
            if (_oTextDisplayData.anim) {
                this.inc += delta * 7;
            }
            for (var i = 0; i < aLinesToRender.length; i++) {
                shiftX = 0;
                if (_oTextDisplayData.alignX == "centre") {
                    offsetX = this.oTextData[_oTextDisplayData.text].aLineWidths[i] / 2;
                }
                if (_oTextDisplayData.alignY == "centre") {
                    offsetY = this.oTextData[_oTextDisplayData.text].blockHeight / 2 + (lineOffsetY * (aLinesToRender.length - 1)) / 2;
                }
                for (var j = 0; j < aLinesToRender[i].length; j++) {
                    var bX = aLinesToRender[i][j]["@x"];
                    var bY = aLinesToRender[i][j]["@y"];
                    var bWidth = aLinesToRender[i][j]["@width"];
                    var bHeight = aLinesToRender[i][j]["@height"];
                    if (_oTextDisplayData.anim) {
                        animY = Math.sin(this.inc + j / 2) * ((bHeight / 15) * textScale);
                    }
                    ctx.drawImage(oFontImgData.img, bX, bY, bWidth, bHeight, _oTextDisplayData.x + (shiftX + parseInt(aLinesToRender[i][j]["@xoffset"]) - offsetX) * textScale, _oTextDisplayData.y + (parseInt(aLinesToRender[i][j]["@yoffset"]) + (i * this.oTextData[_oTextDisplayData.text].lineHeight) + (i * lineOffsetY) - offsetY) * textScale + animY, bWidth * textScale, bHeight * textScale);
                    shiftX += parseInt(aLinesToRender[i][j]["@xadvance"]);
                }
            }
        };
        return TextDisplay;
    }());
    Utils.TextDisplay = TextDisplay;
})(Utils || (Utils = {}));
var Elements;
(function (Elements) {
    var Ground = (function () {
        function Ground() {
            this.inc = 0;
            this.roadSegWidth = 40;
            this.smootheScaleRate = .8;
            this.roadSegDepth = 50;
            this.roadSteerAngle = 0;
            this.horizon = 300;
            this.steer = 0;
            this.carPosTarg = .5;
            this.carPos = .5;
            this.nearWidthRate = 5;
            this.heightRate = 300;
            this.roadCurveEase = 0;
            this.roadCurveEaseTarg = 0;
            this.roadCurveEaseInc = 0;
            this.roadCurveEaseDuration = 0;
            this.roadHillEase = 0;
            this.roadHillEaseTarg = 0;
            this.roadHillEaseInc = 0;
            this.roadHillEaseDuration = 0;
            this.bgHillEase0 = 0;
            this.bgHillEaseTarg0 = 0;
            this.bgHillEaseInc0 = 0;
            this.bgHillEaseDuration0 = 0;
            this.bgHillEase1 = 0;
            this.bgHillEaseTarg1 = 0;
            this.bgHillEaseInc1 = 0;
            this.bgHillEaseDuration1 = 0;
            this.tiltEase = .1;
            this.tiltEaseTarg = 0;
            this.tiltEaseInc = 0;
            this.tiltEaseDuration = 0;
            this.ditchEase0 = .5;
            this.ditchEaseTarg0 = 0;
            this.ditchEaseInc0 = 0;
            this.ditchEaseDuration0 = 0;
            this.ditchEase1 = .5;
            this.ditchEaseTarg1 = 0;
            this.ditchEaseInc1 = 0;
            this.ditchEaseDuration1 = 0;
            this.roadWidthEase = 40;
            this.roadWidthEaseTarg = 0;
            this.roadWidthEaseInc = 0;
            this.roadWidthEaseDuration = 0;
            this.curvePattern = 0;
            this.horizonX0 = 0;
            this.horizonX1 = -Math.max(1200, canvas.width);
            this.horizonY = 0;
            this.distObjectNum = 5;
            this.testing = false;
            this.enemyReleaseTarg = 25;
            this.enemyReleaseInc = 20;
            this.sideBounceInc = 0;
            this.segsSinceJump = 0;
            this.segsSincePickUp = 0;
            this.coinRow = -10;
            this.cointTot = 5;
            this.coinPos = .5;
            this.roadWidthChange = true;
            this.pickUpCount = -1;
            this.magnetCount = 0;
            this.bannerInc = -1;
            if (gameState == "start") {
                raceNum = 0;
            }
            else if (gameState == "charSelect") {
                raceNum = 3;
            }
            this.oHorizonImgData = assetLib.getData("horizon" + raceNum);
            this.oGameElementsImgData = assetLib.getData("gameElements");
            switch (raceNum) {
                case 0:
                    this.heightRate = 200;
                    break;
                case 1:
                    this.heightRate = 100;
                    break;
                case 2:
                    this.heightRate = 200;
                    break;
                case 3:
                    this.heightRate = 100;
                    break;
                case 4:
                    this.heightRate = 300;
                    break;
            }
            this.aRoad = new Array();
            this.aRaceColours = new Array({ sky: "#9ADFFF", ground: "#282828", verge0: "#ABA162", verge1: "#C2B46C", skidLines0: "#4F4F4F", skidLines1: "#2C2C2C", streetLines: "#BBBBBB", shards: "#AFAFAF", jump0: "#7A7A7A", jump1: "#A4A4A4", jump2: "#BFBFBF" }, { sky: "#7BC1FF", ground: "#C47B4A", verge0: "#FCBE61", verge1: "#F2AE6A", skidLines0: "#F2AE6A", skidLines1: "#D9934D", streetLines: "#F0C786", shards: "#FFCC80", jump0: "#793C25", jump1: "#935D29", jump2: "#A16830" }, { sky: "#A091FA", ground: "#7C3723", verge0: "#D99363", verge1: "#E1835C", skidLines0: "#622913", skidLines1: "#954F3B", streetLines: "#F7C8A4", shards: "#E9A373", jump0: "#E9A373", jump1: "#FFB0A1", jump2: "#FFD2B1" }, { sky: "#34254E", ground: "#181F4D", verge0: "#80397E", verge1: "#AA3C76", skidLines0: "#1D4F5C", skidLines1: "#081F25", streetLines: "#F4C4B4", shards: "#FF74AB", jump0: "#80397E", jump1: "#C35A92", jump2: "#FF77AD" }, { sky: "#87E1FF", ground: "#F1FCFC", verge0: "#AFD5FF", verge1: "#B2E9FC", skidLines0: "#D0F2FF", skidLines1: "#E5E5E5", streetLines: "#AFE9FF", shards: "#AFD5FF", jump0: "#AAB1FF", jump1: "#C4D7FF", jump2: "#DDE9FF" });
            var oTempRoadColours = this.getRoadColours();
            this.aRoad.push({
                id: 0,
                tilt: 0,
                height: 0,
                angle: 0,
                hillHeight0: 0,
                hillHeight1: 0,
                ditch0: 0,
                ditch1: 0,
                centre: { x: 0, y: 0 },
                leftSide: { x: -this.roadSegWidth, y: 0 },
                rightSide: { x: this.roadSegWidth, y: 0 },
                leftDistObject0: Math.random() * 1,
                rightDistObject0: Math.random() * 1,
                leftObjectType0: Math.floor(Math.random() * this.distObjectNum),
                rightObjectType0: Math.floor(Math.random() * this.distObjectNum),
                leftDistObject1: Math.random() * 1,
                rightDistObject1: Math.random() * 1,
                leftObjectType1: Math.floor(Math.random() * this.distObjectNum),
                rightObjectType1: Math.floor(Math.random() * this.distObjectNum),
                mergeInc: 1,
                jump: 0,
                pickUp: 0,
                lines: [Math.random(), Math.random(), Math.random(), Math.random()],
                roadSegWidth: this.roadSegWidth,
                roadColours: oTempRoadColours,
                leftCliff: 0,
                rightCliff: 0,
                bannerId: this.bannerInc
            });
            this.newRoadEase(true);
            this.newRoadCurveEase(true);
            this.newTiltEase(true);
            this.newBgHillEase0();
            this.newBgHillEase1();
            this.newDitchEase0();
            this.newDitchEase1();
            this.newRoadWidthEase();
            for (var i = 0; i < 30; i++) {
                this.addRoadSeg(false);
            }
        }
        Ground.prototype.newRoadEase = function (_isStart) {
            if (_isStart === void 0) { _isStart = false; }
            if (_isStart) {
                this.roadHillEaseTarg = 1;
                this.roadHillEaseInc = 0;
                this.roadHillEaseDuration = 20;
            }
            else {
                this.roadHillEaseTarg = Math.random() * 1 - .3;
                this.roadHillEaseInc = 0;
                this.roadHillEaseDuration = Math.random() * 15 + 8;
            }
        };
        Ground.prototype.newRoadCurveEase = function (_isStart) {
            if (_isStart === void 0) { _isStart = false; }
            if (_isStart) {
                this.curvePattern = 0;
                this.roadCurveEaseInc = 0;
                this.roadCurveEaseDuration = 20;
            }
            else {
                if (this.curvePattern == 1 && Math.random() > .5) {
                    this.curvePattern = 0;
                    this.roadCurveEaseInc = 0;
                    this.roadCurveEaseDuration = Math.random() * 15 + 5;
                    return;
                }
                this.curvePattern = 1;
                if (Math.random() > .25) {
                    if (this.roadCurveEaseTarg < 0) {
                        this.roadCurveEaseTarg = Math.random() * 6 - 1;
                    }
                    else if (this.roadCurveEaseTarg > 0) {
                        this.roadCurveEaseTarg = Math.random() * 6 - 5;
                    }
                    else {
                        this.roadCurveEaseTarg = Math.random() * 10 - 5;
                    }
                    this.roadCurveEaseInc = 0;
                    this.roadCurveEaseDuration = Math.random() * 15 + 5;
                }
                else {
                    this.roadCurveEaseTarg = 0;
                    this.roadCurveEaseInc = 0;
                    this.roadCurveEaseDuration = Math.random() * 30 + 20;
                }
            }
        };
        Ground.prototype.newRoadWidthEase = function () {
            if (this.roadWidthChange) {
                this.roadWidthEaseTarg = Math.ceil(Math.random() * 4) * 10;
                this.roadWidthEaseInc = 0;
                this.roadWidthEaseDuration = Math.random() * 2 + 2;
                this.roadWidthChange = false;
            }
            else {
                this.roadWidthEaseInc = 0;
                this.roadWidthEaseDuration = Math.random() * 20 + 20;
                this.roadWidthChange = true;
            }
        };
        Ground.prototype.newTiltEase = function (_isStart) {
            if (_isStart === void 0) { _isStart = false; }
            if (_isStart) {
                this.tiltEaseTarg = 0;
                this.tiltEaseInc = 0;
                this.tiltEaseDuration = 20;
            }
            else {
                this.tiltEaseTarg = Math.random() * .2 - .1;
                this.tiltEaseInc = 0;
                this.tiltEaseDuration = Math.random() * 20 + 10;
            }
        };
        Ground.prototype.newBgHillEase0 = function () {
            this.bgHillEaseTarg0 = Math.random() * 400 - 200;
            this.bgHillEaseInc0 = 0;
            this.bgHillEaseDuration0 = Math.random() * 20 + 10;
        };
        Ground.prototype.newBgHillEase1 = function () {
            this.bgHillEaseTarg1 = Math.random() * 400 - 200;
            this.bgHillEaseInc1 = 0;
            this.bgHillEaseDuration1 = Math.random() * 20 + 10;
        };
        Ground.prototype.newDitchEase0 = function () {
            this.ditchEaseTarg0 = Math.random() * 20 + 3;
            this.ditchEaseInc0 = 0;
            this.ditchEaseDuration0 = Math.random() * 5 + 5;
        };
        Ground.prototype.newDitchEase1 = function () {
            this.ditchEaseTarg1 = Math.random() * 20 + 3;
            this.ditchEaseInc1 = 0;
            this.ditchEaseDuration1 = Math.random() * 5 + 5;
        };
        Ground.prototype.addRoadSeg = function (_removeSeg) {
            if (_removeSeg === void 0) { _removeSeg = true; }
            var isFinishLine = false;
            if (this.aRoad[this.aRoad.length - 1].id == raceLength && gameState == "game") {
                isFinishLine = true;
            }
            if (this.aRoad[0].id == raceLength && gameState == "game") {
                panel.tweenFinish();
                if (gameType == 0) {
                    for (var i = 0; i < aLeaderboard.length; i++) {
                        for (var j = 0; j < aRacePositions.length; j++) {
                            if (aLeaderboard[i].charId == aRacePositions[j].charId) {
                                aLeaderboard[i].score += aPosPoints[j];
                            }
                        }
                    }
                    aUserRaceResults.push(userCharPos);
                    aLeaderboard.sort(function (a, b) { return b.score - a.score; });
                    for (var i = aLeaderboard.length - 1; i > 0; i--) {
                        if (aLeaderboard[i].score == aLeaderboard[i - 1].score && aLeaderboard[i].charId == curChar) {
                            var temp = aLeaderboard[i];
                            aLeaderboard[i] = aLeaderboard[i - 1];
                            aLeaderboard[i - 1] = temp;
                        }
                    }
                }
            }
            var tempMergeInc = 1;
            if (_removeSeg) {
                this.aRoad.shift();
                this.inc -= 1;
                for (var j = 0; j < aEnemySkaters.length; j++) {
                    aEnemySkaters[j].segId -= 1;
                }
                userSkater.segId -= 1;
                tempMergeInc = 0;
            }
            this.roadHillEaseInc++;
            var tempRoadHillEase = this.easeInOutQuad(this.roadHillEaseInc, this.roadHillEase, this.roadHillEaseTarg - this.roadHillEase, this.roadHillEaseDuration);
            if (this.roadHillEaseInc >= this.roadHillEaseDuration) {
                this.roadHillEase = tempRoadHillEase;
                this.newRoadEase();
            }
            this.roadCurveEaseInc++;
            var tempRoadCurveEase = this.easeInOutQuad(this.roadCurveEaseInc, this.roadCurveEase, this.roadCurveEaseTarg - this.roadCurveEase, this.roadCurveEaseDuration);
            if (this.roadCurveEaseInc >= this.roadCurveEaseDuration) {
                this.roadCurveEase = tempRoadCurveEase;
                this.newRoadCurveEase();
            }
            this.tiltEaseInc++;
            var tempTiltEase = this.easeInOutQuad(this.tiltEaseInc, this.tiltEase, this.tiltEaseTarg - this.tiltEase, this.tiltEaseDuration);
            if (this.tiltEaseInc >= this.tiltEaseDuration) {
                this.tiltEase = tempTiltEase;
                this.newTiltEase();
            }
            this.bgHillEaseInc0++;
            var tempBgHillEase0 = this.easeInOutQuad(this.bgHillEaseInc0, this.bgHillEase0, this.bgHillEaseTarg0 - this.bgHillEase0, this.bgHillEaseDuration0);
            if (this.bgHillEaseInc0 >= this.bgHillEaseDuration0) {
                this.bgHillEase0 = tempBgHillEase0;
                this.newBgHillEase0();
            }
            this.bgHillEaseInc1++;
            var tempBgHillEase1 = this.easeInOutQuad(this.bgHillEaseInc1, this.bgHillEase1, this.bgHillEaseTarg1 - this.bgHillEase1, this.bgHillEaseDuration1);
            if (this.bgHillEaseInc1 >= this.bgHillEaseDuration1) {
                this.bgHillEase1 = tempBgHillEase1;
                this.newBgHillEase1();
            }
            this.ditchEaseInc0++;
            var tempDitchHillEase0 = this.easeInOutQuad(this.ditchEaseInc0, this.ditchEase0, this.ditchEaseTarg0 - this.ditchEase0, this.ditchEaseDuration0);
            if (this.ditchEaseInc0 >= this.ditchEaseDuration0) {
                this.ditchEase0 = tempDitchHillEase0;
                this.newDitchEase0();
            }
            this.ditchEaseInc1++;
            var tempDitchHillEase1 = this.easeInOutQuad(this.ditchEaseInc1, this.ditchEase1, this.ditchEaseTarg1 - this.ditchEase1, this.ditchEaseDuration1);
            if (this.ditchEaseInc1 >= this.ditchEaseDuration1) {
                this.ditchEase1 = tempDitchHillEase1;
                this.newDitchEase1();
            }
            if (_removeSeg) {
                this.roadWidthEaseInc++;
                this.roadSegWidth = this.easeInOutQuad(this.roadWidthEaseInc, this.roadWidthEase, this.roadWidthEaseTarg - this.roadWidthEase, this.roadWidthEaseDuration);
                if (this.roadWidthEaseInc >= this.roadWidthEaseDuration) {
                    this.roadWidthEase = this.roadSegWidth;
                    this.newRoadWidthEase();
                }
            }
            else {
                this.roadSegWidth = 40;
            }
            var tempIndex = this.aRoad.length - 1;
            var tempAngle = this.aRoad[tempIndex].angle + tempRoadCurveEase;
            var tempCentreX = this.aRoad[tempIndex].centre.x + this.roadSegDepth * Math.cos((tempAngle - 90) * radian);
            var tempCentreY = this.aRoad[tempIndex].centre.y + this.roadSegDepth * Math.sin((tempAngle - 90) * radian);
            var tempLeftX = tempCentreX - this.roadSegWidth * Math.cos((tempAngle) * radian);
            var tempLeftY = tempCentreY - this.roadSegWidth * Math.sin((tempAngle) * radian);
            var tempRightX = tempCentreX + this.roadSegWidth * Math.cos((tempAngle) * radian);
            var tempRightY = tempCentreY + this.roadSegWidth * Math.sin((tempAngle) * radian);
            var tempJumpNum = 0;
            var tempPickUpPos = -1;
            if (raceNum > 0 && Math.random() < .05 && _removeSeg && this.segsSinceJump > 20 && Math.abs(tempAngle - this.aRoad[tempIndex].angle) < 1 && gameState == "game") {
                tempJumpNum = Math.round(Math.random()) + 1;
                this.segsSinceJump = 0;
            }
            else if (_removeSeg && (++this.coinRow > 0 || Math.random() < .1) && gameState == "game" && this.aRoad[tempIndex].id + 1 <= raceLength && gameType == 0) {
                tempPickUpPos = Math.random() * .6 + .2;
                if (this.coinRow <= this.cointTot) {
                    addTrackObject("coin", this.aRoad[tempIndex].id + 1);
                }
                else if (this.coinRow > this.cointTot) {
                    if (userCharPos != 0) {
                        addTrackObject("pickUp", this.aRoad[tempIndex].id + 1, ++this.pickUpCount % 3);
                    }
                    this.cointTot = Math.random() * 8 + 8;
                    this.coinRow = -(Math.random() * 10 + 70);
                }
            }
            var tempRan = Math.random() * 20 - 10;
            var oTempRoadColours = this.getRoadColours(tempRoadHillEase, tempRan, isFinishLine);
            var tempLeftCliff = 0;
            var tempRightCliff = 0;
            if (raceNum == 2) {
                if (this.roadSegWidth > 15) {
                    tempLeftCliff = Math.random() * 200 + 25;
                    tempRightCliff = Math.random() * 200 + 25;
                    tempDitchHillEase0 *= .1;
                    tempDitchHillEase1 *= .1;
                }
                else {
                    tempLeftCliff = Math.random() * 50 + 25;
                    tempRightCliff = Math.random() * 50 + 25;
                }
                tempBgHillEase0 = Math.abs(tempBgHillEase0);
                tempBgHillEase1 = Math.abs(tempBgHillEase1);
            }
            else if (raceNum == 1) {
                tempLeftCliff = Math.random() * 50 + 50;
                tempRightCliff = Math.random() * 50 + 50;
            }
            else if (raceNum == 4) {
                if (this.roadSegWidth > 15) {
                    tempLeftCliff = Math.random() * 50 + 25;
                    tempRightCliff = Math.random() * 50 + 25;
                    tempDitchHillEase0 *= .2;
                    tempDitchHillEase1 *= .2;
                }
                else {
                    tempLeftCliff = Math.random() * 50 + 25;
                    tempRightCliff = Math.random() * 50 + 25;
                }
                tempBgHillEase0 = Math.abs(tempBgHillEase0);
                tempBgHillEase1 = Math.abs(tempBgHillEase1);
            }
            this.segsSinceJump++;
            if (this.aRoad[tempIndex].id % 15 == 0) {
                this.bannerInc = (this.bannerInc + 1) % 15;
            }
            this.aRoad.push({
                id: this.aRoad[tempIndex].id + 1,
                tilt: tempTiltEase,
                height: tempRoadHillEase,
                hillHeight0: tempBgHillEase0,
                hillHeight1: tempBgHillEase1,
                ditch0: tempDitchHillEase0,
                ditch1: tempDitchHillEase1,
                angle: tempAngle,
                centre: { x: tempCentreX, y: tempCentreY },
                centreSide: { x: tempCentreX, y: tempCentreY },
                leftSide: { x: tempLeftX, y: tempLeftY },
                rightSide: { x: tempRightX, y: tempRightY },
                leftDistObject0: Math.random() * 1 + .1,
                rightDistObject0: Math.random() * 1 + .1,
                leftObjectType0: Math.floor(Math.random() * this.distObjectNum),
                rightObjectType0: Math.floor(Math.random() * this.distObjectNum),
                leftDistObject1: Math.random() * 1 + .1,
                rightDistObject1: Math.random() * 1 + .1,
                leftObjectType1: Math.floor(Math.random() * this.distObjectNum),
                rightObjectType1: Math.floor(Math.random() * this.distObjectNum),
                mergeInc: tempMergeInc,
                jump: tempJumpNum,
                pickUp: tempPickUpPos,
                lines: [Math.random(), Math.random(), Math.random(), Math.random()],
                roadSegWidth: this.roadSegWidth,
                roadColours: oTempRoadColours,
                leftCliff: tempLeftCliff,
                rightCliff: tempRightCliff,
                bannerId: this.bannerInc
            });
        };
        Ground.prototype.getRoadColours = function (_tempRoadHillEase, _tempRan, _isfinishLine) {
            if (_tempRoadHillEase === void 0) { _tempRoadHillEase = 0; }
            if (_tempRan === void 0) { _tempRan = 0; }
            if (_isfinishLine === void 0) { _isfinishLine = false; }
            var oTempRoadColours;
            if (_isfinishLine) {
                switch (raceNum) {
                    case 0:
                        oTempRoadColours = {
                            wide: "rgba(224,224,224,",
                            thin: "rgba(224,224,224,",
                            field0: "rgba(" + (96 + _tempRan) + ", " + (160 + _tempRan) + ",  " + (59 + _tempRan) + ","
                        };
                        break;
                    case 1:
                        oTempRoadColours = {
                            wide: "rgba(236,229,216,",
                            thin: "rgba(236,229,216,",
                            field0: "rgba(" + (250 + _tempRan) + ", " + (210 + _tempRan) + ",  " + (127 + _tempRan) + ","
                        };
                        break;
                    case 2:
                        oTempRoadColours = {
                            wide: "rgba(255,210,170,",
                            thin: "rgba(255,210,170,",
                            field0: "rgba(" + (177 + _tempRan) + ", " + (84 + _tempRan) + ",  " + (39 + _tempRan) + ","
                        };
                        break;
                    case 3:
                        oTempRoadColours = {
                            wide: "rgba(231,182,202,",
                            thin: "rgba(231,182,202,",
                            field0: "rgba(" + (155 + _tempRan) + ", " + (62 + _tempRan) + ",  " + (128 + _tempRan) + ","
                        };
                        break;
                    case 4:
                        oTempRoadColours = {
                            wide: "rgba(111,116,170,",
                            thin: "rgba(111,116,170,",
                            field0: "rgba(" + (255 + _tempRan) + ", " + (255 + _tempRan) + ",  " + (255 + _tempRan) + ","
                        };
                        break;
                }
            }
            else {
                switch (raceNum) {
                    case 0:
                        oTempRoadColours = {
                            wide: "rgba(" + (40 + Math.random() * 10 - 5 + _tempRoadHillEase * 50) + ", " + (40 + Math.random() * 10 - 5 + _tempRoadHillEase * 50) + ",  " + (40 + Math.random() * 10 - 5 + _tempRoadHillEase * 50) + ",",
                            thin: "rgba(" + (77 + Math.random() * 10 - 5 + _tempRoadHillEase * 50) + ", " + (59 + Math.random() * 10 - 5 + _tempRoadHillEase * 50) + ",  " + (24 + Math.random() * 10 - 5 + _tempRoadHillEase * 50) + ",",
                            field0: "rgba(" + (96 + _tempRan) + ", " + (160 + _tempRan) + ",  " + (59 + _tempRan) + ","
                        };
                        break;
                    case 1:
                        oTempRoadColours = {
                            wide: "rgba(" + (196 + Math.random() * 10 - 5 + _tempRoadHillEase * 50) + ", " + (123 + Math.random() * 10 - 5 + _tempRoadHillEase * 50) + ",  " + (74 + Math.random() * 10 - 5 + _tempRoadHillEase * 50) + ",",
                            thin: "rgba(" + (229 + Math.random() * 10 - 5 + _tempRoadHillEase * 50) + ", " + (160 + Math.random() * 10 - 5 + _tempRoadHillEase * 50) + ",  " + (86 + Math.random() * 10 - 5 + _tempRoadHillEase * 50) + ",",
                            field0: "rgba(" + (250 + _tempRan) + ", " + (210 + _tempRan) + ",  " + (127 + _tempRan) + ","
                        };
                        break;
                    case 2:
                        oTempRoadColours = {
                            wide: "rgba(" + (124 + Math.random() * 10 - 5 + _tempRoadHillEase * 50) + ", " + (55 + Math.random() * 10 - 5 + _tempRoadHillEase * 50) + ",  " + (35 + Math.random() * 10 - 5 + _tempRoadHillEase * 50) + ",",
                            thin: "rgba(" + (163 + Math.random() * 10 - 5 + _tempRoadHillEase * 50) + ", " + (101 + Math.random() * 10 - 5 + _tempRoadHillEase * 50) + ",  " + (53 + Math.random() * 10 - 5 + _tempRoadHillEase * 50) + ",",
                            field0: "rgba(" + (177 + _tempRan) + ", " + (84 + _tempRan) + ",  " + (39 + _tempRan) + ","
                        };
                        break;
                    case 3:
                        oTempRoadColours = {
                            wide: "rgba(" + (24 + Math.random() * 10 - 5 + _tempRoadHillEase * 50) + ", " + (31 + Math.random() * 10 - 5 + _tempRoadHillEase * 50) + ",  " + (77 + Math.random() * 10 - 5 + _tempRoadHillEase * 50) + ",",
                            thin: "rgba(" + (71 + Math.random() * 10 - 5 + _tempRoadHillEase * 50) + ", " + (44 + Math.random() * 10 - 5 + _tempRoadHillEase * 50) + ",  " + (87 + Math.random() * 10 - 5 + _tempRoadHillEase * 50) + ",",
                            field0: "rgba(" + (155 + _tempRan) + ", " + (62 + _tempRan) + ",  " + (128 + _tempRan) + ","
                        };
                        break;
                    case 4:
                        oTempRoadColours = {
                            wide: "rgba(" + (241 + Math.random() * 10 - 5 + _tempRoadHillEase * 50) + ", " + (252 + Math.random() * 10 - 5 + _tempRoadHillEase * 50) + ",  " + (252 + Math.random() * 10 - 5 + _tempRoadHillEase * 50) + ",",
                            thin: "rgba(" + (198 + Math.random() * 10 - 5 + _tempRoadHillEase * 50) + ", " + (253 + Math.random() * 10 - 5 + _tempRoadHillEase * 50) + ",  " + (255 + Math.random() * 10 - 5 + _tempRoadHillEase * 50) + ",",
                            field0: "rgba(" + (255 + _tempRan) + ", " + (255 + _tempRan) + ",  " + (255 + _tempRan) + ","
                        };
                        break;
                }
            }
            return oTempRoadColours;
        };
        Ground.prototype.rotateAround = function (_x, _y) {
            var tempCos = Math.cos(this.roadSteerAngle);
            var tempSin = Math.sin(this.roadSteerAngle);
            var nx = (tempCos * (_x - canvas.width / 2)) + ((tempSin * (_y - 700)) + canvas.width / 2);
            var ny = (tempCos * (_y - 700)) - (tempSin * (_x - canvas.width / 2)) + 700;
            ny = ny * .5 + 700 * .5;
            var tempCubicNy = this.easeInCubic(ny, 0, 700, 700);
            ny = this.easeInExpo(ny, 0, 700, 700) * .8;
            return [
                nx,
                ny + 700 * .2 + (canvas.height - 700),
                ny * (this.nearWidthRate * this.carPos) * 1.5,
                ny * (this.nearWidthRate * (1 - this.carPos)) * 1.5,
                ny,
                tempCubicNy,
                ny * (this.nearWidthRate * (.5 - this.carPos)) * 1.5,
            ];
        };
        Ground.prototype.easeInExpo = function (t, b, c, d) {
            return (t == 0) ? b : c * Math.pow(10, 10 * (t / d - 1)) + b;
        };
        Ground.prototype.easeInCubic = function (t, b, c, d) {
            return c * (t /= d) * t * t + b;
        };
        Ground.prototype.easeInOutQuad = function (t, b, c, d) {
            t /= d / 2;
            if (t < 1)
                return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        };
        Ground.prototype.easeInQuad = function (t, b, c, d) {
            return c * (t /= d) * t + b;
        };
        Ground.prototype.easeOutQuad = function (t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        };
        Ground.prototype.easeOutSine = function (t, b, c, d) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b;
        };
        Ground.prototype.easeInSine = function (t, b, c, d) {
            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
        };
        Ground.prototype.update = function () {
            if (this.magnetCount > 0) {
                this.magnetCount -= delta;
            }
            else {
                this.magnetCount = 0;
            }
            this.horizonStretchWidth = Math.max(canvas.width, this.oHorizonImgData.img.width);
            this.steer = (rightSteer + leftSteer) * 1;
            if (userSkater.jumpHeight < -50) {
                this.steer = 0;
            }
            if (gameState == "game") {
                this.carPosTarg -= ((this.steer * (userSkater.steerPower / Math.max((userSkater.speed / userSkater.maxSpeed), .4))) * userSkater.speed) * delta;
                if (this.aRoad[0].id < raceLength) {
                    this.carPosTarg -= ((this.aRoad[1].angle - this.aRoad[0].angle) * (userSkater.speed * userSkater.drag)) * delta;
                }
                else {
                    rightSteer = leftSteer = 0;
                }
                this.carPos += ((this.carPosTarg - this.carPos) * 5) * delta;
                if (this.carPos < 0.05) {
                    this.carPos = 0.05;
                    this.carPosTarg = 0.05;
                    playSound("hitWall" + Math.floor(Math.random() * 3));
                    if (this.sideBounceTween) {
                        this.sideBounceTween.kill();
                    }
                    this.sideBounceInc = .05;
                    this.sideBounceTween = TweenLite.to(this, .5, { sideBounceInc: 0, ease: "Cubic.easeOut" });
                    userSkater.triggerCrash();
                    if (userSkater.speedControlState == 1) {
                        userSkater.speed *= .2;
                    }
                }
                else if (this.carPos > 0.95) {
                    this.carPos = 0.95;
                    this.carPosTarg = 0.95;
                    playSound("hitWall" + Math.floor(Math.random() * 3));
                    if (this.sideBounceTween) {
                        this.sideBounceTween.kill();
                    }
                    this.sideBounceInc = -.05;
                    this.sideBounceTween = TweenLite.to(this, .5, { sideBounceInc: 0, ease: "Cubic.easeOut" });
                    userSkater.triggerCrash();
                    if (userSkater.speedControlState == 1) {
                        userSkater.speed *= .2;
                    }
                }
                this.carPosTarg += this.sideBounceInc;
            }
            userSkater.segSeg += (userSkater.speed) * delta;
            this.inc += delta * userSkater.speed;
            var tempX = this.aRoad[Math.floor(this.inc)].centre.x + (this.aRoad[Math.floor(this.inc) + 1].centre.x - this.aRoad[Math.floor(this.inc)].centre.x) * (this.inc % 1);
            var tempY = this.aRoad[Math.floor(this.inc)].centre.y + (this.aRoad[Math.floor(this.inc) + 1].centre.y - this.aRoad[Math.floor(this.inc)].centre.y) * (this.inc % 1);
            var tempSteerAngle = (this.aRoad[Math.floor(this.inc)].angle + (this.aRoad[Math.floor(this.inc) + 1].angle - this.aRoad[Math.floor(this.inc)].angle) * (this.inc % 1)) * radian;
            this.x = tempX - canvas.width / 2;
            this.y = tempY - 700;
            this.roadSteerAngle = tempSteerAngle;
            var aTemp;
            var tempTilt = (this.aRoad[1].angle - this.aRoad[0].angle) * this.aRoad[0].tilt;
            if ((this.aRoad[0].angle - this.aRoad[1].angle < 0 && this.aRoad[0].tilt > 0) || (this.aRoad[0].angle - this.aRoad[1].angle > 0 && this.aRoad[0].tilt < 0)) {
                aTemp = this.rotateAround(this.aRoad[1].leftSide.x - this.x, this.aRoad[1].leftSide.y - this.y);
                if (aTemp[1] + this.aRoad[1].height * this.heightRate - aTemp[4] * tempTilt > canvas.height && this.inc > 1) {
                    this.addRoadSeg();
                }
            }
            else {
                aTemp = this.rotateAround(this.aRoad[1].rightSide.x - this.x, this.aRoad[1].rightSide.y - this.y);
                if (aTemp[1] + this.aRoad[1].height * this.heightRate + aTemp[4] * tempTilt > canvas.height && this.inc > 1) {
                    this.addRoadSeg();
                }
            }
            var tempHX = (this.aRoad[1].angle - this.aRoad[0].angle) * delta * 25 * userSkater.speed;
            this.horizonX0 -= tempHX;
            this.horizonX1 -= tempHX;
            if (this.horizonX0 > this.horizonStretchWidth) {
                this.horizonX0 -= this.horizonStretchWidth * 2;
            }
            else if (this.horizonX0 < -this.horizonStretchWidth) {
                this.horizonX0 += this.horizonStretchWidth * 2;
            }
            if (this.horizonX1 > this.horizonStretchWidth) {
                this.horizonX1 -= this.horizonStretchWidth * 2;
            }
            else if (this.horizonX1 < -this.horizonStretchWidth) {
                this.horizonX1 += this.horizonStretchWidth * 2;
            }
            this.horizonY += ((((this.aRoad[1].height * -200) - this.horizonY) * 1) * delta * 2) * .1;
        };
        Ground.prototype.render = function () {
            ctx.fillStyle = this.aRaceColours[raceNum].sky;
            ctx.fillRect(0, 0, canvas.width, this.horizonY + (canvas.height - 550));
            ctx.fillStyle = this.aRaceColours[raceNum].ground;
            ctx.fillRect(0, this.horizonY + (canvas.height - 550), canvas.width, canvas.height);
            if (!this.testing) {
                ctx.drawImage(this.oHorizonImgData.img, 0, 0, this.oHorizonImgData.img.width, this.oHorizonImgData.img.height, this.horizonX0, this.horizonY - this.oHorizonImgData.img.height / 2 + (canvas.height - 550), this.horizonStretchWidth + 2, this.oHorizonImgData.img.height);
                ctx.drawImage(this.oHorizonImgData.img, 0, 0, this.oHorizonImgData.img.width, this.oHorizonImgData.img.height, this.horizonX1, this.horizonY - this.oHorizonImgData.img.height / 2 + (canvas.height - 550), this.horizonStretchWidth + 2, this.oHorizonImgData.img.height);
            }
            if (panel.lightningScale < 1) {
                ctx.fillStyle = "rgba(0,0,0," + (Math.random() * .5 + .5) + ")";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            for (var i = this.aRoad.length - 1; i > 0; i--) {
                var tempTilt0 = this.aRoad[i].tilt;
                var tempTilt1 = tempTilt0;
                if (i < this.aRoad.length - 1) {
                    var tempTilt1 = this.aRoad[i + 1].tilt;
                }
                var tempSmoothScale0 = Math.min(((this.aRoad.length - ((i - 1) - this.inc)) / (this.aRoad.length * this.smootheScaleRate)), 1) * .6 + .4;
                var tempSmoothScale1 = Math.min(((this.aRoad.length - ((i) - this.inc)) / (this.aRoad.length * this.smootheScaleRate)), 1) * .6 + .4;
                var aTemp0 = this.rotateAround(this.aRoad[i - 1].leftSide.x - this.x, this.aRoad[i - 1].leftSide.y - this.y);
                var aTemp1 = this.rotateAround(this.aRoad[i - 1].rightSide.x - this.x, this.aRoad[i - 1].rightSide.y - this.y);
                var aTemp2 = this.rotateAround(this.aRoad[i].rightSide.x - this.x, this.aRoad[i].rightSide.y - this.y);
                var aTemp3 = this.rotateAround(this.aRoad[i].leftSide.x - this.x, this.aRoad[i].leftSide.y - this.y);
                var aTempCentre0 = this.rotateAround(this.aRoad[i - 1].centre.x - this.x, this.aRoad[i - 1].centre.y - this.y);
                var aTempCentre1 = this.rotateAround(this.aRoad[i].centre.x - this.x, this.aRoad[i].centre.y - this.y);
                var tempX0a = aTemp0[0] - aTemp0[2] + aTemp0[4] * .2;
                var tempY0 = aTemp0[1] + this.aRoad[i - 1].height * this.heightRate - aTemp0[4] * tempTilt0 * .92;
                var tempX1a = aTemp1[0] + aTemp1[3] - aTemp1[4] * .2;
                var tempY1 = aTemp1[1] + this.aRoad[i - 1].height * this.heightRate + aTemp1[4] * tempTilt0 * .92;
                var tempX0 = tempX0a + ((tempX1a - tempX0a) * .5) * (1 - tempSmoothScale0);
                var tempX1 = tempX1a + ((tempX0a - tempX1a) * .5) * (1 - tempSmoothScale0);
                var tempX2a = aTemp2[0] + aTemp2[3] - aTemp2[4] * .2;
                var tempY2 = aTemp2[1] + this.aRoad[i].height * this.heightRate + aTemp2[4] * tempTilt1 * .92;
                var tempX3a = aTemp3[0] - aTemp3[2] + aTemp3[4] * .2;
                var tempY3 = aTemp3[1] + this.aRoad[i].height * this.heightRate - aTemp3[4] * tempTilt1 * .92;
                var tempX2 = tempX2a + ((tempX3a - tempX2a) * .5) * (1 - tempSmoothScale1);
                var tempX3 = tempX3a + ((tempX2a - tempX3a) * .5) * (1 - tempSmoothScale1);
                if (aTemp0[4] < .005) {
                }
                this.aRoad[i - 1].mergeInc = Math.min(this.aRoad[i - 1].mergeInc + delta * 1, 1);
                var tempScale = aTemp0[5] * 0.0004 + (aTemp0[4] * .02 + .06) * this.aRoad[i - 1].mergeInc;
                var tempScale1 = aTemp3[5] * 0.0004 + (aTemp3[4] * .02 + .06) * this.aRoad[i].mergeInc;
                var tempDX0a = aTemp0[0] - aTemp0[2] - aTemp0[4] * this.aRoad[i - 1].ditch0;
                var tempDX1a = aTemp3[0] - aTemp3[2] - aTemp3[4] * this.aRoad[i].ditch0;
                var tempDX2a = aTemp1[0] + aTemp1[3] + aTemp1[4] * this.aRoad[i - 1].ditch1;
                var tempDX3a = aTemp2[0] + aTemp2[3] + aTemp2[4] * this.aRoad[i].ditch1;
                var tempDX0 = tempDX0a + ((tempDX2a - tempDX0a) * .5) * (1 - tempSmoothScale0) * .8 - this.aRoad[i - 1].ditch0 * tempSmoothScale0;
                var tempDX1 = tempDX1a + ((tempDX3a - tempDX1a) * .5) * (1 - tempSmoothScale1) * .8 - this.aRoad[i].ditch0 * tempSmoothScale1;
                var tempDX2 = tempDX2a + ((tempDX0a - tempDX2a) * .5) * (1 - tempSmoothScale0) * .8 + this.aRoad[i - 1].ditch0 * tempSmoothScale0;
                var tempDX3 = tempDX3a + ((tempDX1a - tempDX3a) * .5) * (1 - tempSmoothScale1) * .8 + this.aRoad[i].ditch0 * tempSmoothScale1;
                ctx.fillStyle = this.aRoad[i - 1].roadColours.field0 + this.aRoad[i].mergeInc + ")";
                ctx.beginPath();
                var tempFar = Math.min(aTemp0[0] - aTemp0[2] - canvas.width - aTemp0[4] * 100, 0);
                var a = tempFar + ((tempDX0) - tempFar) * .75;
                var b = aTemp0[1] + this.aRoad[i - 1].height * this.heightRate - this.aRoad[i - 1].height * this.aRoad[i - 1].hillHeight0 * (1 + aTemp0[4] * .15) - (this.aRoad[i - 1].leftCliff * tempScale) * 2;
                var c = tempDX0;
                var d = aTemp0[1] + this.aRoad[i - 1].height * this.heightRate - aTemp0[4] * tempTilt0 - (this.aRoad[i - 1].leftCliff * tempScale);
                var tempFar1 = Math.min(aTemp3[0] - aTemp3[2] - canvas.width - aTemp3[4] * 100, 0);
                var a1 = tempFar1 + ((tempDX1) - tempFar1) * .75;
                var b1 = aTemp3[1] + this.aRoad[i].height * this.heightRate - this.aRoad[i].height * this.aRoad[i].hillHeight0 * (1 + aTemp3[4] * .15) - (this.aRoad[i].leftCliff * tempScale1) * 2;
                var c1 = tempFar1;
                var d1 = aTemp3[1] + this.aRoad[i].height * this.heightRate - this.aRoad[i].height * 200;
                ctx.moveTo(tempFar, b);
                ctx.quadraticCurveTo(tempFar + (a - tempFar) / 2, b - this.aRoad[i - 1].hillHeight0 * this.aRoad[i - 1].height, a, b);
                ctx.lineTo(c, d);
                this.aRoad[i - 1].leftHillTop = { x: a, y: b };
                this.aRoad[i - 1].leftVergeEdge = { x: c, y: d };
                ctx.lineTo(tempDX1, aTemp3[1] + this.aRoad[i].height * this.heightRate - aTemp3[4] * tempTilt1 - (this.aRoad[i].leftCliff * tempScale1));
                ctx.lineTo(a1, b1);
                ctx.quadraticCurveTo(a1 + (c1 - a1) / 2, b1 - this.aRoad[i].hillHeight0 * this.aRoad[i].height, c1, b1);
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(tempDX2, aTemp1[1] + this.aRoad[i - 1].height * this.heightRate + aTemp1[4] * tempTilt0 - (this.aRoad[i - 1].rightCliff * tempScale));
                var tempFar = Math.max(aTemp1[0] + aTemp1[3] + canvas.width + aTemp1[4] * 100, canvas.width);
                a = tempFar + ((tempDX2) - tempFar) * .75;
                b = aTemp1[1] + this.aRoad[i - 1].height * this.heightRate - (this.aRoad[i - 1].height) * this.aRoad[i - 1].hillHeight1 * (1 + aTemp1[4] * .15) - (this.aRoad[i - 1].rightCliff * tempScale) * 2;
                c = Math.max(aTemp1[0] + aTemp1[3] + canvas.width + aTemp1[4] * 100, canvas.width);
                d = aTemp1[1] + this.aRoad[i - 1].height * this.heightRate - this.aRoad[i - 1].height * 200;
                var tempFar1 = Math.max(aTemp2[0] + aTemp2[3] + canvas.width + aTemp2[4] * 100, canvas.width);
                a1 = tempFar1 + ((tempDX3) - tempFar1) * .75;
                b1 = aTemp2[1] + this.aRoad[i].height * this.heightRate - this.aRoad[i].height * this.aRoad[i].hillHeight1 * (1 + aTemp2[4] * .15) - (this.aRoad[i].rightCliff * tempScale1) * 2;
                c1 = tempDX3;
                d1 = aTemp2[1] + this.aRoad[i].height * this.heightRate + aTemp2[4] * tempTilt1 - (this.aRoad[i].rightCliff * tempScale1);
                ctx.lineTo(a, b);
                ctx.quadraticCurveTo(a + (c - a) / 2, b - this.aRoad[i - 1].hillHeight1 * this.aRoad[i - 1].height, c, b);
                this.aRoad[i - 1].rightHillTop = { x: a, y: b };
                this.aRoad[i - 1].rightVergeEdge = { x: tempDX2, y: aTemp1[1] + this.aRoad[i - 1].height * this.heightRate + aTemp1[4] * tempTilt0 - (this.aRoad[i - 1].rightCliff * tempScale) };
                ctx.lineTo(tempFar1, b1);
                ctx.quadraticCurveTo(tempFar1 + (a1 - tempFar1) / 2, b1 - this.aRoad[i].hillHeight1 * this.aRoad[i].height, a1, b1);
                ctx.lineTo(c1, d1);
                ctx.fill();
                if (this.aRoad[i - 1].id % 2 == 0) {
                    ctx.fillStyle = this.aRaceColours[raceNum].verge0;
                }
                else {
                    ctx.fillStyle = this.aRaceColours[raceNum].verge1;
                }
                ctx.beginPath();
                ctx.moveTo(tempDX0, aTemp0[1] + this.aRoad[i - 1].height * this.heightRate - aTemp0[4] * tempTilt0 - (this.aRoad[i - 1].leftCliff * tempScale));
                ctx.lineTo(tempX0, aTemp0[1] + this.aRoad[i - 1].height * this.heightRate - aTemp0[4] * tempTilt0 * .92);
                ctx.lineTo(tempX3, aTemp3[1] + this.aRoad[i].height * this.heightRate - aTemp3[4] * tempTilt1 * .92);
                ctx.lineTo(tempDX1, aTemp3[1] + this.aRoad[i].height * this.heightRate - aTemp3[4] * tempTilt1 - (this.aRoad[i].leftCliff * tempScale1));
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(tempX1, aTemp1[1] + this.aRoad[i - 1].height * this.heightRate + aTemp1[4] * tempTilt0 * .92);
                ctx.lineTo(tempDX2, aTemp1[1] + this.aRoad[i - 1].height * this.heightRate + aTemp1[4] * tempTilt0 - (this.aRoad[i - 1].rightCliff * tempScale));
                ctx.lineTo(tempDX3, aTemp2[1] + this.aRoad[i].height * this.heightRate + aTemp2[4] * tempTilt1 - (this.aRoad[i].rightCliff * tempScale1));
                ctx.lineTo(tempX2, aTemp2[1] + this.aRoad[i].height * this.heightRate + aTemp2[4] * tempTilt1 * .92);
                ctx.fill();
                if (this.aRoad[i - 1].roadSegWidth > 15) {
                    ctx.fillStyle = this.aRoad[i - 1].roadColours.wide + this.aRoad[i].mergeInc + ")";
                }
                else {
                    ctx.fillStyle = this.aRoad[i - 1].roadColours.thin + this.aRoad[i].mergeInc + ")";
                }
                ctx.beginPath();
                ctx.moveTo(tempX0, tempY0 + 1);
                ctx.lineTo(tempX1, tempY1 + 1);
                ctx.lineTo(tempX2, tempY2);
                ctx.lineTo(tempX3, tempY3);
                ctx.fill();
                if (!this.testing) {
                    ctx.lineWidth = aTemp0[4] * .03;
                    for (var j = 0; j < this.aRoad[i].lines.length; j++) {
                        if (j < 2) {
                            ctx.strokeStyle = this.aRaceColours[raceNum].skidLines0;
                        }
                        else {
                            ctx.strokeStyle = this.aRaceColours[raceNum].skidLines1;
                        }
                        ctx.beginPath();
                        ctx.moveTo(tempX0 + (tempX1 - tempX0) * this.aRoad[i].lines[j], tempY0 + (tempY1 - tempY0) * this.aRoad[i].lines[j]);
                        ctx.lineTo(tempX3 + (tempX2 - tempX3) * this.aRoad[i].lines[j], tempY3 + (tempY2 - tempY3) * this.aRoad[i].lines[j]);
                        ctx.stroke();
                    }
                    if (this.aRoad[i].id % 2 == 0) {
                        ctx.strokeStyle = this.aRaceColours[raceNum].streetLines;
                        if (this.aRoad[i].roadSegWidth > 15 && this.aRoad[i].roadSegWidth <= 25) {
                            ctx.beginPath();
                            ctx.moveTo(tempX0 + (tempX1 - tempX0) * .5, tempY0 + (tempY1 - tempY0) * .5);
                            ctx.lineTo(tempX3 + (tempX2 - tempX3) * .5, tempY3 + (tempY2 - tempY3) * .5);
                            ctx.stroke();
                        }
                        else if (this.aRoad[i].roadSegWidth > 15 && this.aRoad[i].roadSegWidth <= 32) {
                            ctx.beginPath();
                            ctx.moveTo(tempX0 + (tempX1 - tempX0) * .35, tempY0 + (tempY1 - tempY0) * .35);
                            ctx.lineTo(tempX3 + (tempX2 - tempX3) * .35, tempY3 + (tempY2 - tempY3) * .35);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(tempX0 + (tempX1 - tempX0) * .65, tempY0 + (tempY1 - tempY0) * .65);
                            ctx.lineTo(tempX3 + (tempX2 - tempX3) * .65, tempY3 + (tempY2 - tempY3) * .65);
                            ctx.stroke();
                        }
                        else if (this.aRoad[i].roadSegWidth > 15 && this.aRoad[i].roadSegWidth <= 40) {
                            ctx.beginPath();
                            ctx.moveTo(tempX0 + (tempX1 - tempX0) * .25, tempY0 + (tempY1 - tempY0) * .25);
                            ctx.lineTo(tempX3 + (tempX2 - tempX3) * .25, tempY3 + (tempY2 - tempY3) * .25);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(tempX0 + (tempX1 - tempX0) * .5, tempY0 + (tempY1 - tempY0) * .5);
                            ctx.lineTo(tempX3 + (tempX2 - tempX3) * .5, tempY3 + (tempY2 - tempY3) * .5);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(tempX0 + (tempX1 - tempX0) * .75, tempY0 + (tempY1 - tempY0) * .75);
                            ctx.lineTo(tempX3 + (tempX2 - tempX3) * .75, tempY3 + (tempY2 - tempY3) * .75);
                            ctx.stroke();
                        }
                    }
                    if (this.aRoad[i].roadSegWidth > 15) {
                        ctx.strokeStyle = "rgba(30, 26, 22," + this.aRoad[i].mergeInc + ")";
                        var tempF0 = 20;
                        var tempF1 = 20;
                        ctx.lineWidth = aTemp0[4] * .04 + 1;
                        ctx.beginPath();
                        ctx.moveTo(tempX0, tempY0 - tempF0 * tempScale);
                        ctx.lineTo(tempX3, tempY3 - 20 * tempScale1);
                        ctx.lineTo(tempX3, tempY3);
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.moveTo(tempX1, tempY1 - tempF1 * tempScale);
                        ctx.lineTo(tempX2, tempY2 - 20 * tempScale1);
                        ctx.lineTo(tempX2, tempY2);
                        ctx.stroke();
                        if (this.aRoad[i].id % 10 == 0) {
                            ctx.strokeStyle = "rgba(105, 68, 31," + this.aRoad[i].mergeInc + ")";
                            ctx.lineWidth = aTemp0[4] * .05 + 1;
                            ctx.beginPath();
                            ctx.moveTo(tempX2, tempY2 - 200 * tempScale1);
                            ctx.lineTo(tempX2, tempY2);
                            ctx.stroke();
                            ctx.lineWidth = aTemp0[4] * .03 + 1;
                            ctx.beginPath();
                            ctx.moveTo(tempX2 - 30 * tempScale1, tempY2 - 190 * tempScale1);
                            ctx.lineTo(tempX2 + 30 * tempScale1, tempY2 - 190 * tempScale1);
                            ctx.stroke();
                        }
                    }
                    else {
                        ctx.strokeStyle = "rgba(255, 250, 231," + this.aRoad[i].mergeInc + ")";
                        ctx.lineWidth = aTemp0[4] * .05 + 1;
                        if (this.aRoad[i].id % 2 == 0) {
                            ctx.beginPath();
                            ctx.moveTo(tempX3, tempY3 - 10 * tempScale1);
                            ctx.lineTo(tempX3, tempY3);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(tempX1, tempY1 - 10 * tempScale);
                            ctx.lineTo(tempX2, tempY2 - 10 * tempScale1);
                            ctx.lineTo(tempX2, tempY2);
                            ctx.stroke();
                        }
                        else {
                            ctx.beginPath();
                            ctx.moveTo(tempX0, tempY0 - 10 * tempScale);
                            ctx.lineTo(tempX3, tempY3 - 10 * tempScale1);
                            ctx.lineTo(tempX3, tempY3);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(tempX2, tempY2 - 10 * tempScale1);
                            ctx.lineTo(tempX2, tempY2);
                            ctx.stroke();
                        }
                    }
                    tempScale = Math.min((tempScale + tempScale * tempScale * tempScale) * 1.2, 10);
                    var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds["roadSide" + raceNum + this.aRoad[i - 1].leftObjectType0]].x;
                    var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds["roadSide" + raceNum + this.aRoad[i - 1].leftObjectType0]].y;
                    var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds["roadSide" + raceNum + this.aRoad[i - 1].leftObjectType0]].width;
                    var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds["roadSide" + raceNum + this.aRoad[i - 1].leftObjectType0]].height;
                    var tempRevert = 0;
                    if (this.aRoad[i].roadSegWidth < 15 || this.aRoad[i].id >= raceLength || this.aRoad[i].id < 10 || this.aRoad[i].id % 10 == 0 || (this.aRoad[i].angle - this.aRoad[i - 1].angle) > 1.5 || (this.aRoad[i].angle - this.aRoad[i - 1].angle) < -1.5) {
                        this.aRoad[i - 1].leftDistObject0 = .1;
                        this.aRoad[i - 1].rightDistObject0 = .1;
                        if (this.aRoad[i].id >= raceLength && gameState == "game") {
                            bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds.endBanner].x;
                            bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds.endBanner].y;
                            bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds.endBanner].width;
                            bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.endBanner].height;
                        }
                        else if ((gameState == "game" && this.aRoad[i].id < 10) || this.aRoad[i].id % 15 == 0) {
                            bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds["raceBanner" + this.aRoad[i].bannerId]].x;
                            bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds["raceBanner" + this.aRoad[i].bannerId]].y;
                            bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds["raceBanner" + this.aRoad[i].bannerId]].width;
                            bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds["raceBanner" + this.aRoad[i].bannerId]].height;
                        }
                        else if ((this.aRoad[i].angle - this.aRoad[i - 1].angle) > 1.5) {
                            bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds.rightSign].x;
                            bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds.rightSign].y;
                            bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds.rightSign].width;
                            bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.rightSign].height;
                            tempRevert = 1;
                        }
                        else if ((this.aRoad[i].angle - this.aRoad[i - 1].angle) < -1.5) {
                            tempRevert = 2;
                        }
                    }
                    ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, this.aRoad[i - 1].leftVergeEdge.x - ((this.aRoad[i - 1].leftVergeEdge.x - this.aRoad[i - 1].leftHillTop.x) * this.aRoad[i - 1].leftDistObject0) * tempSmoothScale0 - bWidth * tempScale, this.aRoad[i - 1].leftVergeEdge.y - ((this.aRoad[i - 1].leftVergeEdge.y - this.aRoad[i - 1].leftHillTop.y) * this.aRoad[i - 1].leftDistObject0) * tempSmoothScale0 - bHeight * tempScale, bWidth * tempScale, bHeight * tempScale);
                    if (tempRevert == 1) {
                        bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds["roadSide" + raceNum + this.aRoad[i - 1].leftObjectType0]].x;
                        bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds["roadSide" + raceNum + this.aRoad[i - 1].leftObjectType0]].y;
                        bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds["roadSide" + raceNum + this.aRoad[i - 1].leftObjectType0]].width;
                        bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds["roadSide" + raceNum + this.aRoad[i - 1].leftObjectType0]].height;
                    }
                    else if (tempRevert == 2) {
                        bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds.leftSign].x;
                        bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds.leftSign].y;
                        bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds.leftSign].width;
                        bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.leftSign].height;
                    }
                    ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, this.aRoad[i - 1].rightVergeEdge.x - ((this.aRoad[i - 1].rightVergeEdge.x - this.aRoad[i - 1].rightHillTop.x) * this.aRoad[i - 1].rightDistObject0) * tempSmoothScale0, this.aRoad[i - 1].rightVergeEdge.y - ((this.aRoad[i - 1].rightVergeEdge.y - this.aRoad[i - 1].rightHillTop.y) * this.aRoad[i - 1].rightDistObject0) * tempSmoothScale0 - bHeight * tempScale, bWidth * tempScale, bHeight * tempScale);
                    var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds["roadSide" + raceNum + this.aRoad[i - 1].leftObjectType1]].x;
                    var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds["roadSide" + raceNum + this.aRoad[i - 1].leftObjectType1]].y;
                    var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds["roadSide" + raceNum + this.aRoad[i - 1].leftObjectType1]].width;
                    var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds["roadSide" + raceNum + this.aRoad[i - 1].leftObjectType1]].height;
                    ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, this.aRoad[i - 1].leftVergeEdge.x - ((this.aRoad[i - 1].leftVergeEdge.x - this.aRoad[i - 1].leftHillTop.x) * this.aRoad[i - 1].leftDistObject1) * tempSmoothScale0 - bWidth * tempScale, this.aRoad[i - 1].leftVergeEdge.y - ((this.aRoad[i - 1].leftVergeEdge.y - this.aRoad[i - 1].leftHillTop.y) * this.aRoad[i - 1].leftDistObject1) * tempSmoothScale0 - bHeight * tempScale, bWidth * tempScale, bHeight * tempScale);
                    ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, this.aRoad[i - 1].rightVergeEdge.x - ((this.aRoad[i - 1].rightVergeEdge.x - this.aRoad[i - 1].rightHillTop.x) * this.aRoad[i - 1].rightDistObject) * tempSmoothScale0, this.aRoad[i - 1].rightVergeEdge.y - ((this.aRoad[i - 1].rightVergeEdge.y - this.aRoad[i - 1].rightHillTop.y) * this.aRoad[i - 1].rightDistObject) * tempSmoothScale0 - bHeight * tempScale, bWidth * tempScale, bHeight * tempScale);
                }
                if (this.aRoad[i].jump == 1) {
                    ctx.fillStyle = this.aRaceColours[raceNum].jump0;
                    ctx.beginPath();
                    ctx.moveTo(aTempCentre0[0] + aTempCentre0[6], aTempCentre0[1] + this.aRoad[i - 1].height * this.heightRate);
                    ctx.lineTo(aTempCentre1[0] + aTempCentre1[6], aTempCentre1[1] + this.aRoad[i].height * this.heightRate - 8 - .8 * aTempCentre1[4]);
                    ctx.lineTo(aTempCentre1[0] + aTempCentre1[6], aTempCentre1[1] + this.aRoad[i].height * this.heightRate);
                    ctx.fill();
                    ctx.fillStyle = this.aRaceColours[raceNum].jump1;
                    ctx.beginPath();
                    ctx.moveTo(tempX0, tempY0);
                    ctx.lineTo(aTempCentre0[0] + aTempCentre0[6], aTempCentre0[1] + this.aRoad[i - 1].height * this.heightRate);
                    ctx.lineTo(aTempCentre1[0] + aTempCentre1[6], aTempCentre1[1] + this.aRoad[i].height * this.heightRate - 8 - .8 * aTempCentre1[4]);
                    ctx.lineTo(tempX3, tempY3 - 8 - .8 * aTemp3[4]);
                    ctx.fill();
                    ctx.fillStyle = this.aRaceColours[raceNum].jump2;
                    ctx.beginPath();
                    ctx.moveTo(tempX0, tempY0);
                    ctx.lineTo(aTempCentre0[0] + aTempCentre0[6], aTempCentre0[1] + this.aRoad[i - 1].height * this.heightRate);
                    ctx.lineTo(tempX3 + ((aTempCentre1[0] + aTempCentre1[6]) - tempX3) / 2, tempY3 - 8 - .8 * aTemp3[4]);
                    ctx.fill();
                }
                else if (this.aRoad[i].jump == 2) {
                    ctx.fillStyle = this.aRaceColours[raceNum].jump0;
                    ctx.beginPath();
                    ctx.moveTo(aTempCentre0[0] + aTempCentre0[6], aTempCentre0[1] + this.aRoad[i - 1].height * this.heightRate);
                    ctx.lineTo(aTempCentre1[0] + aTempCentre1[6], aTempCentre1[1] + this.aRoad[i].height * this.heightRate - 8 - .8 * aTempCentre1[4]);
                    ctx.lineTo(aTempCentre1[0] + aTempCentre1[6], aTempCentre1[1] + this.aRoad[i].height * this.heightRate);
                    ctx.fill();
                    ctx.fillStyle = this.aRaceColours[raceNum].jump1;
                    ctx.beginPath();
                    ctx.moveTo(tempX1, tempY1);
                    ctx.lineTo(aTempCentre0[0] + aTempCentre0[6], aTempCentre0[1] + this.aRoad[i - 1].height * this.heightRate);
                    ctx.lineTo(aTempCentre1[0] + aTempCentre1[6], aTempCentre1[1] + this.aRoad[i].height * this.heightRate - 8 - .8 * aTempCentre1[4]);
                    ctx.lineTo(tempX2, tempY2 - 8 - .8 * aTemp2[4]);
                    ctx.fill();
                    ctx.fillStyle = this.aRaceColours[raceNum].jump2;
                    ctx.beginPath();
                    ctx.moveTo(tempX1, tempY1);
                    ctx.lineTo(aTempCentre0[0] + aTempCentre0[6], aTempCentre0[1] + this.aRoad[i - 1].height * this.heightRate);
                    ctx.lineTo(tempX2 + ((aTempCentre1[0] + aTempCentre1[6]) - tempX2) / 2, tempY2 - 8 - .8 * aTemp2[4]);
                    ctx.fill();
                }
                if (this.aRoad[i].pickUp > 0) {
                    for (var j = 0; j < aTrackObjects.length; j++) {
                        if (this.aRoad[i].id == aTrackObjects[j].id) {
                            if (!aTrackObjects[j].hasHit) {
                                aTrackObjects[j].x = tempX0 + (tempX1 - tempX0) * this.aRoad[i].pickUp;
                                aTrackObjects[j].y = aTempCentre0[1] + this.aRoad[i - 1].height * this.heightRate;
                                aTrackObjects[j].scaleX = aTrackObjects[j].scaleY = (((aTemp2[5] * 0.001 + (aTemp2[4] * .02 + .06)) * .09) + ((aTemp3[5] * 0.001 + (aTemp3[4] * .02 + .06)) * .09)) * 2;
                                if (aTrackObjects[j].x > userSkater.x - 200 && aTrackObjects[j].x < userSkater.x + 200 && aTrackObjects[j].y > userSkater.y + 200 - 100 && aTrackObjects[j].y < userSkater.y + 200 + 100) {
                                    aTrackObjects[j].hit();
                                }
                                else if (this.magnetCount > 0 && aTrackObjects[j].y > userSkater.y - 100) {
                                    aTrackObjects[j].hit(true);
                                }
                                aTrackObjects[j].update();
                                aTrackObjects[j].render();
                            }
                        }
                    }
                }
                if (i == Math.floor(userSkater.segId)) {
                    userSkater.roadY0 = tempY0;
                    userSkater.roadY1 = tempY1;
                    userSkater.roadY2 = tempY2;
                    userSkater.roadY3 = tempY3;
                }
                for (var j = 0; j < aEnemySkaters.length; j++) {
                    if (i == Math.floor(aEnemySkaters[j].segId) && aEnemySkaters[j].offscreenState == 0) {
                        aEnemySkaters[j].roadX0 = tempX0;
                        aEnemySkaters[j].roadY0 = tempY0;
                        aEnemySkaters[j].roadX1 = tempX1;
                        aEnemySkaters[j].roadY1 = tempY1;
                        aEnemySkaters[j].roadX2 = tempX2;
                        aEnemySkaters[j].roadY2 = tempY2;
                        aEnemySkaters[j].roadX3 = tempX3;
                        aEnemySkaters[j].roadY3 = tempY3;
                        aEnemySkaters[j].roadPrevScale = (((aTemp0[5] * 0.001 + (aTemp0[4] * .02 + .06)) * .09) + ((aTemp1[5] * 0.001 + (aTemp1[4] * .02 + .06)) * .09)) / 2;
                        aEnemySkaters[j].roadScale = (((aTemp2[5] * 0.001 + (aTemp2[4] * .02 + .06)) * .09) + ((aTemp3[5] * 0.001 + (aTemp3[4] * .02 + .06)) * .09)) / 2;
                        aEnemySkaters[j].update();
                        aEnemySkaters[j].render();
                    }
                    else if (aEnemySkaters[j].segId < 0 && aEnemySkaters[j].offscreenState == 0) {
                        aEnemySkaters[j].offScreenEnd();
                    }
                }
                if (ghostSkater) {
                    if (this.aRoad[i].id == ghostSkater.segId) {
                        ghostSkater.roadX0 = tempX0;
                        ghostSkater.roadY0 = tempY0;
                        ghostSkater.roadX1 = tempX1;
                        ghostSkater.roadY1 = tempY1;
                        ghostSkater.roadX2 = tempX2;
                        ghostSkater.roadY2 = tempY2;
                        ghostSkater.roadX3 = tempX3;
                        ghostSkater.roadY3 = tempY3;
                        ghostSkater.roadPrevScale = (((aTemp0[5] * 0.001 + (aTemp0[4] * .02 + .06)) * .09) + ((aTemp1[5] * 0.001 + (aTemp1[4] * .02 + .06)) * .09)) / 2;
                        ghostSkater.roadScale = (((aTemp2[5] * 0.001 + (aTemp2[4] * .02 + .06)) * .09) + ((aTemp3[5] * 0.001 + (aTemp3[4] * .02 + .06)) * .09)) / 2;
                        ghostSkater.update();
                        ghostSkater.render();
                    }
                }
            }
        };
        return Ground;
    }());
    Elements.Ground = Ground;
})(Elements || (Elements = {}));
var Elements;
(function (Elements) {
    var UserSkater = (function () {
        function UserSkater() {
            this.y = 0;
            this.roadTilt = 0;
            this.steerLean = 0;
            this.speed = 0;
            this.maxSpeed = 6.5;
            this.roadY0 = 0;
            this.roadY1 = 0;
            this.roadY2 = 0;
            this.roadY3 = 0;
            this.segSeg = 0;
            this.segId = 0;
            this.speedControlState = 0;
            this.jumpHeight = 0;
            this.jumpSpeed = 0;
            this.isEnemy = false;
            this.boostSpeed = 0;
            this.shakeInc = 0;
            this.bonusId = -1;
            this.drag = .03;
            this.steerPower = .09;
            this.accPower = 3;
            this.raceStarted = false;
            this.dustSoundDelay = 0;
            this.charId = curChar;
            this.oGameElementsImgData = assetLib.getData("gameElements");
            this.oVehiclesImgData = assetLib.getData("vehicles");
            this.segId = 2;
            if (gameState == "game") {
                this.charRider = new Elements.CharRider(curChar);
                this.vehicleId = curChar;
                this.drag = 0.03;
                this.steerPower = .085 + (aCharData[curChar].stats[1] + saveDataHandler.getStatBonus(1) * .042) / 17;
                this.accPower = 1.6 + (aCharData[curChar].stats[0] + saveDataHandler.getStatBonus(0) * .042) * 5;
                this.maxSpeed += (aCharData[curChar].stats[2] + saveDataHandler.getStatBonus(2) * .042) * 3;
                var aTemp = saveDataHandler.getVehicleData(curChar);
                for (var i = 0; i < aTemp.length; i++) {
                    if (aTemp[i] == 2) {
                        this.vehicleId = 14 + i + aCharData[curChar].vehicleType * 3;
                        break;
                    }
                }
                var aTemp = saveDataHandler.getBonusData(curChar);
                for (var i = 0; i < aTemp.length; i++) {
                    if (aTemp[i] == 2) {
                        this.bonusId = i;
                        break;
                    }
                }
            }
            if (gameState != "game") {
                this.speed = 5;
            }
            else {
                this.startRace();
            }
        }
        UserSkater.prototype.startRace = function () {
            var _this = this;
            if (this.speedTween) {
                this.speedTween.kill();
            }
            this.speedTween = TweenLite.to(this, 2.9, {
                speed: this.maxSpeed, delay: 1.3 + 11 * .1, ease: "Quad.easeInOut",
                onComplete: function () {
                    _this.speedControlState = 1;
                },
                onStart: function () {
                    _this.charRider.setAnimType("once", "startGo");
                    _this.raceStarted = true;
                }
            });
        };
        UserSkater.prototype.triggerJump = function () {
            var _this = this;
            if (this.jumpSpeedTween) {
                this.jumpSpeedTween.kill();
            }
            playSound("jump");
            this.charRider.setAnimType("once", "jump");
            this.jumpSpeed = 0;
            this.jumpSpeedTween = TweenLite.to(this, 1 + (aCharData[curChar].stats[2] + saveDataHandler.getStatBonus(2) * .042) * .1, {
                jumpSpeed: 2, ease: "Quad.easeIn",
                onComplete: function () {
                    _this.jumpSpeedTween = TweenLite.to(_this, 1, {
                        jumpSpeed: 0, ease: "Quad.easeOut",
                        onComplete: function () {
                        }
                    });
                }
            });
            if (this.jumpTween) {
                this.jumpTween.kill();
            }
            this.jumpTween = TweenLite.to(this, .4, {
                jumpHeight: -300, ease: "Quad.easeOut",
                onComplete: function () {
                    _this.jumpTween = TweenLite.to(_this, 1, {
                        jumpHeight: 0, ease: "Bounce.easeOut",
                        onComplete: function () {
                        }
                    });
                }
            });
        };
        UserSkater.prototype.triggerCrash = function () {
            var _this = this;
            if (this.jumpSpeedTween) {
                this.jumpSpeedTween.kill();
            }
            this.jumpSpeed = 0;
            if (this.boostTween) {
                this.boostTween.kill();
            }
            this.boostSpeed = 0;
            if (this.jumpTween) {
                this.jumpTween.kill();
            }
            this.jumpTween = TweenLite.to(this, .2, {
                jumpHeight: -200, ease: "Quad.easeOut",
                onComplete: function () {
                    _this.jumpTween = TweenLite.to(_this, .8, {
                        jumpHeight: 0, ease: "Bounce.easeOut",
                        onComplete: function () {
                        }
                    });
                }
            });
        };
        UserSkater.prototype.hitBoost = function () {
            var _this = this;
            if (this.boostTween) {
                this.boostTween.kill();
            }
            this.boostTween = TweenLite.to(this, .3 + (aCharData[curChar].stats[2] + saveDataHandler.getStatBonus(2) * .042) * .1, {
                boostSpeed: 3, ease: "Quad.easeIn",
                onComplete: function () {
                    _this.boostTween = TweenLite.to(_this, 1, {
                        boostSpeed: 0, delay: .5, ease: "Quad.easeOut",
                        onComplete: function () {
                        }
                    });
                }
            });
        };
        UserSkater.prototype.update = function () {
            this.x = canvas.width / 2;
            if (gameState != "game") {
                return;
            }
            if (this.speedControlState == 1) {
                this.speed = Math.min(this.speed + delta * this.accPower, this.maxSpeed) + this.jumpSpeed + this.boostSpeed;
            }
            panel.jaggedFrameScale = Math.max(1.5 - (this.jumpSpeed + this.boostSpeed) * .2 + Math.sin(panel.incY) * .05 + (1 - (this.speed / this.maxSpeed)), 1);
            this.steerLean += (ground.steer - this.steerLean) * (.005 * this.speed);
            this.rotation = -this.steerLean * .3;
            if (this.jumpHeight == 0) {
                if (this.rotation > .1) {
                    if (Math.random() < this.rotation * 2) {
                        if (this.dustSoundDelay > .1) {
                            playSound("dust");
                            this.dustSoundDelay = 0;
                        }
                        if (Math.random() < .5) {
                            addParticle(this.x, this.y + Math.random() * 80 + 170, -(Math.random() * 60 + 45));
                        }
                        else {
                            addParticle(this.x, this.y + Math.random() * 80 + 170, Math.random() * 60 + 45);
                        }
                    }
                }
                else if (this.rotation < -.1) {
                    if (Math.random() < -this.rotation * 2) {
                        if (this.dustSoundDelay > .1) {
                            playSound("dust");
                            this.dustSoundDelay = 0;
                        }
                        if (Math.random() < .5) {
                            addParticle(this.x, this.y + Math.random() * 80 + 170, -(Math.random() * 60 + 45));
                        }
                        else {
                            addParticle(this.x, this.y + Math.random() * 80 + 170, Math.random() * 60 + 45);
                        }
                    }
                }
            }
            this.dustSoundDelay += delta;
            this.charRider.setFrame(Math.max(Math.min(Math.round(this.rotation * 34) + 9, 18), 0) + aCharData[this.charId].tiltFrameStart);
            this.shakeInc = Math.sin(panel.incY * 1.1) * (this.speed * Math.abs(ground.aRoad[1].angle - ground.aRoad[0].angle)) * .4;
            var easedSegSeg = ground.easeOutSine(this.segSeg, 0, 1, 1) * .31 + this.segSeg * .69;
            var percY0 = (this.roadY0 + this.roadY1) / 2;
            var percY1 = (this.roadY3 + this.roadY2) / 2;
            this.y += ((percY0 + (percY1 - percY0) * easedSegSeg) - this.y) * .2;
            if (this.segSeg >= 1) {
                this.segId += 1;
                this.segSeg -= 1;
            }
            else if (this.segSeg <= 0) {
                this.segId -= 1;
                this.segSeg += 1;
            }
            if (this.jumpHeight == 0 && ((ground.aRoad[Math.max(this.segId - 1, 0)].jump == 1 && ground.carPos < .5) || (ground.aRoad[Math.max(this.segId - 1, 0)].jump == 2 && ground.carPos > .5))) {
                this.triggerJump();
            }
        };
        UserSkater.prototype.render = function () {
            if (gameState != "game") {
                return;
            }
            var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds.testShadow].x;
            var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds.testShadow].y;
            var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds.testShadow].width;
            var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.testShadow].height;
            ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, this.x - bWidth / 2, this.y + 260 - bHeight, bWidth, bHeight);
            if (aCharData[curChar].vehicleType == 0) {
                var bX = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart0" + this.vehicleId]].x;
                var bY = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart0" + this.vehicleId]].y;
                var bWidth = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart0" + this.vehicleId]].width;
                var bHeight = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart0" + this.vehicleId]].height;
                ctx.drawImage(this.oVehiclesImgData.img, bX, bY, bWidth, bHeight, this.x - bWidth / 2 + this.shakeInc, this.y + 250 + this.jumpHeight - 260, bWidth, bHeight);
                ctx.fillStyle = aCharData[this.vehicleId].boardCol;
                var tempY = this.y + 250 + this.jumpHeight - 125;
                ctx.beginPath();
                ctx.moveTo(this.x - 20 + this.shakeInc, tempY);
                ctx.lineTo(this.x + 20 + this.shakeInc, tempY);
                ctx.lineTo(this.x + 35 - this.rotation * 100 + this.shakeInc * 1.5, tempY + 70 + this.jumpHeight * .2 + ground.aRoad[this.segId].height * 25);
                ctx.lineTo(this.x - 35 - this.rotation * 100 + this.shakeInc * 1.5, tempY + 70 + this.jumpHeight * .2 + ground.aRoad[this.segId].height * 25);
                ctx.fill();
                ctx.lineWidth = 2;
                ctx.strokeStyle = "#000000";
                ctx.beginPath();
                ctx.moveTo(this.x - 20 + this.shakeInc, tempY);
                ctx.lineTo(this.x - 35 - this.rotation * 100 + this.shakeInc * 1.5, tempY + 70 + this.jumpHeight * .2 + ground.aRoad[this.segId].height * 25);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(this.x + 20 + this.shakeInc, tempY);
                ctx.lineTo(this.x + 35 - this.rotation * 100 + this.shakeInc * 1.5, tempY + 70 + this.jumpHeight * .2 + ground.aRoad[this.segId].height * 25);
                ctx.stroke();
                this.charRider.x = this.x - this.rotation * 50 + this.shakeInc * 1.2;
                this.charRider.y = this.y + this.jumpHeight + ground.aRoad[this.segId].height * 10;
                this.charRider.update();
                this.charRider.render();
                var bX = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart1" + this.vehicleId]].x;
                var bY = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart1" + this.vehicleId]].y;
                var bWidth = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart1" + this.vehicleId]].width;
                var bHeight = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart1" + this.vehicleId]].height;
                ctx.drawImage(this.oVehiclesImgData.img, bX, bY, bWidth, bHeight, this.x - bWidth / 2 - this.rotation * 100 + this.shakeInc * 1.5, this.y - bHeight * .4 + 250 + this.jumpHeight - 55 + this.jumpHeight * .2 + ground.aRoad[this.segId].height * 25, bWidth, bHeight);
                if (this.bonusId != -1) {
                    var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds["bonus" + this.bonusId + 0]].x;
                    var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds["bonus" + this.bonusId + 0]].y;
                    var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds["bonus" + this.bonusId + 0]].width;
                    var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds["bonus" + this.bonusId + 0]].height;
                    ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, this.x - this.rotation * 100 + this.shakeInc * 1.5 - bWidth / 2, this.y + 250 + this.jumpHeight - 55 + this.jumpHeight * .2 + ground.aRoad[this.segId].height * 25 - bHeight, bWidth, bHeight);
                }
            }
            else {
                var bX = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart0" + this.vehicleId]].x;
                var bY = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart0" + this.vehicleId]].y;
                var bWidth = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart0" + this.vehicleId]].width;
                var bHeight = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart0" + this.vehicleId]].height;
                ctx.drawImage(this.oVehiclesImgData.img, bX, bY, bWidth, bHeight, this.x - bWidth / 2 + this.rotation * 50 + this.shakeInc, this.y + 250 + this.jumpHeight - 142, bWidth, bHeight);
                var bX = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart1" + this.vehicleId]].x;
                var bY = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart1" + this.vehicleId]].y;
                var bWidth = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart1" + this.vehicleId]].width;
                var bHeight = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart1" + this.vehicleId]].height;
                ctx.drawImage(this.oVehiclesImgData.img, bX, bY, bWidth, bHeight, this.x - bWidth / 2 - this.rotation * 100 + this.shakeInc * 1.5, this.y + 250 + this.jumpHeight - 61 + this.jumpHeight * .2 + ground.aRoad[this.segId].height * 25, bWidth, bHeight);
                ctx.fillStyle = aCharData[this.vehicleId].boardCol;
                var tempY = this.y + 250 + this.jumpHeight - 131;
                ctx.beginPath();
                ctx.moveTo(this.x - 26 + this.rotation * 50 + this.shakeInc, tempY);
                ctx.lineTo(this.x + 26 + this.rotation * 50 + this.shakeInc, tempY);
                ctx.lineTo(this.x + 46 - this.rotation * 100 + this.shakeInc * 1.5, tempY + 72 + this.jumpHeight * .2 + ground.aRoad[this.segId].height * 25);
                ctx.lineTo(this.x - 46 - this.rotation * 100 + this.shakeInc * 1.5, tempY + 72 + this.jumpHeight * .2 + ground.aRoad[this.segId].height * 25);
                ctx.fill();
                ctx.lineWidth = 2;
                ctx.strokeStyle = "#000000";
                ctx.beginPath();
                ctx.moveTo(this.x - 26 + this.rotation * 50 + this.shakeInc, tempY);
                ctx.lineTo(this.x - 46 - this.rotation * 100 + this.shakeInc * 1.5, tempY + 72 + this.jumpHeight * .2 + ground.aRoad[this.segId].height * 25);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(this.x + 26 + this.rotation * 50 + this.shakeInc, tempY);
                ctx.lineTo(this.x + 46 - this.rotation * 100 + this.shakeInc * 1.5, tempY + 72 + this.jumpHeight * .2 + ground.aRoad[this.segId].height * 25);
                ctx.stroke();
                this.charRider.x = this.x - this.rotation * 50 + this.shakeInc * 1.2;
                this.charRider.y = this.y + this.jumpHeight + ground.aRoad[this.segId].height * 10;
                this.charRider.update();
                this.charRider.render();
                if (this.bonusId != -1) {
                    var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds["bonus" + this.bonusId + 1]].x;
                    var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds["bonus" + this.bonusId + 1]].y;
                    var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds["bonus" + this.bonusId + 1]].width;
                    var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds["bonus" + this.bonusId + 1]].height;
                    ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, this.x - this.rotation * 100 + this.shakeInc * 1.5 - bWidth / 2, this.y + 250 + this.jumpHeight - 55 + this.jumpHeight * .2 + ground.aRoad[this.segId].height * 25 - bHeight, bWidth, bHeight);
                }
            }
        };
        return UserSkater;
    }());
    Elements.UserSkater = UserSkater;
})(Elements || (Elements = {}));
var Elements;
(function (Elements) {
    var EnemySkater = (function () {
        function EnemySkater(_startPosId, _charId) {
            this.roadTilt = 0;
            this.steerLean = 0;
            this.x = 0;
            this.y = 0;
            this.scale = 0;
            this.targX = 0;
            this.targY = 0;
            this.targScale = 0;
            this.speed = 0;
            this.segSeg = 0;
            this.roadScale = 0;
            this.roadPrevScale = 0;
            this.easedSegSeg = 0;
            this.roadXPerc = 0;
            this.removeMe = false;
            this.nearOff = false;
            this.offscreenState = 0;
            this.offscreenEndInc = 0;
            this.speedControlState = 0;
            this.newRoadPosComplete = false;
            this.jumpHeight = 0;
            this.jumpSpeed = 0;
            this.controlledSpeed = 0;
            this.isEnemy = true;
            this.slowSpeed = 1;
            this.charGroundOffsetY = 20;
            this.testChar = Math.floor(Math.random() * 14);
            this.startPosId = _startPosId;
            this.charId = _charId;
            this.oGameElementsImgData = assetLib.getData("gameElements");
            this.oVehiclesImgData = assetLib.getData("vehicles");
            this.oEnemyCharsImgData = assetLib.getData("enemyChars");
            this.segId = this.startPosId * 1 + 3;
            this.roadXPerc = (this.startPosId % 2) * .4 + .3;
            this.prevRoadXPerc = this.roadXPerc;
            this.startRace();
        }
        EnemySkater.prototype.makeSlow = function () {
            var _this = this;
            if (this.slowTween) {
                this.slowTween.kill();
            }
            this.slowTween = TweenLite.to(this, .3, {
                slowSpeed: 0, ease: "Quad.easeIn",
                onComplete: function () {
                    _this.slowTween = TweenLite.to(_this, 1, {
                        slowSpeed: 1, delay: 1, ease: "Quad.easeOut",
                        onComplete: function () {
                        }
                    });
                }
            });
        };
        EnemySkater.prototype.triggerJump = function () {
            var _this = this;
            if (this.jumpSpeedTween) {
                this.jumpSpeedTween.kill();
            }
            this.jumpSpeed = 0;
            this.jumpSpeedTween = TweenLite.to(this, 1, {
                jumpSpeed: 2, ease: "Quad.easeIn",
                onComplete: function () {
                    _this.jumpSpeedTween = TweenLite.to(_this, 1, {
                        jumpSpeed: 0, ease: "Quad.easeOut",
                        onComplete: function () {
                        }
                    });
                }
            });
            if (this.jumpTween) {
                this.jumpTween.kill();
            }
            this.jumpTween = TweenLite.to(this, .4, {
                jumpHeight: -300, ease: "Quad.easeOut",
                onComplete: function () {
                    _this.jumpTween = TweenLite.to(_this, 1, {
                        jumpHeight: 0, ease: "Bounce.easeOut",
                        onComplete: function () {
                        }
                    });
                }
            });
        };
        EnemySkater.prototype.startRace = function () {
            var _this = this;
            if (this.speedTween) {
                this.speedTween.kill();
            }
            this.speedTween = TweenLite.to(this, .5 + (11 - this.startPosId) * .2, {
                controlledSpeed: userSkater.maxSpeed, ease: "Quad.easeInOut", delay: 1 + (11 - this.startPosId) * .1,
                onComplete: function () {
                    _this.setNewSpeed();
                    _this.setNewRoadXPos();
                    _this.speedControlState = 1;
                },
                onStart: function () {
                }
            });
        };
        EnemySkater.prototype.getSpeed = function () {
            return Math.random() * (userSkater.maxSpeed * .25 - raceNum * .01) + (userSkater.maxSpeed * (.75 + this.startPosId * 0.004 + raceNum * .01));
        };
        EnemySkater.prototype.setNewRoadXPos = function (_force) {
            var _this = this;
            if (_force === void 0) { _force = null; }
            if (this.roadXTween) {
                this.roadXTween.kill();
            }
            var tempTime = .5;
            if (_force == null) {
                _force = Math.random() * .8 + .1;
                tempTime = Math.random() * 2 + 2;
            }
            else {
                this.newRoadPosComplete = false;
            }
            this.roadXTween = TweenLite.to(this, tempTime, {
                roadXPerc: _force, ease: "Quad.easeInOut",
                onComplete: function () {
                    _this.setNewRoadXPos();
                    _this.newRoadPosComplete = true;
                }
            });
        };
        EnemySkater.prototype.setNewSpeed = function (_force) {
            var _this = this;
            if (_force === void 0) { _force = null; }
            if (this.speedTween) {
                this.speedTween.kill();
            }
            if (_force == null) {
                _force = this.getSpeed();
            }
            this.speedTween = TweenLite.to(this, Math.random() * 2 + 2, {
                controlledSpeed: _force, ease: "Quad.easeInOut",
                onComplete: function () {
                    _this.setNewSpeed();
                }
            });
        };
        EnemySkater.prototype.setOffSpeed = function () {
            var _this = this;
            if (this.speedTween) {
                this.speedTween.kill();
            }
            this.speedTween = TweenLite.to(this, 1, {
                controlledSpeed: Math.min(this.speed, userSkater.speed - 2), ease: "Quad.easeIn",
                onComplete: function () {
                    if (_this.segId <= 3) {
                        _this.setOffSpeed();
                    }
                    else {
                        _this.setNewSpeed();
                    }
                }
            });
        };
        EnemySkater.prototype.offScreenEnd = function () {
            if (this.speedTween) {
                this.speedTween.kill();
            }
            if (this.roadXTween) {
                this.roadXTween.kill();
            }
            if (this.charId != challengeChar) {
                playSound("overtake");
            }
            this.offscreenState = 1;
            this.offscreenEndInc = 1;
        };
        EnemySkater.prototype.backOnFromEnd = function () {
            this.offscreenState = 0;
            this.segId = 1;
            if (this.charId != challengeChar) {
                playSound("enemyOvertake");
            }
            if (ground.carPosTarg < .5) {
                this.prevRoadXPerc = this.roadXPerc = Math.random() * .35 + .55;
            }
            else {
                this.prevRoadXPerc = this.roadXPerc = Math.random() * .35 + .1;
            }
            this.controlledSpeed = userSkater.maxSpeed;
            this.setNewSpeed();
            this.setNewRoadXPos();
            this.nearOff = false;
        };
        EnemySkater.prototype.update = function () {
            if (this.offscreenState == 1) {
                this.offscreenEndInc += (userSkater.speed - (userSkater.maxSpeed - 1)) * delta;
                if (this.offscreenEndInc < 0) {
                    this.backOnFromEnd();
                }
                return;
            }
            this.speed = (this.controlledSpeed + this.jumpSpeed) * this.slowSpeed;
            if (this.segId <= 3 && this.speed < userSkater.speed && !this.nearOff) {
                this.nearOff = true;
                this.setOffSpeed();
            }
            this.roadTilt += (((ground.aRoad[this.segId].angle - ground.aRoad[Math.max(this.segId - 1, 0)].angle) - (this.prevRoadXPerc - this.roadXPerc) * 300) - this.roadTilt) * .2;
            this.prevRoadXPerc = this.roadXPerc;
            this.segSeg += (userSkater.speed + (this.speed - userSkater.speed)) * delta;
            var easedSegSeg = ground.easeOutSine(this.segSeg, 0, 1, 1) * .31 + this.segSeg * .69;
            var percX0 = this.roadX0 + (this.roadX1 - this.roadX0) * this.roadXPerc;
            var percX1 = this.roadX3 + (this.roadX2 - this.roadX3) * this.roadXPerc;
            var percY0 = this.roadY0 + (this.roadY1 - this.roadY0) * this.roadXPerc;
            var percY1 = this.roadY3 + (this.roadY2 - this.roadY3) * this.roadXPerc;
            this.x += ((percX0 + (percX1 - percX0) * easedSegSeg) - this.x) * .7;
            this.y += ((percY0 + (percY1 - percY0) * easedSegSeg) - this.y) * .3;
            this.scale += ((this.roadPrevScale * 1.2 + ((this.roadScale * 1.2) - this.roadPrevScale * 1.2) * easedSegSeg) - this.scale) * .3;
            this.rotation = this.roadTilt * .08;
            if (this.segSeg >= 1) {
                this.segId += 1;
                this.segSeg -= 1;
            }
            else if (this.segSeg <= 0) {
                this.segId -= 1;
                this.segSeg += 1;
            }
            if (this.x > userSkater.x - 120 && this.x < userSkater.x + 120 && this.y > userSkater.y && this.y < userSkater.y + 30 && userSkater.speedControlState == 1 && userSkater.segId >= this.segId - 1 && userSkater.segId <= this.segId + 1 && this.charId != challengeChar) {
                if (this.speedTween) {
                    this.speedTween.kill();
                }
                playSound("hitEnemy");
                this.speed = userSkater.maxSpeed;
                this.setNewSpeed();
                this.setNewRoadXPos();
                userSkater.triggerCrash();
                userSkater.speed *= .3;
            }
            if (this.charId != challengeChar) {
                for (var i = 0; i < aEnemySkaters.length; i++) {
                    if (aEnemySkaters[i].charId != this.charId && aEnemySkaters[i].charId != challengeChar) {
                        if (this.x > aEnemySkaters[i].x - 300 * this.scale
                            && this.x < aEnemySkaters[i].x + 300 * this.scale
                            && this.y > aEnemySkaters[i].y - 100 * this.scale && this.y < aEnemySkaters[i].y + 100 * this.scale
                            && this.speedControlState == 1
                            && this.newRoadPosComplete
                            && aEnemySkaters[i].newRoadPosComplete
                            && this.segId <= aEnemySkaters[i].segId + 6
                            && this.segId >= aEnemySkaters[i].segId - 6) {
                            this.newRoadPosComplete = false;
                            aEnemySkaters[i].newRoadPosComplete = false;
                            if (this.x > aEnemySkaters[i].x) {
                                var tempRoadXPerc = this.roadXPerc;
                                this.setNewRoadXPos(Math.min(aEnemySkaters[i].roadXPerc + .2, .8));
                                aEnemySkaters[i].setNewRoadXPos(Math.max(tempRoadXPerc - .2, .2));
                            }
                            else {
                                var tempRoadXPerc = this.roadXPerc;
                                this.setNewRoadXPos(Math.max(aEnemySkaters[i].roadXPerc - .2, .2));
                                aEnemySkaters[i].setNewRoadXPos(Math.min(tempRoadXPerc + .2, .8));
                            }
                        }
                    }
                }
            }
            if (this.y + Math.min((canvas.height - (userSkater.y + 200)), 0) > canvas.height || this.segId < 0) {
                this.offScreenEnd();
            }
            if (this.segId >= 0 && this.segId < ground.aRoad.length && this.jumpHeight == 0 && ((ground.aRoad[this.segId].jump == 1 && this.roadXPerc < .5) || (ground.aRoad[this.segId].jump == 2 && this.roadXPerc > .5))) {
                this.triggerJump();
            }
        };
        EnemySkater.prototype.renderPointer = function () {
            if (challengeTime != -1) {
                return;
            }
            var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds["charPointer" + this.charId]].x;
            var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds["charPointer" + this.charId]].y;
            var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds["charPointer" + this.charId]].width;
            var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds["charPointer" + this.charId]].height;
            var tempScale = Math.max(this.scale * 2, .3);
            ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, this.x - (bWidth / 2) * tempScale, this.y + (this.jumpHeight - 400) * this.scale - 50 * tempScale - bHeight * tempScale, bWidth * tempScale, bHeight * tempScale);
        };
        EnemySkater.prototype.render = function () {
            if (this.charId == challengeChar) {
                return;
            }
            var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds.testShadow].x;
            var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds.testShadow].y;
            var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds.testShadow].width;
            var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.testShadow].height;
            ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, this.x - bWidth / 2 * this.scale, this.y - bHeight * this.scale, bWidth * this.scale, bHeight * this.scale);
            if (aCharData[this.charId].vehicleType == 0) {
                var bX = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart0" + this.charId]].x;
                var bY = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart0" + this.charId]].y;
                var bWidth = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart0" + this.charId]].width;
                var bHeight = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart0" + this.charId]].height;
                ctx.drawImage(this.oVehiclesImgData.img, bX, bY, bWidth, bHeight, this.x - (bWidth / 2) * this.scale, this.y + (this.charGroundOffsetY + this.jumpHeight - 260) * this.scale, bWidth * this.scale, bHeight * this.scale);
                ctx.fillStyle = aCharData[this.charId].boardCol;
                var tempY = this.y + (this.charGroundOffsetY + this.jumpHeight - 125) * this.scale;
                ctx.beginPath();
                ctx.moveTo(this.x - 20 * this.scale, tempY);
                ctx.lineTo(this.x + 20 * this.scale, tempY);
                ctx.lineTo(this.x + 35 * this.scale + (this.roadXPerc - ground.carPos) * 200 * this.scale, tempY + (30 + this.jumpHeight * .2) * this.scale);
                ctx.lineTo(this.x - 35 * this.scale + (this.roadXPerc - ground.carPos) * 200 * this.scale, tempY + (30 + this.jumpHeight * .2) * this.scale);
                ctx.fill();
                ctx.lineWidth = 2 * this.scale;
                ctx.strokeStyle = "#000000";
                ctx.beginPath();
                ctx.moveTo(this.x - 20 * this.scale, tempY);
                ctx.lineTo(this.x - 35 * this.scale + (this.roadXPerc - ground.carPos) * 200 * this.scale, tempY + (30 + this.jumpHeight * .2) * this.scale);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(this.x + 20 * this.scale, tempY);
                ctx.lineTo(this.x + 35 * this.scale + (this.roadXPerc - ground.carPos) * 200 * this.scale, tempY + (30 + this.jumpHeight * .2) * this.scale);
                ctx.stroke();
                var tempCharId = "stillChar" + this.charId;
                if (panel.lightningZapId == this.charId && panel.incY < panel.lightningZapInc + 30 && Math.floor(panel.incY) % 2) {
                    tempCharId = "zapChar" + this.charId;
                }
                var bX = this.oEnemyCharsImgData.oData.oAtlasData[oImageIds[tempCharId]].x;
                var bY = this.oEnemyCharsImgData.oData.oAtlasData[oImageIds[tempCharId]].y;
                var bWidth = this.oEnemyCharsImgData.oData.oAtlasData[oImageIds[tempCharId]].width;
                var bHeight = this.oEnemyCharsImgData.oData.oAtlasData[oImageIds[tempCharId]].height;
                ctx.drawImage(this.oEnemyCharsImgData.img, bX, bY, bWidth, bHeight, this.x - (this.rotation * 50 * 1.2) * this.scale - (bWidth / 2) * this.scale + aCharData[this.charId].oStillCharOffset.x * this.scale, this.y + (this.jumpHeight - 250) * this.scale - (bHeight / 2) * this.scale + aCharData[this.charId].oStillCharOffset.y * this.scale, bWidth * this.scale, bHeight * this.scale);
                var bX = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart1" + this.charId]].x;
                var bY = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart1" + this.charId]].y;
                var bWidth = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart1" + this.charId]].width;
                var bHeight = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart1" + this.charId]].height;
                ctx.drawImage(this.oVehiclesImgData.img, bX, bY, bWidth, bHeight, this.x - (bWidth / 2) * this.scale + (this.roadXPerc - ground.carPos) * 200 * this.scale, tempY - (bHeight * .4) * this.scale + (30 + this.jumpHeight * .2) * this.scale, bWidth * this.scale, bHeight * this.scale);
            }
            else {
                var tempY = this.y + (this.charGroundOffsetY + this.jumpHeight - 130) * this.scale;
                var bX = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart0" + this.charId]].x;
                var bY = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart0" + this.charId]].y;
                var bWidth = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart0" + this.charId]].width;
                var bHeight = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart0" + this.charId]].height;
                ctx.drawImage(this.oVehiclesImgData.img, bX, bY, bWidth, bHeight, this.x - (bWidth / 2) * this.scale - Math.max(Math.min((this.roadXPerc - ground.carPos), .2), -.2) * 200 * this.scale, this.y + (bHeight * .2) * this.scale + (this.charGroundOffsetY + this.jumpHeight - 147) * this.scale, bWidth * this.scale, bHeight * this.scale);
                var bX = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart1" + this.charId]].x;
                var bY = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart1" + this.charId]].y;
                var bWidth = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart1" + this.charId]].width;
                var bHeight = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart1" + this.charId]].height;
                ctx.drawImage(this.oVehiclesImgData.img, bX, bY, bWidth, bHeight, this.x - (bWidth / 2) * this.scale - (this.rotation * 100 * .5) * this.scale + Math.max(Math.min((this.roadXPerc - ground.carPos), .2), -.2) * 200 * this.scale, tempY + (35 + this.jumpHeight * .2) * this.scale, bWidth * this.scale, bHeight * this.scale);
                ctx.fillStyle = aCharData[this.charId].boardCol;
                ctx.beginPath();
                ctx.moveTo(this.x - 26 * this.scale - Math.max(Math.min((this.roadXPerc - ground.carPos), .2), -.2) * 200 * this.scale, tempY);
                ctx.lineTo(this.x + 26 * this.scale - Math.max(Math.min((this.roadXPerc - ground.carPos), .2), -.2) * 200 * this.scale, tempY);
                ctx.lineTo(this.x + 46 * this.scale - (this.rotation * 100 * .5) * this.scale + Math.max(Math.min((this.roadXPerc - ground.carPos), .2), -.2) * 200 * this.scale, tempY + (37 + this.jumpHeight * .2) * this.scale);
                ctx.lineTo(this.x - 46 * this.scale - (this.rotation * 100 * .5) * this.scale + Math.max(Math.min((this.roadXPerc - ground.carPos), .2), -.2) * 200 * this.scale, tempY + (37 + this.jumpHeight * .2) * this.scale);
                ctx.fill();
                ctx.lineWidth = 2 * this.scale;
                ctx.strokeStyle = "#000000";
                ctx.beginPath();
                ctx.moveTo(this.x - 26 * this.scale - Math.max(Math.min((this.roadXPerc - ground.carPos), .2), -.2) * 200 * this.scale, tempY);
                ctx.lineTo(this.x - 46 * this.scale - (this.rotation * 100 * .5) * this.scale + Math.max(Math.min((this.roadXPerc - ground.carPos), .2), -.2) * 200 * this.scale, tempY + (37 + this.jumpHeight * .2) * this.scale);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(this.x + 26 * this.scale - Math.max(Math.min((this.roadXPerc - ground.carPos), .2), -.2) * 200 * this.scale, tempY);
                ctx.lineTo(this.x + 46 * this.scale - (this.rotation * 100 * .5) * this.scale + Math.max(Math.min((this.roadXPerc - ground.carPos), .2), -.2) * 200 * this.scale, tempY + (37 + this.jumpHeight * .2) * this.scale);
                ctx.stroke();
                var tempCharId = "stillChar" + this.charId;
                if (panel.lightningZapId == this.charId && panel.incY < panel.lightningZapInc + 30 && Math.floor(panel.incY) % 2) {
                    tempCharId = "zapChar" + this.charId;
                }
                var bX = this.oEnemyCharsImgData.oData.oAtlasData[oImageIds[tempCharId]].x;
                var bY = this.oEnemyCharsImgData.oData.oAtlasData[oImageIds[tempCharId]].y;
                var bWidth = this.oEnemyCharsImgData.oData.oAtlasData[oImageIds[tempCharId]].width;
                var bHeight = this.oEnemyCharsImgData.oData.oAtlasData[oImageIds[tempCharId]].height;
                ctx.drawImage(this.oEnemyCharsImgData.img, bX, bY, bWidth, bHeight, this.x - (this.rotation * 100 * .2) * this.scale - (bWidth / 2) * this.scale + aCharData[this.charId].oStillCharOffset.x * this.scale, this.y + (this.jumpHeight - 250) * this.scale - (bHeight / 2) * this.scale + aCharData[this.charId].oStillCharOffset.y * this.scale, bWidth * this.scale, bHeight * this.scale);
            }
        };
        return EnemySkater;
    }());
    Elements.EnemySkater = EnemySkater;
})(Elements || (Elements = {}));
var Elements;
(function (Elements) {
    var Coin = (function (_super) {
        __extends(Coin, _super);
        function Coin(_id) {
            var _this = _super.call(this, assetLib.getData("coin"), 20, 60, "spin" + Math.floor(Math.random() * 10)) || this;
            _this.removeMe = false;
            _this.hasHit = false;
            _this.id = _id;
            _this.offsetY = -100;
            return _this;
        }
        Coin.prototype.hit = function (_hitUserFirst) {
            var _this = this;
            if (_hitUserFirst === void 0) { _hitUserFirst = false; }
            this.hasHit = true;
            playSound("coin" + Math.floor(Math.random() * 3));
            if (!_hitUserFirst) {
                TweenLite.to(this, .3, {
                    x: canvas.width * .73, y: 0, scaleX: .5, scaleY: .5, ease: "Quad.easeOut",
                    onComplete: function () {
                        panel.jiggleCash();
                        saveDataHandler.updateCash(5);
                        _this.removeMe = true;
                    }
                });
            }
            else {
                TweenLite.to(this, .3, {
                    x: userSkater.x, y: userSkater.y, scaleX: .5, scaleY: .5, ease: "Quad.easeOut",
                    onComplete: function () {
                        TweenLite.to(_this, .3, {
                            x: canvas.width * .73, y: 0, scaleX: .5, scaleY: .5, ease: "Quad.easeInOut",
                            onComplete: function () {
                                panel.jiggleCash();
                                saveDataHandler.updateCash(5);
                                _this.removeMe = true;
                            }
                        });
                    }
                });
            }
        };
        Coin.prototype.update = function (_trackX, _trackY) {
            _super.prototype.updateAnimation.call(this, delta);
            if (!this.hasHit && this.y > canvas.height) {
                this.removeMe = true;
            }
        };
        Coin.prototype.render = function () {
            _super.prototype.renderSimple.call(this, ctx);
        };
        return Coin;
    }(Utils.AnimSprite));
    Elements.Coin = Coin;
})(Elements || (Elements = {}));
var Elements;
(function (Elements) {
    var Shard = (function () {
        function Shard(_x, _y, _angle) {
            var _this = this;
            this.removeMe = false;
            this.offsetX = 0;
            this.startX = _x;
            this.startY = _y;
            this.scale = Math.random() * 15 + 15;
            this.angle = _angle;
            this.col = ground.aRaceColours[raceNum].shards;
            this.inc = Math.random() * 50 + 50;
            var tempTime = Math.random() * .4 + .4;
            if (this.angle > 0) {
                TweenLite.to(this, tempTime, {
                    startX: this.startX + (Math.random() * 300 + 300), angle: 100, scale: 0, ease: "Quad.easeOut",
                    onComplete: function () {
                        _this.removeMe = true;
                    }
                });
            }
            else {
                TweenLite.to(this, tempTime, {
                    startX: this.startX - (Math.random() * 300 + 300), angle: -100, scale: 0, ease: "Quad.easeOut",
                    onComplete: function () {
                        _this.removeMe = true;
                    }
                });
            }
            TweenLite.to(this, tempTime * .25, {
                startY: this.startY - (Math.random() * 100), ease: "Cubic.easeOut",
                onComplete: function () {
                    TweenLite.to(_this, tempTime * .75, {
                        startY: _this.startY + (Math.random() * 300 + 300), ease: "Cubic.easeIn",
                        onComplete: function () {
                        }
                    });
                }
            });
        }
        Shard.prototype.update = function () {
            this.offsetX -= ((ground.carPosTarg - ground.carPos) * 10000) * delta;
            this.endX = this.scale * Math.cos((this.angle + 90) * radian);
            this.endY = this.scale * Math.sin((this.angle + 90) * radian);
        };
        Shard.prototype.render = function () {
            ctx.strokeStyle = this.col;
            ctx.lineWidth = this.scale * 1;
            ctx.beginPath();
            ctx.moveTo(this.startX + this.offsetX, this.startY);
            ctx.lineTo(this.startX - this.endX + this.offsetX, this.startY - this.endY);
            ctx.stroke();
        };
        return Shard;
    }());
    Elements.Shard = Shard;
})(Elements || (Elements = {}));
var Elements;
(function (Elements) {
    var Confetti = (function () {
        function Confetti() {
            this.removeMe = false;
            this.reset(true);
        }
        Confetti.prototype.reset = function (_firstRun) {
            if (_firstRun === void 0) { _firstRun = false; }
            this.x = Math.random() * canvas.width;
            if (_firstRun) {
                this.y = Math.random() * canvas.height;
            }
            else {
                this.y = -20;
            }
            this.scale = Math.random() * 15 + 15;
            this.angle = Math.random() * 360;
            this.col = "rgb(" + Math.floor(Math.random() * 156 + 100) + ", " + Math.floor(Math.random() * 156 + 100) + ",  " + Math.floor(Math.random() * 156 + 100) + ")";
            this.inc = Math.random() * 150 + 150;
            this.drift = Math.random() * .3 + .3;
        };
        Confetti.prototype.update = function () {
            this.y += this.inc * delta;
            this.x += Math.sin(this.y * .01) * this.drift;
            this.angle += this.inc * delta;
            this.endX = this.scale * Math.cos((this.angle) * radian);
            this.endY = this.scale * Math.sin((this.angle) * radian);
            if (this.y > canvas.height + 20) {
                this.reset();
            }
        };
        Confetti.prototype.render = function () {
            ctx.strokeStyle = this.col;
            ctx.lineWidth = this.scale * .5;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - this.endX, this.y - this.endY);
            ctx.stroke();
        };
        return Confetti;
    }());
    Elements.Confetti = Confetti;
})(Elements || (Elements = {}));
var Elements;
(function (Elements) {
    var CoinShower = (function (_super) {
        __extends(CoinShower, _super);
        function CoinShower(_oImgData, _startX, _startY) {
            var _this = _super.call(this, _oImgData, 20, 45, "spin" + Math.floor(Math.random() * 10)) || this;
            _this.incX = Math.random() * 800 - 400;
            _this.incY = Math.random() * -600;
            _this.x = _startX;
            _this.y = _startY;
            _this.scaleX = _this.scaleY = 0;
            var tempScale = Math.random() * .3 + .5;
            TweenLite.to(_this, .5, { scaleX: tempScale, scaleY: tempScale, ease: "Back.easeOut" });
            return _this;
        }
        CoinShower.prototype.update = function () {
            _super.prototype.updateAnimation.call(this, delta);
            this.incX *= .99;
            this.incY += 800 * delta;
            this.x += this.incX * delta;
            this.y += this.incY * delta;
            if (this.y > canvas.height + 100) {
                this.removeMe = true;
            }
        };
        CoinShower.prototype.render = function () {
            _super.prototype.renderSimple.call(this, ctx);
        };
        return CoinShower;
    }(Utils.AnimSprite));
    Elements.CoinShower = CoinShower;
})(Elements || (Elements = {}));
var Elements;
(function (Elements) {
    var PickUp = (function () {
        function PickUp(_id, _flavour) {
            this.hasHit = false;
            this.removeMe = false;
            this.scaleX = 1;
            this.scaleY = 1;
            this.oGameElementsImgData = assetLib.getData("gameElements");
            this.id = _id;
            this.flavour = _flavour;
        }
        PickUp.prototype.hit = function () {
            var _this = this;
            this.hasHit = true;
            if (this.flavour == 0) {
                userSkater.hitBoost();
                playSound("boost");
            }
            else if (this.flavour == 1) {
                if (userCharPos > 0) {
                    var tempChar = aRacePositions[Math.max(userCharPos - 2, 0)];
                    panel.lightningZapId = tempChar.charId;
                    tempChar.makeSlow();
                    panel.lightningHit(tempChar.x, tempChar.y + (tempChar.jumpHeight - 400) * tempChar.scale);
                    playSound("lightning");
                }
            }
            else if (this.flavour == 2) {
                ground.magnetCount = 20;
                playSound("powerUp");
            }
            TweenLite.to(this, .3, {
                x: canvas.width * .5, y: canvas.height * .35, scaleX: 1, scaleY: 1, ease: "Quad.easeOut",
                onComplete: function () {
                    TweenLite.to(_this, .3, {
                        x: 0, ease: "Quad.easeIn",
                        onComplete: function () {
                            _this.removeMe = true;
                        }
                    });
                }
            });
        };
        PickUp.prototype.update = function (_trackX, _trackY) {
            if (!this.hasHit && this.y > canvas.height) {
                this.removeMe = true;
            }
        };
        PickUp.prototype.render = function () {
            var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds["pickUp" + this.flavour]].x;
            var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds["pickUp" + this.flavour]].y;
            var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds["pickUp" + this.flavour]].width;
            var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds["pickUp" + this.flavour]].height;
            ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, this.x - (bWidth / 2) * this.scaleY, this.y - 150 * this.scaleY - (bHeight / 2) * this.scaleY, bWidth * this.scaleX, bHeight * this.scaleY);
        };
        return PickUp;
    }());
    Elements.PickUp = PickUp;
})(Elements || (Elements = {}));
var Elements;
(function (Elements) {
    var CharRider = (function (_super) {
        __extends(CharRider, _super);
        function CharRider(_charId) {
            var _this = _super.call(this, assetLib.getData("charRider" + _charId), 24, 60, "startPause") || this;
            _this.offsetX = aCharData[_charId].oCharOffset.x * _this.scaleX;
            _this.offsetY = aCharData[_charId].oCharOffset.y * _this.scaleY;
            return _this;
        }
        CharRider.prototype.hit = function () {
        };
        CharRider.prototype.update = function () {
            _super.prototype.updateAnimation.call(this, delta);
        };
        CharRider.prototype.render = function () {
            _super.prototype.renderSimple.call(this, ctx);
        };
        return CharRider;
    }(Utils.AnimSprite));
    Elements.CharRider = CharRider;
})(Elements || (Elements = {}));
var Elements;
(function (Elements) {
    var GhostSkater = (function () {
        function GhostSkater(_charId) {
            this.roadTilt = 0;
            this.steerLean = 0;
            this.x = 0;
            this.y = 0;
            this.scale = 0;
            this.targX = 0;
            this.targY = 0;
            this.targScale = 0;
            this.speed = 0;
            this.segSeg = 0;
            this.roadScale = 0;
            this.roadPrevScale = 0;
            this.easedSegSeg = 0;
            this.roadXPerc = 0;
            this.removeMe = false;
            this.nearOff = false;
            this.offscreenState = 0;
            this.offscreenEndInc = 0;
            this.speedControlState = 0;
            this.newRoadPosComplete = false;
            this.jumpHeight = 0;
            this.jumpSpeed = 0;
            this.controlledSpeed = 0;
            this.isEnemy = true;
            this.slowSpeed = 1;
            this.charGroundOffsetY = 20;
            this.testChar = Math.floor(Math.random() * 14);
            this.segPerc = 0;
            this.charId = _charId;
            this.oGameElementsImgData = assetLib.getData("gameElements");
            this.oVehiclesImgData = assetLib.getData("vehicles");
            this.oEnemyCharsImgData = assetLib.getData("enemyChars");
            this.segId = 30;
            this.roadXPerc = .5;
            this.prevRoadXPerc = this.roadXPerc;
            this.setNewRoadXPos();
        }
        GhostSkater.prototype.setNewRoadXPos = function (_force) {
            var _this = this;
            if (_force === void 0) { _force = null; }
            if (this.roadXTween) {
                this.roadXTween.kill();
            }
            var tempTime = .5;
            if (_force == null) {
                _force = Math.random() * .8 + .1;
                tempTime = Math.random() * 2 + 2;
            }
            else {
                this.newRoadPosComplete = false;
            }
            this.roadXTween = TweenLite.to(this, tempTime, {
                roadXPerc: _force, ease: "Quad.easeInOut",
                onComplete: function () {
                    _this.setNewRoadXPos();
                    _this.newRoadPosComplete = true;
                }
            });
        };
        GhostSkater.prototype.update = function () {
            this.prevRoadXPerc = this.roadXPerc;
            this.segSeg = this.segPerc;
            var easedSegSeg = ground.easeOutSine(this.segSeg, 0, 1, 1) * .31 + this.segSeg * .69;
            var percX0 = this.roadX0 + (this.roadX1 - this.roadX0) * this.roadXPerc;
            var percX1 = this.roadX3 + (this.roadX2 - this.roadX3) * this.roadXPerc;
            var percY0 = this.roadY0 + (this.roadY1 - this.roadY0) * this.roadXPerc;
            var percY1 = this.roadY3 + (this.roadY2 - this.roadY3) * this.roadXPerc;
            this.x += ((percX0 + (percX1 - percX0) * easedSegSeg) - this.x) * .7;
            this.y += ((percY0 + (percY1 - percY0) * easedSegSeg) - this.y) * .3;
            this.scale += ((this.roadPrevScale * 1.2 + ((this.roadScale * 1.2) - this.roadPrevScale * 1.2) * easedSegSeg) - this.scale) * .3;
            this.rotation = this.roadTilt * .08;
        };
        GhostSkater.prototype.renderPointer = function () {
            var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds["charPointer" + this.charId]].x;
            var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds["charPointer" + this.charId]].y;
            var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds["charPointer" + this.charId]].width;
            var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds["charPointer" + this.charId]].height;
            var tempScale = Math.max(this.scale * 2, .3);
            ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, this.x - (bWidth / 2) * tempScale, this.y + (this.jumpHeight - 400) * this.scale - 50 * tempScale - bHeight * tempScale, bWidth * tempScale, bHeight * tempScale);
        };
        GhostSkater.prototype.render = function () {
            var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds.testShadow].x;
            var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds.testShadow].y;
            var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds.testShadow].width;
            var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.testShadow].height;
            ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, this.x - bWidth / 2 * this.scale, this.y - bHeight * this.scale, bWidth * this.scale, bHeight * this.scale);
            if (aCharData[this.charId].vehicleType == 0) {
                var bX = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart0" + this.charId]].x;
                var bY = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart0" + this.charId]].y;
                var bWidth = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart0" + this.charId]].width;
                var bHeight = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart0" + this.charId]].height;
                ctx.drawImage(this.oVehiclesImgData.img, bX, bY, bWidth, bHeight, this.x - (bWidth / 2) * this.scale, this.y + (this.charGroundOffsetY + this.jumpHeight - 260) * this.scale, bWidth * this.scale, bHeight * this.scale);
                ctx.fillStyle = aCharData[this.charId].boardCol;
                var tempY = this.y + (this.charGroundOffsetY + this.jumpHeight - 125) * this.scale;
                ctx.beginPath();
                ctx.moveTo(this.x - 20 * this.scale, tempY);
                ctx.lineTo(this.x + 20 * this.scale, tempY);
                ctx.lineTo(this.x + 35 * this.scale + (this.roadXPerc - ground.carPos) * 200 * this.scale, tempY + (30 + this.jumpHeight * .2) * this.scale);
                ctx.lineTo(this.x - 35 * this.scale + (this.roadXPerc - ground.carPos) * 200 * this.scale, tempY + (30 + this.jumpHeight * .2) * this.scale);
                ctx.fill();
                ctx.lineWidth = 2 * this.scale;
                ctx.strokeStyle = "#000000";
                ctx.beginPath();
                ctx.moveTo(this.x - 20 * this.scale, tempY);
                ctx.lineTo(this.x - 35 * this.scale + (this.roadXPerc - ground.carPos) * 200 * this.scale, tempY + (30 + this.jumpHeight * .2) * this.scale);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(this.x + 20 * this.scale, tempY);
                ctx.lineTo(this.x + 35 * this.scale + (this.roadXPerc - ground.carPos) * 200 * this.scale, tempY + (30 + this.jumpHeight * .2) * this.scale);
                ctx.stroke();
                var tempCharId = "stillChar" + this.charId;
                if (panel.lightningZapId == this.charId && panel.incY < panel.lightningZapInc + 30 && Math.floor(panel.incY) % 2) {
                    tempCharId = "zapChar" + this.charId;
                }
                var bX = this.oEnemyCharsImgData.oData.oAtlasData[oImageIds[tempCharId]].x;
                var bY = this.oEnemyCharsImgData.oData.oAtlasData[oImageIds[tempCharId]].y;
                var bWidth = this.oEnemyCharsImgData.oData.oAtlasData[oImageIds[tempCharId]].width;
                var bHeight = this.oEnemyCharsImgData.oData.oAtlasData[oImageIds[tempCharId]].height;
                ctx.drawImage(this.oEnemyCharsImgData.img, bX, bY, bWidth, bHeight, this.x - (this.rotation * 50 * 1.2) * this.scale - (bWidth / 2) * this.scale + aCharData[this.charId].oStillCharOffset.x * this.scale, this.y + (this.jumpHeight - 250) * this.scale - (bHeight / 2) * this.scale + aCharData[this.charId].oStillCharOffset.y * this.scale, bWidth * this.scale, bHeight * this.scale);
                var bX = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart1" + this.charId]].x;
                var bY = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart1" + this.charId]].y;
                var bWidth = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart1" + this.charId]].width;
                var bHeight = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart1" + this.charId]].height;
                ctx.drawImage(this.oVehiclesImgData.img, bX, bY, bWidth, bHeight, this.x - (bWidth / 2) * this.scale + (this.roadXPerc - ground.carPos) * 200 * this.scale, tempY - (bHeight * .4) * this.scale + (30 + this.jumpHeight * .2) * this.scale, bWidth * this.scale, bHeight * this.scale);
            }
            else {
                var tempY = this.y + (this.charGroundOffsetY + this.jumpHeight - 130) * this.scale;
                var bX = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart0" + this.charId]].x;
                var bY = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart0" + this.charId]].y;
                var bWidth = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart0" + this.charId]].width;
                var bHeight = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart0" + this.charId]].height;
                ctx.drawImage(this.oVehiclesImgData.img, bX, bY, bWidth, bHeight, this.x - (bWidth / 2) * this.scale - Math.max(Math.min((this.roadXPerc - ground.carPos), .2), -.2) * 200 * this.scale, this.y + (bHeight * .2) * this.scale + (this.charGroundOffsetY + this.jumpHeight - 147) * this.scale, bWidth * this.scale, bHeight * this.scale);
                var bX = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart1" + this.charId]].x;
                var bY = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart1" + this.charId]].y;
                var bWidth = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart1" + this.charId]].width;
                var bHeight = this.oVehiclesImgData.oData.oAtlasData[oImageIds["vehiclePart1" + this.charId]].height;
                ctx.drawImage(this.oVehiclesImgData.img, bX, bY, bWidth, bHeight, this.x - (bWidth / 2) * this.scale - (this.rotation * 100 * .5) * this.scale + Math.max(Math.min((this.roadXPerc - ground.carPos), .2), -.2) * 200 * this.scale, tempY + (35 + this.jumpHeight * .2) * this.scale, bWidth * this.scale, bHeight * this.scale);
                ctx.fillStyle = aCharData[this.charId].boardCol;
                ctx.beginPath();
                ctx.moveTo(this.x - 26 * this.scale - Math.max(Math.min((this.roadXPerc - ground.carPos), .2), -.2) * 200 * this.scale, tempY);
                ctx.lineTo(this.x + 26 * this.scale - Math.max(Math.min((this.roadXPerc - ground.carPos), .2), -.2) * 200 * this.scale, tempY);
                ctx.lineTo(this.x + 46 * this.scale - (this.rotation * 100 * .5) * this.scale + Math.max(Math.min((this.roadXPerc - ground.carPos), .2), -.2) * 200 * this.scale, tempY + (37 + this.jumpHeight * .2) * this.scale);
                ctx.lineTo(this.x - 46 * this.scale - (this.rotation * 100 * .5) * this.scale + Math.max(Math.min((this.roadXPerc - ground.carPos), .2), -.2) * 200 * this.scale, tempY + (37 + this.jumpHeight * .2) * this.scale);
                ctx.fill();
                ctx.lineWidth = 2 * this.scale;
                ctx.strokeStyle = "#000000";
                ctx.beginPath();
                ctx.moveTo(this.x - 26 * this.scale - Math.max(Math.min((this.roadXPerc - ground.carPos), .2), -.2) * 200 * this.scale, tempY);
                ctx.lineTo(this.x - 46 * this.scale - (this.rotation * 100 * .5) * this.scale + Math.max(Math.min((this.roadXPerc - ground.carPos), .2), -.2) * 200 * this.scale, tempY + (37 + this.jumpHeight * .2) * this.scale);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(this.x + 26 * this.scale - Math.max(Math.min((this.roadXPerc - ground.carPos), .2), -.2) * 200 * this.scale, tempY);
                ctx.lineTo(this.x + 46 * this.scale - (this.rotation * 100 * .5) * this.scale + Math.max(Math.min((this.roadXPerc - ground.carPos), .2), -.2) * 200 * this.scale, tempY + (37 + this.jumpHeight * .2) * this.scale);
                ctx.stroke();
                var tempCharId = "stillChar" + this.charId;
                if (panel.lightningZapId == this.charId && panel.incY < panel.lightningZapInc + 30 && Math.floor(panel.incY) % 2) {
                    tempCharId = "zapChar" + this.charId;
                }
                var bX = this.oEnemyCharsImgData.oData.oAtlasData[oImageIds[tempCharId]].x;
                var bY = this.oEnemyCharsImgData.oData.oAtlasData[oImageIds[tempCharId]].y;
                var bWidth = this.oEnemyCharsImgData.oData.oAtlasData[oImageIds[tempCharId]].width;
                var bHeight = this.oEnemyCharsImgData.oData.oAtlasData[oImageIds[tempCharId]].height;
                ctx.drawImage(this.oEnemyCharsImgData.img, bX, bY, bWidth, bHeight, this.x - (this.rotation * 100 * .2) * this.scale - (bWidth / 2) * this.scale + aCharData[this.charId].oStillCharOffset.x * this.scale, this.y + (this.jumpHeight - 250) * this.scale - (bHeight / 2) * this.scale + aCharData[this.charId].oStillCharOffset.y * this.scale, bWidth * this.scale, bHeight * this.scale);
            }
            this.renderPointer();
        };
        return GhostSkater;
    }());
    Elements.GhostSkater = GhostSkater;
})(Elements || (Elements = {}));
var Utils;
(function (Utils) {
    var SaveDataHandler = (function () {
        function SaveDataHandler(_saveDataId) {
            this.dataGroupNum = 2;
            this.saveDataId = _saveDataId;
            var testKey = 'test';
            var storage;
            var lc = false;
            try {
                storage = window.localStorage;
                lc = true;
            }
            catch (e) {
                console.log("local storage denied");
                lc = false;
                this.canStore = false;
            }
            if (lc) {
                try {
                    storage.setItem(testKey, '1');
                    storage.removeItem(testKey);
                    this.canStore = true;
                }
                catch (error) {
                    this.canStore = false;
                }
            }
            this.clearData();
            this.setInitialData();
        }
        SaveDataHandler.prototype.clearData = function () {
            this.aLevelStore = new Array();
            for (var i = 0; i < 14; i++) {
                if (i < 7) {
                    this.aLevelStore.push(1);
                }
                else {
                    this.aLevelStore.push(0);
                }
                this.aLevelStore.push(0);
                this.aLevelStore.push(0);
                this.aLevelStore.push(0);
                this.aLevelStore.push(0);
                this.aLevelStore.push(0);
                this.aLevelStore.push(0);
                this.aLevelStore.push(0);
                this.aLevelStore.push(0);
                this.aLevelStore.push(0);
            }
            this.aLevelStore.push(0);
        };
        SaveDataHandler.prototype.resetData = function () {
            this.clearData();
            this.saveData();
        };
        SaveDataHandler.prototype.setInitialData = function () {
            if (this.canStore && typeof (Storage) !== "undefined") {
                if (localStorage.getItem(this.saveDataId) != null && localStorage.getItem(this.saveDataId) != "") {
                    this.aLevelStore = localStorage.getItem(this.saveDataId).split(",");
                    for (var a in this.aLevelStore) {
                        this.aLevelStore[a] = parseInt(this.aLevelStore[a]);
                    }
                }
                else {
                    this.saveData();
                }
            }
        };
        SaveDataHandler.prototype.setData = function (_levelNum, _aData) {
            for (var i = 0; i < _aData.length; i++) {
                if (this.aLevelStore.length == 0 || this.aLevelStore.length <= _levelNum * this.dataGroupNum + i) {
                    for (var j = 0; j < ((_levelNum * this.dataGroupNum) + i) - this.aLevelStore.length - 1; j++) {
                        this.aLevelStore.push(0);
                    }
                    this.aLevelStore.push(_aData[i]);
                }
                else {
                    this.aLevelStore[_levelNum * this.dataGroupNum + i] = _aData[i];
                }
            }
        };
        SaveDataHandler.prototype.getCharLockStatus = function (_id) {
            return this.aLevelStore[_id * 10];
        };
        SaveDataHandler.prototype.getUpgradeLockStatus = function (_charId, _id) {
            return this.aLevelStore[_charId * 10 + _id + 1];
        };
        SaveDataHandler.prototype.getStatBonus = function (_id) {
            if (_id > 2) {
                return 0;
            }
            else {
                return this.aLevelStore[curChar * 10 + _id + 1];
            }
        };
        SaveDataHandler.prototype.unlockChar = function (_id) {
            this.aLevelStore[_id * 10] = 1;
        };
        SaveDataHandler.prototype.unlockUpgrade = function (_charId, _id) {
            if (_id <= 2) {
                this.aLevelStore[_charId * 10 + _id + 1]++;
            }
            else {
                var tempId = Math.floor(_id / 3) * 3;
                for (var i = 0; i < 3; i++) {
                    if (this.aLevelStore[_charId * 10 + tempId + i + 1] == 2) {
                        this.aLevelStore[_charId * 10 + tempId + i + 1] = 1;
                    }
                }
                this.aLevelStore[_charId * 10 + _id + 1] = 2;
            }
        };
        SaveDataHandler.prototype.turnOffUnlockedkUpgrade = function (_charId, _id) {
            var tempId = Math.floor(_id / 3) * 3;
            for (var i = 0; i < 3; i++) {
                if (this.aLevelStore[_charId * 10 + tempId + i + 1] == 2) {
                    this.aLevelStore[_charId * 10 + tempId + i + 1] = 1;
                }
            }
        };
        SaveDataHandler.prototype.getVehicleData = function (_id) {
            return [this.aLevelStore[_id * 10 + 4], this.aLevelStore[_id * 10 + 5], this.aLevelStore[_id * 10 + 6]];
        };
        SaveDataHandler.prototype.getBonusData = function (_id) {
            return [this.aLevelStore[_id * 10 + 7], this.aLevelStore[_id * 10 + 8], this.aLevelStore[_id * 10 + 9]];
        };
        SaveDataHandler.prototype.getCash = function () {
            return this.aLevelStore[14 * 10];
        };
        SaveDataHandler.prototype.updateCash = function (_amount) {
            this.aLevelStore[14 * 10] += _amount;
        };
        SaveDataHandler.prototype.anyUpgradeBought = function (_charId) {
            var temp = false;
            for (var i = 0; i < 9; i++) {
                if (this.getUpgradeLockStatus(_charId, i) > 0) {
                    temp = true;
                    break;
                }
            }
            return temp;
        };
        SaveDataHandler.prototype.saveData = function () {
            if (this.canStore && typeof (Storage) !== "undefined") {
                var str = "";
                for (var i = 0; i < this.aLevelStore.length; i++) {
                    str += this.aLevelStore[i];
                    if (i < this.aLevelStore.length - 1) {
                        str += ",";
                    }
                }
                localStorage.setItem(this.saveDataId, str);
            }
        };
        return SaveDataHandler;
    }());
    Utils.SaveDataHandler = SaveDataHandler;
})(Utils || (Utils = {}));
var requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.requestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60, new Date().getTime());
        };
})();
var previousTime;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");
var maxWidth = 700;
var minWidth = 700;
var maxHeight = 700;
var minHeight = 700;
var canvasX;
var canvasY;
var canvasScale;
var isRotated = false;
var div = document.getElementById('canvas-wrapper');
var sound;
var music;
var audioType = 0;
var muted = false;
var splashTimer = 0;
var assetLib;
var preAssetLib;
var isMobile = false;
var gameState = "loading";
var aLangs = new Array("EN");
var curLang = "";
var isBugBrowser = false;
var isIE10 = false;
var delta;
var radian = Math.PI / 180;
var ios9FirstTouch = false;
var hasFocus = true;
var saveDataHandler = new Utils.SaveDataHandler("skaterushv4");
if (navigator.userAgent.match(/MSIE\s([\d]+)/)) {
    isIE10 = true;
}
var deviceAgent = navigator.userAgent.toLowerCase();
if (deviceAgent.match(/(iphone|ipod|ipad)/) ||
    deviceAgent.match(/(android)/) ||
    deviceAgent.match(/(iemobile)/) ||
    deviceAgent.match(/iphone/i) ||
    deviceAgent.match(/ipad/i) ||
    deviceAgent.match(/ipod/i) ||
    deviceAgent.match(/blackberry/i) ||
    deviceAgent.match(/bada/i)) {
    isMobile = true;
    if (deviceAgent.match(/(android)/) && !/Chrome/.test(navigator.userAgent)) {
        isBugBrowser = true;
    }
}
var userInput = new Utils.UserInput(canvas, isBugBrowser);
resizeCanvas();
window.onresize = function () {
    setTimeout(function () {
        resizeCanvas();
    }, 1);
};
function visibleResume() {
    if (!hasFocus) {
        if (userInput) {
            userInput.checkKeyFocus();
        }
        if (!muted && gameState != "pause" && gameState != "splash" && gameState != "loading") {
            Howler.mute(false);
            playMusic();
        }
    }
    hasFocus = true;
}
function visiblePause() {
    hasFocus = false;
    Howler.mute(true);
    music.pause();
}
window.onpageshow = function () {
    if (!hasFocus) {
        if (userInput) {
            userInput.checkKeyFocus();
        }
        if (!muted && gameState != "pause" && gameState != "splash" && gameState != "loading") {
            Howler.mute(false);
            playMusic();
        }
    }
    hasFocus = true;
};
window.onpagehide = function () {
    hasFocus = false;
    Howler.mute(true);
    music.pause();
};
function playMusic() {
    if (!music.playing()) {
        music.play();
    }
}
window.addEventListener("load", function () {
    setTimeout(function () {
        resizeCanvas();
    }, 0);
    window.addEventListener("orientationchange", function () {
        setTimeout(function () {
            resizeCanvas();
        }, 500);
        setTimeout(function () {
            resizeCanvas();
        }, 2000);
    }, false);
});
function isStock() {
    var matches = window.navigator.userAgent.match(/Android.*AppleWebKit\/([\d.]+)/);
    return matches && parseFloat(matches[1]) < 537;
}
var ua = navigator.userAgent;
var isSharpStock = ((/SHL24|SH-01F/i).test(ua)) && isStock();
var isXperiaAStock = ((/SO-04E/i).test(ua)) && isStock();
var isFujitsuStock = ((/F-01F/i).test(ua)) && isStock();
if (!isIE10 && !isSharpStock && !isXperiaAStock && !isFujitsuStock && (typeof window.AudioContext !== 'undefined' || typeof window.webkitAudioContext !== 'undefined' || navigator.userAgent.indexOf('Android') == -1)) {
    audioType = 1;
    sound = new Howl({
        src: ['audio/sound.mp3'],
        sprite: {
            backScreen: [
                0,
                280.1587301587302
            ],
            boost: [
                1500,
                703.8548752834469
            ],
            buyChar: [
                3000,
                519.7959183673469
            ],
            buyItem: [
                4500,
                461.08843537414936
            ],
            buyUpgrade: [
                6000,
                244.4897959183674
            ],
            click: [
                7500,
                242.15419501133795
            ],
            coin0: [
                9000,
                461.08843537414936
            ],
            coin1: [
                10500,
                208.97959183673544
            ],
            coin2: [
                12000,
                349.9773242630386
            ],
            countDown: [
                13500,
                170.88435374149748
            ],
            dust: [
                15000,
                244.4897959183674
            ],
            earnCoins0: [
                16500,
                349.97732426303685
            ],
            earnCoins1: [
                18000,
                692.5170068027206
            ],
            earnCoins2: [
                19500,
                741.8820861678022
            ],
            earnCoins3: [
                21000,
                928.2993197278913
            ],
            endGame0: [
                22500,
                1076.3718820861677
            ],
            endGame1: [
                25000,
                516.0090702947855
            ],
            endGame2: [
                26500,
                915.9183673469399
            ],
            endTourn: [
                28000,
                835.8956916099771
            ],
            enemyOvertake: [
                29500,
                361.97278911564723
            ],
            hitEnemy: [
                31000,
                295.17006802721113
            ],
            hitWall0: [
                32500,
                92.85714285714164
            ],
            hitWall1: [
                34000,
                93.01587301587233
            ],
            hitWall2: [
                35500,
                93.10657596371641
            ],
            itemLocked: [
                37000,
                283.46938775510466
            ],
            jump: [
                38500,
                550.5442176870758
            ],
            lightning: [
                40000,
                1639.637188208617
            ],
            mapScreen: [
                42500,
                475.01133786848015
            ],
            overtake: [
                44000,
                738.3219954648509
            ],
            powerUp: [
                45500,
                743.015873015871
            ],
            raceEnd: [
                47000,
                743.015873015871
            ],
            raceStart: [
                48500,
                1404.807256235827
            ],
            selectChar: [
                51000,
                529.8412698412704
            ],
            silence: [
                52500,
                502.8798185941028
            ],
            upgradeScreen: [
                54000,
                285.7142857142847
            ]
        }
    });
    music = new Howl({
        src: ['audio/music.mp3'],
        volume: .5,
        loop: true
    });
}
else {
    audioType = 0;
}
var panel;
var background;
var totalScore = 0;
var levelScore = 0;
var aTutorials = new Array();
var panelFrame;
var oLogoData = {};
var oLogoBut;
var musicTween;
var oImageIds = {};
var rightSteer = 0;
var leftSteer = 0;
var ground;
var userSkater;
var aEnemySkaters;
var aTrackObjects;
var testVar = "---";
var firstRun = true;
var curChar = null;
var aCharData = new Array({ stats: [.6, .6, .4], cost: 0, vehicleType: 0, boardCol: "#FFFFFF", oCharOffset: { x: 5, y: -10 }, oStillCharOffset: { x: 0, y: 5 }, tiltFrameStart: 7, logo: 4 }, { stats: [.5, .5, .6], cost: 0, vehicleType: 0, boardCol: "#448E57", oCharOffset: { x: -3, y: 0 }, oStillCharOffset: { x: 0, y: 10 }, tiltFrameStart: 7, logo: 5 }, { stats: [.7, .4, .5], cost: 0, vehicleType: 0, boardCol: "#E93E17", oCharOffset: { x: 5, y: 5 }, oStillCharOffset: { x: 0, y: 27 }, tiltFrameStart: 7, logo: 3 }, { stats: [.7, .3, .6], cost: 0, vehicleType: 0, boardCol: "#BBBBBB", oCharOffset: { x: 0, y: 20 }, oStillCharOffset: { x: 0, y: 25 }, tiltFrameStart: 7, logo: 1 }, { stats: [.4, .7, .5], cost: 0, vehicleType: 1, boardCol: "#FD66CB", oCharOffset: { x: 50, y: -5 }, oStillCharOffset: { x: 50, y: 10 }, tiltFrameStart: 12, logo: 4 }, { stats: [.3, .5, .6], cost: 0, vehicleType: 1, boardCol: "#B88462", oCharOffset: { x: 25, y: 0 }, oStillCharOffset: { x: 0, y: 0 }, tiltFrameStart: 7, logo: 0 }, { stats: [.4, .6, .5], cost: 0, vehicleType: 1, boardCol: "#4BD97E", oCharOffset: { x: 0, y: 50 }, oStillCharOffset: { x: 0, y: 50 }, tiltFrameStart: 7, logo: 2 }, { stats: [.7, .5, .6], cost: 700, vehicleType: 0, boardCol: "#6C3E8D", oCharOffset: { x: 0, y: 20 }, oStillCharOffset: { x: 0, y: 35 }, tiltFrameStart: 7, logo: 1 }, { stats: [.5, .7, .4], cost: 700, vehicleType: 1, boardCol: "#FCBB7D", oCharOffset: { x: 0, y: 30 }, oStillCharOffset: { x: 0, y: 50 }, tiltFrameStart: 7, logo: 4 }, { stats: [.6, .6, .7], cost: 1000, vehicleType: 1, boardCol: "#394596", oCharOffset: { x: 5, y: 15 }, oStillCharOffset: { x: 0, y: 30 }, tiltFrameStart: 7, logo: 1 }, { stats: [.4, .4, .6], cost: 1000, vehicleType: 1, boardCol: "#A6D5FF", oCharOffset: { x: 30, y: 0 }, oStillCharOffset: { x: 0, y: 0 }, tiltFrameStart: 7, logo: 0 }, { stats: [.3, .7, .4], cost: 1250, vehicleType: 0, boardCol: "#48BA63", oCharOffset: { x: 5, y: -5 }, oStillCharOffset: { x: 0, y: 8 }, tiltFrameStart: 7, logo: 2 }, { stats: [.6, .7, .5], cost: 1500, vehicleType: 0, boardCol: "#FFDF22", oCharOffset: { x: -5, y: 10 }, oStillCharOffset: { x: 0, y: 22 }, tiltFrameStart: 7, logo: 1 }, { stats: [.7, .6, .6], cost: 2000, vehicleType: 1, boardCol: "#9ACB49", oCharOffset: { x: 0, y: 10 }, oStillCharOffset: { x: 0, y: 15 }, tiltFrameStart: 7, logo: 3 }, { boardCol: "#FFB600" }, { boardCol: "#696969" }, { boardCol: "#DE0000" }, { boardCol: "#80D6EB" }, { boardCol: "#FFDE00" }, { boardCol: "#FFFFFF" });
var aUpgradeData = new Array({ aCost: [100, 150, 200, 250, 300] }, { aCost: [100, 150, 200, 250, 300] }, { aCost: [100, 150, 200, 250, 300] }, { aCost: [300] }, { aCost: [400] }, { aCost: [500] }, { aCost: [200] }, { aCost: [250] }, { aCost: [300] });
var oUpgrades = { aUpgrades: [0, 0, 0], aVehicles: [0, 0, 0], aBonus: [0, 0, 0] };
var aRacePositions;
var aEffects;
var userCharPos = 0;
var raceLength = 400;
var raceNum = 0;
var aLeaderboard;
var aUserRaceResults;
var aPosPoints = new Array(10, 8, 6, 4, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0);
var gameType;
var prevGameState;
var raceSelected = -1;
var raceTime;
var challengeTime = -1;
var challengeChar = -1;
var charLookup = "sWPeIzrvTBRaySuEbdmUcfQMinxYXqVljhLDOwHZFpJNGtKCAkgo";
var aGhostData;
var ghostSkater;
var resetConfirmOn = false;
function loadLang(_lang) {
    if (_lang === void 0) { _lang = "en"; }
    curLang = _lang;
    loadPreAssets();
}
function initSplash() {
    gameState = "splash";
    resizeCanvas();
    if (audioType == 1 && !muted) {
        playMusic();
        if (!hasFocus) {
            music.pause();
        }
    }
    try {
        var href = (window.location != window.parent.location) ? document.referrer : document.location.href;
        var url = new URL(href);
        var skcid = url.searchParams.get("skcid");
        if (!skcid) {
            challengeTime = -1;
        }
        else {
            getRaceTimeFromCode(skcid);
        }
        ;
    }
    catch (e) {
        challengeTime = -1;
    }
    initStartScreen();
}
function initStartScreen() {
    gameState = "start";
    userInput.removeHitArea("moreGames");
    if (audioType == 1) {
        music.fade(music.volume(), .5, 500);
    }
    curChar = null;
    levelScore = 0;
    totalScore = 0;
    resetLeaderboard();
    var oInfoBut = { oImgData: assetLib.getData("uiButs"), aPos: [43, 43], align: [0, 0], id: oImageIds.infoBut, idOver: oImageIds.infoButOver };
    userInput.addHitArea("credits", butEventHandler, null, "image", oInfoBut);
    if (challengeTime == -1) {
        var oTournamentBut = { oImgData: assetLib.getData("uiButs"), aPos: [0, 0], align: [.5, .8], id: oImageIds.playBut, idOver: oImageIds.playButOver, flash: true };
        userInput.addHitArea("tournamentFromStart", butEventHandler, null, "image", oTournamentBut);
        var aButs = new Array(oTournamentBut, oInfoBut);
    }
    else {
        var oChallengeGameBut = { oImgData: assetLib.getData("uiButs"), aPos: [0, 0], align: [.5, .75], id: oImageIds.playBut, idOver: oImageIds.playButOver, flash: true };
        userInput.addHitArea("challengeFromStart", butEventHandler, null, "image", oChallengeGameBut);
        var oBackBut = { oImgData: assetLib.getData("uiButs"), aPos: [55, -43], align: [0, 1], id: oImageIds.backBut, idOver: oImageIds.backButOver };
        userInput.addHitArea("backFromStart", butEventHandler, null, "image", oBackBut);
        var aButs = new Array(oChallengeGameBut, oBackBut, oInfoBut);
    }
    aEnemySkaters = new Array();
    aTrackObjects = new Array();
    ground = new Elements.Ground();
    userSkater = new Elements.UserSkater();
    aUserRaceResults = new Array();
    addMuteBut(aButs);
    panel = new Elements.Panel(gameState, aButs);
    panel.startTween1();
    previousTime = new Date().getTime();
    updateStartScreenEvent();
}
function resetLeaderboard() {
    aLeaderboard = new Array();
    for (var i = 0; i < 14; i++) {
        aLeaderboard.push({ charId: i, score: 0 });
    }
}
function initCharSelect() {
    gameState = "charSelect";
    raceNum = 0;
    curChar = null;
    var aButs = new Array();
    aEnemySkaters = new Array();
    aTrackObjects = new Array();
    ground = new Elements.Ground();
    userSkater = new Elements.UserSkater();
    addMuteBut(aButs);
    panel = new Elements.Panel(gameState, aButs);
    setCharSelectButs();
    aEffects = new Array();
    panel.startTween1();
    previousTime = new Date().getTime();
    updateCharSelectEvent();
}
function setCharSelectButs() {
    userInput.removeHitArea("charSelect");
    var tempScale = 1;
    if (canvas.height > canvas.width) {
        for (var i = 0; i < 14; i++) {
            tempScale = Math.min((canvas.height - 400) / 460, 1);
            if (saveDataHandler.getCharLockStatus(i) && challengeChar != i) {
                panel.removeBut(oImageIds["char" + i + "But"]);
                var oCharBut = { oImgData: assetLib.getData("uiButs"), aPos: [(i % 5) * (138 * tempScale) - 276 * tempScale, Math.floor(i / 5) * 148 * tempScale + 75 * tempScale + 75], align: [.5, 0], scale: tempScale, id: oImageIds["char" + i + "But"], idOver: oImageIds["char" + i + "ButOver"], flash: true };
                userInput.addHitArea("charSelect", butEventHandler, { id: i, locked: false }, "image", oCharBut);
            }
            else {
                panel.removeBut(oImageIds["char" + i + "ButGrey"]);
                if (saveDataHandler.getCash() >= aCharData[i].cost && challengeChar != i) {
                    var oCharBut = { oImgData: assetLib.getData("uiButs"), aPos: [(i % 5) * (138 * tempScale) - 276 * tempScale, Math.floor(i / 5) * 148 * tempScale + 75 * tempScale + 75], align: [.5, 0], scale: tempScale, id: oImageIds["char" + i + "ButGrey"], idOver: oImageIds["char" + i + "But"], flash: true };
                }
                else {
                    var oCharBut = { oImgData: assetLib.getData("uiButs"), aPos: [(i % 5) * (138 * tempScale) - 276 * tempScale, Math.floor(i / 5) * 148 * tempScale + 75 * tempScale + 75], align: [.5, 0], scale: tempScale, id: oImageIds["char" + i + "ButGrey"], idOver: oImageIds["char" + i + "ButGrey"] };
                }
                userInput.addHitArea("charSelect", butEventHandler, { id: i, locked: true }, "image", oCharBut);
            }
            panel.aButs.push(oCharBut);
        }
    }
    else {
        for (var i = 0; i < 14; i++) {
            tempScale = Math.min((canvas.width - 20) / 965, 1);
            if (saveDataHandler.getCharLockStatus(i) && challengeChar != i) {
                panel.removeBut(oImageIds["char" + i + "But"]);
                var oCharBut = { oImgData: assetLib.getData("uiButs"), aPos: [(i % 7) * (138 * tempScale) - 414 * tempScale, Math.floor(i / 7) * 148 * tempScale + 75 * tempScale + 75], align: [.5, 0], scale: tempScale, id: oImageIds["char" + i + "But"], idOver: oImageIds["char" + i + "ButOver"], flash: true };
                userInput.addHitArea("charSelect", butEventHandler, { id: i, locked: false }, "image", oCharBut);
            }
            else {
                panel.removeBut(oImageIds["char" + i + "ButGrey"]);
                if (saveDataHandler.getCash() >= aCharData[i].cost && challengeChar != i) {
                    var oCharBut = { oImgData: assetLib.getData("uiButs"), aPos: [(i % 7) * (138 * tempScale) - 414 * tempScale, Math.floor(i / 7) * 148 * tempScale + 75 * tempScale + 75], align: [.5, 0], scale: tempScale, id: oImageIds["char" + i + "ButGrey"], idOver: oImageIds["char" + i + "But"], flash: true };
                }
                else {
                    var oCharBut = { oImgData: assetLib.getData("uiButs"), aPos: [(i % 7) * (138 * tempScale) - 414 * tempScale, Math.floor(i / 7) * 148 * tempScale + 75 * tempScale + 75], align: [.5, 0], scale: tempScale, id: oImageIds["char" + i + "ButGrey"], idOver: oImageIds["char" + i + "ButGrey"] };
                }
                userInput.addHitArea("charSelect", butEventHandler, { id: i, locked: true }, "image", oCharBut);
            }
            panel.aButs.push(oCharBut);
        }
    }
}
function initUpgrades() {
    gameState = "upgrades";
    playSound("upgradeScreen");
    var oBackBut = { oImgData: assetLib.getData("uiButs"), aPos: [55, -43], align: [0, 1], id: oImageIds.backBut, idOver: oImageIds.backButOver };
    userInput.addHitArea("backFromUpgrades", butEventHandler, null, "image", oBackBut);
    var aButs = new Array(oBackBut);
    if (prevGameState != "gameEnd1") {
        var oNextBut = { oImgData: assetLib.getData("uiButs"), aPos: [-100, -76], align: [1, 1], id: oImageIds.playBut, idOver: oImageIds.playButOver, flash: true };
        userInput.addHitArea("nextFromUpgrades", butEventHandler, null, "image", oNextBut);
        aButs.push(oNextBut);
    }
    aEnemySkaters = new Array();
    aTrackObjects = new Array();
    ground = new Elements.Ground();
    userSkater = new Elements.UserSkater();
    addMuteBut(aButs);
    panel = new Elements.Panel(gameState, aButs);
    setUpgradeButs();
    aEffects = new Array();
    panel.startTween1();
    panel.tweenCharInfo();
    previousTime = new Date().getTime();
    updateUpgradesEvent();
}
function setUpgradeButs() {
    userInput.removeHitArea("upgradeSelect");
    var tempScale = 1;
    for (var i = 0; i < 9; i++) {
        var tempButId = i.toString();
        var tempButName0;
        var tempButName1;
        var tempFlash = false;
        var tempLocked;
        if (i < 3 || i > 5) {
            panel.removeBut(oImageIds["upgrade" + i + "But"]);
            panel.removeBut(oImageIds["upgrade" + i + "ButGrey"]);
        }
        else {
            tempButId = tempButId + aCharData[curChar].vehicleType;
            panel.removeBut(oImageIds["upgrade" + tempButId + "But"]);
            panel.removeBut(oImageIds["upgrade" + tempButId + "ButGrey"]);
        }
        var tempIndex = saveDataHandler.getStatBonus(i);
        if (((i >= 3 && saveDataHandler.getUpgradeLockStatus(curChar, i) > 0) || saveDataHandler.getCash() >= aUpgradeData[i].aCost[tempIndex]) && saveDataHandler.getUpgradeLockStatus(curChar, i) <= 4) {
            tempButName0 = "upgrade" + tempButId + "But";
            tempButName1 = "upgrade" + tempButId + "ButOver";
            tempFlash = true;
            tempLocked = false;
        }
        else {
            tempButName0 = "upgrade" + tempButId + "ButGrey";
            tempButName1 = "upgrade" + tempButId + "ButGrey";
            tempLocked = true;
        }
        if (canvas.height > canvas.width) {
            tempScale = Math.min((canvas.height - 400) / 460, 1);
            var oUpgradeBut = { oImgData: assetLib.getData("uiButs"), aPos: [(i % 3) * (138 * tempScale) - 138 * tempScale, Math.floor(i / 3) * 148 * tempScale + 75 * tempScale + 75], align: [.5, 0], scale: tempScale, id: oImageIds[tempButName0], idOver: oImageIds[tempButName1], flash: tempFlash };
            userInput.addHitArea("upgradeSelect", butEventHandler, { id: i, locked: tempLocked }, "image", oUpgradeBut);
            panel.aButs.push(oUpgradeBut);
        }
        else {
            tempScale = Math.min((canvas.width - 20) / 965, 1);
            var oUpgradeBut = { oImgData: assetLib.getData("uiButs"), aPos: [(i % 5) * (138 * tempScale) - 276 * tempScale, Math.floor(i / 5) * 148 * tempScale + 75 * tempScale + 75], align: [.5, 0], scale: tempScale, id: oImageIds[tempButName0], idOver: oImageIds[tempButName1], flash: tempFlash };
            userInput.addHitArea("upgradeSelect", butEventHandler, { id: i, locked: tempLocked }, "image", oUpgradeBut);
            panel.aButs.push(oUpgradeBut);
        }
    }
}
function addMuteBut(_aButs) {
    if (audioType == 1) {
        var mb = oImageIds.muteBut0;
        var mbOver = oImageIds.muteBut0Over;
        if (muted) {
            mb = oImageIds.muteBut1;
            mbOver = oImageIds.muteBut1Over;
        }
        var oMuteBut = { oImgData: assetLib.getData("uiButs"), aPos: [-43, 43], align: [1, 0], id: mb, idOver: mbOver };
        userInput.addHitArea("mute", butEventHandler, null, "image", oMuteBut);
        for (var i = 0; i < _aButs.length; i++) {
            if (_aButs[i].id == oImageIds.muteBut0 || _aButs[i].id == oImageIds.muteBut1) {
                return;
            }
        }
        _aButs.push(oMuteBut);
    }
}
function initCreditsScreen() {
    gameState = "credits";
    var oBackBut = { oImgData: assetLib.getData("uiButs"), aPos: [55, -43], align: [0, 1], id: oImageIds.backBut, idOver: oImageIds.backButOver };
    var oResetBut = { oImgData: assetLib.getData("uiButs"), aPos: [-43, -43], align: [1, 1], id: oImageIds.resetBut, idOver: oImageIds.resetButOver };
    userInput.addHitArea("backFromCharSelect", butEventHandler, null, "image", oBackBut);
    userInput.addHitArea("resetData", butEventHandler, null, "image", oResetBut);
    var aButs = new Array(oBackBut, oResetBut);
    addMuteBut(aButs);
    panel = new Elements.Panel(gameState, aButs);
    panel.startTween1();
    previousTime = new Date().getTime();
    updateCreditsScreenEvent();
}
function initResetConfirm() {
    var oYesBut = { oImgData: assetLib.getData("uiButs"), aPos: [-225, -155], align: [1, 1], id: oImageIds.yesBut, idOver: oImageIds.yesButOver };
    var oNoBut = { oImgData: assetLib.getData("uiButs"), aPos: [-125, -155], align: [1, 1], id: oImageIds.noBut, idOver: oImageIds.noButOver };
    userInput.addHitArea("resetYes", butEventHandler, null, "image", oYesBut);
    userInput.addHitArea("resetNo", butEventHandler, null, "image", oNoBut);
    panel.aButs.push(oYesBut, oNoBut);
}
function initGameIntro() {
    gameState = "gameIntro";
    playSound("mapScreen");
    var oNextBut = { oImgData: assetLib.getData("uiButs"), aPos: [-100, -76], align: [1, 1], id: oImageIds.playBut, idOver: oImageIds.playButOver, flash: true };
    var oUpgradeBut = { oImgData: assetLib.getData("uiButs"), aPos: [-290, -76], align: [1, 1], id: oImageIds.upgradeBut, idOver: oImageIds.upgradeButOver, flash: true };
    userInput.addHitArea("nextFromGameIntro", butEventHandler, null, "image", oNextBut);
    userInput.addHitArea("upgradeFromGameIntro", butEventHandler, null, "image", oUpgradeBut);
    var aButs = new Array(oNextBut, oUpgradeBut);
    aEnemySkaters = new Array();
    aTrackObjects = new Array();
    ground = new Elements.Ground();
    userSkater = new Elements.UserSkater();
    addMuteBut(aButs);
    panel = new Elements.Panel(gameState, aButs);
    panel.startTween1();
    previousTime = new Date().getTime();
    updateGameIntro();
}
function initRaceSelect() {
    gameState = "raceSelect";
    playSound("mapScreen");
    raceSelected = -1;
    var oBackBut = { oImgData: assetLib.getData("uiButs"), aPos: [55, -43], align: [0, 1], id: oImageIds.backBut, idOver: oImageIds.backButOver };
    userInput.addHitArea("backFromRaceSelect", butEventHandler, null, "image", oBackBut);
    var aButs = new Array(oBackBut);
    aEnemySkaters = new Array();
    aTrackObjects = new Array();
    ground = new Elements.Ground();
    userSkater = new Elements.UserSkater();
    addMuteBut(aButs);
    panel = new Elements.Panel(gameState, aButs);
    updateRaceSelectbuts();
    panel.startTween1();
    previousTime = new Date().getTime();
    updateRaceSelect();
}
function updateRaceSelectbuts() {
    userInput.removeHitArea("nextFromRaceSelect");
    panel.removeBut(oImageIds.playBut);
    userInput.removeHitArea("raceFromRaceSelect");
    panel.removeBut(oImageIds.mapRaceBut);
    for (var i = 0; i < panel.aMapPoints.length; i++) {
        if (i != raceSelected) {
            var oRaceBut = { oImgData: assetLib.getData("uiButs"), aPos: [panel.aMapPoints[i][0], panel.aMapPoints[i][1]], align: [.5, .45], id: oImageIds.mapRaceBut, idOver: oImageIds.mapRaceButOver, flash: true };
            userInput.addHitArea("raceFromRaceSelect", butEventHandler, { id: i }, "image", oRaceBut);
            panel.aButs.push(oRaceBut);
        }
    }
    if (raceSelected != -1) {
        var oNextBut = { oImgData: assetLib.getData("uiButs"), aPos: [-100, -76], align: [1, 1], id: oImageIds.playBut, idOver: oImageIds.playButOver, flash: true };
        userInput.addHitArea("nextFromRaceSelect", butEventHandler, null, "image", oNextBut);
        panel.aButs.push(oNextBut);
    }
}
function initGame() {
    gameState = "game";
    if (audioType == 1) {
        music.fade(music.volume(), 1, 1000);
    }
    raceTime = 0;
    var oPauseBut = { oImgData: assetLib.getData("uiButs"), aPos: [43, 43], align: [0, 0], id: oImageIds.pauseBut, idOver: oImageIds.pauseButOver };
    userInput.addHitArea("pause", butEventHandler, null, "image", oPauseBut);
    var aButs = new Array(oPauseBut);
    if (isMobile) {
        userInput.addHitArea("steerLeft", butEventHandler, { multiTouch: true }, "rect", { aRect: [0, 60, canvas.width / 2, canvas.height] }, true);
        userInput.addHitArea("steerRight", butEventHandler, { multiTouch: true }, "rect", { aRect: [canvas.width / 2, 60, canvas.width, canvas.height] }, true);
    }
    userInput.addKey("steerRight", butEventHandler, null, 39);
    userInput.addKey("steerLeft", butEventHandler, null, 37);
    userInput.addKey("upKey", butEventHandler, null, 38);
    userInput.addKey("downKey", butEventHandler, null, 40);
    addMuteBut(aButs);
    aEnemySkaters = new Array();
    aTrackObjects = new Array();
    aEffects = new Array();
    rightSteer = leftSteer = 0;
    ground = new Elements.Ground();
    userSkater = new Elements.UserSkater();
    aRacePositions = new Array();
    aRacePositions.push(userSkater);
    var aTempStartPositions = setStartRacePositions();
    for (var i = 0; i < 13; i++) {
        var tempCharId = aTempStartPositions[i];
        var temp = new Elements.EnemySkater(i, tempCharId);
        aEnemySkaters.push(temp);
        aRacePositions.push(temp);
    }
    if (challengeTime != -1) {
        ghostSkater = new Elements.GhostSkater(challengeChar);
    }
    panel = new Elements.Panel(gameState, aButs);
    panel.startSequence();
    panel.startTween1();
    previousTime = new Date().getTime();
    updateGameEvent();
}
function setStartRacePositions() {
    var aTempStartPositions = new Array();
    var aEnemyIDs = new Array();
    for (var i = 0; i < 14; i++) {
        if (i != curChar) {
            aEnemyIDs.push(i);
        }
    }
    var aTempBefore = new Array();
    for (var i = 0; i < 4; i++) {
        aTempBefore.push(i);
    }
    for (var i = 0; i < 4; i++) {
        var ran = Math.floor(Math.random() * aTempBefore.length);
        aTempStartPositions.push(aEnemyIDs[aTempBefore[ran]]);
        aTempBefore.splice(ran, 1);
    }
    aTempBefore = new Array();
    for (var i = 4; i < 7; i++) {
        aTempBefore.push(i);
    }
    for (var i = 0; i < 3; i++) {
        var ran = Math.floor(Math.random() * aTempBefore.length);
        aTempStartPositions.push(aEnemyIDs[aTempBefore[ran]]);
        aTempBefore.splice(ran, 1);
    }
    aTempBefore = new Array();
    for (var i = 7; i < 10; i++) {
        aTempBefore.push(i);
    }
    for (var i = 0; i < 3; i++) {
        var ran = Math.floor(Math.random() * aTempBefore.length);
        aTempStartPositions.push(aEnemyIDs[aTempBefore[ran]]);
        aTempBefore.splice(ran, 1);
    }
    aTempBefore = new Array();
    for (var i = 10; i < 13; i++) {
        aTempBefore.push(i);
    }
    for (var i = 0; i < 3; i++) {
        var ran = Math.floor(Math.random() * aTempBefore.length);
        aTempStartPositions.push(aEnemyIDs[aTempBefore[ran]]);
        aTempBefore.splice(ran, 1);
    }
    return aTempStartPositions;
}
function initPause() {
    gameState = "pause";
    var oPlayBut = { oImgData: assetLib.getData("uiButs"), aPos: [-100, 0], align: [.5, .5], id: oImageIds.playBut, idOver: oImageIds.playButOver };
    var oQuitBut = { oImgData: assetLib.getData("uiButs"), aPos: [100, 0], align: [.5, .5], id: oImageIds.quitBut, idOver: oImageIds.quitButOver };
    userInput.addHitArea("playFromPause", butEventHandler, null, "image", oPlayBut);
    userInput.addHitArea("quitFromPause", butEventHandler, null, "image", oQuitBut);
    var aButs = new Array(oPlayBut, oQuitBut);
    panel = new Elements.Panel(gameState, aButs);
    panel.startTween1();
    previousTime = new Date().getTime();
    background = new Elements.Background();
    updatePauseEvent();
}
function resumeGame() {
    gameState = "game";
    background = new Elements.Background();
    if (isMobile) {
        userInput.addHitArea("steerLeft", butEventHandler, { multiTouch: true }, "rect", { aRect: [0, 60, canvas.width / 2, canvas.height] }, true);
        userInput.addHitArea("steerRight", butEventHandler, { multiTouch: true }, "rect", { aRect: [canvas.width / 2, 60, canvas.width, canvas.height] }, true);
    }
    userInput.addKey("steerRight", butEventHandler, null, 39);
    userInput.addKey("steerLeft", butEventHandler, null, 37);
    userInput.addKey("upKey", butEventHandler, null, 38);
    userInput.addKey("downKey", butEventHandler, null, 40);
    var oPauseBut = { oImgData: assetLib.getData("uiButs"), aPos: [43, 43], align: [0, 0], id: oImageIds.pauseBut, idOver: oImageIds.pauseButOver };
    userInput.addHitArea("pause", butEventHandler, null, "image", oPauseBut);
    var aButs = new Array(oPauseBut);
    addMuteBut(aButs);
    panel = new Elements.Panel(gameState, aButs);
    panel.startTween1();
    previousTime = new Date().getTime();
    updateGameEvent();
}
function butEventHandler(_id, _oData) {
    switch (_id) {
        case "langSelect":
            curLang = _oData.lang;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            userInput.removeHitArea("langSelect");
            preAssetLib = new Utils.AssetLoader(curLang, [{
                    id: "preloadImage",
                    file: "images/preloadImage.jpg"
                }], ctx, canvas.width, canvas.height, false);
            preAssetLib.onReady(initLoadAssets);
            break;
        case "credits":
            playSound("click");
            userInput.removeHitArea("tournamentFromStart");
            userInput.removeHitArea("challengeFromStart");
            userInput.removeHitArea("backFromStart");
            userInput.removeHitArea("upgradeFromStart");
            userInput.removeHitArea("credits");
            userInput.removeHitArea("mute");
            initCreditsScreen();
            break;
        case "backFromCredits":
            playSound("backScreen");
            userInput.removeHitArea("backFromCredits");
            userInput.removeHitArea("resetData");
            userInput.removeHitArea("resetYes");
            userInput.removeHitArea("resetNo");
            userInput.removeHitArea("mute");
            initStartScreen();
            break;
        case "moreGames":
        case "moreGamesPause":
            break;
        case "resetData":
            playSound("click");
            if (!resetConfirmOn) {
                initResetConfirm();
                resetConfirmOn = true;
            }
            break;
        case "resetYes":
            playSound("endGame3");
            userInput.removeHitArea("backFromCredits");
            userInput.removeHitArea("resetData");
            userInput.removeHitArea("resetYes");
            userInput.removeHitArea("resetNo");
            userInput.removeHitArea("mute");
            resetConfirmOn = false;
            saveDataHandler.resetData();
            resetChallengeData();
            initStartScreen();
            break;
        case "resetNo":
            playSound("endGame3");
            resetConfirmOn = false;
            userInput.removeHitArea("resetYes");
            panel.removeBut(oImageIds.yesBut);
            userInput.removeHitArea("resetNo");
            panel.removeBut(oImageIds.noBut);
            break;
        case "tournamentFromStart":
            playSound("click");
            userInput.removeHitArea("tournamentFromStart");
            userInput.removeHitArea("challengeFromStart");
            userInput.removeHitArea("backFromStart");
            userInput.removeHitArea("upgradeFromStart");
            userInput.removeHitArea("credits");
            userInput.removeHitArea("mute");
            gameType = 0;
            initCharSelect();
            break;
        case "challengeFromStart":
            playSound("click");
            userInput.removeHitArea("tournamentFromStart");
            userInput.removeHitArea("challengeFromStart");
            userInput.removeHitArea("backFromStart");
            userInput.removeHitArea("upgradeFromStart");
            userInput.removeHitArea("credits");
            userInput.removeHitArea("mute");
            gameType = 1;
            initCharSelect();
            break;
        case "backFromStart":
            playSound("backScreen");
            userInput.removeHitArea("tournamentFromStart");
            userInput.removeHitArea("challengeFromStart");
            userInput.removeHitArea("backFromStart");
            userInput.removeHitArea("upgradeFromStart");
            userInput.removeHitArea("credits");
            userInput.removeHitArea("mute");
            challengeTime = -1;
            initStartScreen();
            break;
        case "raceFromRaceSelect":
            playSound("click");
            raceSelected = raceNum = _oData.id;
            ground = new Elements.Ground();
            updateRaceSelectbuts();
            break;
        case "backFromRaceSelect":
            playSound("backScreen");
            userInput.removeHitArea("backFromRaceSelect");
            userInput.removeHitArea("raceFromRaceSelect");
            userInput.removeHitArea("nextFromRaceSelect");
            initCharSelect();
            break;
        case "nextFromRaceSelect":
            playSound("click");
            userInput.removeHitArea("backFromRaceSelect");
            userInput.removeHitArea("raceFromRaceSelect");
            userInput.removeHitArea("nextFromRaceSelect");
            initGame();
            break;
        case "charSelect":
            if (_oData.id == challengeChar) {
            }
            else if (!_oData.locked && curChar != _oData.id) {
                playSound("selectChar");
                curChar = _oData.id, 2;
                panel.tweenCharInfo();
                userInput.removeHitArea("nextFromCharSelect");
                panel.removeBut(oImageIds.playBut);
                var oNextBut = { oImgData: assetLib.getData("uiButs"), aPos: [-100, -76], align: [1, 1], id: oImageIds.playBut, idOver: oImageIds.playButOver, flash: true };
                userInput.addHitArea("nextFromCharSelect", butEventHandler, null, "image", oNextBut);
                panel.aButs.push(oNextBut);
            }
            else if (_oData.locked && saveDataHandler.getCash() >= aCharData[_oData.id].cost) {
                playSound("buyChar");
                curChar = _oData.id, 2;
                panel.tweenCharInfo();
                userInput.removeHitArea("nextFromCharSelect");
                panel.removeBut(oImageIds.playBut);
                var oNextBut = { oImgData: assetLib.getData("uiButs"), aPos: [-100, -76], align: [1, 1], id: oImageIds.playBut, idOver: oImageIds.playButOver, flash: true };
                userInput.addHitArea("nextFromCharSelect", butEventHandler, null, "image", oNextBut);
                panel.aButs.push(oNextBut);
                saveDataHandler.unlockChar(_oData.id);
                saveDataHandler.updateCash(-aCharData[_oData.id].cost);
                saveDataHandler.saveData();
                setCharSelectButs();
                for (var i = 0; i < 10; i++) {
                    var temp = new Elements.CoinShower(assetLib.getData("coin"), _oData.x, _oData.y);
                    aEffects.push(temp);
                }
            }
            else if (_oData.locked && saveDataHandler.getCash() < aCharData[_oData.id].cost) {
                playSound("itemLocked");
                panel.jiggleCash();
            }
            break;
        case "backFromCharSelect":
            playSound("backScreen");
            userInput.removeHitArea("backFromCharSelect");
            userInput.removeHitArea("nextFromCharSelect");
            userInput.removeHitArea("charSelect");
            userInput.removeHitArea("mute");
            initStartScreen();
            break;
        case "nextFromCharSelect":
            playSound("click");
            userInput.removeHitArea("backFromCharSelect");
            userInput.removeHitArea("nextFromCharSelect");
            userInput.removeHitArea("charSelect");
            userInput.removeHitArea("mute");
            raceNum = 0;
            if (gameType == 0) {
                initGameIntro();
            }
            else {
                if (challengeTime == -1) {
                    initRaceSelect();
                }
                else {
                    raceNum = raceSelected;
                    initGame();
                }
            }
            break;
        case "nextFromGameIntro":
            playSound("click");
            userInput.removeHitArea("mute");
            userInput.removeHitArea("nextFromGameIntro");
            userInput.removeHitArea("upgradeFromGameIntro");
            initGame();
            break;
        case "upgradeFromGameIntro":
            playSound("click");
            prevGameState = gameState;
            userInput.removeHitArea("mute");
            userInput.removeHitArea("nextFromGameIntro");
            userInput.removeHitArea("upgradeFromGameIntro");
            initUpgrades();
            break;
        case "upgradeSelect":
            if (!_oData.locked) {
                var tempIndex = saveDataHandler.getStatBonus(_oData.id);
                if (_oData.id <= 2 || saveDataHandler.getUpgradeLockStatus(curChar, _oData.id) == 0) {
                    saveDataHandler.updateCash(-aUpgradeData[_oData.id].aCost[tempIndex]);
                    for (var i = 0; i < 10; i++) {
                        var temp = new Elements.CoinShower(assetLib.getData("coin"), _oData.x, _oData.y);
                        aEffects.push(temp);
                    }
                    if (_oData.id <= 2) {
                        playSound("buyUpgrade");
                    }
                    else {
                        playSound("buyItem");
                    }
                }
                if (saveDataHandler.getUpgradeLockStatus(curChar, _oData.id) == 2) {
                    saveDataHandler.turnOffUnlockedkUpgrade(curChar, _oData.id);
                }
                else {
                    saveDataHandler.unlockUpgrade(curChar, _oData.id);
                }
                saveDataHandler.saveData();
                setUpgradeButs();
            }
            else if (_oData.locked && saveDataHandler.getCash() < aUpgradeData[_oData.id].aCost[tempIndex] && saveDataHandler.getUpgradeLockStatus(curChar, _oData.id) <= 4) {
                panel.jiggleCash();
                playSound("itemLocked");
            }
            break;
        case "backFromUpgrades":
            playSound("backScreen");
            userInput.removeHitArea("backFromUpgrades");
            userInput.removeHitArea("nextFromUpgrades");
            userInput.removeHitArea("upgradeSelect");
            userInput.removeHitArea("mute");
            if (prevGameState == "gameIntro") {
                initGameIntro();
            }
            else if (prevGameState == "gameEnd0") {
                prevGameState = "upgrades";
                initGameEnd0(false);
            }
            else if (prevGameState == "gameEnd1") {
                prevGameState = "upgrades";
                initGameEnd1(false);
            }
            break;
        case "nextFromUpgrades":
            playSound("click");
            userInput.removeHitArea("backFromUpgrades");
            userInput.removeHitArea("nextFromUpgrades");
            userInput.removeHitArea("upgradeSelect");
            userInput.removeHitArea("mute");
            if (prevGameState == "gameIntro") {
                initGame();
            }
            else if (prevGameState == "gameEnd0") {
                if (raceNum == 4) {
                    initTournamentEnd();
                }
                else {
                    raceNum++;
                    initGameIntro();
                }
            }
            break;
        case "steerLeft":
            if (_oData.isDown) {
                leftSteer = 1;
                rightSteer = 0;
            }
            else {
                leftSteer = 0;
            }
            break;
        case "steerRight":
            if (_oData.isDown) {
                rightSteer = -1;
                leftSteer = 0;
            }
            else {
                rightSteer = 0;
            }
            break;
        case "mute":
            playSound("click");
            toggleMute();
            if (muted) {
                panel.switchBut(oImageIds.muteBut0, oImageIds.muteBut1, oImageIds.muteBut1Over);
            }
            else {
                panel.switchBut(oImageIds.muteBut1, oImageIds.muteBut0, oImageIds.muteBut0Over);
            }
            break;
        case "pause":
            playSound("click");
            if (audioType == 1) {
                Howler.mute(true);
                music.pause();
            }
            else if (audioType == 2) {
                music.pause();
            }
            userInput.removeHitArea("pause");
            userInput.removeHitArea("steerLeft");
            userInput.removeHitArea("steerRight");
            userInput.removeKey("steerRight");
            userInput.removeKey("steerLeft");
            userInput.removeHitArea("mute");
            initPause();
            break;
        case "nextFromGameEnd0":
            playSound("click");
            userInput.removeHitArea("mute");
            userInput.removeHitArea("nextFromGameEnd0");
            userInput.removeHitArea("upgradeFromGameEnd0");
            if (raceNum == 4) {
                initTournamentEnd();
            }
            else {
                raceNum++;
                initGameIntro();
            }
            break;
        case "retryFromGameEnd1":
            playSound("click");
            userInput.removeHitArea("mute");
            userInput.removeHitArea("retryFromGameEnd1");
            userInput.removeHitArea("upgradeFromGameEnd1");
            userInput.removeHitArea("backFromGameEnd1");
            userInput.removeHitArea("copyLinkFromGameEnd1");
            if (challengeTime == -1) {
                initGame();
            }
            else if (raceTime > challengeTime) {
                initGame();
            }
            else {
                resetChallengeData();
                initStartScreen();
            }
            break;
        case "upgradeFromGameEnd1":
            playSound("click");
            userInput.removeHitArea("mute");
            userInput.removeHitArea("retryFromGameEnd1");
            userInput.removeHitArea("upgradeFromGameEnd1");
            userInput.removeHitArea("backFromGameEnd1");
            userInput.removeHitArea("copyLinkFromGameEnd1");
            prevGameState = gameState;
            initUpgrades();
            break;
        case "backFromGameEnd1":
            playSound("backScreen");
            userInput.removeHitArea("mute");
            userInput.removeHitArea("retryFromGameEnd1");
            userInput.removeHitArea("upgradeFromGameEnd1");
            userInput.removeHitArea("copyLinkFromGameEnd1");
            userInput.removeHitArea("backFromGameEnd1");
            resetChallengeData();
            initStartScreen();
            break;
        case "copyLinkFromGameEnd1":
            playSound("click");
            var tempUrl = assetLib.textData.langText["challengeLink"][curLang];
            var tempCode = tempUrl + getChallengeCode();
            var tempSuccess = false;
            if (navigator.clipboard != undefined) {
                navigator.clipboard.writeText(tempCode).then(function () {
                    tempSuccess = true;
                }, function (err) {
                    console.error('Clipboard copy error: ', err);
                    tempSuccess = false;
                });
            }
            if (!tempSuccess) {
                tempSuccess = true;
                var copyField = document.createElement('textArea');
                copyField.readOnly = false;
                copyField.contenteditable = true;
                copyField.value = tempCode;
                document.body.appendChild(copyField);
                copyField.select();
                copyField.setSelectionRange(0, 99999);
                try {
                    document.execCommand("copy");
                }
                catch (err) {
                    tempSuccess = false;
                    console.warn("Clipboard copy error: " + err);
                }
                document.body.removeChild(copyField);
            }
            if (tempSuccess) {
                panel.copySuccess = 1;
            }
            else {
                panel.copySuccess = -1;
            }
            break;
        case "nextFromTournamentEnd":
            playSound("click");
            userInput.removeHitArea("mute");
            userInput.removeHitArea("nextFromTournamentEnd");
            initStartScreen();
            break;
        case "playFromPause":
            playSound("click");
            if (audioType == 1) {
                if (!muted) {
                    Howler.mute(false);
                    playMusic();
                }
            }
            else if (audioType == 2) {
                if (!muted) {
                    playMusic();
                }
            }
            userInput.removeHitArea("playFromPause");
            userInput.removeHitArea("quitFromPause");
            userInput.removeHitArea("mute");
            resumeGame();
            break;
        case "quitFromPause":
            playSound("click");
            if (audioType == 1) {
                if (!muted) {
                    Howler.mute(false);
                    playMusic();
                }
            }
            else if (audioType == 2) {
                if (!muted) {
                    playMusic();
                }
            }
            userInput.removeHitArea("playFromPause");
            userInput.removeHitArea("quitFromPause");
            userInput.removeHitArea("mute");
            levelScore = 0;
            totalScore = 0;
            resetChallengeData();
            initStartScreen();
            break;
        case "restartFromPause":
            break;
    }
}
function resetChallengeData() {
    raceSelected = -1;
    challengeChar = -1;
    challengeTime = -1;
}
function getChallengeCode() {
    var tempTime = raceTime.toString();
    var tempCode = "?skcid=" + charLookup.charAt(raceSelected) + charLookup.charAt(curChar);
    var i = 0;
    while (i < tempTime.length) {
        tempCode += charLookup.charAt(parseInt(tempTime.charAt(i)));
        i++;
    }
    return tempCode;
}
function getRaceTimeFromCode(_code) {
    var tempNumStr = "";
    var i = 0;
    while (i < _code.length) {
        if (i == 0) {
            raceSelected = charLookup.indexOf(_code.charAt(i));
        }
        else if (i == 1) {
            challengeChar = charLookup.indexOf(_code.charAt(i));
        }
        else {
            tempNumStr += charLookup.indexOf(_code.charAt(i));
        }
        i++;
    }
    challengeTime = parseInt(tempNumStr);
}
function addTrackObject(_type, _id, _flavour) {
    if (_flavour === void 0) { _flavour = 0; }
    if (_type == "coin") {
        var tempCoin = new Elements.Coin(_id);
        aTrackObjects.push(tempCoin);
    }
    else if (_type == "pickUp") {
        var tempPickUp = new Elements.PickUp(_id, _flavour);
        aTrackObjects.push(tempPickUp);
    }
}
function addParticle(_x, _y, _angle) {
    var temp = new Elements.Shard(_x, _y, _angle);
    aEffects.push(temp);
}
function updateScore(_inc) {
    levelScore += _inc;
}
function initGameEnd0(_addCoins) {
    if (_addCoins === void 0) { _addCoins = true; }
    gameState = "gameEnd0";
    if (userCharPos < 4) {
        playSound("endGame0");
    }
    else if (userCharPos <= 10) {
        playSound("endGame1");
    }
    else {
        playSound("endGame2");
    }
    if (audioType == 1) {
        music.fade(music.volume(), .5, 500);
    }
    userInput.removeHitArea("pause");
    userInput.removeHitArea("steerLeft");
    userInput.removeHitArea("steerRight");
    userInput.removeKey("steerRight");
    userInput.removeKey("steerLeft");
    var oNextBut = { oImgData: assetLib.getData("uiButs"), aPos: [-100, -76], align: [1, 1], id: oImageIds.playBut, idOver: oImageIds.playButOver, flash: true };
    userInput.addHitArea("nextFromGameEnd0", butEventHandler, null, "image", oNextBut);
    var aButs = new Array(oNextBut);
    addMuteBut(aButs);
    panel = new Elements.Panel(gameState, aButs);
    aEffects = new Array();
    aEnemySkaters = new Array();
    aTrackObjects = new Array();
    ground = new Elements.Ground();
    userSkater = new Elements.UserSkater();
    panel.startTween1();
    if (_addCoins) {
        panel.endScreenTween0();
    }
    previousTime = new Date().getTime();
    updateGameEnd0();
}
function initGameEnd1(_addCoins) {
    if (_addCoins === void 0) { _addCoins = true; }
    gameState = "gameEnd1";
    if (audioType == 1) {
        music.fade(music.volume(), .5, 500);
    }
    if (challengeTime == -1 || raceTime < challengeTime) {
        playSound("endGame0");
    }
    else {
        playSound("endGame2");
    }
    userInput.removeHitArea("pause");
    userInput.removeHitArea("steerLeft");
    userInput.removeHitArea("steerRight");
    userInput.removeKey("steerRight");
    userInput.removeKey("steerLeft");
    var aButs = new Array();
    if (challengeTime == -1) {
        var oRetryBut = { oImgData: assetLib.getData("uiButs"), aPos: [-100, -76], align: [1, 1], id: oImageIds.retryBut, idOver: oImageIds.retryButOver, flash: true };
        var oCopyLinkBut = { oImgData: assetLib.getData("uiButs"), aPos: [0, 90], align: [.5, .45], id: oImageIds.copyLinkBut, idOver: oImageIds.copyLinkButOver, flash: true };
        userInput.addHitArea("copyLinkFromGameEnd1", butEventHandler, null, "image", oCopyLinkBut);
        aButs.push(oCopyLinkBut);
    }
    else if (raceTime > challengeTime) {
        var oRetryBut = { oImgData: assetLib.getData("uiButs"), aPos: [-100, -76], align: [1, 1], id: oImageIds.retryBut, idOver: oImageIds.retryButOver, flash: true };
    }
    else {
        var oRetryBut = { oImgData: assetLib.getData("uiButs"), aPos: [-100, -76], align: [1, 1], id: oImageIds.playBut, idOver: oImageIds.playButOver, flash: true };
    }
    var oUpgradeBut = { oImgData: assetLib.getData("uiButs"), aPos: [-290, -76], align: [1, 1], id: oImageIds.upgradeBut, idOver: oImageIds.upgradeButOver, flash: true };
    var oBackBut = { oImgData: assetLib.getData("uiButs"), aPos: [55, -43], align: [0, 1], id: oImageIds.backBut, idOver: oImageIds.backButOver };
    userInput.addHitArea("retryFromGameEnd1", butEventHandler, null, "image", oRetryBut);
    userInput.addHitArea("upgradeFromGameEnd1", butEventHandler, null, "image", oUpgradeBut);
    userInput.addHitArea("backFromGameEnd1", butEventHandler, null, "image", oBackBut);
    aButs.push(oRetryBut, oUpgradeBut, oBackBut);
    addMuteBut(aButs);
    panel = new Elements.Panel(gameState, aButs);
    aEffects = new Array();
    aEnemySkaters = new Array();
    aTrackObjects = new Array();
    ground = new Elements.Ground();
    userSkater = new Elements.UserSkater();
    panel.startTween1();
    if (_addCoins) {
        panel.endScreenTween1();
    }
    previousTime = new Date().getTime();
    updateGameEnd1();
}
function initTournamentEnd() {
    gameState = "tournamentEnd";
    playSound("endTourn");
    var oNextBut = { oImgData: assetLib.getData("uiButs"), aPos: [-100, -76], align: [1, 1], id: oImageIds.playBut, idOver: oImageIds.playButOver, flash: true };
    userInput.addHitArea("nextFromTournamentEnd", butEventHandler, null, "image", oNextBut);
    var aButs = new Array(oNextBut);
    addMuteBut(aButs);
    panel = new Elements.Panel(gameState, aButs);
    aEffects = new Array();
    aEnemySkaters = new Array();
    aTrackObjects = new Array();
    aEffects = new Array();
    for (var i = 0; i < 50; i++) {
        var tempC = new Elements.Confetti();
        aEffects.push(tempC);
    }
    ground = new Elements.Ground();
    userSkater = new Elements.UserSkater();
    panel.startTween1();
    panel.endScreenTween0();
    previousTime = new Date().getTime();
    updateTournamentEnd();
}
function updateGameEvent() {
    if (gameState != "game") {
        return;
    }
    delta = getDelta();
    if (gameType == 1 && ground.aRoad[0].id < raceLength && userSkater.raceStarted) {
        raceTime += Math.min(Math.round(delta * 100), 59900);
        if (challengeTime != -1) {
            var tempSeg = ((raceLength - 30) / challengeTime) * raceTime + 30;
            ghostSkater.segId = Math.floor(tempSeg);
            ghostSkater.segPerc = tempSeg - ghostSkater.segId;
        }
    }
    for (var i = 0; i < aEnemySkaters.length; i++) {
        if (aEnemySkaters[i].offscreenState != 0) {
            aEnemySkaters[i].update();
            aEnemySkaters[i].render();
        }
    }
    ground.update();
    ground.render();
    if (ground.aRoad[0].id < raceLength) {
        aRacePositions.sort(function (a, b) { return b.segId - a.segId; });
    }
    for (var i = 0; i < aRacePositions.length; i++) {
        if (!aRacePositions[i].isEnemy) {
            userCharPos = i;
            break;
        }
        else {
            aRacePositions[i].curPos = i;
        }
    }
    for (var i = 0; i < aRacePositions.length; i++) {
        if (aRacePositions[i].isEnemy && aRacePositions[i].offscreenState == 0 && i > userCharPos - 5) {
            aRacePositions[i].renderPointer();
        }
    }
    for (var i = 0; i < aTrackObjects.length; i++) {
        if (aTrackObjects[i].hasHit) {
            aTrackObjects[i].update();
            aTrackObjects[i].render();
        }
        if (aTrackObjects[i].removeMe) {
            aTrackObjects.splice(i, 1);
            i -= 1;
        }
    }
    for (var i = 0; i < aEffects.length; i++) {
        aEffects[i].update();
        aEffects[i].render();
        if (aEffects[i].removeMe) {
            aEffects.splice(i, 1);
            i -= 1;
        }
    }
    userSkater.update();
    userSkater.render();
    panel.update();
    panel.render();
    checkButtonsOver();
    requestAnimFrame(updateGameEvent);
}
function updateCreditsScreenEvent() {
    if (gameState != "credits") {
        return;
    }
    delta = getDelta();
    for (var i = 0; i < aTrackObjects.length; i++) {
        if (aTrackObjects[i].removeMe) {
            aTrackObjects.splice(i, 1);
            i -= 1;
        }
    }
    ground.update();
    ground.render();
    userSkater.update();
    userSkater.render();
    panel.update();
    panel.render();
    checkButtonsOver();
    requestAnimFrame(updateCreditsScreenEvent);
}
function updateGameIntro() {
    if (gameState != "gameIntro") {
        return;
    }
    delta = getDelta();
    for (var i = 0; i < aTrackObjects.length; i++) {
        if (aTrackObjects[i].removeMe) {
            aTrackObjects.splice(i, 1);
            i -= 1;
        }
    }
    ground.update();
    ground.render();
    userSkater.update();
    userSkater.render();
    panel.update();
    panel.render();
    for (var i = 0; i < aEffects.length; i++) {
        aEffects[i].update();
        aEffects[i].render();
        if (aEffects[i].removeMe) {
            aEffects.splice(i, 1);
            i -= 1;
        }
    }
    checkButtonsOver();
    requestAnimFrame(updateGameIntro);
}
function updateRaceSelect() {
    if (gameState != "raceSelect") {
        return;
    }
    delta = getDelta();
    for (var i = 0; i < aTrackObjects.length; i++) {
        if (aTrackObjects[i].removeMe) {
            aTrackObjects.splice(i, 1);
            i -= 1;
        }
    }
    ground.update();
    ground.render();
    userSkater.update();
    userSkater.render();
    panel.update();
    panel.render();
    for (var i = 0; i < aEffects.length; i++) {
        aEffects[i].update();
        aEffects[i].render();
        if (aEffects[i].removeMe) {
            aEffects.splice(i, 1);
            i -= 1;
        }
    }
    checkButtonsOver();
    requestAnimFrame(updateRaceSelect);
}
function updateGameEnd0() {
    if (gameState != "gameEnd0") {
        return;
    }
    delta = getDelta();
    for (var i = 0; i < aTrackObjects.length; i++) {
        if (aTrackObjects[i].removeMe) {
            aTrackObjects.splice(i, 1);
            i -= 1;
        }
    }
    ground.update();
    ground.render();
    userSkater.update();
    userSkater.render();
    panel.update();
    panel.render();
    for (var i = 0; i < aEffects.length; i++) {
        aEffects[i].update();
        aEffects[i].render();
        if (aEffects[i].removeMe) {
            aEffects.splice(i, 1);
            i -= 1;
        }
    }
    checkButtonsOver();
    requestAnimFrame(updateGameEnd0);
}
function updateGameEnd1() {
    if (gameState != "gameEnd1") {
        return;
    }
    delta = getDelta();
    for (var i = 0; i < aTrackObjects.length; i++) {
        if (aTrackObjects[i].removeMe) {
            aTrackObjects.splice(i, 1);
            i -= 1;
        }
    }
    ground.update();
    ground.render();
    userSkater.update();
    userSkater.render();
    panel.update();
    panel.render();
    for (var i = 0; i < aEffects.length; i++) {
        aEffects[i].update();
        aEffects[i].render();
        if (aEffects[i].removeMe) {
            aEffects.splice(i, 1);
            i -= 1;
        }
    }
    checkButtonsOver();
    requestAnimFrame(updateGameEnd1);
}
function updateTournamentEnd() {
    if (gameState != "tournamentEnd") {
        return;
    }
    delta = getDelta();
    for (var i = 0; i < aTrackObjects.length; i++) {
        if (aTrackObjects[i].removeMe) {
            aTrackObjects.splice(i, 1);
            i -= 1;
        }
    }
    ground.update();
    ground.render();
    userSkater.update();
    userSkater.render();
    panel.update();
    panel.render();
    for (var i = 0; i < aEffects.length; i++) {
        aEffects[i].update();
        aEffects[i].render();
        if (aEffects[i].removeMe) {
            aEffects.splice(i, 1);
            i -= 1;
        }
    }
    checkButtonsOver();
    requestAnimFrame(updateTournamentEnd);
}
function updateSplashScreenEvent() {
    if (gameState != "splash") {
        return;
    }
    delta = getDelta();
    splashTimer += delta;
    if (splashTimer > 2.5) {
        if (audioType == 1 && !muted) {
            playMusic();
            if (!hasFocus) {
                music.pause();
            }
        }
        initStartScreen();
        return;
    }
    background.render();
    panel.update();
    panel.render();
    checkButtonsOver();
    requestAnimFrame(updateSplashScreenEvent);
}
function updateStartScreenEvent() {
    if (gameState != "start") {
        return;
    }
    delta = getDelta();
    for (var i = 0; i < aTrackObjects.length; i++) {
        if (aTrackObjects[i].removeMe) {
            aTrackObjects.splice(i, 1);
            i -= 1;
        }
    }
    ground.update();
    ground.render();
    userSkater.update();
    userSkater.render();
    panel.update();
    panel.render();
    checkButtonsOver();
    requestAnimFrame(updateStartScreenEvent);
}
function updateUpgradesEvent() {
    if (gameState != "upgrades") {
        return;
    }
    delta = getDelta();
    for (var i = 0; i < aTrackObjects.length; i++) {
        if (aTrackObjects[i].removeMe) {
            aTrackObjects.splice(i, 1);
            i -= 1;
        }
    }
    ground.update();
    ground.render();
    userSkater.update();
    userSkater.render();
    panel.update();
    panel.render();
    for (var i = 0; i < aEffects.length; i++) {
        aEffects[i].update();
        aEffects[i].render();
        if (aEffects[i].removeMe) {
            aEffects.splice(i, 1);
            i -= 1;
        }
    }
    checkButtonsOver();
    requestAnimFrame(updateUpgradesEvent);
}
function updateCharSelectEvent() {
    if (gameState != "charSelect") {
        return;
    }
    delta = getDelta();
    for (var i = 0; i < aTrackObjects.length; i++) {
        if (aTrackObjects[i].removeMe) {
            aTrackObjects.splice(i, 1);
            i -= 1;
        }
    }
    ground.update();
    ground.render();
    userSkater.update();
    userSkater.render();
    panel.update();
    panel.render();
    for (var i = 0; i < aEffects.length; i++) {
        aEffects[i].update();
        aEffects[i].render();
        if (aEffects[i].removeMe) {
            aEffects.splice(i, 1);
            i -= 1;
        }
    }
    checkButtonsOver();
    requestAnimFrame(updateCharSelectEvent);
}
function updateLoaderEvent() {
    if (gameState != "load") {
        return;
    }
    delta = getDelta();
    assetLib.render();
    requestAnimFrame(updateLoaderEvent);
}
function updatePauseEvent() {
    if (gameState != "pause") {
        return;
    }
    delta = getDelta();
    background.render();
    panel.update();
    panel.render();
    checkButtonsOver();
    requestAnimFrame(updatePauseEvent);
}
function addDirectText(_font, _size, _width, _align, _x, _y, _str, _col) {
    if (_col === void 0) { _col = "#202020"; }
    ctx.fillStyle = _col;
    ctx.textAlign = _align;
    ctx.font = _size + "px " + assetLib.textData.langText["font" + _font][curLang];
    ctx.fillText(_str, _x, _y);
}
function addText(_font, _size, _width, _align, _x, _y, _str, _col) {
    if (_col === void 0) { _col = "#202020"; }
    ctx.fillStyle = _col;
    ctx.textAlign = _align;
    if (_width < getTextWidth(_font, _size, _str)) {
        var breakCount = 0;
        _size--;
        while (_width < getTextWidth(_font, _size, _str)) {
            _size--;
            if (breakCount > 100) {
                break;
            }
        }
    }
    if (curLang == "ar") {
        _y -= _size / 15;
    }
    ctx.font = _size + "px " + assetLib.textData.langText["font" + _font][curLang];
    ctx.fillText(getText(_str), _x, _y);
}
function getText(_str) {
    var tempText = assetLib.textData.langText[_str][curLang];
    if (curLang == "de") {
    }
    return tempText;
}
function getTextWidth(_font, _size, _str) {
    ctx.font = _size + "px " + assetLib.textData.langText["font" + _font][curLang];
    var metrics = ctx.measureText(getText(_str));
    return metrics.width;
}
function getCorrectedTextWidth(_font, _size, _width, _str) {
    if (_width < getTextWidth(_font, _size, _str)) {
        var breakCount = 0;
        _size--;
        while (_width < getTextWidth(_font, _size, _str)) {
            _size--;
            if (breakCount > 100) {
                break;
            }
        }
    }
    ctx.font = _size + "px " + assetLib.textData.langText["font" + _font][curLang];
    var metrics = ctx.measureText(getText(_str));
    return metrics.width;
}
function checkButtonsOver() {
    if (isMobile) {
        return;
    }
    for (var i = 0; i < panel.aButs.length; i++) {
        panel.aButs[i].isOver = false;
        if (userInput.mouseX > panel.aButs[i].aOverData[0] && userInput.mouseX < panel.aButs[i].aOverData[2] && userInput.mouseY > panel.aButs[i].aOverData[1] && userInput.mouseY < panel.aButs[i].aOverData[3]) {
            panel.aButs[i].isOver = true;
        }
    }
}
function clearButtonOvers() {
    userInput.mouseX = -100;
    userInput.mouseY = -100;
}
function getDelta() {
    var currentTime = new Date().getTime();
    var deltaTemp = (currentTime - previousTime) / 1000;
    previousTime = currentTime;
    if (deltaTemp > .5) {
        deltaTemp = 0;
    }
    return deltaTemp;
}
function checkSpriteCollision(_s1, _s2) {
    var s1XOffset = _s1.x;
    var s1YOffset = _s1.y;
    var s2XOffset = _s2.x;
    var s2YOffset = _s2.y;
    var distance_squared = (((s1XOffset - s2XOffset) * (s1XOffset - s2XOffset)) + ((s1YOffset - s2YOffset) * (s1YOffset - s2YOffset)));
    var radii_squared = (_s1.radius) * (_s2.radius);
    if (distance_squared < radii_squared) {
        return true;
    }
    else {
        return false;
    }
}
function getScaleImageToMax(_oImgData, _aLimit) {
    var newScale;
    if (_oImgData.isSpriteSheet) {
        if (_aLimit[0] / _oImgData.oData.spriteWidth < _aLimit[1] / _oImgData.oData.spriteHeight) {
            newScale = Math.min(_aLimit[0] / _oImgData.oData.spriteWidth, 1);
        }
        else {
            newScale = Math.min(_aLimit[1] / _oImgData.oData.spriteHeight, 1);
        }
    }
    else {
        if (_aLimit[0] / _oImgData.img.width < _aLimit[1] / _oImgData.img.height) {
            newScale = Math.min(_aLimit[0] / _oImgData.img.width, 1);
        }
        else {
            newScale = Math.min(_aLimit[1] / _oImgData.img.height, 1);
        }
    }
    return newScale;
}
function getCentreFromTopLeft(_aTopLeft, _oImgData, _imgScale) {
    var aCentre = new Array();
    aCentre.push(_aTopLeft[0] + (_oImgData.oData.spriteWidth / 2) * _imgScale);
    aCentre.push(_aTopLeft[1] + (_oImgData.oData.spriteHeight / 2) * _imgScale);
    return aCentre;
}
function loadPreAssets() {
    preAssetLib = new Utils.AssetLoader(curLang, [{
            id: "loader",
            file: "images/preloader.png",
            oAtlasData: {
                id0: { x: 0, y: 0, width: 792, height: 102 },
                id1: { x: 0, y: 104, width: 778, height: 81 },
                id2: { x: 0, y: 187, width: 520, height: 335 }
            }
        }], ctx, canvas.width, canvas.height, false);
    oImageIds.overBar = "id0";
    oImageIds.underBar = "id1";
    oImageIds.logo = "id2";
    preAssetLib.onReady(initLoadAssets);
}
function initLangSelect() {
    var oImgData;
    var j;
    var k;
    var gap = 10;
    var tileWidthNum = 0;
    var tileHeightNum = 0;
    var butScale = 1;
    for (var i = 0; i < aLangs.length; i++) {
        oImgData = preAssetLib.getData("lang" + aLangs[i]);
        if ((i + 1) * (oImgData.img.width * butScale) + (i + 2) * gap < canvas.width) {
            tileWidthNum++;
        }
        else {
            break;
        }
    }
    tileHeightNum = Math.ceil(aLangs.length / tileWidthNum);
    for (var i = 0; i < aLangs.length; i++) {
        oImgData = preAssetLib.getData("lang" + aLangs[i]);
        j = canvas.width / 2 - (tileWidthNum / 2) * (oImgData.img.width * butScale) - ((tileWidthNum - 1) / 2) * gap;
        j += (i % tileWidthNum) * ((oImgData.img.width * butScale) + gap);
        k = canvas.height / 2 - (tileHeightNum / 2) * (oImgData.img.height * butScale) - ((tileHeightNum - 1) / 2) * gap;
        k += (Math.floor(i / tileWidthNum) % tileHeightNum) * ((oImgData.img.height * butScale) + gap);
        ctx.drawImage(oImgData.img, 0, 0, oImgData.img.width, oImgData.img.height, j, k, (oImgData.img.width * butScale), (oImgData.img.height * butScale));
        var oBut = { oImgData: oImgData, aPos: [j + (oImgData.img.width * butScale) / 2, k + (oImgData.img.height * butScale) / 2], scale: butScale, id: "none", noMove: true };
        userInput.addHitArea("langSelect", butEventHandler, { lang: aLangs[i] }, "image", oBut);
    }
}
function initLoadAssets() {
    loadAssets();
}
function loadAssets() {
    assetLib = new Utils.AssetLoader(curLang, [{
            id: "info",
            file: "images/info.png"
        }, {
            id: "flare",
            file: "images/flare.png"
        }, {
            id: "uiButs",
            file: "images/uiButs.png",
            oAtlasData: {
                id0: { x: 180, y: 339, width: 178, height: 129 },
                id1: { x: 0, y: 339, width: 178, height: 129 },
                id10: { x: 1044, y: 1345, width: 77, height: 77 },
                id100: { x: 495, y: 540, width: 133, height: 133 },
                id101: { x: 450, y: 748, width: 133, height: 133 },
                id102: { x: 783, y: 1346, width: 89, height: 89 },
                id103: { x: 874, y: 1346, width: 89, height: 89 },
                id104: { x: 0, y: 0, width: 369, height: 102 },
                id105: { x: 0, y: 104, width: 369, height: 102 },
                id106: { x: 0, y: 601, width: 178, height: 129 },
                id107: { x: 0, y: 732, width: 178, height: 129 },
                id108: { x: 1303, y: 213, width: 77, height: 78 },
                id109: { x: 1303, y: 293, width: 77, height: 78 },
                id11: { x: 1303, y: 134, width: 77, height: 77 },
                id110: { x: 1314, y: 0, width: 77, height: 78 },
                id111: { x: 1360, y: 1344, width: 77, height: 78 },
                id12: { x: 585, y: 1345, width: 97, height: 77 },
                id13: { x: 684, y: 1345, width: 97, height: 77 },
                id14: { x: 0, y: 1125, width: 178, height: 129 },
                id15: { x: 0, y: 1256, width: 178, height: 129 },
                id16: { x: 180, y: 208, width: 178, height: 129 },
                id17: { x: 180, y: 470, width: 178, height: 129 },
                id18: { x: 1123, y: 1345, width: 77, height: 77 },
                id19: { x: 765, y: 539, width: 77, height: 77 },
                id2: { x: 0, y: 470, width: 178, height: 129 },
                id20: { x: 965, y: 1346, width: 77, height: 77 },
                id21: { x: 360, y: 748, width: 77, height: 77 },
                id22: { x: 1259, y: 537, width: 132, height: 132 },
                id23: { x: 1259, y: 403, width: 132, height: 132 },
                id24: { x: 1258, y: 1210, width: 132, height: 132 },
                id25: { x: 1169, y: 269, width: 132, height: 132 },
                id26: { x: 1180, y: 0, width: 132, height: 132 },
                id27: { x: 1125, y: 1076, width: 132, height: 132 },
                id28: { x: 855, y: 539, width: 133, height: 132 },
                id29: { x: 855, y: 1077, width: 133, height: 132 },
                id3: { x: 0, y: 208, width: 178, height: 129 },
                id30: { x: 855, y: 808, width: 133, height: 132 },
                id31: { x: 855, y: 942, width: 133, height: 133 },
                id32: { x: 900, y: 269, width: 133, height: 133 },
                id33: { x: 855, y: 1211, width: 133, height: 133 },
                id34: { x: 900, y: 135, width: 133, height: 132 },
                id35: { x: 990, y: 941, width: 133, height: 132 },
                id36: { x: 990, y: 807, width: 133, height: 132 },
                id37: { x: 765, y: 404, width: 133, height: 133 },
                id38: { x: 765, y: 269, width: 133, height: 133 },
                id39: { x: 990, y: 672, width: 133, height: 133 },
                id4: { x: 0, y: 863, width: 178, height: 129 },
                id40: { x: 855, y: 673, width: 133, height: 133 },
                id41: { x: 776, y: 0, width: 133, height: 133 },
                id42: { x: 990, y: 1075, width: 133, height: 133 },
                id43: { x: 990, y: 538, width: 133, height: 132 },
                id44: { x: 911, y: 0, width: 133, height: 132 },
                id45: { x: 900, y: 404, width: 133, height: 132 },
                id46: { x: 1035, y: 268, width: 132, height: 132 },
                id47: { x: 1035, y: 402, width: 132, height: 132 },
                id48: { x: 1046, y: 0, width: 132, height: 132 },
                id49: { x: 1125, y: 536, width: 132, height: 133 },
                id5: { x: 0, y: 994, width: 178, height: 129 },
                id50: { x: 1125, y: 671, width: 132, height: 133 },
                id51: { x: 1124, y: 1210, width: 132, height: 133 },
                id52: { x: 1125, y: 941, width: 132, height: 133 },
                id53: { x: 1169, y: 134, width: 132, height: 133 },
                id54: { x: 1125, y: 806, width: 132, height: 133 },
                id55: { x: 1035, y: 134, width: 132, height: 132 },
                id56: { x: 1259, y: 1073, width: 132, height: 132 },
                id57: { x: 990, y: 1210, width: 132, height: 132 },
                id58: { x: 720, y: 1210, width: 133, height: 132 },
                id59: { x: 720, y: 1076, width: 133, height: 132 },
                id6: { x: 1281, y: 1344, width: 77, height: 77 },
                id60: { x: 720, y: 942, width: 133, height: 132 },
                id61: { x: 1259, y: 939, width: 132, height: 132 },
                id62: { x: 1259, y: 671, width: 132, height: 132 },
                id63: { x: 1259, y: 805, width: 132, height: 132 },
                id64: { x: 630, y: 538, width: 133, height: 132 },
                id65: { x: 765, y: 135, width: 133, height: 132 },
                id66: { x: 630, y: 269, width: 133, height: 132 },
                id67: { x: 630, y: 135, width: 133, height: 132 },
                id68: { x: 585, y: 1211, width: 133, height: 132 },
                id69: { x: 585, y: 1077, width: 133, height: 132 },
                id7: { x: 1202, y: 1345, width: 77, height: 77 },
                id70: { x: 585, y: 943, width: 133, height: 132 },
                id71: { x: 585, y: 809, width: 133, height: 132 },
                id72: { x: 585, y: 675, width: 133, height: 132 },
                id73: { x: 180, y: 732, width: 178, height: 129 },
                id74: { x: 180, y: 601, width: 178, height: 129 },
                id75: { x: 495, y: 270, width: 133, height: 133 },
                id76: { x: 506, y: 0, width: 133, height: 133 },
                id77: { x: 495, y: 135, width: 133, height: 133 },
                id78: { x: 450, y: 1288, width: 133, height: 133 },
                id79: { x: 450, y: 1153, width: 133, height: 133 },
                id8: { x: 1169, y: 403, width: 77, height: 77 },
                id80: { x: 450, y: 1018, width: 133, height: 133 },
                id81: { x: 450, y: 883, width: 133, height: 133 },
                id82: { x: 641, y: 0, width: 133, height: 133 },
                id83: { x: 630, y: 403, width: 133, height: 133 },
                id84: { x: 360, y: 613, width: 133, height: 133 },
                id85: { x: 360, y: 478, width: 133, height: 133 },
                id86: { x: 720, y: 807, width: 133, height: 133 },
                id87: { x: 720, y: 672, width: 133, height: 133 },
                id88: { x: 315, y: 1268, width: 133, height: 133 },
                id89: { x: 315, y: 1133, width: 133, height: 133 },
                id9: { x: 1382, y: 80, width: 77, height: 77 },
                id90: { x: 315, y: 998, width: 133, height: 133 },
                id91: { x: 371, y: 0, width: 133, height: 133 },
                id92: { x: 360, y: 343, width: 133, height: 133 },
                id93: { x: 360, y: 208, width: 133, height: 133 },
                id94: { x: 180, y: 1268, width: 133, height: 133 },
                id95: { x: 315, y: 863, width: 133, height: 133 },
                id96: { x: 180, y: 863, width: 133, height: 133 },
                id97: { x: 180, y: 998, width: 133, height: 133 },
                id98: { x: 180, y: 1133, width: 133, height: 133 },
                id99: { x: 495, y: 405, width: 133, height: 133 }
            }
        }, {
            id: "uiElements",
            file: "images/uiElements.png",
            oAtlasData: {
                id0: { x: 0, y: 0, width: 700, height: 700 },
                id1: { x: 2010, y: 1196, width: 182, height: 296 },
                id10: { x: 0, y: 702, width: 661, height: 278 },
                id11: { x: 848, y: 1893, width: 261, height: 224 },
                id12: { x: 1584, y: 1981, width: 197, height: 212 },
                id13: { x: 1401, y: 720, width: 218, height: 207 },
                id14: { x: 1386, y: 1260, width: 222, height: 209 },
                id15: { x: 1421, y: 463, width: 215, height: 221 },
                id16: { x: 1358, y: 1835, width: 224, height: 226 },
                id17: { x: 1529, y: 0, width: 192, height: 215 },
                id18: { x: 1509, y: 240, width: 213, height: 210 },
                id19: { x: 1401, y: 929, width: 218, height: 187 },
                id2: { x: 880, y: 1381, width: 257, height: 323 },
                id20: { x: 1358, y: 1621, width: 224, height: 212 },
                id21: { x: 1282, y: 240, width: 225, height: 221 },
                id22: { x: 2010, y: 1494, width: 159, height: 231 },
                id23: { x: 1937, y: 0, width: 200, height: 216 },
                id24: { x: 1937, y: 218, width: 199, height: 215 },
                id25: { x: 667, y: 1381, width: 110, height: 43 },
                id26: { x: 1724, y: 0, width: 211, height: 253 },
                id27: { x: 1797, y: 1883, width: 211, height: 253 },
                id28: { x: 1823, y: 941, width: 211, height: 253 },
                id29: { x: 1797, y: 1373, width: 211, height: 253 },
                id3: { x: 2036, y: 751, width: 151, height: 200 },
                id30: { x: 1282, y: 0, width: 245, height: 238 },
                id31: { x: 927, y: 540, width: 245, height: 238 },
                id32: { x: 1111, y: 1946, width: 245, height: 238 },
                id33: { x: 1797, y: 1628, width: 211, height: 253 },
                id34: { x: 1154, y: 780, width: 245, height: 238 },
                id35: { x: 1174, y: 480, width: 245, height: 238 },
                id36: { x: 1139, y: 1381, width: 245, height: 238 },
                id37: { x: 1724, y: 255, width: 211, height: 253 },
                id38: { x: 1621, y: 686, width: 211, height: 253 },
                id39: { x: 1154, y: 1020, width: 245, height: 238 },
                id4: { x: 1834, y: 510, width: 207, height: 239 },
                id40: { x: 1509, y: 1118, width: 98, height: 99 },
                id41: { x: 555, y: 1381, width: 110, height: 43 },
                id42: { x: 884, y: 1159, width: 257, height: 220 },
                id43: { x: 555, y: 1159, width: 327, height: 220 },
                id44: { x: 702, y: 379, width: 262, height: 159 },
                id45: { x: 663, y: 702, width: 262, height: 159 },
                id46: { x: 808, y: 863, width: 73, height: 72 },
                id47: { x: 770, y: 2051, width: 74, height: 72 },
                id48: { x: 779, y: 1381, width: 73, height: 72 },
                id49: { x: 0, y: 1895, width: 422, height: 154 },
                id5: { x: 2010, y: 1727, width: 159, height: 265 },
                id50: { x: 0, y: 2105, width: 259, height: 79 },
                id51: { x: 702, y: 0, width: 331, height: 377 },
                id52: { x: 424, y: 1895, width: 422, height: 154 },
                id53: { x: 0, y: 1542, width: 469, height: 77 },
                id54: { x: 0, y: 982, width: 553, height: 479 },
                id55: { x: 702, y: 636, width: 80, height: 49 },
                id56: { x: 0, y: 2051, width: 371, height: 52 },
                id57: { x: 770, y: 2125, width: 66, height: 67 },
                id58: { x: 838, y: 2125, width: 66, height: 66 },
                id59: { x: 1584, y: 1471, width: 211, height: 253 },
                id6: { x: 897, y: 863, width: 255, height: 290 },
                id60: { x: 1610, y: 1118, width: 211, height: 253 },
                id61: { x: 1584, y: 1726, width: 211, height: 253 },
                id62: { x: 1111, y: 1706, width: 245, height: 238 },
                id63: { x: 1035, y: 0, width: 245, height: 238 },
                id64: { x: 1035, y: 240, width: 245, height: 238 },
                id65: { x: 1386, y: 1471, width: 107, height: 142 },
                id66: { x: 832, y: 540, width: 93, height: 146 },
                id67: { x: 1401, y: 1118, width: 106, height: 139 },
                id68: { x: 1477, y: 2063, width: 98, height: 99 },
                id69: { x: 663, y: 863, width: 143, height: 95 },
                id7: { x: 624, y: 2051, width: 144, height: 133 },
                id70: { x: 464, y: 2051, width: 158, height: 100 },
                id71: { x: 261, y: 2119, width: 201, height: 71 },
                id72: { x: 1621, y: 941, width: 89, height: 103 },
                id73: { x: 702, y: 540, width: 128, height: 94 },
                id74: { x: 1358, y: 2063, width: 117, height: 100 },
                id75: { x: 0, y: 1621, width: 467, height: 272 },
                id76: { x: 471, y: 1463, width: 407, height: 428 },
                id77: { x: 1263, y: 1260, width: 118, height: 119 },
                id78: { x: 1143, y: 1260, width: 118, height: 119 },
                id79: { x: 373, y: 2051, width: 85, height: 63 },
                id8: { x: 880, y: 1706, width: 183, height: 184 },
                id80: { x: 555, y: 982, width: 340, height: 175 },
                id9: { x: 0, y: 1463, width: 469, height: 77 }
            }
        }, {
            id: "gameElements",
            file: "images/gameElements.png",
            oAtlasData: {
                id0: { x: 948, y: 822, width: 143, height: 425 },
                id1: { x: 0, y: 376, width: 320, height: 336 },
                id10: { x: 1176, y: 1545, width: 127, height: 146 },
                id11: { x: 1056, y: 1397, width: 127, height: 146 },
                id12: { x: 1096, y: 0, width: 127, height: 146 },
                id13: { x: 1047, y: 1607, width: 127, height: 146 },
                id14: { x: 952, y: 1249, width: 127, height: 146 },
                id15: { x: 1082, y: 514, width: 127, height: 146 },
                id16: { x: 1096, y: 296, width: 127, height: 146 },
                id17: { x: 1081, y: 1249, width: 127, height: 146 },
                id18: { x: 1093, y: 810, width: 127, height: 146 },
                id19: { x: 951, y: 514, width: 129, height: 148 },
                id2: { x: 762, y: 476, width: 187, height: 344 },
                id20: { x: 902, y: 1608, width: 143, height: 143 },
                id21: { x: 766, y: 1462, width: 143, height: 144 },
                id22: { x: 911, y: 1462, width: 143, height: 143 },
                id23: { x: 0, y: 1713, width: 17, height: 35 },
                id24: { x: 19, y: 1713, width: 12, height: 35 },
                id25: { x: 0, y: 0, width: 501, height: 35 },
                id26: { x: 766, y: 1306, width: 184, height: 154 },
                id27: { x: 764, y: 171, width: 185, height: 154 },
                id28: { x: 0, y: 714, width: 301, height: 504 },
                id29: { x: 1650, y: 1158, width: 108, height: 314 },
                id3: { x: 545, y: 0, width: 202, height: 236 },
                id30: { x: 1567, y: 772, width: 113, height: 384 },
                id31: { x: 1185, y: 1397, width: 114, height: 118 },
                id32: { x: 1093, y: 1106, width: 114, height: 118 },
                id33: { x: 322, y: 606, width: 215, height: 88 },
                id34: { x: 764, y: 327, width: 173, height: 80 },
                id35: { x: 322, y: 506, width: 221, height: 98 },
                id36: { x: 303, y: 1080, width: 236, height: 88 },
                id37: { x: 253, y: 1696, width: 195, height: 80 },
                id38: { x: 301, y: 1220, width: 243, height: 97 },
                id39: { x: 0, y: 1350, width: 276, height: 256 },
                id4: { x: 951, y: 427, width: 133, height: 85 },
                id40: { x: 564, y: 476, width: 196, height: 328 },
                id41: { x: 303, y: 714, width: 259, height: 364 },
                id42: { x: 278, y: 1350, width: 264, height: 203 },
                id43: { x: 564, y: 806, width: 194, height: 152 },
                id44: { x: 0, y: 1220, width: 299, height: 128 },
                id45: { x: 546, y: 1080, width: 202, height: 237 },
                id46: { x: 0, y: 1608, width: 251, height: 103 },
                id47: { x: 506, y: 1668, width: 207, height: 112 },
                id48: { x: 749, y: 0, width: 190, height: 169 },
                id49: { x: 0, y: 37, width: 321, height: 337 },
                id5: { x: 322, y: 376, width: 236, height: 128 },
                id50: { x: 951, y: 0, width: 143, height: 425 },
                id51: { x: 759, y: 960, width: 187, height: 344 },
                id52: { x: 560, y: 238, width: 202, height: 236 },
                id53: { x: 760, y: 822, width: 175, height: 86 },
                id54: { x: 544, y: 1319, width: 220, height: 347 },
                id55: { x: 564, y: 960, width: 193, height: 98 },
                id56: { x: 253, y: 1608, width: 251, height: 86 },
                id57: { x: 715, y: 1668, width: 185, height: 104 },
                id58: { x: 323, y: 37, width: 220, height: 291 },
                id59: { x: 1305, y: 1216, width: 113, height: 384 },
                id6: { x: 951, y: 664, width: 129, height: 148 },
                id60: { x: 1225, y: 0, width: 113, height: 384 },
                id61: { x: 1567, y: 386, width: 113, height: 384 },
                id62: { x: 1222, y: 830, width: 113, height: 384 },
                id63: { x: 1455, y: 0, width: 113, height: 384 },
                id64: { x: 1452, y: 772, width: 113, height: 384 },
                id65: { x: 1452, y: 386, width: 113, height: 384 },
                id66: { x: 1420, y: 1158, width: 113, height: 384 },
                id67: { x: 1337, y: 772, width: 113, height: 384 },
                id68: { x: 1535, y: 1158, width: 113, height: 384 },
                id69: { x: 1337, y: 386, width: 113, height: 384 },
                id7: { x: 1093, y: 958, width: 127, height: 146 },
                id70: { x: 1222, y: 444, width: 113, height: 384 },
                id71: { x: 1340, y: 0, width: 113, height: 384 },
                id72: { x: 1570, y: 0, width: 113, height: 384 },
                id8: { x: 1082, y: 662, width: 127, height: 146 },
                id9: { x: 1096, y: 148, width: 127, height: 146 }
            }
        }, {
            id: "vehicles",
            file: "images/vehicles.png",
            oAtlasData: {
                id0: { x: 0, y: 0, width: 139, height: 164 },
                id1: { x: 444, y: 466, width: 73, height: 73 },
                id10: { x: 444, y: 576, width: 56, height: 33 },
                id11: { x: 294, y: 498, width: 96, height: 28 },
                id12: { x: 498, y: 426, width: 56, height: 33 },
                id13: { x: 196, y: 498, width: 96, height: 28 },
                id14: { x: 423, y: 0, width: 139, height: 164 },
                id15: { x: 423, y: 316, width: 73, height: 73 },
                id16: { x: 519, y: 461, width: 56, height: 33 },
                id17: { x: 196, y: 528, width: 96, height: 28 },
                id18: { x: 444, y: 541, width: 56, height: 33 },
                id19: { x: 98, y: 558, width: 96, height: 28 },
                id2: { x: 0, y: 166, width: 139, height: 164 },
                id20: { x: 556, y: 426, width: 56, height: 33 },
                id21: { x: 196, y: 558, width: 96, height: 28 },
                id22: { x: 0, y: 332, width: 139, height: 164 },
                id23: { x: 369, y: 528, width: 73, height: 73 },
                id24: { x: 282, y: 166, width: 139, height: 164 },
                id25: { x: 423, y: 391, width: 73, height: 73 },
                id26: { x: 498, y: 391, width: 56, height: 33 },
                id27: { x: 0, y: 558, width: 96, height: 28 },
                id28: { x: 282, y: 0, width: 139, height: 164 },
                id29: { x: 423, y: 241, width: 73, height: 73 },
                id3: { x: 498, y: 316, width: 73, height: 73 },
                id30: { x: 282, y: 332, width: 139, height: 164 },
                id31: { x: 423, y: 166, width: 73, height: 73 },
                id32: { x: 141, y: 166, width: 139, height: 164 },
                id33: { x: 294, y: 528, width: 73, height: 73 },
                id34: { x: 556, y: 391, width: 56, height: 33 },
                id35: { x: 0, y: 528, width: 96, height: 28 },
                id36: { x: 502, y: 576, width: 56, height: 33 },
                id37: { x: 0, y: 498, width: 96, height: 28 },
                id38: { x: 519, y: 496, width: 56, height: 33 },
                id39: { x: 98, y: 528, width: 96, height: 28 },
                id4: { x: 141, y: 0, width: 139, height: 164 },
                id5: { x: 498, y: 241, width: 73, height: 73 },
                id6: { x: 141, y: 332, width: 139, height: 164 },
                id7: { x: 498, y: 166, width: 73, height: 73 },
                id8: { x: 502, y: 541, width: 56, height: 33 },
                id9: { x: 98, y: 498, width: 96, height: 28 }
            }
        }, {
            id: "enemyChars",
            file: "images/enemyChars.png",
            oAtlasData: {
                id0: { x: 603, y: 880, width: 219, height: 350 },
                id1: { x: 1022, y: 351, width: 179, height: 349 },
                id10: { x: 0, y: 660, width: 340, height: 328 },
                id11: { x: 1329, y: 676, width: 111, height: 346 },
                id12: { x: 1248, y: 1030, width: 118, height: 319 },
                id13: { x: 824, y: 861, width: 186, height: 320 },
                id14: { x: 603, y: 528, width: 219, height: 350 },
                id15: { x: 1022, y: 0, width: 179, height: 349 },
                id16: { x: 1200, y: 702, width: 127, height: 326 },
                id17: { x: 342, y: 1142, width: 208, height: 289 },
                id18: { x: 342, y: 835, width: 259, height: 305 },
                id19: { x: 0, y: 990, width: 340, height: 328 },
                id2: { x: 1203, y: 0, width: 127, height: 326 },
                id20: { x: 342, y: 0, width: 287, height: 262 },
                id21: { x: 1117, y: 1183, width: 129, height: 294 },
                id22: { x: 824, y: 291, width: 196, height: 283 },
                id23: { x: 824, y: 1183, width: 160, height: 279 },
                id24: { x: 0, y: 0, width: 340, height: 328 },
                id25: { x: 1323, y: 328, width: 111, height: 346 },
                id26: { x: 1203, y: 328, width: 118, height: 319 },
                id27: { x: 1012, y: 861, width: 186, height: 320 },
                id3: { x: 631, y: 0, width: 208, height: 289 },
                id4: { x: 342, y: 528, width: 259, height: 305 },
                id5: { x: 0, y: 330, width: 340, height: 328 },
                id6: { x: 342, y: 264, width: 287, height: 262 },
                id7: { x: 986, y: 1183, width: 129, height: 294 },
                id8: { x: 824, y: 576, width: 196, height: 283 },
                id9: { x: 841, y: 0, width: 160, height: 279 }
            }
        }, {
            id: "coin",
            file: "images/coin_84x84.png",
            oAnims: {
                spin0: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                spin1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
                spin2: [2, 3, 4, 5, 6, 7, 8, 9, 0, 1],
                spin3: [3, 4, 5, 6, 7, 8, 9, 0, 1, 2],
                spin4: [4, 5, 6, 7, 8, 9, 0, 1, 2, 3],
                spin5: [5, 6, 7, 8, 9, 0, 1, 2, 3, 4],
                spin6: [6, 7, 8, 9, 0, 1, 2, 3, 4, 5],
                spin7: [7, 8, 9, 0, 1, 2, 3, 4, 5, 6],
                spin8: [8, 9, 0, 1, 2, 3, 4, 5, 6, 7],
                spin9: [9, 0, 1, 2, 3, 4, 5, 6, 7, 8]
            }
        }, {
            id: "charRider0",
            file: "images/char0_326x361.png",
            oAnims: {
                startPause: [0],
                startGo: [1, 2, 3, 4, 5, 6, 16],
                jump: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26]
            }
        }, {
            id: "charRider1",
            file: "images/char1_256x370.png",
            oAnims: {
                startPause: [0],
                startGo: [1, 2, 3, 4, 5, 6, 16],
                jump: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26]
            }
        }, {
            id: "charRider2",
            file: "images/char2_197x336.png",
            oAnims: {
                startPause: [0],
                startGo: [1, 2, 3, 4, 5, 6, 16],
                jump: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26]
            }
        }, {
            id: "charRider3",
            file: "images/char3_432x303.png",
            oAnims: {
                startPause: [0],
                startGo: [1, 2, 3, 4, 5, 6, 16],
                jump: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26]
            }
        }, {
            id: "charRider4",
            file: "images/char4_380x340.png",
            oAnims: {
                startPause: [0],
                startGo: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 21],
                jump: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 39, 38, 37, 36, 35, 34, 33, 32, 31]
            }
        }, {
            id: "charRider5",
            file: "images/char5_441x354.png",
            oAnims: {
                startPause: [0],
                startGo: [1, 2, 3, 4, 5, 6, 16],
                jump: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26]
            }
        }, {
            id: "charRider6",
            file: "images/char6_357x277.png",
            oAnims: {
                startPause: [0],
                startGo: [1, 2, 3, 4, 5, 6, 16],
                jump: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26]
            }
        }, {
            id: "charRider7",
            file: "images/char7_217x295.png",
            oAnims: {
                startPause: [0],
                startGo: [1, 2, 3, 4, 5, 6, 16],
                jump: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26]
            }
        }, {
            id: "charRider8",
            file: "images/char8_392x312.png",
            oAnims: {
                startPause: [0],
                startGo: [1, 2, 3, 4, 5, 6, 16],
                jump: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26]
            }
        }, {
            id: "charRider9",
            file: "images/char9_262x297.png",
            oAnims: {
                startPause: [0],
                startGo: [1, 2, 3, 4, 5, 6, 16],
                jump: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26]
            }
        }, {
            id: "charRider10",
            file: "images/char10_428x364.png",
            oAnims: {
                startPause: [0],
                startGo: [1, 2, 3, 4, 5, 6, 16],
                jump: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26]
            }
        }, {
            id: "charRider11",
            file: "images/char11_180x365.png",
            oAnims: {
                startPause: [0],
                startGo: [1, 2, 3, 4, 5, 6, 16],
                jump: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26]
            }
        }, {
            id: "charRider12",
            file: "images/char12_223x333.png",
            oAnims: {
                startPause: [0],
                startGo: [1, 2, 3, 4, 5, 6, 16],
                jump: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26]
            }
        }, {
            id: "charRider13",
            file: "images/char13_262x340.png",
            oAnims: {
                startPause: [0],
                startGo: [1, 2, 3, 4, 5, 6, 16],
                jump: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26]
            }
        }, {
            id: "langText",
            file: "json/text.json"
        }, {
            id: "numbers0",
            file: "images/numbers0_75x97.png"
        }, {
            id: "numbers1",
            file: "images/numbers1_75x97.png"
        }, {
            id: "numbers2",
            file: "images/numbers2_75x99.png"
        }, {
            id: "titleLogo",
            file: "images/title/" + curLang + ".png"
        }, {
            id: "horizon0",
            file: "images/horizon0.jpg"
        }, {
            id: "horizon1",
            file: "images/horizon1.jpg"
        }, {
            id: "horizon2",
            file: "images/horizon2.jpg"
        }, {
            id: "horizon3",
            file: "images/horizon3.jpg"
        }, {
            id: "horizon4",
            file: "images/horizon4.jpg"
        }], ctx, canvas.width, canvas.height);
    oImageIds.vehiclePart00 = "id0";
    oImageIds.vehiclePart10 = "id1";
    oImageIds.vehiclePart01 = "id2";
    oImageIds.vehiclePart11 = "id3";
    oImageIds.vehiclePart02 = "id4";
    oImageIds.vehiclePart12 = "id5";
    oImageIds.vehiclePart03 = "id6";
    oImageIds.vehiclePart13 = "id7";
    oImageIds.vehiclePart04 = "id8";
    oImageIds.vehiclePart14 = "id9";
    oImageIds.vehiclePart05 = "id10";
    oImageIds.vehiclePart15 = "id11";
    oImageIds.vehiclePart06 = "id12";
    oImageIds.vehiclePart16 = "id13";
    oImageIds.vehiclePart07 = "id14";
    oImageIds.vehiclePart17 = "id15";
    oImageIds.vehiclePart08 = "id16";
    oImageIds.vehiclePart18 = "id17";
    oImageIds.vehiclePart09 = "id18";
    oImageIds.vehiclePart19 = "id19";
    oImageIds.vehiclePart010 = "id20";
    oImageIds.vehiclePart110 = "id21";
    oImageIds.vehiclePart011 = "id22";
    oImageIds.vehiclePart111 = "id23";
    oImageIds.vehiclePart012 = "id24";
    oImageIds.vehiclePart112 = "id25";
    oImageIds.vehiclePart013 = "id26";
    oImageIds.vehiclePart113 = "id27";
    oImageIds.vehiclePart014 = "id28";
    oImageIds.vehiclePart114 = "id29";
    oImageIds.vehiclePart015 = "id30";
    oImageIds.vehiclePart115 = "id31";
    oImageIds.vehiclePart016 = "id32";
    oImageIds.vehiclePart116 = "id33";
    oImageIds.vehiclePart017 = "id34";
    oImageIds.vehiclePart117 = "id35";
    oImageIds.vehiclePart018 = "id36";
    oImageIds.vehiclePart118 = "id37";
    oImageIds.vehiclePart019 = "id38";
    oImageIds.vehiclePart119 = "id39";
    oImageIds.stillChar0 = "id0";
    oImageIds.stillChar1 = "id1";
    oImageIds.stillChar2 = "id2";
    oImageIds.stillChar3 = "id3";
    oImageIds.stillChar4 = "id4";
    oImageIds.stillChar5 = "id5";
    oImageIds.stillChar6 = "id6";
    oImageIds.stillChar7 = "id7";
    oImageIds.stillChar8 = "id8";
    oImageIds.stillChar9 = "id9";
    oImageIds.stillChar10 = "id10";
    oImageIds.stillChar11 = "id11";
    oImageIds.stillChar12 = "id12";
    oImageIds.stillChar13 = "id13";
    oImageIds.zapChar0 = "id14";
    oImageIds.zapChar1 = "id15";
    oImageIds.zapChar2 = "id16";
    oImageIds.zapChar3 = "id17";
    oImageIds.zapChar4 = "id18";
    oImageIds.zapChar5 = "id19";
    oImageIds.zapChar6 = "id20";
    oImageIds.zapChar7 = "id21";
    oImageIds.zapChar8 = "id22";
    oImageIds.zapChar9 = "id23";
    oImageIds.zapChar10 = "id24";
    oImageIds.zapChar11 = "id25";
    oImageIds.zapChar12 = "id26";
    oImageIds.zapChar13 = "id27";
    oImageIds.roadSide00 = "id0";
    oImageIds.roadSide01 = "id1";
    oImageIds.roadSide02 = "id2";
    oImageIds.roadSide03 = "id3";
    oImageIds.roadSide04 = "id4";
    oImageIds.testShadow = "id5";
    oImageIds.charPointer0 = "id6";
    oImageIds.charPointer1 = "id7";
    oImageIds.charPointer2 = "id8";
    oImageIds.charPointer3 = "id9";
    oImageIds.charPointer4 = "id10";
    oImageIds.charPointer5 = "id11";
    oImageIds.charPointer6 = "id12";
    oImageIds.charPointer7 = "id13";
    oImageIds.charPointer8 = "id14";
    oImageIds.charPointer9 = "id15";
    oImageIds.charPointer10 = "id16";
    oImageIds.charPointer11 = "id17";
    oImageIds.charPointer12 = "id18";
    oImageIds.charPointer13 = "id19";
    oImageIds.pickUp0 = "id20";
    oImageIds.pickUp2 = "id21";
    oImageIds.pickUp1 = "id22";
    oImageIds.uiDistEnd = "id23";
    oImageIds.uiDistCap = "id24";
    oImageIds.uiDistBar = "id25";
    oImageIds.raceFlag0 = "id26";
    oImageIds.raceFlag1 = "id27";
    oImageIds.lightning = "id28";
    oImageIds.endBanner = "id29";
    oImageIds.raceBanner14 = "id30";
    oImageIds.leftSign = "id31";
    oImageIds.rightSign = "id32";
    oImageIds.bonus00 = "id33";
    oImageIds.bonus10 = "id34";
    oImageIds.bonus20 = "id35";
    oImageIds.bonus01 = "id36";
    oImageIds.bonus11 = "id37";
    oImageIds.bonus21 = "id38";
    oImageIds.roadSide10 = "id39";
    oImageIds.roadSide11 = "id40";
    oImageIds.roadSide12 = "id41";
    oImageIds.roadSide13 = "id42";
    oImageIds.roadSide14 = "id43";
    oImageIds.roadSide20 = "id44";
    oImageIds.roadSide21 = "id45";
    oImageIds.roadSide22 = "id46";
    oImageIds.roadSide23 = "id47";
    oImageIds.roadSide24 = "id48";
    oImageIds.roadSide30 = "id49";
    oImageIds.roadSide31 = "id50";
    oImageIds.roadSide32 = "id51";
    oImageIds.roadSide33 = "id52";
    oImageIds.roadSide34 = "id53";
    oImageIds.roadSide40 = "id54";
    oImageIds.roadSide41 = "id55";
    oImageIds.roadSide42 = "id56";
    oImageIds.roadSide43 = "id57";
    oImageIds.roadSide44 = "id58";
    oImageIds.raceBanner1 = "id59";
    oImageIds.raceBanner2 = "id60";
    oImageIds.raceBanner3 = "id61";
    oImageIds.raceBanner4 = "id62";
    oImageIds.raceBanner5 = "id63";
    oImageIds.raceBanner6 = "id64";
    oImageIds.raceBanner7 = "id65";
    oImageIds.raceBanner8 = "id66";
    oImageIds.raceBanner9 = "id67";
    oImageIds.raceBanner10 = "id68";
    oImageIds.raceBanner11 = "id69";
    oImageIds.raceBanner12 = "id70";
    oImageIds.raceBanner13 = "id71";
    oImageIds.raceBanner0 = "id72";
    oImageIds.jaggedFrame = "id0";
    oImageIds.titleChar0 = "id1";
    oImageIds.titleChar1 = "id2";
    oImageIds.titleChar2 = "id3";
    oImageIds.titleChar3 = "id4";
    oImageIds.titleChar4 = "id5";
    oImageIds.titleChar5 = "id6";
    oImageIds.titleChar6 = "id7";
    oImageIds.titleChar7 = "id8";
    oImageIds.screenTitlePanel0 = "id9";
    oImageIds.charPanel = "id10";
    oImageIds.charZoom0 = "id11";
    oImageIds.charZoom1 = "id12";
    oImageIds.charZoom2 = "id13";
    oImageIds.charZoom3 = "id14";
    oImageIds.charZoom4 = "id15";
    oImageIds.charZoom5 = "id16";
    oImageIds.charZoom6 = "id17";
    oImageIds.charZoom7 = "id18";
    oImageIds.charZoom8 = "id19";
    oImageIds.charZoom9 = "id20";
    oImageIds.charZoom10 = "id21";
    oImageIds.charZoom11 = "id22";
    oImageIds.charZoom12 = "id23";
    oImageIds.charZoom13 = "id24";
    oImageIds.costPanel1 = "id25";
    oImageIds.vehicle0 = "id26";
    oImageIds.vehicle1 = "id27";
    oImageIds.vehicle2 = "id28";
    oImageIds.vehicle3 = "id29";
    oImageIds.vehicle4 = "id30";
    oImageIds.vehicle5 = "id31";
    oImageIds.vehicle6 = "id32";
    oImageIds.vehicle7 = "id33";
    oImageIds.vehicle8 = "id34";
    oImageIds.vehicle9 = "id35";
    oImageIds.vehicle10 = "id36";
    oImageIds.vehicle11 = "id37";
    oImageIds.vehicle12 = "id38";
    oImageIds.vehicle13 = "id39";
    oImageIds.uiCoin0 = "id40";
    oImageIds.costPanel0 = "id41";
    oImageIds.tutA0 = "id42";
    oImageIds.tutA1 = "id43";
    oImageIds.tutB0 = "id44";
    oImageIds.tutB1 = "id45";
    oImageIds.endCup0 = "id46";
    oImageIds.endCup1 = "id47";
    oImageIds.endCup2 = "id48";
    oImageIds.endPanel0B = "id49";
    oImageIds.endPanel1 = "id50";
    oImageIds.endPanel2 = "id51";
    oImageIds.endPanel0A = "id52";
    oImageIds.screenTitlePanel1 = "id53";
    oImageIds.map = "id54";
    oImageIds.mapRaceCompletePanel = "id55";
    oImageIds.mapSpeech = "id56";
    oImageIds.mapCross0 = "id57";
    oImageIds.mapCross1 = "id58";
    oImageIds.vehicle140 = "id59";
    oImageIds.vehicle150 = "id60";
    oImageIds.vehicle160 = "id61";
    oImageIds.vehicle141 = "id62";
    oImageIds.vehicle151 = "id63";
    oImageIds.vehicle161 = "id64";
    oImageIds.upgradePreview0 = "id65";
    oImageIds.upgradePreview1 = "id66";
    oImageIds.upgradePreview2 = "id67";
    oImageIds.uiCoin1 = "id68";
    oImageIds.logo0 = "id69";
    oImageIds.logo1 = "id70";
    oImageIds.logo2 = "id71";
    oImageIds.logo3 = "id72";
    oImageIds.logo4 = "id73";
    oImageIds.logo5 = "id74";
    oImageIds.acceptChallengeBg = "id75";
    oImageIds.makeChallengeBg = "id76";
    oImageIds.orangeCharBg0 = "id77";
    oImageIds.orangeCharBg1 = "id78";
    oImageIds.soloPointer = "id79";
    oImageIds.areYouSurePanel = "id80";
    oImageIds.tournamentBut = "id0";
    oImageIds.tournamentButOver = "id1";
    oImageIds.quickGameBut = "id2";
    oImageIds.quickGameButOver = "id3";
    oImageIds.upgradeBut = "id4";
    oImageIds.upgradeButOver = "id5";
    oImageIds.infoBut = "id6";
    oImageIds.infoButOver = "id7";
    oImageIds.muteBut1 = "id8";
    oImageIds.muteBut1Over = "id9";
    oImageIds.muteBut0 = "id10";
    oImageIds.muteBut0Over = "id11";
    oImageIds.backBut = "id12";
    oImageIds.backButOver = "id13";
    oImageIds.playBut = "id14";
    oImageIds.playButOver = "id15";
    oImageIds.quitBut = "id16";
    oImageIds.quitButOver = "id17";
    oImageIds.pauseBut = "id18";
    oImageIds.pauseButOver = "id19";
    oImageIds.resetBut = "id20";
    oImageIds.resetButOver = "id21";
    oImageIds.char0But = "id22";
    oImageIds.char0ButOver = "id23";
    oImageIds.char0ButGrey = "id24";
    oImageIds.char1But = "id25";
    oImageIds.char1ButOver = "id26";
    oImageIds.char1ButGrey = "id27";
    oImageIds.char2But = "id28";
    oImageIds.char2ButOver = "id29";
    oImageIds.char2ButGrey = "id30";
    oImageIds.char3But = "id31";
    oImageIds.char3ButOver = "id32";
    oImageIds.char3ButGrey = "id33";
    oImageIds.char4But = "id34";
    oImageIds.char4ButOver = "id35";
    oImageIds.char4ButGrey = "id36";
    oImageIds.char5But = "id37";
    oImageIds.char5ButOver = "id38";
    oImageIds.char5ButGrey = "id39";
    oImageIds.char6But = "id40";
    oImageIds.char6ButOver = "id41";
    oImageIds.char6ButGrey = "id42";
    oImageIds.char7But = "id43";
    oImageIds.char7ButOver = "id44";
    oImageIds.char7ButGrey = "id45";
    oImageIds.char8But = "id46";
    oImageIds.char8ButOver = "id47";
    oImageIds.char8ButGrey = "id48";
    oImageIds.char9But = "id49";
    oImageIds.char9ButOver = "id50";
    oImageIds.char9ButGrey = "id51";
    oImageIds.char10But = "id52";
    oImageIds.char10ButOver = "id53";
    oImageIds.char10ButGrey = "id54";
    oImageIds.char11But = "id55";
    oImageIds.char11ButOver = "id56";
    oImageIds.char11ButGrey = "id57";
    oImageIds.char12But = "id58";
    oImageIds.char12ButOver = "id59";
    oImageIds.char12ButGrey = "id60";
    oImageIds.char13But = "id61";
    oImageIds.char13ButOver = "id62";
    oImageIds.char13ButGrey = "id63";
    oImageIds.upgrade0But = "id64";
    oImageIds.upgrade0ButOver = "id65";
    oImageIds.upgrade0ButGrey = "id66";
    oImageIds.upgrade1But = "id67";
    oImageIds.upgrade1ButOver = "id68";
    oImageIds.upgrade1ButGrey = "id69";
    oImageIds.upgrade2But = "id70";
    oImageIds.upgrade2ButOver = "id71";
    oImageIds.upgrade2ButGrey = "id72";
    oImageIds.quitBut = "id73";
    oImageIds.quitButOver = "id74";
    oImageIds.upgrade30But = "id75";
    oImageIds.upgrade30ButOver = "id76";
    oImageIds.upgrade30ButGrey = "id77";
    oImageIds.upgrade40But = "id78";
    oImageIds.upgrade40ButOver = "id79";
    oImageIds.upgrade40ButGrey = "id80";
    oImageIds.upgrade50But = "id81";
    oImageIds.upgrade50ButOver = "id82";
    oImageIds.upgrade50ButGrey = "id83";
    oImageIds.upgrade31But = "id84";
    oImageIds.upgrade31ButOver = "id85";
    oImageIds.upgrade31ButGrey = "id86";
    oImageIds.upgrade41But = "id87";
    oImageIds.upgrade41ButOver = "id88";
    oImageIds.upgrade41ButGrey = "id89";
    oImageIds.upgrade51But = "id90";
    oImageIds.upgrade51ButOver = "id91";
    oImageIds.upgrade51ButGrey = "id92";
    oImageIds.upgrade6But = "id93";
    oImageIds.upgrade6ButOver = "id94";
    oImageIds.upgrade6ButGrey = "id95";
    oImageIds.upgrade7But = "id96";
    oImageIds.upgrade7ButOver = "id97";
    oImageIds.upgrade7ButGrey = "id98";
    oImageIds.upgrade8But = "id99";
    oImageIds.upgrade8ButOver = "id100";
    oImageIds.upgrade8ButGrey = "id101";
    oImageIds.mapRaceBut = "id102";
    oImageIds.mapRaceButOver = "id103";
    oImageIds.copyLinkBut = "id104";
    oImageIds.copyLinkButOver = "id105";
    oImageIds.retryBut = "id106";
    oImageIds.retryButOver = "id107";
    oImageIds.yesBut = "id108";
    oImageIds.yesButOver = "id109";
    oImageIds.noBut = "id110";
    oImageIds.noButOver = "id111";
    oImageIds.titleLogo = "id0";
    oImageIds.bgPanel = "id1";
    assetLib.onReady(initSplash);
    gameState = "load";
    previousTime = new Date().getTime();
    updateLoaderEvent();
}
function resizeCanvas() {
    var tempInnerWidth = window.innerWidth;
    var tempInnerHeight = window.innerHeight;
    canvas.height = tempInnerHeight;
    canvas.width = tempInnerWidth;
    canvas.style.width = tempInnerWidth + "px";
    canvas.style.height = tempInnerHeight + "px";
    var maxW;
    var maxH;
    var minW;
    var minH;
    canvasScale = 1;
    if (tempInnerWidth < tempInnerHeight) {
        maxW = maxWidth;
        maxH = maxHeight;
        minW = minWidth;
        minH = minHeight;
    }
    else {
        maxW = maxHeight;
        maxH = maxWidth;
        minW = minHeight;
        minH = minWidth;
    }
    if (canvas.width / canvas.height < minW / minH) {
        canvas.width = maxW;
        canvas.height = maxW * (tempInnerHeight / tempInnerWidth);
        canvasScale = maxW / tempInnerWidth;
    }
    else {
        canvas.height = minH;
        canvas.width = minH * (tempInnerWidth / tempInnerHeight);
        canvasScale = minH / tempInnerHeight;
    }
    if (ground) {
        ground.horizonStretchWidth = Math.max(canvas.width, ground.oHorizonImgData.img.width);
        ground.horizonX0 = 0;
        ground.horizonX1 = -ground.horizonStretchWidth;
    }
    switch (gameState) {
        case "game":
            userInput.removeHitArea("steerLeft");
            userInput.removeHitArea("steerRight");
            userInput.removeHitArea("steerTouch");
            if (isMobile) {
                userInput.addHitArea("steerLeft", butEventHandler, { multiTouch: true }, "rect", { aRect: [0, 60, canvas.width / 2, canvas.height] }, true);
                userInput.addHitArea("steerRight", butEventHandler, { multiTouch: true }, "rect", { aRect: [canvas.width / 2, 60, canvas.width, canvas.height] }, true);
            }
            break;
        case "charSelect":
            setCharSelectButs();
            break;
        case "upgrades":
            setUpgradeButs();
            break;
        case "credits":
        case "gameComplete":
            break;
    }
    this.prevCanvasWidth = tempInnerWidth;
    this.prevCanvasHeight = tempInnerHeight;
    window.scrollTo(0, 0);
}
function playSound(_id) {
    if (audioType == 1) {
        sound.play(_id);
    }
}
function toggleMute() {
    muted = !muted;
    if (audioType == 1) {
        if (muted) {
            Howler.mute(true);
            music.pause();
        }
        else {
            Howler.mute(false);
            playMusic();
            if (gameState == "game") {
                music.volume(1);
            }
            else {
                music.volume(.5);
            }
        }
    }
    else if (audioType == 2) {
        if (muted) {
            music.pause();
        }
        else {
            playMusic();
        }
    }
}
