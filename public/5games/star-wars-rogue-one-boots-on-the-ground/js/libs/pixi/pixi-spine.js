(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * @namespace PIXI.spine
 */
module.exports = PIXI.spine = {
    Spine:          require('./Spine'),
    SpineRuntime:   require('./SpineRuntime'),
    loaders:        require('./loaders')
};

},{"./Spine":45,"./SpineRuntime":43,"./loaders":49}],2:[function(require,module,exports){
var spine = require('../SpineUtil');
spine.Animation = function (name, timelines, duration)
{
    this.name = name;
    this.timelines = timelines;
    this.duration = duration;
};
spine.Animation.prototype = {
    apply: function (skeleton, lastTime, time, loop, events)
    {
        if (loop && this.duration != 0)
        {
            time %= this.duration;
            lastTime %= this.duration;
        }
        var timelines = this.timelines;
        for (var i = 0, n = timelines.length; i < n; i++)
            timelines[i].apply(skeleton, lastTime, time, events, 1);
    },
    mix: function (skeleton, lastTime, time, loop, events, alpha)
    {
        if (loop && this.duration != 0)
        {
            time %= this.duration;
            lastTime %= this.duration;
        }
        var timelines = this.timelines;
        for (var i = 0, n = timelines.length; i < n; i++)
            timelines[i].apply(skeleton, lastTime, time, events, alpha);
    }
};
spine.Animation.binarySearch = function (values, target, step)
{
    var low = 0;
    var high = Math.floor(values.length / step) - 2;
    if (!high) return step;
    var current = high >>> 1;
    while (true)
    {
        if (values[(current + 1) * step] <= target)
            low = current + 1;
        else
            high = current;
        if (low == high) return (low + 1) * step;
        current = (low + high) >>> 1;
    }
};
spine.Animation.binarySearch1 = function (values, target)
{
    var low = 0;
    var high = values.length - 2;
    if (!high) return 1;
    var current = high >>> 1;
    while (true)
    {
        if (values[current + 1] <= target)
            low = current + 1;
        else
            high = current;
        if (low == high) return low + 1;
        current = (low + high) >>> 1;
    }
};
spine.Animation.linearSearch = function (values, target, step)
{
    for (var i = 0, last = values.length - step; i <= last; i += step)
        if (values[i] > target) return i;
    return -1;
};
module.exports = spine.Animation;

},{"../SpineUtil":44}],3:[function(require,module,exports){
var spine = require('../SpineUtil');
spine.TrackEntry = require('./TrackEntry');
spine.AnimationState = function (stateData)
{
    this.data = stateData;
    this.tracks = [];
    this.events = [];
};
spine.AnimationState.prototype = {
    onStart: null,
    onEnd: null,
    onComplete: null,
    onEvent: null,
    timeScale: 1,
    update: function (delta)
    {
        delta *= this.timeScale;
        for (var i = 0; i < this.tracks.length; i++)
        {
            var current = this.tracks[i];
            if (!current) continue;

            current.time += delta * current.timeScale;
            if (current.previous)
            {
                var previousDelta = delta * current.previous.timeScale;
                current.previous.time += previousDelta;
                current.mixTime += previousDelta;
            }

            var next = current.next;
            if (next)
            {
                next.time = current.lastTime - next.delay;
                if (next.time >= 0) this.setCurrent(i, next);
            } else {
                // End non-looping animation when it reaches its end time and there is no next entry.
                if (!current.loop && current.lastTime >= current.endTime) this.clearTrack(i);
            }
        }
    },
    apply: function (skeleton)
    {
        skeleton.resetDrawOrder();

        for (var i = 0; i < this.tracks.length; i++)
        {
            var current = this.tracks[i];
            if (!current) continue;

            this.events.length = 0;

            var time = current.time;
            var lastTime = current.lastTime;
            var endTime = current.endTime;
            var loop = current.loop;
            if (!loop && time > endTime) time = endTime;

            var previous = current.previous;
            if (!previous)
            {
                if (current.mix == 1)
                    current.animation.apply(skeleton, current.lastTime, time, loop, this.events);
                else
                    current.animation.mix(skeleton, current.lastTime, time, loop, this.events, current.mix);
            } else {
                var previousTime = previous.time;
                if (!previous.loop && previousTime > previous.endTime) previousTime = previous.endTime;
                previous.animation.apply(skeleton, previousTime, previousTime, previous.loop, null);

                var alpha = current.mixTime / current.mixDuration * current.mix;
                if (alpha >= 1)
                {
                    alpha = 1;
                    current.previous = null;
                }
                current.animation.mix(skeleton, current.lastTime, time, loop, this.events, alpha);
            }

            for (var ii = 0, nn = this.events.length; ii < nn; ii++)
            {
                var event = this.events[ii];
                if (current.onEvent) current.onEvent(i, event);
                if (this.onEvent) this.onEvent(i, event);
            }

            // Check if completed the animation or a loop iteration.
            if (loop ? (lastTime % endTime > time % endTime) : (lastTime < endTime && time >= endTime))
            {
                var count = Math.floor(time / endTime);
                if (current.onComplete) current.onComplete(i, count);
                if (this.onComplete) this.onComplete(i, count);
            }

            current.lastTime = current.time;
        }
    },
    clearTracks: function ()
    {
        for (var i = 0, n = this.tracks.length; i < n; i++)
            this.clearTrack(i);
        this.tracks.length = 0;
    },
    clearTrack: function (trackIndex)
    {
        if (trackIndex >= this.tracks.length) return;
        var current = this.tracks[trackIndex];
        if (!current) return;

        if (current.onEnd) current.onEnd(trackIndex);
        if (this.onEnd) this.onEnd(trackIndex);

        this.tracks[trackIndex] = null;
    },
    _expandToIndex: function (index)
    {
        if (index < this.tracks.length) return this.tracks[index];
        while (index >= this.tracks.length)
            this.tracks.push(null);
        return null;
    },
    setCurrent: function (index, entry)
    {
        var current = this._expandToIndex(index);
        if (current)
        {
            var previous = current.previous;
            current.previous = null;

            if (current.onEnd) current.onEnd(index);
            if (this.onEnd) this.onEnd(index);

            entry.mixDuration = this.data.getMix(current.animation, entry.animation);
            if (entry.mixDuration > 0)
            {
                entry.mixTime = 0;
                // If a mix is in progress, mix from the closest animation.
                if (previous && current.mixTime / current.mixDuration < 0.5)
                    entry.previous = previous;
                else
                    entry.previous = current;
            }
        }

        this.tracks[index] = entry;

        if (entry.onStart) entry.onStart(index);
        if (this.onStart) this.onStart(index);
    },
    setAnimationByName: function (trackIndex, animationName, loop)
    {
        var animation = this.data.skeletonData.findAnimation(animationName);
        if (!animation) throw "Animation not found: " + animationName;
        return this.setAnimation(trackIndex, animation, loop);
    },
    /** Set the current animation. Any queued animations are cleared. */
    setAnimation: function (trackIndex, animation, loop)
    {
        var entry = new spine.TrackEntry();
        entry.animation = animation;
        entry.loop = loop;
        entry.endTime = animation.duration;
        this.setCurrent(trackIndex, entry);
        return entry;
    },
    addAnimationByName: function (trackIndex, animationName, loop, delay)
    {
        var animation = this.data.skeletonData.findAnimation(animationName);
        if (!animation) throw "Animation not found: " + animationName;
        return this.addAnimation(trackIndex, animation, loop, delay);
    },
    /** Adds an animation to be played delay seconds after the current or last queued animation.
     * @param delay May be <= 0 to use duration of previous animation minus any mix duration plus the negative delay. */
    addAnimation: function (trackIndex, animation, loop, delay)
    {
        var entry = new spine.TrackEntry();
        entry.animation = animation;
        entry.loop = loop;
        entry.endTime = animation.duration;

        var last = this._expandToIndex(trackIndex);
        if (last)
        {
            while (last.next)
                last = last.next;
            last.next = entry;
        } else
            this.tracks[trackIndex] = entry;

        if (delay <= 0)
        {
            if (last)
                delay += last.endTime - this.data.getMix(last.animation, animation);
            else
                delay = 0;
        }
        entry.delay = delay;

        return entry;
    },
    /**
     * Returns true if animation exists in skeleton data
     * @param animationName
     * @returns {boolean}
     */
    hasAnimationByName: function (animationName)
    {
        var animation = this.data.skeletonData.findAnimation(animationName);
        return animation !== null;
    },
    /** May be null. */
    getCurrent: function (trackIndex)
    {
        if (trackIndex >= this.tracks.length) return null;
        return this.tracks[trackIndex];
    }
};
module.exports = spine.AnimationState;


},{"../SpineUtil":44,"./TrackEntry":37}],4:[function(require,module,exports){
var spine = require('../SpineUtil');
spine.AnimationStateData = function (skeletonData)
{
    this.skeletonData = skeletonData;
    this.animationToMixTime = {};
};
spine.AnimationStateData.prototype = {
    defaultMix: 0,
    setMixByName: function (fromName, toName, duration)
    {
        var from = this.skeletonData.findAnimation(fromName);
        if (!from) throw "Animation not found: " + fromName;
        var to = this.skeletonData.findAnimation(toName);
        if (!to) throw "Animation not found: " + toName;
        this.setMix(from, to, duration);
    },
    setMix: function (from, to, duration)
    {
        this.animationToMixTime[from.name + ":" + to.name] = duration;
    },
    getMix: function (from, to)
    {
        var key = from.name + ":" + to.name;
        return this.animationToMixTime.hasOwnProperty(key) ? this.animationToMixTime[key] : this.defaultMix;
    }
};
module.exports = spine.AnimationStateData;


},{"../SpineUtil":44}],5:[function(require,module,exports){
var spine = require('../SpineUtil');
spine.AtlasReader = require('./AtlasReader');
spine.AtlasPage = require('./AtlasPage');
spine.AtlasRegion = require('./AtlasRegion');
var syncImageLoaderAdapter = require('../loaders/syncImageLoaderAdapter.js')

spine.Atlas = function(atlasText, loaderFunction, callback) {
    this.pages = [];
    this.regions = [];
    if (typeof atlasText === "string") {
        this.addSpineAtlas.call(this, atlasText, loaderFunction, callback);
    }
};

spine.Atlas.prototype = {
    addTexture: function(name, texture) {
        var pages = this.pages;
        var page = null;
        for (var i=0;i<pages.length;i++) {
            if (pages[i].rendererObject === texture.baseTexture) {
                page = pages[i];
                break;
            }
        }
        if (page === null) {
            page = new spine.AtlasPage();
            page.name = 'texturePage';
            var baseTexture = texture.baseTexture;
            page.width = baseTexture.realWidth;
            page.height = baseTexture.realHeight;
            page.rendererObject = baseTexture;
            //those fields are not relevant in Pixi
            page.format = 'RGBA8888';
            page.minFilter = page.magFilter = "Nearest";
            page.uWrap = spine.Atlas.TextureWrap.clampToEdge;
            page.vWrap = spine.Atlas.TextureWrap.clampToEdge;
            pages.push(page);
        }
        var region = new spine.AtlasRegion();
        region.name = name;
        region.page = page;
        region.texture = texture;
        region.index = -1;
        this.regions.push(region);
        return region;
    },
    addTextureHash: function(textures, stripExtension) {
        for (var key in textures) {
            if (textures.hasOwnProperty(key)) {
                this.addTexture(stripExtension && key.indexOf('.') !== -1 ? key.substr(0, key.lastIndexOf('.')) : key, textures[key]);
            }
        }
    },
    addSpineAtlas: function (atlasText, loaderFunction, callback)
    {
        //TODO: remove this legacy later
        if (typeof loaderFunction !== "function") {
            //old syntax
            var baseUrl = loaderFunction;
            var crossOrigin = callback;
            loaderFunction = syncImageLoaderAdapter(baseUrl, crossOrigin);
            callback = null;
        }

        this.texturesLoading = 0;

        var self = this;

        var reader = new spine.AtlasReader(atlasText);
        var tuple = [];
        tuple.length = 4;
        var page = null;

        iterateParser();

        function iterateParser() {
            while (true) {
                var line = reader.readLine();
                if (line === null) {
                    return callback && callback(self);
                }
                line = reader.trim(line);
                if (!line.length)
                    page = null;
                else if (!page) {
                    page = new spine.AtlasPage();
                    page.name = line;

                    if (reader.readTuple(tuple) == 2) { // size is only optional for an atlas packed with an old TexturePacker.
                        page.width = parseInt(tuple[0]);
                        page.height = parseInt(tuple[1]);
                        reader.readTuple(tuple);
                    } else {
                        //old format, detect width and height by texture
                    }
                    page.format = spine.Atlas.Format[tuple[0]];

                    reader.readTuple(tuple);
                    page.minFilter = spine.Atlas.TextureFilter[tuple[0]];
                    page.magFilter = spine.Atlas.TextureFilter[tuple[1]];

                    var direction = reader.readValue();
                    page.uWrap = spine.Atlas.TextureWrap.clampToEdge;
                    page.vWrap = spine.Atlas.TextureWrap.clampToEdge;
                    if (direction == "x")
                        page.uWrap = spine.Atlas.TextureWrap.repeat;
                    else if (direction == "y")
                        page.vWrap = spine.Atlas.TextureWrap.repeat;
                    else if (direction == "xy")
                        page.uWrap = page.vWrap = spine.Atlas.TextureWrap.repeat;

                    // @ivanpopelyshev: I so want to use generators and "yield()" here, or at least promises
                    loaderFunction(line, function (texture) {
                        page.rendererObject = texture;
                        if (!texture.hasLoaded) {
                            texture.width = page.width;
                            texture.height = page.height;
                        }
                        self.pages.push(page);
                        if (!page.width || !page.height) {
                            page.width = texture.realWidth;
                            page.height = texture.realHeight;
                            if (!page.width || !page.height) {
                                console.log("ERROR spine atlas page " + page.name + ": meshes wont work if you dont specify size in atlas (http://www.html5gamedevs.com/topic/18888-pixi-spines-and-meshes/?p=107121)");
                            }
                        }
                        iterateParser();
                    });
                    break;
                } else {
                    var region = new spine.AtlasRegion();
                    region.name = line;
                    region.page = page;

                    var rotate = reader.readValue() === "true" ? 6 : 0;

                    reader.readTuple(tuple);
                    var x = parseInt(tuple[0]);
                    var y = parseInt(tuple[1]);

                    reader.readTuple(tuple);
                    var width = parseInt(tuple[0]);
                    var height = parseInt(tuple[1]);

                    var resolution = page.rendererObject.resolution;
                    x /= resolution;
                    y /= resolution;
                    width /= resolution;
                    height /= resolution;

                    var frame = new PIXI.Rectangle(x, y, rotate ? height : width, rotate ? width : height);

                    if (reader.readTuple(tuple) == 4) { // split is optional
                        region.splits = [parseInt(tuple[0]), parseInt(tuple[1]), parseInt(tuple[2]), parseInt(tuple[3])];

                        if (reader.readTuple(tuple) == 4) { // pad is optional, but only present with splits
                            region.pads = [parseInt(tuple[0]), parseInt(tuple[1]), parseInt(tuple[2]), parseInt(tuple[3])];

                            reader.readTuple(tuple);
                        }
                    }

                    var originalWidth = parseInt(tuple[0]) / resolution;
                    var originalHeight = parseInt(tuple[1]) / resolution;
                    reader.readTuple(tuple);
                    var offsetX = parseInt(tuple[0]) / resolution;
                    var offsetY = parseInt(tuple[1]) / resolution;

                    var orig = new PIXI.Rectangle(0, 0, originalWidth, originalHeight);
                    var trim = new PIXI.Rectangle(offsetX, originalHeight - height - offsetY, width, height);

                    //TODO: pixiv3 uses different frame/crop/trim

                    if (PIXI.VERSION[0] == '4') {
                        // pixi v4.0.0
                        region.texture = new PIXI.Texture(region.page.rendererObject, frame, orig, trim, rotate);
                    } else {
                        // pixi v3.0.11
                        var frame2 = new PIXI.Rectangle(x, y, width, height);
                        var crop = frame2.clone();
                        trim.width = originalWidth;
                        trim.height = originalHeight;
                        region.texture = new PIXI.Texture(region.page.rendererObject, frame2, crop, trim, rotate);
                    }

                    region.index = parseInt(reader.readValue());
                    region.texture._updateUvs();

                    self.regions.push(region);
                }
            }
        }
    },
    findRegion: function (name)
    {
        var regions = this.regions;
        for (var i = 0, n = regions.length; i < n; i++)
            if (regions[i].name == name) return regions[i];
        return null;
    },
    dispose: function ()
    {
        var pages = this.pages;
        for (var i = 0, n = pages.length; i < n; i++)
            pages[i].rendererObject.destroy(true);
    },
    updateUVs: function (page)
    {
        var regions = this.regions;
        for (var i = 0, n = regions.length; i < n; i++)
        {
            var region = regions[i];
            if (region.page != page) continue;
            region.texture._updateUvs();
        }
    }
};

spine.Atlas.Format = {
    alpha: 0,
    intensity: 1,
    luminanceAlpha: 2,
    rgb565: 3,
    rgba4444: 4,
    rgb888: 5,
    rgba8888: 6
};

spine.Atlas.TextureFilter = {
    nearest: 0,
    linear: 1,
    mipMap: 2,
    mipMapNearestNearest: 3,
    mipMapLinearNearest: 4,
    mipMapNearestLinear: 5,
    mipMapLinearLinear: 6
};

spine.Atlas.TextureWrap = {
    mirroredRepeat: 0,
    clampToEdge: 1,
    repeat: 2
};
module.exports = spine.Atlas;

},{"../SpineUtil":44,"../loaders/syncImageLoaderAdapter.js":50,"./AtlasPage":7,"./AtlasReader":8,"./AtlasRegion":9}],6:[function(require,module,exports){
var spine = require('../SpineUtil');
spine.RegionAttachment = require('./RegionAttachment');
spine.MeshAttachment = require('./MeshAttachment');
spine.WeightedMeshAttachment = require('./WeightedMeshAttachment');
spine.BoundingBoxAttachment = require('./BoundingBoxAttachment');
spine.AtlasAttachmentParser = function (atlas)
{
    this.atlas = atlas;
};
spine.AtlasAttachmentParser.prototype = {
    newRegionAttachment: function (skin, name, path)
    {
        var region = this.atlas.findRegion(path);
        if (!region) throw "Region not found in atlas: " + path + " (region attachment: " + name + ")";
        var attachment = new spine.RegionAttachment(name);
        attachment.rendererObject = region;
        attachment.setUVs(region.u, region.v, region.u2, region.v2, region.rotate);
        attachment.regionOffsetX = region.offsetX;
        attachment.regionOffsetY = region.spineOffsetY;
        attachment.regionWidth = region.width;
        attachment.regionHeight = region.height;
        attachment.regionOriginalWidth = region.originalWidth;
        attachment.regionOriginalHeight = region.originalHeight;
        return attachment;
    },
    newMeshAttachment: function (skin, name, path)
    {
        var region = this.atlas.findRegion(path);
        if (!region) throw "Region not found in atlas: " + path + " (mesh attachment: " + name + ")";
        var attachment = new spine.MeshAttachment(name);
        attachment.rendererObject = region;
        // region.texture.on('update', spine.MeshAttachment.prototype.updateUVs.bind(attachment));
        return attachment;
    },
    newWeightedMeshAttachment: function (skin, name, path)
    {
        var region = this.atlas.findRegion(path);
        if (!region) throw "Region not found in atlas: " + path + " (skinned mesh attachment: " + name + ")";
        var attachment = new spine.WeightedMeshAttachment(name);
        attachment.rendererObject = region;
        // region.texture.on('update', spine.WeightedMeshAttachment.prototype.updateUVs.bind(attachment));
        return attachment;
    },
    newBoundingBoxAttachment: function (skin, name)
    {
        return new spine.BoundingBoxAttachment(name);
    }
};
module.exports = spine.AtlasAttachmentParser;


},{"../SpineUtil":44,"./BoundingBoxAttachment":14,"./MeshAttachment":25,"./RegionAttachment":26,"./WeightedMeshAttachment":42}],7:[function(require,module,exports){
var spine = require('../SpineUtil');
spine.AtlasPage = function ()
{};
spine.AtlasPage.prototype = {
    name: null,
    format: null,
    minFilter: null,
    magFilter: null,
    uWrap: null,
    vWrap: null,
    rendererObject: null,
    width: 0,
    height: 0
};
module.exports = spine.AtlasPage;


},{"../SpineUtil":44}],8:[function(require,module,exports){
var spine = require('../SpineUtil');
spine.AtlasReader = function (text)
{
    this.lines = text.split(/\r\n|\r|\n/);
};
spine.AtlasReader.prototype = {
    index: 0,
    trim: function (value)
    {
        return value.replace(/^\s+|\s+$/g, "");
    },
    readLine: function ()
    {
        if (this.index >= this.lines.length) return null;
        return this.lines[this.index++];
    },
    readValue: function ()
    {
        var line = this.readLine();
        var colon = line.indexOf(":");
        if (colon == -1) throw "Invalid line: " + line;
        return this.trim(line.substring(colon + 1));
    },
    /** Returns the number of tuple values read (1, 2 or 4). */
    readTuple: function (tuple)
    {
        var line = this.readLine();
        var colon = line.indexOf(":");
        if (colon == -1) throw "Invalid line: " + line;
        var i = 0, lastMatch = colon + 1;
        for (; i < 3; i++)
        {
            var comma = line.indexOf(",", lastMatch);
            if (comma == -1) break;
            tuple[i] = this.trim(line.substr(lastMatch, comma - lastMatch));
            lastMatch = comma + 1;
        }
        tuple[i] = this.trim(line.substring(lastMatch));
        return i + 1;
    }
};
module.exports = spine.AtlasReader;


},{"../SpineUtil":44}],9:[function(require,module,exports){
var spine = require('../SpineUtil');
spine.AtlasRegion = function ()
{};
spine.AtlasRegion.prototype = {
    name: null,
    /**
     * @member {PIXI.Texture}
     */
    texture: null,

    /**
     * @member {PIXI.spine.Spine.AtlasPage}
     */
    page: null,
    index: 0,
    splits: null,
    pads: null
};

Object.defineProperties(spine.AtlasRegion.prototype, {
    x: {
        get: function() {
            return this.texture.frame.x;
        }
    },
    y: {
        get: function() {
            return this.texture.frame.y;
        }
    },
    width: {
        get: function() {
            var tex = this.texture;
            if (PIXI.VERSION[0] == '3') {
                return tex.crop.width;
            }
            if (tex.trim) {
                return tex.trim.width;
            }
            return tex.orig.width;
        }
    },
    height: {
        get: function() {
            var tex = this.texture;
            if (PIXI.VERSION[0] == '3') {
                return tex.crop.height;
            }
            if (tex.trim) {
                return tex.trim.height;
            }
            return tex.orig.height;
        }
    },
    u: {
        get: function() {
            return this.texture._uvs.x0;
        }
    },
    v: {
        get: function() {
            return this.texture._uvs.y0;
        }
    },
    u2: {
        get: function() {
            return this.texture._uvs.x2;
        }
    },
    v2: {
        get: function() {
            return this.texture._uvs.y2;
        }
    },
    rotate: {
        get: function() {
            return !!this.texture.rotate;
        }
    },
    offsetX: {
        get: function() {
            var tex = this.texture;
            return tex.trim ? tex.trim.x : 0;
        }
    },
    offsetY: {
        get: function() {
            console.warn("Deprecation Warning: @Hackerham: I guess, if you are using PIXI-SPINE ATLAS region.offsetY, you want a texture, right? Use region.texture from now on.");
            return this.spineOffsetY;
        }
    },
    pixiOffsetY: {
        get: function() {
            var tex = this.texture;
            return tex.trim ? tex.trim.y : 0;
        }
    },
    spineOffsetY: {
        get: function() {
            var tex = this.texture;
            return this.originalHeight - this.height - (tex.trim ? tex.trim.y : 0);
        }
    },  
    originalWidth: {
        get: function() {
            var tex = this.texture;
            if (PIXI.VERSION[0] == '3') {
                if (tex.trim) {
                    return tex.trim.width;
                }
                return tex.crop.width;
            }
            return tex.orig.width;
        }
    },
    originalHeight: {
        get: function() {
            var tex = this.texture;
            if (PIXI.VERSION[0] == '3') {
                if (tex.trim) {
                    return tex.trim.height;
                }
                return tex.crop.height;
            }
            return tex.orig.height;
        }
    }
});

module.exports = spine.AtlasRegion;


},{"../SpineUtil":44}],10:[function(require,module,exports){
var spine = require('../SpineUtil');
spine.Curves = require('./Curves');
spine.Animation = require('./Animation');
spine.AttachmentTimeline = function (frameCount)
{
    this.curves = new spine.Curves(frameCount);
    this.frames = []; // time, ...
    this.frames.length = frameCount;
    this.attachmentNames = [];
    this.attachmentNames.length = frameCount;
};
spine.AttachmentTimeline.prototype = {
    slotIndex: 0,
    getFrameCount: function ()
    {
        return this.frames.length;
    },
    setFrame: function (frameIndex, time, attachmentName)
    {
        this.frames[frameIndex] = time;
        this.attachmentNames[frameIndex] = attachmentName;
    },
    apply: function (skeleton, lastTime, time, firedEvents, alpha)
    {
        var frames = this.frames;
        if (time < frames[0])
        {
            if (lastTime > time) this.apply(skeleton, lastTime, Number.MAX_VALUE, null, 0);
            return;
        } else if (lastTime > time) //
            lastTime = -1;

        var frameIndex = time >= frames[frames.length - 1] ? frames.length - 1 : spine.Animation.binarySearch1(frames, time) - 1;
        if (frames[frameIndex] < lastTime) return;

        var attachmentName = this.attachmentNames[frameIndex];
        skeleton.slots[this.slotIndex].setAttachment(
            !attachmentName ? null : skeleton.getAttachmentBySlotIndex(this.slotIndex, attachmentName));
    }
};
module.exports = spine.AttachmentTimeline;


},{"../SpineUtil":44,"./Animation":2,"./Curves":16}],11:[function(require,module,exports){
var spine = require('../SpineUtil');
spine.AttachmentType = {
    region: 0,
    boundingbox: 1,
    mesh: 2,
    weightedmesh : 3,
    skinnedmesh: 3,
    linkedmesh: 4,
    weightedlinkedmesh: 5
};
module.exports = spine.AttachmentType;


},{"../SpineUtil":44}],12:[function(require,module,exports){
var spine = require('../SpineUtil');
spine.Bone = function (boneData, skeleton, parent)
{
    this.data = boneData;
    this.skeleton = skeleton;
    this.parent = parent;
    this.matrix = new PIXI.Matrix();
    this.setToSetupPose();
};
spine.Bone.yDown = false;
spine.Bone.prototype = {
    x: 0, y: 0,
    rotation: 0, rotationIK: 0,
    scaleX: 1, scaleY: 1,
    shearX: 0, shearY: 0,
    flipX: false, flipY: false,

    worldSignX: 1, worldSignY: 1,
    update: function() {
        this.rotationIK = this.rotation;
        this.updateWorldTransform();
    },
    updateWorldTransform: function() {
        var rotation = this.rotationIK;
        var scaleX = this.scaleX;
        var scaleY = this.scaleY;
        var x = this.x;
        var y = this.y;
        var rotationX = rotation + this.shearX;
        var rotationY = rotation + 90 + this.shearY;

        var la = Math.cos(rotationX * spine.degRad) * scaleX, lb = Math.cos(rotationY * spine.degRad) * scaleY,
            lc = Math.sin(rotationX * spine.degRad) * scaleX, ld = Math.sin(rotationY * spine.degRad) * scaleY;
        var parent = this.parent;
        var m = this.matrix;
        var skeleton = this.skeleton;
        if (!parent) { // Root bone.
            if (skeleton.flipX) {
                x = -x;
                la = -la;
                lb = -lb;
            }
            if (skeleton.flipY !== spine.Bone.yDown) {
                y = -y;
                lc = -lc;
                ld = -ld;
            }
            m.a = la;
            m.c = lb;
            m.b = lc;
            m.d = ld;
            m.tx = x;
            m.ty = y;
            this.worldSignX = spine.signum(scaleX);
            this.worldSignY = spine.signum(scaleY);
            return;
        }


        var pa = parent.matrix.a, pb = parent.matrix.c, pc = parent.matrix.b, pd = parent.matrix.d;
        m.tx = pa * x + pb * y + parent.matrix.tx;
        m.ty = pc * x + pd * y + parent.matrix.ty;
        this.worldSignX = parent.worldSignX * spine.signum(scaleX);
        this.worldSignY = parent.worldSignY * spine.signum(scaleY);
        var data = this.data;

        if (data.inheritRotation && data.inheritScale) {
            m.a = pa * la + pb * lc;
            m.c = pa * lb + pb * ld;
            m.b = pc * la + pd * lc;
            m.d = pc * lb + pd * ld;
        } else {
            if (data.inheritRotation) { // No scale inheritance.
                pa = 1;
                pb = 0;
                pc = 0;
                pd = 1;
                do {
                    cos = Math.cos(parent.rotationIK * spine.degRad);
                    sin = Math.sin(parent.rotationIK * spine.degRad);
                    var temp = pa * cos + pb * sin;
                    pb = pa * -sin + pb * cos;
                    pa = temp;
                    temp = pc * cos + pd * sin;
                    pd = pc * -sin + pd * cos;
                    pc = temp;

                    if (!parent.data.inheritRotation) break;
                    parent = parent.parent;
                } while (parent != null);
                m.a = pa * la + pb * lc;
                m.c = pa * lb + pb * ld;
                m.b = pc * la + pd * lc;
                m.d = pc * lb + pd * ld;
            } else if (data.inheritScale) { // No rotation inheritance.
                pa = 1;
                pb = 0;
                pc = 0;
                pd = 1;
                do {
                    var r = parent.rotationIK;
                    cos = Math.cos(r * spine.degRad);
                    sin = Math.sin(r * spine.degRad);
                    var psx = parent.scaleX, psy = parent.scaleY;
                    var za = cos * psx, zb = -sin * psy, zc = sin * psx, zd = cos * psy;
                    temp = pa * za + pb * zc;
                    pb = pa * zb + pb * zd;
                    pa = temp;
                    temp = pc * za + pd * zc;
                    pd = pc * zb + pd * zd;
                    pc = temp;

                    if (psx < 0) {
                        r = -r;
                    } else {
                        sin = -sin;
                    }
                    temp = pa * cos + pb * sin;
                    pb = pa * -sin + pb * cos;
                    pa = temp;
                    temp = pc * cos + pd * sin;
                    pd = pc * -sin + pd * cos;
                    pc = temp;

                    if (!parent.data.inheritScale) break;
                    parent = parent.parent;
                } while (parent != null);
                m.a = pa * la + pb * lc;
                m.c = pa * lb + pb * ld;
                m.b = pc * la + pd * lc;
                m.d = pc * lb + pd * ld;
            } else {
                m.a = la;
                m.c = lb;
                m.b = lc;
                m.d = ld;
            }
            if (skeleton.flipX) {
                m.a = -m.a;
                m.c = -m.c;
            }
            if (skeleton.flipY !== spine.Bone.yDown) {
                m.b = -m.b;
                m.d = -m.d;
            }
        }
    },

    setToSetupPose: function ()
    {
        var data = this.data;
        this.x = data.x;
        this.y = data.y;
        this.rotation = data.rotation;
        this.rotationIK = this.rotation;
        this.scaleX = data.scaleX;
        this.scaleY = data.scaleY;
        this.shearX = data.shearX;
        this.shearY = data.shearY;
    },
    worldToLocal: function (world)
    {
        var m = this.matrix;
        var dx = world[0] - m.tx, dy = m.ty;
        var invDet = 1 / (m.a * m.d - m.b * m.c);
        //Yep, its a bug in original spine. I hope they'll fix it: https://github.com/EsotericSoftware/spine-runtimes/issues/544
        world[0] = dx * m.a * invDet - dy * m.c * invDet;
        world[1] = dy * m.d * invDet - dx * m.b * invDet;
    },
    localToWorld: function (local)
    {
        var localX = local[0], localY = local[1];
        var m = this.matrix;
        local[0] = localX * m.a + localY * m.c + m.tx;
        local[1] = localX * m.b + localY * m.d + m.ty;
    },
    getWorldRotationX: function() {
        return Math.atan2(this.matrix.b, this.matrix.a) * spine.radDeg;

    },
    getWorldRotationY: function() {
        return Math.atan2(this.matrix.d, this.matrix.c) * spine.radDeg;
    },
    getWorldScaleX: function() {
        var a = this.matrix.a;
        var b = this.matrix.b;
        return Math.sqrt(a*a+b*b);
    },
    getWorldScaleY: function() {
        var c = this.matrix.c;
        var d = this.matrix.d;
        return Math.sqrt(c * c + d * d);
    }
};

Object.defineProperties(spine.Bone.prototype, {
    worldX: {
        get: function() {
            return this.matrix.tx;
        }
    },
    worldY:  {
        get: function() {
            return this.matrix.ty;
        }
    }
});

module.exports = spine.Bone;

},{"../SpineUtil":44}],13:[function(require,module,exports){
var spine = require('../SpineUtil');
spine.BoneData = function (name, parent)
{
    this.name = name;
    this.parent = parent;
};
spine.BoneData.prototype = {
    length: 0,
    x: 0, y: 0,
    rotation: 0,
    scaleX: 1, scaleY: 1,
    shearX: 0, shearY: 0,
    inheritScale: true,
    inheritRotation: true
};
module.exports = spine.BoneData;


},{"../SpineUtil":44}],14:[function(require,module,exports){
var spine = require('../SpineUtil');
spine.AttachmentType = require('./AttachmentType');
spine.BoundingBoxAttachment = function (name)
{
    this.name = name;
    this.vertices = [];
};
spine.BoundingBoxAttachment.prototype = {
    type: spine.AttachmentType.boundingbox,
    computeWorldVertices: function (x, y, bone, worldVertices)
    {
        x += bone.worldX;
        y += bone.worldY;
        var m00 = bone.matrix.a, m01 = bone.matrix.c, m10 = bone.matrix.b, m11 = bone.matrix.d;
        var vertices = this.vertices;
        for (var i = 0, n = vertices.length; i < n; i += 2)
        {
            var px = vertices[i];
            var py = vertices[i + 1];
            worldVertices[i] = px * m00 + py * m01 + x;
            worldVertices[i + 1] = px * m10 + py * m11 + y;
        }
    }
};
module.exports = spine.BoundingBoxAttachment;


},{"../SpineUtil":44,"./AttachmentType":11}],15:[function(require,module,exports){
var spine = require('../SpineUtil');
spine.Animation = require('./Animation');
spine.Curves = require('./Curves');
spine.ColorTimeline = function (frameCount)
{
    this.curves = new spine.Curves(frameCount);
    this.frames = []; // time, r, g, b, a, ...
    this.frames.length = frameCount * 5;
};
spine.ColorTimeline.prototype = {
    slotIndex: 0,
    getFrameCount: function ()
    {
        return this.frames.length / 5;
    },
    setFrame: function (frameIndex, time, r, g, b, a)
    {
        frameIndex *= 5;
        this.frames[frameIndex] = time;
        this.frames[frameIndex + 1] = r;
        this.frames[frameIndex + 2] = g;
        this.frames[frameIndex + 3] = b;
        this.frames[frameIndex + 4] = a;
    },
    apply: function (skeleton, lastTime, time, firedEvents, alpha)
    {
        var frames = this.frames;
        if (time < frames[0]) return; // Time is before first frame.

        var r, g, b, a;
        if (time >= frames[frames.length - 5])
        {
            // Time is after last frame.
            var i = frames.length - 1;
            r = frames[i - 3];
            g = frames[i - 2];
            b = frames[i - 1];
            a = frames[i];
        } else {
            // Interpolate between the previous frame and the current frame.
            var frameIndex = spine.Animation.binarySearch(frames, time, 5);
            var prevFrameR = frames[frameIndex - 4];
            var prevFrameG = frames[frameIndex - 3];
            var prevFrameB = frames[frameIndex - 2];
            var prevFrameA = frames[frameIndex - 1];
            var frameTime = frames[frameIndex];
            var percent = 1 - (time - frameTime) / (frames[frameIndex - 5/*PREV_FRAME_TIME*/] - frameTime);
            percent = this.curves.getCurvePercent(frameIndex / 5 - 1, percent);

            r = prevFrameR + (frames[frameIndex + 1/*FRAME_R*/] - prevFrameR) * percent;
            g = prevFrameG + (frames[frameIndex + 2/*FRAME_G*/] - prevFrameG) * percent;
            b = prevFrameB + (frames[frameIndex + 3/*FRAME_B*/] - prevFrameB) * percent;
            a = prevFrameA + (frames[frameIndex + 4/*FRAME_A*/] - prevFrameA) * percent;
        }
        var slot = skeleton.slots[this.slotIndex];
        if (alpha < 1)
        {
            slot.r += (r - slot.r) * alpha;
            slot.g += (g - slot.g) * alpha;
            slot.b += (b - slot.b) * alpha;
            slot.a += (a - slot.a) * alpha;
        } else {
            slot.r = r;
            slot.g = g;
            slot.b = b;
            slot.a = a;
        }
    }
};
module.exports = spine.ColorTimeline;


},{"../SpineUtil":44,"./Animation":2,"./Curves":16}],16:[function(require,module,exports){
var spine = require('../SpineUtil');
spine.Curves = function (frameCount)
{
    this.curves = []; // type, x, y, ...
    //this.curves.length = (frameCount - 1) * 19/*BEZIER_SIZE*/;
};
spine.Curves.prototype = {
    setLinear: function (frameIndex)
    {
        this.curves[frameIndex * 19/*BEZIER_SIZE*/] = 0/*LINEAR*/;
    },
    setStepped: function (frameIndex)
    {
        this.curves[frameIndex * 19/*BEZIER_SIZE*/] = 1/*STEPPED*/;
    },
    /** Sets the control handle positions for an interpolation bezier curve used to transition from this keyframe to the next.
     * cx1 and cx2 are from 0 to 1, representing the percent of time between the two keyframes. cy1 and cy2 are the percent of
     * the difference between the keyframe's values. */
    setCurve: function (frameIndex, cx1, cy1, cx2, cy2)
    {
        var subdiv1 = 1 / 10/*BEZIER_SEGMENTS*/, subdiv2 = subdiv1 * subdiv1, subdiv3 = subdiv2 * subdiv1;
        var pre1 = 3 * subdiv1, pre2 = 3 * subdiv2, pre4 = 6 * subdiv2, pre5 = 6 * subdiv3;
        var tmp1x = -cx1 * 2 + cx2, tmp1y = -cy1 * 2 + cy2, tmp2x = (cx1 - cx2) * 3 + 1, tmp2y = (cy1 - cy2) * 3 + 1;
        var dfx = cx1 * pre1 + tmp1x * pre2 + tmp2x * subdiv3, dfy = cy1 * pre1 + tmp1y * pre2 + tmp2y * subdiv3;
        var ddfx = tmp1x * pre4 + tmp2x * pre5, ddfy = tmp1y * pre4 + tmp2y * pre5;
        var dddfx = tmp2x * pre5, dddfy = tmp2y * pre5;

        var i = frameIndex * 19/*BEZIER_SIZE*/;
        var curves = this.curves;
        curves[i++] = 2/*BEZIER*/;

        var x = dfx, y = dfy;
        for (var n = i + 19/*BEZIER_SIZE*/ - 1; i < n; i += 2)
        {
            curves[i] = x;
            curves[i + 1] = y;
            dfx += ddfx;
            dfy += ddfy;
            ddfx += dddfx;
            ddfy += dddfy;
            x += dfx;
            y += dfy;
        }
    },
    getCurvePercent: function (frameIndex, percent)
    {
        percent = percent < 0 ? 0 : (percent > 1 ? 1 : percent);
        var curves = this.curves;
        var i = frameIndex * 19/*BEZIER_SIZE*/;
        var type = curves[i];
        if (type === 0/*LINEAR*/) return percent;
        if (type == 1/*STEPPED*/) return 0;
        i++;
        var x = 0;
        for (var start = i, n = i + 19/*BEZIER_SIZE*/ - 1; i < n; i += 2)
        {
            x = curves[i];
            if (x >= percent)
            {
                var prevX, prevY;
                if (i == start)
                {
                    prevX = 0;
                    prevY = 0;
                } else {
                    prevX = curves[i - 2];
                    prevY = curves[i - 1];
                }
                return prevY + (curves[i + 1] - prevY) * (percent - prevX) / (x - prevX);
            }
        }
        var y = curves[i - 1];
        return y + (1 - y) * (percent - x) / (1 - x); // Last point is 1,1.
    }
};
module.exports = spine.Curves;


},{"../SpineUtil":44}],17:[function(require,module,exports){
var spine = require('../SpineUtil');
spine.Animation = require('./Animation');
spine.DrawOrderTimeline = function (frameCount)
{
    this.frames = []; // time, ...
    this.frames.length = frameCount;
    this.drawOrders = [];
    this.drawOrders.length = frameCount;
};
spine.DrawOrderTimeline.prototype = {
    getFrameCount: function ()
    {
        return this.frames.length;
    },
    setFrame: function (frameIndex, time, drawOrder)
    {
        this.frames[frameIndex] = time;
        this.drawOrders[frameIndex] = drawOrder;
    },
    apply: function (skeleton, lastTime, time, firedEvents, alpha)
    {
        var frames = this.frames;
        if (time < frames[0]) return; // Time is before first frame.

        var frameIndex;
        if (time >= frames[frames.length - 1]) // Time is after last frame.
            frameIndex = frames.length - 1;
        else
            frameIndex = spine.Animation.binarySearch1(frames, time) - 1;

        var drawOrder = skeleton.drawOrder;
        var slots = skeleton.slots;
        var drawOrderToSetupIndex = this.drawOrders[frameIndex];
        if (drawOrderToSetupIndex)
        {
            for (var i = 0, n = drawOrderToSetupIndex.length; i < n; i++)
            {
                drawOrder[i] = drawOrderToSetupIndex[i];
            }
        }

    }
};
module.exports = spine.DrawOrderTimeline;


},{"../SpineUtil":44,"./Animation":2}],18:[function(require,module,exports){
var spine = require('../SpineUtil');
spine.Event = function (data)
{
    this.data = data;
};
spine.Event.prototype = {
    intValue: 0,
    floatValue: 0,
    stringValue: null
};
module.exports = spine.Event;


},{"../SpineUtil":44}],19:[function(require,module,exports){
var spine = require('../SpineUtil');
spine.EventData = function (name)
{
    this.name = name;
};
spine.EventData.prototype = {
    intValue: 0,
    floatValue: 0,
    stringValue: null
};
module.exports = spine.EventData;


},{"../SpineUtil":44}],20:[function(require,module,exports){
var spine = require('../SpineUtil');
spine.Animation = require('./Animation');
spine.EventTimeline = function (frameCount)
{
    this.frames = []; // time, ...
    this.frames.length = frameCount;
    this.events = [];
    this.events.length = frameCount;
};
spine.EventTimeline.prototype = {
    getFrameCount: function ()
    {
        return this.frames.length;
    },
    setFrame: function (frameIndex, time, event)
    {
        this.frames[frameIndex] = time;
        this.events[frameIndex] = event;
    },
    /** Fires events for frames > lastTime and <= time. */
    apply: function (skeleton, lastTime, time, firedEvents, alpha)
    {
        if (!firedEvents) return;

        var frames = this.frames;
        var frameCount = frames.length;

        if (lastTime > time)
        { // Fire events after last time for looped animations.
            this.apply(skeleton, lastTime, Number.MAX_VALUE, firedEvents, alpha);
            lastTime = -1;
        } else if (lastTime >= frames[frameCount - 1]) // Last time is after last frame.
            return;
        if (time < frames[0]) return; // Time is before first frame.

        var frameIndex;
        if (lastTime < frames[0])
            frameIndex = 0;
        else
        {
            frameIndex = spine.Animation.binarySearch1(frames, lastTime);
            var frame = frames[frameIndex];
            while (frameIndex > 0)
            { // Fire multiple events with the same frame.
                if (frames[frameIndex - 1] != frame) break;
                frameIndex--;
            }
        }
        var events = this.events;
        for (; frameIndex < frameCount && time >= frames[frameIndex]; frameIndex++)
            firedEvents.push(events[frameIndex]);
    }
};
module.exports = spine.EventTimeline;


},{"../SpineUtil":44,"./Animation":2}],21:[function(require,module,exports){
var spine = require('../SpineUtil');
spine.Animation = require('./Animation');
spine.Curves = require('./Curves');
spine.FfdTimeline = function (frameCount)
{
    this.curves = new spine.Curves(frameCount);
    this.frames = [];
    this.frames.length = frameCount;
    this.frameVertices = [];
    this.frameVertices.length = frameCount;
};
spine.FfdTimeline.prototype = {
    slotIndex: 0,
    attachment: 0,
    getFrameCount: function ()
    {
        return this.frames.length;
    },
    setFrame: function (frameIndex, time, vertices)
    {
        this.frames[frameIndex] = time;
        this.frameVertices[frameIndex] = vertices;
    },
    apply: function (skeleton, lastTime, time, firedEvents, alpha)
    {
        var slot = skeleton.slots[this.slotIndex];
        var slotAttachment = slot.attachment;
        if (slotAttachment && (!slotAttachment.applyFFD || !slotAttachment.applyFFD(this.attachment))) return;

        var frames = this.frames;
        if (time < frames[0]) return; // Time is before first frame.

        var frameVertices = this.frameVertices;
        var vertexCount = frameVertices[0].length;

        var vertices = slot.attachmentVertices;
        if (vertices.length != vertexCount) {
            vertices = slot.attachmentVertices = [];
            for (var k = 0; k < vertexCount; k++) vertices.push(0);
            // Don't mix from uninitialized slot vertices.
            alpha = 1;
        }

        if (time >= frames[frames.length - 1])
        { // Time is after last frame.
            var lastVertices = frameVertices[frames.length - 1];
            if (alpha < 1)
            {
                for (var i = 0; i < vertexCount; i++)
                    vertices[i] += (lastVertices[i] - vertices[i]) * alpha;
            } else {
                for (var i = 0; i < vertexCount; i++)
                    vertices[i] = lastVertices[i];
            }
            return;
        }

        // Interpolate between the previous frame and the current frame.
        var frameIndex = spine.Animation.binarySearch1(frames, time);
        var frameTime = frames[frameIndex];
        var percent = 1 - (time - frameTime) / (frames[frameIndex - 1] - frameTime);
        percent = this.curves.getCurvePercent(frameIndex - 1, percent < 0 ? 0 : (percent > 1 ? 1 : percent));

        var prevVertices = frameVertices[frameIndex - 1];
        var nextVertices = frameVertices[frameIndex];

        if (alpha < 1)
        {
            for (var i = 0; i < vertexCount; i++)
            {
                var prev = prevVertices[i];
                vertices[i] += (prev + (nextVertices[i] - prev) * percent - vertices[i]) * alpha;
            }
        } else {
            for (var i = 0; i < vertexCount; i++)
            {
                var prev = prevVertices[i];
                vertices[i] = prev + (nextVertices[i] - prev) * percent;
            }
        }
    }
};
module.exports = spine.FfdTimeline;


},{"../SpineUtil":44,"./Animation":2,"./Curves":16}],22:[function(require,module,exports){
var spine = require('../SpineUtil');
spine.IkConstraint = function (data, skeleton)
{
    this.data = data;
    this.mix = data.mix;
    this.bendDirection = data.bendDirection;

    this.bones = [];
    for (var i = 0, n = data.bones.length; i < n; i++)
        this.bones.push(skeleton.findBone(data.bones[i].name));
    this.target = skeleton.findBone(data.target.name);
};
spine.IkConstraint.prototype = {
    update: function() {
        this.apply();
    },
    apply: function ()
    {
        var target = this.target;
        var bones = this.bones;
        switch (bones.length)
        {
        case 1:
            spine.IkConstraint.apply1(bones[0], target.worldX, target.worldY, this.mix);
            break;
        case 2:
            spine.IkConstraint.apply2(bones[0], bones[1], target.worldX, target.worldY, this.bendDirection, this.mix);
            break;
        }
    }
};
/** Adjusts the bone rotation so the tip is as close to the target position as possible. The target is specified in the world
 * coordinate system. */
spine.IkConstraint.apply1 = function (bone, targetX, targetY, alpha)
{
    var parentRotation = bone.parent ? bone.parent.getWorldRotationX(): 0;
    var rotation = bone.rotation;
    var rotationIK = Math.atan2(targetY - bone.worldY, targetX - bone.worldX) * spine.radDeg - parentRotation;
    if ((bone.worldSignX != bone.worldSignY) != (bone.skeleton.flipX != (bone.skeleton.flipY != spine.Bone.yDown))) rotationIK = 360 - rotationIK;

    //OLD ONE:

    // float parentRotation = bone.parent == null ? 0 : bone.parent.getWorldRotationX();
    // float rotation = bone.rotation;
    // float rotationIK = atan2(targetY - bone.worldY, targetX - bone.worldX) * radDeg - parentRotation;
    // if ((bone.worldSignX != bone.worldSignY) != (bone.skeleton.flipX != bone.skeleton.flipY)) rotationIK = 360 - rotationIK;

    //NEW ONE

    // var pp = bone.parent;
    // float id = 1 / (pp.a * pp.d - pp.b * pp.c);
    // float x = targetX - pp.worldX, y = targetY - pp.worldY;
    // float tx = (x * pp.d - y * pp.b) * id - bone.x, ty = (y * pp.a - x * pp.c) * id - bone.y;
    // float rotationIK = atan2(ty, tx) * radDeg - bone.shearX;
    // if (bone.scaleX < 0) rotationIK += 180;


    if (rotationIK > 180)
        rotationIK -= 360;
    else if (rotationIK < -180) rotationIK += 360;
    bone.rotationIK = rotation + (rotationIK - rotation) * alpha;
    bone.updateWorldTransform();
};
/** Adjusts the parent and child bone rotations so the tip of the child is as close to the target position as possible. The
 * target is specified in the world coordinate system.
 * @param child Any descendant bone of the parent. */
spine.IkConstraint.apply2 = function (parent, child, targetX, targetY, bendDir, alpha)
{
    if (alpha == 0) return;
    var px = parent.x, py = parent.y, psx = parent.scaleX, psy = parent.scaleY, csx = child.scaleX, cy = child.y;
    var offset1, offset2, sign2;
    if (psx < 0) {
        psx = -psx;
        offset1 = 180;
        sign2 = -1;
    } else {
        offset1 = 0;
        sign2 = 1;
    }
    if (psy < 0) {
        psy = -psy;
        sign2 = -sign2;
    }
    if (csx < 0) {
        csx = -csx;
        offset2 = 180;
    } else
        offset2 = 0;
    var pp = parent.parent;
    var ppm = pp.matrix;
    var tx, ty, dx, dy;
    if (pp == null) {
        tx = targetX - px;
        ty = targetY - py;
        dx = child.worldX - px;
        dy = child.worldY - py;
    } else {
        var a = ppm.a, b = ppm.c, c = ppm.b, d = ppm.d, invDet = 1 / (a * d - b * c);
        var wx = ppm.tx, wy = ppm.ty, x = targetX - wx, y = targetY - wy;
        tx = (x * d - y * b) * invDet - px;
        ty = (y * a - x * c) * invDet - py;
        x = child.worldX - wx;
        y = child.worldY - wy;
        dx = (x * d - y * b) * invDet - px;
        dy = (y * a - x * c) * invDet - py;
    }

    //OLD ONE
    // float tx, ty, dx, dy;
    // if (pp == null) {
    //     tx = targetX - px;
    //     ty = targetY - py;
    //     dx = child.worldX - px;
    //     dy = child.worldY - py;
    // } else {
    //     float a = pp.a, b = pp.b, c = pp.c, d = pp.d, invDet = 1 / (a * d - b * c);
    //     float wx = pp.worldX, wy = pp.worldY, x = targetX - wx, y = targetY - wy;
    //     tx = (x * d - y * b) * invDet - px;
    //     ty = (y * a - x * c) * invDet - py;
    //     x = child.worldX - wx;
    //     y = child.worldY - wy;
    //     dx = (x * d - y * b) * invDet - px;
    //     dy = (y * a - x * c) * invDet - py;
    // }

    //NEW ONE
    // float ppa = pp.a, ppb = pp.b, ppc = pp.c, ppd = pp.d, id = 1 / (ppa * ppd - ppb * ppc);
    // float x = targetX - pp.worldX, y = targetY - pp.worldY;
    // float tx = (x * ppd - y * ppb) * id - px, ty = (y * ppa - x * ppc) * id - py;
    // x = child.worldX - pp.worldX;
    // y = child.worldY - pp.worldY;
    // float dx = (x * ppd - y * ppb) * id - px, dy = (y * ppa - x * ppc) * id - py;

    var l1 = Math.sqrt(dx * dx + dy * dy), l2 = child.data.length * csx, a1, a2;
    outer:
        if (Math.abs(psx - psy) <= 0.0001) {
            l2 *= psx;
            var cos = (tx * tx + ty * ty - l1 * l1 - l2 * l2) / (2 * l1 * l2);
            if (cos < -1)
                cos = -1;
            else if (cos > 1) cos = 1;
            a2 = Math.acos(cos) * bendDir;
            var a = l1 + l2 * cos, o = l2 * Math.sin(a2);
            a1 = Math.atan2(ty * a - tx * o, tx * a + ty * o);
        } else {
            cy = 0;
            var a = psx * l2, b = psy * l2, ta = Math.atan2(ty, tx);
            var aa = a * a, bb = b * b, ll = l1 * l1, dd = tx * tx + ty * ty;
            var c0 = bb * ll + aa * dd - aa * bb, c1 = -2 * bb * l1, c2 = bb - aa;
            var d = c1 * c1 - 4 * c2 * c0;
            if (d >= 0) {
                var q = Math.sqrt(d);
                if (c1 < 0) q = -q;
                q = -(c1 + q) / 2;
                var r0 = q / c2, r1 = c0 / q;
                var r = Math.abs(r0) < Math.abs(r1) ? r0 : r1;
                if (r * r <= dd) {
                    var y = Math.sqrt(dd - r * r) * bendDir;
                    a1 = ta - Math.atan2(y, r);
                    a2 = Math.atan2(y / psy, (r - l1) / psx);
                    break outer;
                }
            }
            var minAngle = 0, minDist = Infinity, minX = 0, minY = 0;
            var maxAngle = 0, maxDist = 0, maxX = 0, maxY = 0;
            var x = l1 + a, dist = x * x;
            if (dist > maxDist) {
                maxAngle = 0;
                maxDist = dist;
                maxX = x;
            }
            x = l1 - a;
            dist = x * x;
            if (dist < minDist) {
                minAngle = Math.PI;
                minDist = dist;
                minX = x;
            }
            var angle = Math.acos(-a * l1 / (aa - bb));
            x = a * Math.cos(angle) + l1;
            var y = b * Math.sin(angle);
            dist = x * x + y * y;
            if (dist < minDist) {
                minAngle = angle;
                minDist = dist;
                minX = x;
                minY = y;
            }
            if (dist > maxDist) {
                maxAngle = angle;
                maxDist = dist;
                maxX = x;
                maxY = y;
            }
            if (dd <= (minDist + maxDist) / 2) {
                a1 = ta - Math.atan2(minY * bendDir, minX);
                a2 = minAngle * bendDir;
            } else {
                a1 = ta - Math.atan2(maxY * bendDir, maxX);
                a2 = maxAngle * bendDir;
            }
        }
    var offset = Math.atan2(cy, child.x) * sign2;
    a1 = (a1 - offset) * spine.radDeg + offset1;
    a2 = (a2 + offset) * spine.radDeg * sign2 + offset2;
    if (a1 > 180)
        a1 -= 360;
    else if (a1 < -180) a1 += 360;
    if (a2 > 180)
        a2 -= 360;
    else if (a2 < -180) a2 += 360;
    var rotation = parent.rotation;
    parent.rotationIK = rotation + (a1 - rotation) * alpha;
    parent.updateWorldTransform();
    rotation = child.rotation;
    child.rotationIK = rotation + (a2 - rotation) * alpha;
    child.updateWorldTransform();
};
module.exports = spine.IkConstraint;


},{"../SpineUtil":44}],23:[function(require,module,exports){
var spine = require('../SpineUtil') || {};
spine.IkConstraintData = function (name)
{
    this.name = name;
    this.bones = [];
};
spine.IkConstraintData.prototype = {
    target: null,
    bendDirection: 1,
    mix: 1
};
module.exports = spine.IkConstraintData;


},{"../SpineUtil":44}],24:[function(require,module,exports){
var spine = require('../SpineUtil') || {};
spine.Animation = require('./Animation');
spine.Curves = require('./Curves');
spine.IkConstraintTimeline = function (frameCount)
{
    this.curves = new spine.Curves(frameCount);
    this.frames = []; // time, mix, bendDirection, ...
    this.frames.length = frameCount * 3;
};
spine.IkConstraintTimeline.prototype = {
    ikConstraintIndex: 0,
    getFrameCount: function ()
    {
        return this.frames.length / 3;
    },
    setFrame: function (frameIndex, time, mix, bendDirection)
    {
        frameIndex *= 3;
        this.frames[frameIndex] = time;
        this.frames[frameIndex + 1] = mix;
        this.frames[frameIndex + 2] = bendDirection;
    },
    apply: function (skeleton, lastTime, time, firedEvents, alpha)
    {
        var frames = this.frames;
        if (time < frames[0]) return; // Time is before first frame.

        var ikConstraint = skeleton.ikConstraints[this.ikConstraintIndex];

        if (time >= frames[frames.length - 3])
        { // Time is after last frame.
            ikConstraint.mix += (frames[frames.length - 2] - ikConstraint.mix) * alpha;
            ikConstraint.bendDirection = frames[frames.length - 1];
            return;
        }

        // Interpolate between the previous frame and the current frame.
        var frameIndex = spine.Animation.binarySearch(frames, time, 3);
        var prevFrameMix = frames[frameIndex + -2/*PREV_FRAME_MIX*/];
        var frameTime = frames[frameIndex];
        var percent = 1 - (time - frameTime) / (frames[frameIndex + -3/*PREV_FRAME_TIME*/] - frameTime);
        percent = this.curves.getCurvePercent(frameIndex / 3 - 1, percent);

        var mix = prevFrameMix + (frames[frameIndex + 1/*FRAME_MIX*/] - prevFrameMix) * percent;
        ikConstraint.mix += (mix - ikConstraint.mix) * alpha;
        ikConstraint.bendDirection = frames[frameIndex + -1/*PREV_FRAME_BEND_DIRECTION*/];
    }
};
module.exports = spine.IkConstraintTimeline;


},{"../SpineUtil":44,"./Animation":2,"./Curves":16}],25:[function(require,module,exports){
var spine = require('../SpineUtil') || {};
spine.AttachmentType = require('./AttachmentType');
spine.MeshAttachment = function (name)
{
    this.name = name;
};
spine.MeshAttachment.prototype = {
    type: spine.AttachmentType.mesh,
    parentMesh: null,
    inheritFFD: false,
    vertices: null,
    uvs: null,
    regionUVs: null,
    triangles: null,
    hullLength: 0,
    r: 1, g: 1, b: 1, a: 1,
    path: null,
    rendererObject: null,
    edges: null,
    width: 0, height: 0,
    updateUVs: function ()
    {
        var n = this.regionUVs.length;
        if (!this.uvs || this.uvs.length != n)
        {
            this.uvs = new spine.Float32Array(n);
        }
        var region = this.rendererObject;
        if (!region) return;
        var texture = region.texture;
        var r = texture._uvs;
        var w1 = region.width, h1 = region.height, w2 = region.originalWidth, h2 = region.originalHeight;
        var x = region.offsetX, y = region.pixiOffsetY;
        for (var i = 0; i < n; i += 2)
        {
            var u = this.regionUVs[i], v = this.regionUVs[i+1];
            u = (u * w2 - x) / w1;
            v = (v * h2 - y) / h1;
            this.uvs[i] = (r.x0 * (1 - u) + r.x1 * u) * (1-v) + (r.x3 * (1 - u) + r.x2 * u) * v;
            this.uvs[i+1] = (r.y0 * (1 - u) + r.y1 * u) * (1-v) + (r.y3 * (1 - u) + r.y2 * u) * v;
        }
    },
    computeWorldVertices: function (x, y, slot, worldVertices)
    {
        var bone = slot.bone;
        x += bone.worldX;
        y += bone.worldY;
        var m00 = bone.matrix.a, m01 = bone.matrix.c, m10 = bone.matrix.b, m11 = bone.matrix.d;
        var vertices = this.vertices;
        var verticesCount = vertices.length;
        if (slot.attachmentVertices.length == verticesCount) vertices = slot.attachmentVertices;
        for (var i = 0; i < verticesCount; i += 2)
        {
            var vx = vertices[i];
            var vy = vertices[i + 1];
            worldVertices[i] = vx * m00 + vy * m01 + x;
            worldVertices[i + 1] = vx * m10 + vy * m11 + y;
        }
    },
    applyFFD: function(sourceAttachment) {
        return this === sourceAttachment || (this.inheritFFD && parentMesh === sourceAttachment);
    },
    setParentMesh: function(parentMesh) {
        this.parentMesh = parentMesh;
        if (parentMesh != null) {
            this.vertices = parentMesh.vertices;
            this.regionUVs = parentMesh.regionUVs;
            this.triangles = parentMesh.triangles;
            this.hullLength = parentMesh.hullLength;
        }
    },
    hackRegion: function(newRegion) {
        if (!newRegion) {
            if (!this.oldRegion) return;
            newRegion = this.oldRegion;
        }
        if (!this.oldRegion) {
            this.oldRegion = this.rendererObject;
        }
        this.rendererObject = newRegion;
        this.updateUVs();
    }
};
module.exports = spine.MeshAttachment;


},{"../SpineUtil":44,"./AttachmentType":11}],26:[function(require,module,exports){
var spine = require('../SpineUtil');
spine.AttachmentType = require('./AttachmentType');
spine.RegionAttachment = function (name)
{
    this.name = name;
    this.offset = [];
    this.offset.length = 8;
    this.uvs = [];
    this.uvs.length = 8;
};
spine.RegionAttachment.prototype = {
    type: spine.AttachmentType.region,
    x: 0, y: 0,
    rotation: 0,
    scaleX: 1, scaleY: 1,
    width: 0, height: 0,
    r: 1, g: 1, b: 1, a: 1,
    path: null,
    rendererObject: null,
    regionOffsetX: 0, regionOffsetY: 0,
    regionWidth: 0, regionHeight: 0,
    regionOriginalWidth: 0, regionOriginalHeight: 0,
    setUVs: function (u, v, u2, v2, rotate)
    {
        var uvs = this.uvs;
        if (rotate)
        {
            uvs[2/*X2*/] = u;
            uvs[3/*Y2*/] = v2;
            uvs[4/*X3*/] = u;
            uvs[5/*Y3*/] = v;
            uvs[6/*X4*/] = u2;
            uvs[7/*Y4*/] = v;
            uvs[0/*X1*/] = u2;
            uvs[1/*Y1*/] = v2;
        } else {
            uvs[0/*X1*/] = u;
            uvs[1/*Y1*/] = v2;
            uvs[2/*X2*/] = u;
            uvs[3/*Y2*/] = v;
            uvs[4/*X3*/] = u2;
            uvs[5/*Y3*/] = v;
            uvs[6/*X4*/] = u2;
            uvs[7/*Y4*/] = v2;
        }
    },
    updateOffset: function ()
    {
        var regionScaleX = this.width / this.regionOriginalWidth * this.scaleX;
        var regionScaleY = this.height / this.regionOriginalHeight * this.scaleY;
        var localX = -this.width / 2 * this.scaleX + this.regionOffsetX * regionScaleX;
        var localY = -this.height / 2 * this.scaleY + this.regionOffsetY * regionScaleY;
        var localX2 = localX + this.regionWidth * regionScaleX;
        var localY2 = localY + this.regionHeight * regionScaleY;
        var radians = this.rotation * spine.degRad;
        var cos = Math.cos(radians);
        var sin = Math.sin(radians);
        var localXCos = localX * cos + this.x;
        var localXSin = localX * sin;
        var localYCos = localY * cos + this.y;
        var localYSin = localY * sin;
        var localX2Cos = localX2 * cos + this.x;
        var localX2Sin = localX2 * sin;
        var localY2Cos = localY2 * cos + this.y;
        var localY2Sin = localY2 * sin;
        var offset = this.offset;
        offset[0/*X1*/] = localXCos - localYSin;
        offset[1/*Y1*/] = localYCos + localXSin;
        offset[2/*X2*/] = localXCos - localY2Sin;
        offset[3/*Y2*/] = localY2Cos + localXSin;
        offset[4/*X3*/] = localX2Cos - localY2Sin;
        offset[5/*Y3*/] = localY2Cos + localX2Sin;
        offset[6/*X4*/] = localX2Cos - localYSin;
        offset[7/*Y4*/] = localYCos + localX2Sin;
    },
    computeVertices: function (x, y, bone, vertices)
    {
        x += bone.worldX;
        y += bone.worldY;
        var m00 = bone.matrix.a, m01 = bone.matrix.c, m10 = bone.matrix.b, m11 = bone.matrix.d;
        var offset = this.offset;
        vertices[0/*X1*/] = offset[0/*X1*/] * m00 + offset[1/*Y1*/] * m01 + x;
        vertices[1/*Y1*/] = offset[0/*X1*/] * m10 + offset[1/*Y1*/] * m11 + y;
        vertices[2/*X2*/] = offset[2/*X2*/] * m00 + offset[3/*Y2*/] * m01 + x;
        vertices[3/*Y2*/] = offset[2/*X2*/] * m10 + offset[3/*Y2*/] * m11 + y;
        vertices[4/*X3*/] = offset[4/*X3*/] * m00 + offset[5/*X3*/] * m01 + x;
        vertices[5/*X3*/] = offset[4/*X3*/] * m10 + offset[5/*X3*/] * m11 + y;
        vertices[6/*X4*/] = offset[6/*X4*/] * m00 + offset[7/*Y4*/] * m01 + x;
        vertices[7/*Y4*/] = offset[6/*X4*/] * m10 + offset[7/*Y4*/] * m11 + y;
    },
    hackRegion: function(newRegion) {
        if (!newRegion) {
            if (!this.oldRegion) return;
            newRegion = this.oldRegion;
        }
        if (!this.oldRegion) {
            this.oldRegion = this.rendererObject;
            this.oldRegion.size = { width: this.width, height: this.height };
        }
        this.rendererObject = newRegion;
        if (newRegion.size) {
            this.width = newRegion.size.width;
            this.height = newRegion.size.height;
        }
    }
};
module.exports = spine.RegionAttachment;


},{"../SpineUtil":44,"./AttachmentType":11}],27:[function(require,module,exports){
var spine = require('../SpineUtil') || {};
spine.Animation = require('./Animation');
spine.Curves = require('./Curves');
spine.RotateTimeline = function (frameCount)
{
    this.curves = new spine.Curves(frameCount);
    this.frames = []; // time, angle, ...
    this.frames.length = frameCount * 2;
};
spine.RotateTimeline.prototype = {
    boneIndex: 0,
    getFrameCount: function ()
    {
        return this.frames.length / 2;
    },
    setFrame: function (frameIndex, time, angle)
    {
        frameIndex *= 2;
        this.frames[frameIndex] = time;
        this.frames[frameIndex + 1] = angle;
    },
    apply: function (skeleton, lastTime, time, firedEvents, alpha)
    {
        var frames = this.frames;
        if (time < frames[0]) return; // Time is before first frame.

        var bone = skeleton.bones[this.boneIndex];

        if (time >= frames[frames.length - 2])
        { // Time is after last frame.
            var amount = bone.data.rotation + frames[frames.length - 1] - bone.rotation;
            while (amount > 180)
                amount -= 360;
            while (amount < -180)
                amount += 360;
            bone.rotation += amount * alpha;
            return;
        }

        // Interpolate between the previous frame and the current frame.
        var frameIndex = spine.Animation.binarySearch(frames, time, 2);
        var prevFrameValue = frames[frameIndex - 1];
        var frameTime = frames[frameIndex];
        var percent = 1 - (time - frameTime) / (frames[frameIndex - 2/*PREV_FRAME_TIME*/] - frameTime);
        percent = this.curves.getCurvePercent(frameIndex / 2 - 1, percent);

        var amount = frames[frameIndex + 1/*FRAME_VALUE*/] - prevFrameValue;
        while (amount > 180)
            amount -= 360;
        while (amount < -180)
            amount += 360;
        amount = bone.data.rotation + (prevFrameValue + amount * percent) - bone.rotation;
        while (amount > 180)
            amount -= 360;
        while (amount < -180)
            amount += 360;
        bone.rotation += amount * alpha;
    }
};
module.exports = spine.RotateTimeline;


},{"../SpineUtil":44,"./Animation":2,"./Curves":16}],28:[function(require,module,exports){
var spine = require('../SpineUtil');
spine.Animation = require('./Animation');
spine.Curves = require('./Curves');
spine.ScaleTimeline = function (frameCount)
{
    this.curves = new spine.Curves(frameCount);
    this.frames = []; // time, x, y, ...
    this.frames.length = frameCount * 3;
};
spine.ScaleTimeline.prototype = {
    boneIndex: 0,
    getFrameCount: function ()
    {
        return this.frames.length / 3;
    },
    setFrame: function (frameIndex, time, x, y)
    {
        frameIndex *= 3;
        this.frames[frameIndex] = time;
        this.frames[frameIndex + 1] = x;
        this.frames[frameIndex + 2] = y;
    },
    apply: function (skeleton, lastTime, time, firedEvents, alpha)
    {
        var frames = this.frames;
        if (time < frames[0]) return; // Time is before first frame.

        var bone = skeleton.bones[this.boneIndex];

        if (time >= frames[frames.length - 3])
        { // Time is after last frame.
            bone.scaleX += (bone.data.scaleX * frames[frames.length - 2] - bone.scaleX) * alpha;
            bone.scaleY += (bone.data.scaleY * frames[frames.length - 1] - bone.scaleY) * alpha;
            return;
        }

        // Interpolate between the previous frame and the current frame.
        var frameIndex = spine.Animation.binarySearch(frames, time, 3);
        var prevFrameX = frames[frameIndex - 2];
        var prevFrameY = frames[frameIndex - 1];
        var frameTime = frames[frameIndex];
        var percent = 1 - (time - frameTime) / (frames[frameIndex + -3/*PREV_FRAME_TIME*/] - frameTime);
        percent = this.curves.getCurvePercent(frameIndex / 3 - 1, percent);

        bone.scaleX += (bone.data.scaleX * (prevFrameX + (frames[frameIndex + 1/*FRAME_X*/] - prevFrameX) * percent) - bone.scaleX) * alpha;
        bone.scaleY += (bone.data.scaleY * (prevFrameY + (frames[frameIndex + 2/*FRAME_Y*/] - prevFrameY) * percent) - bone.scaleY) * alpha;
    }
};
module.exports = spine.ScaleTimeline;


},{"../SpineUtil":44,"./Animation":2,"./Curves":16}],29:[function(require,module,exports){
var spine = require('../SpineUtil');
spine.Animation = require('./Animation');
spine.Curves = require('./Curves');
spine.ShearTimeline = function (frameCount)
{
    this.curves = new spine.Curves(frameCount);
    this.frames = []; // time, x, y, ...
    this.frames.length = frameCount * 3;
};
spine.ShearTimeline.prototype = {
    boneIndex: 0,
    getFrameCount: function ()
    {
        return this.frames.length / 3;
    },
    setFrame: function (frameIndex, time, x, y)
    {
        frameIndex *= 3;
        this.frames[frameIndex] = time;
        this.frames[frameIndex + 1] = x;
        this.frames[frameIndex + 2] = y;
    },
    apply: function (skeleton, lastTime, time, firedEvents, alpha)
    {
        var frames = this.frames;
        if (time < frames[0]) return; // Time is before first frame.

        var bone = skeleton.bones[this.boneIndex];

        if (time >= frames[frames.length - 3])
        { // Time is after last frame.
            bone.shearX += (bone.data.shearX + frames[frames.length - 2] - bone.shearX) * alpha;
            bone.shearY += (bone.data.shearY + frames[frames.length - 1] - bone.shearY) * alpha;
            return;
        }

        // Interpolate between the previous frame and the current frame.
        var frameIndex = spine.Animation.binarySearch(frames, time, 3);
        var prevFrameX = frames[frameIndex - 2];
        var prevFrameY = frames[frameIndex - 1];
        var frameTime = frames[frameIndex];
        var percent = 1 - (time - frameTime) / (frames[frameIndex + -3/*PREV_FRAME_TIME*/] - frameTime);
        percent = this.curves.getCurvePercent(frameIndex / 3 - 1, percent);

        bone.shearX += (bone.data.shearX + (prevFrameX + (frames[frameIndex + 1/*FRAME_X*/] - prevFrameX) * percent) - bone.shearX) * alpha;
        bone.shearY += (bone.data.shearY + (prevFrameY + (frames[frameIndex + 2/*FRAME_Y*/] - prevFrameY) * percent) - bone.shearY) * alpha;
    }
};
module.exports = spine.ShearTimeline;


},{"../SpineUtil":44,"./Animation":2,"./Curves":16}],30:[function(require,module,exports){
var spine = require('../SpineUtil');
spine.Bone = require('./Bone');
spine.Slot = require('./Slot');
spine.IkConstraint = require('./IkConstraint');
spine.Skeleton = function (skeletonData)
{
    this.data = skeletonData;

    this.bones = [];
    for (var i = 0, n = skeletonData.bones.length; i < n; i++)
    {
        var boneData = skeletonData.bones[i];
        var parent = !boneData.parent ? null : this.bones[skeletonData.bones.indexOf(boneData.parent)];
        this.bones.push(new spine.Bone(boneData, this, parent));
    }

    this.slots = [];
    this.drawOrder = [];
    for (var i = 0, n = skeletonData.slots.length; i < n; i++)
    {
        var slotData = skeletonData.slots[i];
        var bone = this.bones[skeletonData.bones.indexOf(slotData.boneData)];
        var slot = new spine.Slot(slotData, bone);
        this.slots.push(slot);
        this.drawOrder.push(i);
    }

    this.ikConstraints = [];
    for (var i = 0, n = skeletonData.ikConstraints.length; i < n; i++)
        this.ikConstraints.push(new spine.IkConstraint(skeletonData.ikConstraints[i], this));

    this.transformConstraints = [];
    for (var i = 0, n = skeletonData.transformConstraints.length; i < n; i++)
        this.transformConstraints.push(new spine.TransformConstraint(skeletonData.transformConstraints[i], this));

    this.boneCache = [];
    this.updateCache();
};
spine.Skeleton.prototype = {
    x: 0, y: 0,
    skin: null,
    r: 1, g: 1, b: 1, a: 1,
    time: 0,
    flipX: false, flipY: false,
    /** Caches information about bones and IK constraints. Must be called if bones or IK constraints are added or removed. */
    updateCache: function ()
    {
        var ikConstraints = this.ikConstraints;
        var ikConstraintsCount = ikConstraints.length;
        var transformConstraints = this.transformConstraints;
        var transformConstraintsCount = transformConstraints.length;

        var boneCache = this.boneCache;
        boneCache.length = 0;
        var bones = this.bones;
        for (var i = 0, n = bones.length; i < n; i++)
        {
            var bone = bones[i];
            boneCache.push(bone);
            for (var j=0; j < transformConstraintsCount; j++) {
                if (transformConstraints[j].bone == bone) {
                    boneCache.push(transformConstraints[j]);
                }
            }
            for (var j=0; j < ikConstraintsCount; j++) {
                if (ikConstraints[j].bones[ikConstraints[j].bones.length-1] == bone) {
                    boneCache.push(ikConstraints[j]);
                    break;
                }
            }
        }
    },
    /** Updates the world transform for each bone. */
    updateWorldTransform: function ()
    {
        var bones = this.bones;
        for (var i = 0, n = bones.length; i < n; i++)
        {
            var bone = bones[i];
            bone.rotationIK = bone.rotation;
        }
        var boneCache = this.boneCache;
        for (var i = 0, n = boneCache.length; i < n; i++) {
            boneCache[i].update();
        }
    },
    /** Sets the bones and slots to their setup pose values. */
    setToSetupPose: function ()
    {
        this.setBonesToSetupPose();
        this.setSlotsToSetupPose();
    },
    setBonesToSetupPose: function ()
    {
        var bones = this.bones;
        for (var i = 0, n = bones.length; i < n; i++)
            bones[i].setToSetupPose();

        var ikConstraints = this.ikConstraints;
        for (var i = 0, n = ikConstraints.length; i < n; i++)
        {
            var ikConstraint = ikConstraints[i];
            ikConstraint.bendDirection = ikConstraint.data.bendDirection;
            ikConstraint.mix = ikConstraint.data.mix;
        }

        var transformConstraints = this.transformConstraints;
        for (var i = 0, n = transformConstraints.length; i < n; i++)
        {
            var constraint = transformConstraints[i];
            var data = constraint.data;
            constraint.rotateMix = data.rotateMix;
            constraint.translateMix = data.translateMix;
            constraint.scaleMix = data.scaleMix;
            constraint.shearMix = data.shearMix;
        }
    },
    setSlotsToSetupPose: function ()
    {
        var slots = this.slots;
        for (var i = 0, n = slots.length; i < n; i++)
        {
            slots[i].setToSetupPose(i);
        }

        this.resetDrawOrder();
    },
    /** @return May return null. */
    getRootBone: function ()
    {
        return this.bones.length ? this.bones[0] : null;
    },
    /** @return May be null. */
    findBone: function (boneName)
    {
        var bones = this.bones;
        for (var i = 0, n = bones.length; i < n; i++)
            if (bones[i].data.name == boneName) return bones[i];
        return null;
    },
    /** @return -1 if the bone was not found. */
    findBoneIndex: function (boneName)
    {
        var bones = this.bones;
        for (var i = 0, n = bones.length; i < n; i++)
            if (bones[i].data.name == boneName) return i;
        return -1;
    },
    /** @return May be null. */
    findSlot: function (slotName)
    {
        var slots = this.slots;
        for (var i = 0, n = slots.length; i < n; i++)
            if (slots[i].data.name == slotName) return slots[i];
        return null;
    },
    /** @return -1 if the bone was not found. */
    findSlotIndex: function (slotName)
    {
        var slots = this.slots;
        for (var i = 0, n = slots.length; i < n; i++)
            if (slots[i].data.name == slotName) return i;
        return -1;
    },
    setSkinByName: function (skinName)
    {
        var skin = this.data.findSkin(skinName);
        if (!skin) throw "Skin not found: " + skinName;
        this.setSkin(skin);
    },
    /** Sets the skin used to look up attachments before looking in the {@link SkeletonData#getDefaultSkin() default skin}.
     * Attachments from the new skin are attached if the corresponding attachment from the old skin was attached. If there was
     * no old skin, each slot's setup mode attachment is attached from the new skin.
     * @param newSkin May be null. */
    setSkin: function (newSkin)
    {
        if (newSkin)
        {
            if (this.skin)
                newSkin._attachAll(this, this.skin);
            else
            {
                var slots = this.slots;
                for (var i = 0, n = slots.length; i < n; i++)
                {
                    var slot = slots[i];
                    var name = slot.data.attachmentName;
                    if (name)
                    {
                        var attachment = newSkin.getAttachment(i, name);
                        if (attachment) slot.setAttachment(attachment);
                    }
                }
            }
        }
        this.skin = newSkin;
    },
    /** @return May be null. */
    getAttachmentBySlotName: function (slotName, attachmentName)
    {
        return this.getAttachmentBySlotIndex(this.data.findSlotIndex(slotName), attachmentName);
    },
    /** @return May be null. */
    getAttachmentBySlotIndex: function (slotIndex, attachmentName)
    {
        if (this.skin)
        {
            var attachment = this.skin.getAttachment(slotIndex, attachmentName);
            if (attachment) return attachment;
        }
        if (this.data.defaultSkin) return this.data.defaultSkin.getAttachment(slotIndex, attachmentName);
        return null;
    },
    /** @param attachmentName May be null. */
    setAttachment: function (slotName, attachmentName)
    {
        var slots = this.slots;
        for (var i = 0, n = slots.length; i < n; i++)
        {
            var slot = slots[i];
            if (slot.data.name == slotName)
            {
                var attachment = null;
                if (attachmentName)
                {
                    attachment = this.getAttachmentBySlotIndex(i, attachmentName);
                    if (!attachment) throw "Attachment not found: " + attachmentName + ", for slot: " + slotName;
                }
                slot.setAttachment(attachment);
                return;
            }
        }
        throw "Slot not found: " + slotName;
    },
    /** @return May be null. */
    findIkConstraint: function (constraintName)
    {
        var constraints = this.ikConstraints;
        for (var i = 0, n = constraints.length; i < n; i++)
            if (constraints[i].data.name == constraintName) return constraints[i];
        return null;
    },
    findTransformConstraint: function (constraintName)
    {
        var constraints = this.transformConstraints;
        for (var i = 0, n = constraints.length; i < n; i++)
            if (constraints[i].data.name == constraintName) return constraints[i];
        return null;
    },
    update: function (delta)
    {
        this.time += delta;
    },
    resetDrawOrder: function () {
        for (var i = 0, n = this.drawOrder.length; i < n; i++)
        {
            this.drawOrder[i] = i;
        }
    }
};
module.exports = spine.Skeleton;


},{"../SpineUtil":44,"./Bone":12,"./IkConstraint":22,"./Slot":35}],31:[function(require,module,exports){
var spine = require('../SpineRuntime') || {};
spine.AttachmentType = require('./AttachmentType');
spine.SkeletonBounds = function ()
{
    this.polygonPool = [];
    this.polygons = [];
    this.boundingBoxes = [];
};
spine.SkeletonBounds.prototype = {
    minX: 0, minY: 0, maxX: 0, maxY: 0,
    update: function (skeleton, updateAabb)
    {
        var slots = skeleton.slots;
        var slotCount = slots.length;
        var x = skeleton.x, y = skeleton.y;
        var boundingBoxes = this.boundingBoxes;
        var polygonPool = this.polygonPool;
        var polygons = this.polygons;

        boundingBoxes.length = 0;
        for (var i = 0, n = polygons.length; i < n; i++)
            polygonPool.push(polygons[i]);
        polygons.length = 0;

        for (var i = 0; i < slotCount; i++)
        {
            var slot = slots[i];
            var boundingBox = slot.attachment;
            if (boundingBox.type != spine.AttachmentType.boundingbox) continue;
            boundingBoxes.push(boundingBox);

            var poolCount = polygonPool.length, polygon;
            if (poolCount > 0)
            {
                polygon = polygonPool[poolCount - 1];
                polygonPool.splice(poolCount - 1, 1);
            } else
                polygon = [];
            polygons.push(polygon);

            polygon.length = boundingBox.vertices.length;
            boundingBox.computeWorldVertices(x, y, slot.bone, polygon);
        }

        if (updateAabb) this.aabbCompute();
    },
    aabbCompute: function ()
    {
        var polygons = this.polygons;
        var minX = Number.MAX_VALUE, minY = Number.MAX_VALUE, maxX = Number.MIN_VALUE, maxY = Number.MIN_VALUE;
        for (var i = 0, n = polygons.length; i < n; i++)
        {
            var vertices = polygons[i];
            for (var ii = 0, nn = vertices.length; ii < nn; ii += 2)
            {
                var x = vertices[ii];
                var y = vertices[ii + 1];
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxX = Math.max(maxX, x);
                maxY = Math.max(maxY, y);
            }
        }
        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
    },
    /** Returns true if the axis aligned bounding box contains the point. */
    aabbContainsPoint: function (x, y)
    {
        return x >= this.minX && x <= this.maxX && y >= this.minY && y <= this.maxY;
    },
    /** Returns true if the axis aligned bounding box intersects the line segment. */
    aabbIntersectsSegment: function (x1, y1, x2, y2)
    {
        var minX = this.minX, minY = this.minY, maxX = this.maxX, maxY = this.maxY;
        if ((x1 <= minX && x2 <= minX) || (y1 <= minY && y2 <= minY) || (x1 >= maxX && x2 >= maxX) || (y1 >= maxY && y2 >= maxY))
            return false;
        var m = (y2 - y1) / (x2 - x1);
        var y = m * (minX - x1) + y1;
        if (y > minY && y < maxY) return true;
        y = m * (maxX - x1) + y1;
        if (y > minY && y < maxY) return true;
        var x = (minY - y1) / m + x1;
        if (x > minX && x < maxX) return true;
        x = (maxY - y1) / m + x1;
        if (x > minX && x < maxX) return true;
        return false;
    },
    /** Returns true if the axis aligned bounding box intersects the axis aligned bounding box of the specified bounds. */
    aabbIntersectsSkeleton: function (bounds)
    {
        return this.minX < bounds.maxX && this.maxX > bounds.minX && this.minY < bounds.maxY && this.maxY > bounds.minY;
    },
    /** Returns the first bounding box attachment that contains the point, or null. When doing many checks, it is usually more
     * efficient to only call this method if {@link #aabbContainsPoint(float, float)} returns true. */
    containsPoint: function (x, y)
    {
        var polygons = this.polygons;
        for (var i = 0, n = polygons.length; i < n; i++)
            if (this.polygonContainsPoint(polygons[i], x, y)) return this.boundingBoxes[i];
        return null;
    },
    /** Returns the first bounding box attachment that contains the line segment, or null. When doing many checks, it is usually
     * more efficient to only call this method if {@link #aabbIntersectsSegment(float, float, float, float)} returns true. */
    intersectsSegment: function (x1, y1, x2, y2)
    {
        var polygons = this.polygons;
        for (var i = 0, n = polygons.length; i < n; i++)
            if (polygons[i].intersectsSegment(x1, y1, x2, y2)) return this.boundingBoxes[i];
        return null;
    },
    /** Returns true if the polygon contains the point. */
    polygonContainsPoint: function (polygon, x, y)
    {
        var nn = polygon.length;
        var prevIndex = nn - 2;
        var inside = false;
        for (var ii = 0; ii < nn; ii += 2)
        {
            var vertexY = polygon[ii + 1];
            var prevY = polygon[prevIndex + 1];
            if ((vertexY < y && prevY >= y) || (prevY < y && vertexY >= y))
            {
                var vertexX = polygon[ii];
                if (vertexX + (y - vertexY) / (prevY - vertexY) * (polygon[prevIndex] - vertexX) < x) inside = !inside;
            }
            prevIndex = ii;
        }
        return inside;
    },
    /** Returns true if the polygon contains the line segment. */
    polygonIntersectsSegment: function (polygon, x1, y1, x2, y2)
    {
        var nn = polygon.length;
        var width12 = x1 - x2, height12 = y1 - y2;
        var det1 = x1 * y2 - y1 * x2;
        var x3 = polygon[nn - 2], y3 = polygon[nn - 1];
        for (var ii = 0; ii < nn; ii += 2)
        {
            var x4 = polygon[ii], y4 = polygon[ii + 1];
            var det2 = x3 * y4 - y3 * x4;
            var width34 = x3 - x4, height34 = y3 - y4;
            var det3 = width12 * height34 - height12 * width34;
            var x = (det1 * width34 - width12 * det2) / det3;
            if (((x >= x3 && x <= x4) || (x >= x4 && x <= x3)) && ((x >= x1 && x <= x2) || (x >= x2 && x <= x1)))
            {
                var y = (det1 * height34 - height12 * det2) / det3;
                if (((y >= y3 && y <= y4) || (y >= y4 && y <= y3)) && ((y >= y1 && y <= y2) || (y >= y2 && y <= y1))) return true;
            }
            x3 = x4;
            y3 = y4;
        }
        return false;
    },
    getPolygon: function (attachment)
    {
        var index = this.boundingBoxes.indexOf(attachment);
        return index == -1 ? null : this.polygons[index];
    },
    getWidth: function ()
    {
        return this.maxX - this.minX;
    },
    getHeight: function ()
    {
        return this.maxY - this.minY;
    }
};
module.exports = spine.SkeletonBounds;


},{"../SpineRuntime":43,"./AttachmentType":11}],32:[function(require,module,exports){
var spine = require('../SpineUtil');
spine.SkeletonData = function ()
{
    this.bones = [];
    this.slots = [];
    this.skins = [];
    this.events = [];
    this.animations = [];
    this.ikConstraints = [];
    this.transformConstraints = [];
};
spine.SkeletonData.prototype = {
    name: null,
    defaultSkin: null,
    width: 0, height: 0,
    version: null, hash: null,
    /** @return May be null. */
    findBone: function (boneName)
    {
        var bones = this.bones;
        for (var i = 0, n = bones.length; i < n; i++)
            if (bones[i].name == boneName) return bones[i];
        return null;
    },
    /** @return -1 if the bone was not found. */
    findBoneIndex: function (boneName)
    {
        var bones = this.bones;
        for (var i = 0, n = bones.length; i < n; i++)
            if (bones[i].name == boneName) return i;
        return -1;
    },
    /** @return May be null. */
    findSlot: function (slotName)
    {
        var slots = this.slots;
        for (var i = 0, n = slots.length; i < n; i++)
        {
            if (slots[i].name == slotName) return this.slots[i];
        }
        return null;
    },
    /** @return -1 if the bone was not found. */
    findSlotIndex: function (slotName)
    {
        var slots = this.slots;
        for (var i = 0, n = slots.length; i < n; i++)
            if (slots[i].name == slotName) return i;
        return -1;
    },
    /** @return May be null. */
    findSkin: function (skinName)
    {
        var skins = this.skins;
        for (var i = 0, n = skins.length; i < n; i++)
            if (skins[i].name == skinName) return skins[i];
        return null;
    },
    /** @return May be null. */
    findEvent: function (eventName)
    {
        var events = this.events;
        for (var i = 0, n = events.length; i < n; i++)
            if (events[i].name == eventName) return events[i];
        return null;
    },
    /** @return May be null. */
    findAnimation: function (animationName)
    {
        var animations = this.animations;
        for (var i = 0, n = animations.length; i < n; i++)
            if (animations[i].name == animationName) return animations[i];
        return null;
    },
    /** @return May be null. */
    findIkConstraint: function (constraintName)
    {
        var constraints = this.ikConstraints;
        for (var i = 0, n = constraints.length; i < n; i++)
            if (constraints[i].name == constraintName) return constraints[i];
        return null;
    },
    /** @return May be null. */
    findTransformConstraint: function (constraintName)
    {
        var constraints = this.transformConstraints;
        for (var i = 0, n = constraints.length; i < n; i++)
            if (constraints[i].name == constraintName) return constraints[i];
        return null;
    },
};
module.exports = spine.SkeletonData;


},{"../SpineUtil":44}],33:[function(require,module,exports){
var spine = require('../SpineUtil');
spine.SkeletonData = require('./SkeletonData');
spine.BoneData = require('./BoneData');
spine.IkConstraintData = require('./IkConstraintData');
spine.TransformConstraintData = require('./TransformConstraintData');
spine.SlotData = require('./SlotData');
spine.Skin = require('./Skin');
spine.EventData = require('./EventData');
spine.AttachmentType = require('./AttachmentType');
spine.ColorTimeline = require('./ColorTimeline');
spine.AttachmentTimeline = require('./AttachmentTimeline');
spine.RotateTimeline = require('./RotateTimeline');
spine.ScaleTimeline = require('./ScaleTimeline');
spine.TranslateTimeline = require('./TranslateTimeline');
spine.ShearTimeline = require('./ShearTimeline');
spine.IkConstraintTimeline = require('./IkConstraintTimeline');
spine.TransformConstraintTimeline = require('./TransformConstraintTimeline');
spine.FfdTimeline = require('./FfdTimeline');
spine.DrawOrderTimeline = require('./DrawOrderTimeline');
spine.EventTimeline = require('./EventTimeline');
spine.Event = require('./Event');
spine.Animation = require('./Animation');

function LinkedMesh(mesh, skin, slotIndex, parent) {
    this.mesh = mesh;
    this.skin = skin;
    this.slotIndex = slotIndex;
    this.parent = parent;
}

spine.SkeletonJsonParser = function (attachmentLoader)
{
    if (attachmentLoader.pages) {
        //its an atlas, we have to wrap it
        this.attachmentLoader = new spine.AtlasAttachmentLoader(attachmentLoader);
    } else {
        //got a loader, thats good
        this.attachmentLoader = attachmentLoader;
    }
    if (!attachmentLoader.newRegionAttachment) {
        console.warn("SkeletonJsonParser accepts AtlasAttachmentLoader or atlas as first parameter");
    }
    this.linkedMeshes = [];
};
spine.SkeletonJsonParser.prototype = {
    scale: 1,
    readSkeletonData: function (root, name)
    {
        var skeletonData = new spine.SkeletonData();
        skeletonData.name = name;

        var scale = this.scale;
        // Skeleton.
        var skeletonMap = root["skeleton"];
        if (skeletonMap)
        {
            skeletonData.hash = skeletonMap["hash"];
            skeletonData.version = skeletonMap["spine"];
            skeletonData.width = skeletonMap["width"] || 0;
            skeletonData.height = skeletonMap["height"] || 0;
        }

        // Bones.
        var bones = root["bones"];
        for (var i = 0, n = bones.length; i < n; i++)
        {
            var boneMap = bones[i];
            var parent = null;
            if (boneMap["parent"])
            {
                parent = skeletonData.findBone(boneMap["parent"]);
                if (!parent) throw "Parent bone not found: " + boneMap["parent"];
            }
            var boneData = new spine.BoneData(boneMap["name"], parent);
            boneData.length = (boneMap["length"] || 0) * this.scale;
            boneData.x = (boneMap["x"] || 0) * this.scale;
            boneData.y = (boneMap["y"] || 0) * this.scale;
            boneData.rotation = (boneMap["rotation"] || 0);
            boneData.scaleX = boneMap.hasOwnProperty("scaleX") ? boneMap["scaleX"] : 1;
            boneData.scaleY = boneMap.hasOwnProperty("scaleY") ? boneMap["scaleY"] : 1;
            boneData.shearX = boneMap["shearX"] || 0;
            boneData.shearY = boneMap["shearY"] || 0;
            boneData.inheritScale = boneMap.hasOwnProperty("inheritScale") ? boneMap["inheritScale"] : true;
            boneData.inheritRotation = boneMap.hasOwnProperty("inheritRotation") ? boneMap["inheritRotation"] : true;
            skeletonData.bones.push(boneData);
        }

        // IK constraints.
        var ik = root["ik"];
        if (ik)
        {
            for (var i = 0, n = ik.length; i < n; i++)
            {
                var ikMap = ik[i];
                var ikConstraintData = new spine.IkConstraintData(ikMap["name"]);

                var bones = ikMap["bones"];
                for (var ii = 0, nn = bones.length; ii < nn; ii++)
                {
                    var bone = skeletonData.findBone(bones[ii]);
                    if (!bone) throw new Error( "IK bone not found: " + bones[ii] );
                    ikConstraintData.bones.push(bone);
                }

                ikConstraintData.target = skeletonData.findBone(ikMap["target"]);
                if (!ikConstraintData.target) throw new Error("Target bone not found: " + ikMap["target"]);

                ikConstraintData.bendDirection = (!ikMap.hasOwnProperty("bendPositive") || ikMap["bendPositive"]) ? 1 : -1;
                ikConstraintData.mix = ikMap.hasOwnProperty("mix") ? ikMap["mix"] : 1;

                skeletonData.ikConstraints.push(ikConstraintData);
            }
        }

        var transform = root["transform"];
        if (transform) {
            for (var i = 0, n = transform.length; i<n; i++) {
                var transformMap = transform[i];
                var transformData = new spine.TransformConstraintData(transformMap["name"]);
                transformData.bone = skeletonData.findBone(transformMap["bone"]);
                if (!transformData.bone) throw new Error("Transform bone not found: " + transformData["bone"]);
                transformData.target = skeletonData.findBone(transformMap["target"]);
                if (!transformData.target) throw new Error("Target bone not found: " + transformData["target"]);

                transformData.offsetRotation = transformMap["rotation"] || 0;
                transformData.offsetX = (transformMap["offsetX"] || 0) * scale;
                transformData.offsetY = (transformMap["offsetY"] || 0) * scale;
                transformData.offsetScaleX = (transformMap["scaleX"] || 0) * scale;
                transformData.offsetScaleY = (transformMap["scaleY"] || 0) * scale;
                transformData.offsetShearY = (transformMap["offsetShearY"] || 0) * scale;

                transformData.rotateMix = transformMap.hasOwnProperty("rotateMix") ? transformMap["rotateMix"] : 1;
                transformData.translateMix = transformMap.hasOwnProperty("translateMix") ? transformMap["translateMix"] : 1;
                transformData.scaleMix = transformMap.hasOwnProperty("scaleMix") ? transformMap["scaleMix"] : 1;
                transformData.shearMix = transformMap.hasOwnProperty("shearMix") ? transformMap["shearMix"] : 1;

                skeletonData.transformConstraints.push(transformData);
            }
        }

        // Slots.
        var slots = root["slots"];
        for (var i = 0, n = slots.length; i < n; i++)
        {
            var slotMap = slots[i];
            var boneData = skeletonData.findBone(slotMap["bone"]);
            if (!boneData) throw "Slot bone not found: " + slotMap["bone"];
            var slotData = new spine.SlotData(slotMap["name"], boneData);

            var color = slotMap["color"];
            if (color)
            {
                slotData.r = this.toColor(color, 0);
                slotData.g = this.toColor(color, 1);
                slotData.b = this.toColor(color, 2);
                slotData.a = this.toColor(color, 3);
            }

            slotData.attachmentName = slotMap["attachment"];


            slotData.blendMode = slotMap["blend"] && spine.SlotData.PIXI_BLEND_MODE_MAP[slotMap["blend"]] || spine.SlotData.PIXI_BLEND_MODE_MAP['normal'];

            skeletonData.slots.push(slotData);
        }

        // Skins.
        var skins = root["skins"];
        for (var skinName in skins)
        {
            if (!skins.hasOwnProperty(skinName)) continue;
            var skinMap = skins[skinName];
            var skin = new spine.Skin(skinName);
            for (var slotName in skinMap)
            {
                if (!skinMap.hasOwnProperty(slotName)) continue;
                var slotIndex = skeletonData.findSlotIndex(slotName);
                var slotEntry = skinMap[slotName];
                for (var attachmentName in slotEntry)
                {
                    if (!slotEntry.hasOwnProperty(attachmentName)) continue;
                    var attachment = this.readAttachment(skin, slotIndex, attachmentName, slotEntry[attachmentName]);
                    if (attachment) skin.addAttachment(slotIndex, attachmentName, attachment);
                }
            }
            skeletonData.skins.push(skin);
            if (skin.name == "default") skeletonData.defaultSkin = skin;
        }

        var linkedMeshes = this.linkedMeshes;
        // Linked meshes.
        for (var i = 0, n = linkedMeshes.size; i < n; i++) {
            var linkedMesh = linkedMeshes[i];
            var skin = linkedMesh.skin ? skeletonData.findSkin(linkedMesh.skin): skeletonData.defaultSkin;
            var parent = skin.getAttachment(linkedMesh.slotIndex, linkedMesh.parent);
            linkedMesh.mesh.setParentMesh(parent);
            linkedMesh.mesh.updateUVs();
        }
        linkedMeshes.length = 0;

        // Events.
        var events = root["events"];
        for (var eventName in events)
        {
            if (!events.hasOwnProperty(eventName)) continue;
            var eventMap = events[eventName];
            var eventData = new spine.EventData(eventName);
            eventData.intValue = eventMap["int"] || 0;
            eventData.floatValue = eventMap["float"] || 0;
            eventData.stringValue = eventMap["string"] || null;
            skeletonData.events.push(eventData);
        }

        // Animations.
        var animations = root["animations"];
        for (var animationName in animations)
        {
            if (!animations.hasOwnProperty(animationName)) continue;
            this.readAnimation(animationName, animations[animationName], skeletonData);
        }

        return skeletonData;
    },
    readAttachment: function (skin, slotIndex, name, map)
    {
        name = map["name"] || name;

        var type = spine.AttachmentType[map["type"] || "region"];
        var path = map["path"] || name;

        var scale = this.scale;
        if (type == spine.AttachmentType.region)
        {
            var region = this.attachmentLoader.newRegionAttachment(skin, name, path);
            if (!region) return null;
            region.path = path;
            region.x = (map["x"] || 0) * scale;
            region.y = (map["y"] || 0) * scale;
            region.scaleX = map.hasOwnProperty("scaleX") ? map["scaleX"] : 1;
            region.scaleY = map.hasOwnProperty("scaleY") ? map["scaleY"] : 1;
            region.rotation = map["rotation"] || 0;
            region.width = (map["width"] || 0) * scale;
            region.height = (map["height"] || 0) * scale;

            var color = map["color"];
            if (color)
            {
                region.r = this.toColor(color, 0);
                region.g = this.toColor(color, 1);
                region.b = this.toColor(color, 2);
                region.a = this.toColor(color, 3);
            }

            region.updateOffset();
            return region;
        } else if (type == spine.AttachmentType.boundingbox)
        {
            var attachment = this.attachmentLoader.newBoundingBoxAttachment(skin, name);
            var vertices = map["vertices"];
            for (var i = 0, n = vertices.length; i < n; i++)
                attachment.vertices.push(vertices[i] * scale);
            return attachment;
        } else if (type == spine.AttachmentType.mesh || type == spine.AttachmentType.linkedmesh ||
            type == spine.AttachmentType.weightedmesh || type == spine.AttachmentType.weightedlinkedmesh)
        {
            var vertexCount = map["vertexCount"] || 0;
            if (vertexCount * 2 === map["vertices"].length ||
                map["vertices"].length === map["uvs"].length) {
                //regular mesh
                var mesh = this.attachmentLoader.newMeshAttachment(skin, name, path);
                if (!mesh) return null;
                mesh.path = path;
                color = map["color"];
                if (color) {
                    mesh.r = this.toColor(color, 0);
                    mesh.g = this.toColor(color, 1);
                    mesh.b = this.toColor(color, 2);
                    mesh.a = this.toColor(color, 3);
                }
                mesh.width = (map["width"] || 0) * scale;
                mesh.height = (map["height"] || 0) * scale;

                var parent = map["parent"];
                if (!parent) {
                    mesh.vertices = this.getFloatArray(map, "vertices", scale);
                    mesh.triangles = this.getIntArray(map, "triangles");
                    mesh.regionUVs = this.getFloatArray(map, "uvs", 1);
                    mesh.updateUVs();
                    mesh.hullLength = (map["hull"] || 0) * 2;
                    if (map["edges"]) mesh.edges = this.getIntArray(map, "edges");
                } else {
                    mesh.inheritFFD = !!map["ffd"];
                    this.linkedMeshes.push(new LinkedMesh(mesh, map["skin"] || null, slotIndex, parent));
                }
                return mesh;
            } else {
                //weighted mesh
                var mesh = this.attachmentLoader.newWeightedMeshAttachment(skin, name, path);
                if (!mesh) return null;
                mesh.path = path;
                color = map["color"];
                if (color) {
                    mesh.r = this.toColor(color, 0);
                    mesh.g = this.toColor(color, 1);
                    mesh.b = this.toColor(color, 2);
                    mesh.a = this.toColor(color, 3);
                }
                mesh.width = (map["width"] || 0) * scale;
                mesh.height = (map["height"] || 0) * scale;

                var parent = map["parent"];
                if (!parent) {
                    var uvs = this.getFloatArray(map, "uvs", 1);
                    var vertices = this.getFloatArray(map, "vertices", 1);
                    var weights = [];
                    var bones = [];
                    for (var i = 0, n = vertices.length; i < n;) {
                        var boneCount = vertices[i++] | 0;
                        bones[bones.length] = boneCount;
                        for (var nn = i + boneCount * 4; i < nn;) {
                            bones[bones.length] = vertices[i];
                            weights[weights.length] = vertices[i + 1] * scale;
                            weights[weights.length] = vertices[i + 2] * scale;
                            weights[weights.length] = vertices[i + 3];
                            i += 4;
                        }
                    }
                    mesh.bones = bones;
                    mesh.weights = weights;
                    mesh.triangles = this.getIntArray(map, "triangles");
                    mesh.regionUVs = uvs;
                    mesh.updateUVs();

                    mesh.hullLength = (map["hull"] || 0) * 2;
                    if (map["edges"]) mesh.edges = this.getIntArray(map, "edges");
                } else {
                    mesh.inheritFFD = !!map["ffd"];
                    this.linkedMeshes.push(new LinkedMesh(mesh, map["skin"] || null, slotIndex, parent));
                }
                return mesh;
            }
        }
        throw "Unknown attachment type: " + type;
    },
    readAnimation: function (name, map, skeletonData)
    {
        var timelines = [];
        var duration = 0;

        var slots = map["slots"];
        for (var slotName in slots)
        {
            if (!slots.hasOwnProperty(slotName)) continue;
            var slotMap = slots[slotName];
            var slotIndex = skeletonData.findSlotIndex(slotName);

            for (var timelineName in slotMap)
            {
                if (!slotMap.hasOwnProperty(timelineName)) continue;
                var values = slotMap[timelineName];
                if (timelineName == "color")
                {
                    var timeline = new spine.ColorTimeline(values.length);
                    timeline.slotIndex = slotIndex;

                    var frameIndex = 0;
                    for (var i = 0, n = values.length; i < n; i++)
                    {
                        var valueMap = values[i];
                        var color = valueMap["color"];
                        var r = this.toColor(color, 0);
                        var g = this.toColor(color, 1);
                        var b = this.toColor(color, 2);
                        var a = this.toColor(color, 3);
                        timeline.setFrame(frameIndex, valueMap["time"], r, g, b, a);
                        this.readCurve(timeline, frameIndex, valueMap);
                        frameIndex++;
                    }
                    timelines.push(timeline);
                    duration = Math.max(duration, timeline.frames[timeline.getFrameCount() * 5 - 5]);

                } else if (timelineName == "attachment")
                {
                    var timeline = new spine.AttachmentTimeline(values.length);
                    timeline.slotIndex = slotIndex;

                    var frameIndex = 0;
                    for (var i = 0, n = values.length; i < n; i++)
                    {
                        var valueMap = values[i];
                        timeline.setFrame(frameIndex++, valueMap["time"], valueMap["name"]);
                    }
                    timelines.push(timeline);
                    duration = Math.max(duration, timeline.frames[timeline.getFrameCount() - 1]);

                } else
                    throw "Invalid timeline type for a slot: " + timelineName + " (" + slotName + ")";
            }
        }

        var bones = map["bones"];
        for (var boneName in bones)
        {
            if (!bones.hasOwnProperty(boneName)) continue;
            var boneIndex = skeletonData.findBoneIndex(boneName);
            if (boneIndex == -1) throw "Bone not found: " + boneName;
            var boneMap = bones[boneName];

            for (var timelineName in boneMap)
            {
                if (!boneMap.hasOwnProperty(timelineName)) continue;
                var values = boneMap[timelineName];
                if (timelineName == "rotate")
                {
                    var timeline = new spine.RotateTimeline(values.length);
                    timeline.boneIndex = boneIndex;

                    var frameIndex = 0;
                    for (var i = 0, n = values.length; i < n; i++)
                    {
                        var valueMap = values[i];
                        timeline.setFrame(frameIndex, valueMap["time"], valueMap["angle"]);
                        this.readCurve(timeline, frameIndex, valueMap);
                        frameIndex++;
                    }
                    timelines.push(timeline);
                    duration = Math.max(duration, timeline.frames[timeline.getFrameCount() * 2 - 2]);

                } else if (timelineName == "translate" || timelineName == "scale" || timelineName == "shear")
                {
                    var timeline;
                    var timelineScale = 1;
                    if (timelineName == "scale") {
                        timeline = new spine.ScaleTimeline(values.length);
                    } else if (timelineName == "shear") {
                        timeline = new spine.ShearTimeline(values.length);
                    }
                    else
                    {
                        timeline = new spine.TranslateTimeline(values.length);
                        timelineScale = this.scale;
                    }
                    timeline.boneIndex = boneIndex;

                    var frameIndex = 0;
                    for (var i = 0, n = values.length; i < n; i++)
                    {
                        var valueMap = values[i];
                        var x = (valueMap["x"] || 0) * timelineScale;
                        var y = (valueMap["y"] || 0) * timelineScale;
                        timeline.setFrame(frameIndex, valueMap["time"], x, y);
                        this.readCurve(timeline, frameIndex, valueMap);
                        frameIndex++;
                    }
                    timelines.push(timeline);
                    duration = Math.max(duration, timeline.frames[timeline.getFrameCount() * 3 - 3]);

                } else if (timelineName == "flipX" || timelineName == "flipY")
                {
                    throw "flipX and flipY are not supported in spine v3: (" + boneName + ")";
                } else
                    throw "Invalid timeline type for a bone: " + timelineName + " (" + boneName + ")";
            }
        }

        var ikMap = map["ik"];
        for (var ikConstraintName in ikMap)
        {
            if (!ikMap.hasOwnProperty(ikConstraintName)) continue;
            var ikConstraint = skeletonData.findIkConstraint(ikConstraintName);
            var values = ikMap[ikConstraintName];
            var timeline = new spine.IkConstraintTimeline(values.length);
            timeline.ikConstraintIndex = skeletonData.ikConstraints.indexOf(ikConstraint);
            var frameIndex = 0;
            for (var i = 0, n = values.length; i < n; i++)
            {
                var valueMap = values[i];
                var mix = valueMap.hasOwnProperty("mix") ? valueMap["mix"] : 1;
                var bendDirection = (!valueMap.hasOwnProperty("bendPositive") || valueMap["bendPositive"]) ? 1 : -1;
                timeline.setFrame(frameIndex, valueMap["time"], mix, bendDirection);
                this.readCurve(timeline, frameIndex, valueMap);
                frameIndex++;
            }
            timelines.push(timeline);
            duration = Math.max(duration, timeline.frames[timeline.getFrameCount() * 3 - 3]);
        }

        var transformMap = map["transform"];
        for (var transformConstraintName in transformMap)
        {
            if (!transformMap.hasOwnProperty(transformConstraintName)) continue;
            var transformConstraint = skeletonData.findTransformConstraint(transformConstraintName);
            var values = transformMap[transformConstraintName];
            var timeline = new spine.TransformConstraintTimeline(values.length);
            timeline.transformConstraintIndex = skeletonData.transformConstraints.indexOf(transformConstraint);
            var frameIndex = 0;
            for (var i = 0, n = values.length; i < n; i++)
            {
                var valueMap = values[i];
                var rotateMix = valueMap.hasOwnProperty("rotateMix") ? valueMap["rotateMix"] : 1;
                var translateMix = valueMap.hasOwnProperty("translateMix") ? valueMap["translateMix"] : 1;
                var scaleMix = valueMap.hasOwnProperty("scaleMix") ? valueMap["scaleMix"] : 1;
                var shearMix = valueMap.hasOwnProperty("shearMix") ? valueMap["shearMix"] : 1;
                timeline.setFrame(frameIndex, valueMap["time"], translateMix, scaleMix, shearMix);
                this.readCurve(timeline, frameIndex, valueMap);
                frameIndex++;
            }
            timelines.push(timeline);
            duration = Math.max(duration, timeline.frames[timeline.getFrameCount() * 5 - 5]);
        }

        var ffd = map["deform"] || map["ffd"];
        for (var skinName in ffd)
        {
            var skin = skeletonData.findSkin(skinName);
            var slotMap = ffd[skinName];
            for (slotName in slotMap)
            {
                var slotIndex = skeletonData.findSlotIndex(slotName);
                var meshMap = slotMap[slotName];
                for (var meshName in meshMap)
                {
                    var values = meshMap[meshName];
                    var timeline = new spine.FfdTimeline(values.length);
                    var attachment = skin.getAttachment(slotIndex, meshName);
                    if (!attachment) throw "FFD attachment not found: " + meshName;
                    timeline.slotIndex = slotIndex;
                    timeline.attachment = attachment;

                    var isMesh = attachment.type == spine.AttachmentType.mesh;
                    var vertexCount;
                    if (isMesh)
                        vertexCount = attachment.vertices.length;
                    else
                        vertexCount = attachment.weights.length / 3 * 2;

                    var frameIndex = 0;
                    for (var i = 0, n = values.length; i < n; i++)
                    {
                        var valueMap = values[i];
                        var vertices;
                        if (!valueMap["vertices"])
                        {
                            if (isMesh)
                                vertices = attachment.vertices;
                            else
                            {
                                vertices = [];
                                for (var j = 0; j < vertexCount; ++j) vertices.push(0); //initialize to 0
                            }
                        } else {
                            var verticesValue = valueMap["vertices"];
                            vertices = [];
                            for (var j = 0; j < vertexCount; ++j) vertices.push(0); //initialize to 0
                            var start = valueMap["offset"] || 0;
                            var nn = verticesValue.length;
                            if (this.scale == 1)
                            {
                                for (var ii = 0; ii < nn; ii++)
                                    vertices[ii + start] = verticesValue[ii];
                            } else {
                                for (var ii = 0; ii < nn; ii++)
                                    vertices[ii + start] = verticesValue[ii] * this.scale;
                            }
                            if (isMesh)
                            {
                                var meshVertices = attachment.vertices;
                                for (var ii = 0, nn = vertices.length; ii < nn; ii++)
                                    vertices[ii] += meshVertices[ii];
                            }
                        }

                        timeline.setFrame(frameIndex, valueMap["time"], vertices);
                        this.readCurve(timeline, frameIndex, valueMap);
                        frameIndex++;
                    }
                    timelines[timelines.length] = timeline;
                    duration = Math.max(duration, timeline.frames[timeline.getFrameCount() - 1]);
                }
            }
        }

        var drawOrderValues = map["drawOrder"];
        if (!drawOrderValues) drawOrderValues = map["draworder"];
        if (drawOrderValues)
        {
            var timeline = new spine.DrawOrderTimeline(drawOrderValues.length);
            var slotCount = skeletonData.slots.length;
            var frameIndex = 0;
            for (var i = 0, n = drawOrderValues.length; i < n; i++)
            {
                var drawOrderMap = drawOrderValues[i];
                var drawOrder = null;
                if (drawOrderMap["offsets"])
                {
                    drawOrder = [];
                    drawOrder.length = slotCount;
                    for (var ii = slotCount - 1; ii >= 0; ii--)
                        drawOrder[ii] = -1;
                    var offsets = drawOrderMap["offsets"];
                    var unchanged = [];
                    unchanged.length = slotCount - offsets.length;
                    var originalIndex = 0, unchangedIndex = 0;
                    for (var ii = 0, nn = offsets.length; ii < nn; ii++)
                    {
                        var offsetMap = offsets[ii];
                        var slotIndex = skeletonData.findSlotIndex(offsetMap["slot"]);
                        if (slotIndex == -1) throw "Slot not found: " + offsetMap["slot"];
                        // Collect unchanged items.
                        while (originalIndex != slotIndex)
                            unchanged[unchangedIndex++] = originalIndex++;
                        // Set changed items.
                        drawOrder[originalIndex + offsetMap["offset"]] = originalIndex++;
                    }
                    // Collect remaining unchanged items.
                    while (originalIndex < slotCount)
                        unchanged[unchangedIndex++] = originalIndex++;
                    // Fill in unchanged items.
                    for (var ii = slotCount - 1; ii >= 0; ii--)
                        if (drawOrder[ii] == -1) drawOrder[ii] = unchanged[--unchangedIndex];
                }
                timeline.setFrame(frameIndex++, drawOrderMap["time"], drawOrder);
            }
            timelines.push(timeline);
            duration = Math.max(duration, timeline.frames[timeline.getFrameCount() - 1]);
        }

        var events = map["events"];
        if (events)
        {
            var timeline = new spine.EventTimeline(events.length);
            var frameIndex = 0;
            for (var i = 0, n = events.length; i < n; i++)
            {
                var eventMap = events[i];
                var eventData = skeletonData.findEvent(eventMap["name"]);
                if (!eventData) throw "Event not found: " + eventMap["name"];
                var event = new spine.Event(eventData);
                event.intValue = eventMap.hasOwnProperty("int") ? eventMap["int"] : eventData.intValue;
                event.floatValue = eventMap.hasOwnProperty("float") ? eventMap["float"] : eventData.floatValue;
                event.stringValue = eventMap.hasOwnProperty("string") ? eventMap["string"] : eventData.stringValue;
                timeline.setFrame(frameIndex++, eventMap["time"], event);
            }
            timelines.push(timeline);
            duration = Math.max(duration, timeline.frames[timeline.getFrameCount() - 1]);
        }

        skeletonData.animations.push(new spine.Animation(name, timelines, duration));
    },
    readCurve: function (timeline, frameIndex, valueMap)
    {
        var curve = valueMap["curve"];
        if (!curve)
            timeline.curves.setLinear(frameIndex);
        else if (curve == "stepped")
            timeline.curves.setStepped(frameIndex);
        else if (curve instanceof Array)
            timeline.curves.setCurve(frameIndex, curve[0], curve[1], curve[2], curve[3]);
    },
    toColor: function (hexString, colorIndex)
    {
        if (hexString.length != 8) throw "Color hexidecimal length must be 8, recieved: " + hexString;
        return parseInt(hexString.substring(colorIndex * 2, (colorIndex * 2) + 2), 16) / 255;
    },
    getFloatArray: function (map, name, scale)
    {
        var list = map[name];
        var values = new spine.Float32Array(list.length);
        var i = 0, n = list.length;
        if (scale == 1)
        {
            for (; i < n; i++)
                values[i] = list[i];
        } else {
            for (; i < n; i++)
                values[i] = list[i] * scale;
        }
        return values;
    },
    getIntArray: function (map, name)
    {
        var list = map[name];
        var values = new spine.Uint16Array(list.length);
        for (var i = 0, n = list.length; i < n; i++)
            values[i] = list[i] | 0;
        return values;
    }
};
module.exports = spine.SkeletonJsonParser;


},{"../SpineUtil":44,"./Animation":2,"./AttachmentTimeline":10,"./AttachmentType":11,"./BoneData":13,"./ColorTimeline":15,"./DrawOrderTimeline":17,"./Event":18,"./EventData":19,"./EventTimeline":20,"./FfdTimeline":21,"./IkConstraintData":23,"./IkConstraintTimeline":24,"./RotateTimeline":27,"./ScaleTimeline":28,"./ShearTimeline":29,"./SkeletonData":32,"./Skin":34,"./SlotData":36,"./TransformConstraintData":39,"./TransformConstraintTimeline":40,"./TranslateTimeline":41}],34:[function(require,module,exports){
var spine = require('../SpineUtil');
spine.Skin = function (name)
{
    this.name = name;
    this.attachments = {};
};
spine.Skin.prototype = {
    addAttachment: function (slotIndex, name, attachment)
    {
        this.attachments[slotIndex + ":" + name] = attachment;
    },
    getAttachment: function (slotIndex, name)
    {
        return this.attachments[slotIndex + ":" + name];
    },
    _attachAll: function (skeleton, oldSkin)
    {
        for (var key in oldSkin.attachments)
        {
            var colon = key.indexOf(":");
            var slotIndex = parseInt(key.substring(0, colon));
            var name = key.substring(colon + 1);
            var slot = skeleton.slots[slotIndex];
            if (slot.attachment && slot.attachment.name == name)
            {
                var attachment = this.getAttachment(slotIndex, name);
                if (attachment) slot.setAttachment(attachment);
            }
        }
    }
};
module.exports = spine.Skin;


},{"../SpineUtil":44}],35:[function(require,module,exports){
var spine = require('../SpineUtil');
spine.Slot = function (slotData, bone)
{
    this.data = slotData;
    this.bone = bone;
    this.setToSetupPose();
};
spine.Slot.prototype = {
    r: 1, g: 1, b: 1, a: 1,
    _attachmentTime: 0,
    attachment: null,
    attachmentVertices: [],
    setAttachment: function (attachment)
    {
        this.attachment = attachment;
        this._attachmentTime = this.bone.skeleton.time;
        this.attachmentVertices.length = 0;
    },
    setAttachmentTime: function (time)
    {
        this._attachmentTime = this.bone.skeleton.time - time;
    },
    getAttachmentTime: function ()
    {
        return this.bone.skeleton.time - this._attachmentTime;
    },
    setToSetupPose: function ()
    {
        var data = this.data;
        this.r = data.r;
        this.g = data.g;
        this.b = data.b;
        this.a = data.a;
        this.blendMode = data.blendMode;

        var slotDatas = this.bone.skeleton.data.slots;
        for (var i = 0, n = slotDatas.length; i < n; i++)
        {
            if (slotDatas[i] == data)
            {
                this.setAttachment(!data.attachmentName ? null : this.bone.skeleton.getAttachmentBySlotIndex(i, data.attachmentName));
                break;
            }
        }
    }
};
module.exports = spine.Slot;


},{"../SpineUtil":44}],36:[function(require,module,exports){
var spine = require('../SpineUtil');
spine.SlotData = function (name, boneData)
{
    this.name = name;
    this.boneData = boneData;
};

spine.SlotData.PIXI_BLEND_MODE_MAP = {
    'multiply': PIXI.BLEND_MODES.MULTIPLY,
    'screen': PIXI.BLEND_MODES.SCREEN,
    'additive': PIXI.BLEND_MODES.ADD,
    'normal': PIXI.BLEND_MODES.NORMAL
};

spine.SlotData.prototype = {
    r: 1, g: 1, b: 1, a: 1,
    attachmentName: null,
    blendMode: PIXI.BLEND_MODES.NORMAL


};


module.exports = spine.SlotData;


},{"../SpineUtil":44}],37:[function(require,module,exports){
var spine = require('../SpineUtil');
spine.TrackEntry = function ()
{};
spine.TrackEntry.prototype = {
    next: null, previous: null,
    animation: null,
    loop: false,
    delay: 0, time: 0, lastTime: -1, endTime: 0,
    timeScale: 1,
    mixTime: 0, mixDuration: 0, mix: 1,
    onStart: null, onEnd: null, onComplete: null, onEvent: null
};
module.exports = spine.TrackEntry;


},{"../SpineUtil":44}],38:[function(require,module,exports){
var spine = require('../SpineUtil');
var tempVec = [0, 0];
spine.TransformConstraint = function (data, skeleton)
{
    this.data = data;
    this.translateMix = data.translateMix;
    this.rotateMix = data.rotateMix;
    this.scaleMix = data.scaleMix;
    this.shearMix = data.shearMix;
    this.offsetX = data.offsetX;
    this.offsetY = data.offsetY;
    this.offsetScaleX = data.offsetScaleX;
    this.offsetScaleY = data.offsetScaleY;
    this.offsetShearY = data.offsetShearY;

    this.bone = skeleton.findBone(data.bone.name);
    this.target = skeleton.findBone(data.target.name);
};

spine.TransformConstraint.prototype = {
    update: function() {
        this.apply();
    },
    apply: function ()
    {
        var bm = this.bone.matrix;
        var tm = this.target.matrix;

        var rotateMix = this.rotateMix;
        if (rotateMix > 0) {
            var a = bm.a, b = bm.c, c = bm.b, d = bm.d;
            var r = Math.atan2(tm.b, tm.a) - Math.atan2(c, a);
            if (r > Math.PI)
                r -= Math.PI*2;
            else if (r < -Math.PI) r += Math.PI*2;
            r *= rotateMix;
            var cos = Math.cos(r), sin = Math.sin(r);
            bm.a = cos * a - sin * c;
            bm.c = cos * b - sin * d;
            bm.b = sin * a + cos * c;
            bm.d = sin * b + cos * d;
        }

        var scaleMix = this.rotateMix;
        if (scaleMix > 0) {
            var bs = Math.sqrt(bm.a * bm.a + bm.b * bm.b);
            var ts = Math.sqrt(tm.a * tm.a + tm.b * tm.b);
            var s = bs > 0.00001 ? (bs + (ts - bs + this.offsetScaleX) * scaleMix) / bs : 0;
            bm.a *= s;
            bm.b *= s;
            bs = Math.sqrt(bm.c * bm.c + bm.d * bm.d);
            ts = Math.sqrt(bm.c * bm.c + bm.d * bm.d);
            s = bs > 0.00001 ? (bs + (ts - bs + this.offsetScaleY) * scaleMix) / bs : 0;
            bm.c *= s;
            bm.d *= s;
        }

        var shearMix = this.shearMix;
        if (shearMix > 0) {
            var b = bm.c, d = bm.d;
            var by = Math.atan2(d, b);
            var r = Math.atan2(tm.d, tm.c) - Math.atan2(tm.b, target.a) - (by - Math.atan2(bm.b, bm.a));
            if (r > Math.PI)
                r -= Math.PI*2;
            else if (r < -Math.PI) r += Math.PI*2;
            r = by + (r + this.offsetShearY * spine.degRad) * shearMix;
            var s = Math.sqrt(b * b + d * d);
            bm.c = Math.cos(r) * s;
            bm.d = Math.sin(r) * s;
        }

        var translateMix = this.translateMix;
        if (translateMix > 0) {
            tempVec[0] = this.offsetX;
            tempVec[1] = this.offsetY;
            this.target.localToWorld(tempVec);
            bm.tx += (tempVec[0] - bm.tx) * translateMix;
            bm.ty += (tempVec[1] - bm.ty) * translateMix;
        }
    }
};

module.exports = spine.TransformConstraint;

},{"../SpineUtil":44}],39:[function(require,module,exports){
var spine = require('../SpineUtil') || {};
spine.TransformConstraintData = function (name)
{
    this.name = name;
    this.bone = null;
};
spine.TransformConstraintData.prototype = {
    target: null,
    rotateMix: 1,
    translateMix: 1,
    scaleMix: 1,
    shearMix: 1,
    offsetRotation: 0,
    offsetX: 0,
    offsetY: 0,
    offsetScaleX: 0,
    offsetScaleY: 0,
    offsetShearY: 0
};
module.exports = spine.TransformConstraintData;


},{"../SpineUtil":44}],40:[function(require,module,exports){
var spine = require('../SpineUtil') || {};
spine.Animation = require('./Animation');
spine.Curves = require('./Curves');
spine.TransformConstraintTimeline = function (frameCount)
{
    this.curves = new spine.Curves(frameCount);
    this.frames = []; // time, mix, bendDirection, ...
    this.frames.length = frameCount * 3;
};
spine.TransformConstraintTimeline.prototype = {
    transformConstraintIndex: 0,
    getFrameCount: function ()
    {
        return this.frames.length / 5;
    },
    setFrame: function (frameIndex, time, rotateMix, translateMix, scaleMix, shareMix)
    {
        frameIndex *= 5;
        this.frames[frameIndex] = time;
        this.frames[frameIndex + 1] = rotateMix;
        this.frames[frameIndex + 2] = translateMix;
        this.frames[frameIndex + 3] = scaleMix;
        this.frames[frameIndex + 4] = shareMix;
    },
    apply: function (skeleton, lastTime, time, firedEvents, alpha)
    {
        var frames = this.frames;
        if (time < frames[0]) return; // Time is before first frame.

        var constraint = skeleton.transformConstraints[this.transformConstraintIndex];

        if (time >= frames[frames.length - 5])
        { // Time is after last frame.
            constraint.rotateMix += (frames[i - 3] - constraint.rotateMix) * alpha;
            constraint.translateMix += (frames[i - 2] - constraint.translateMix) * alpha;
            constraint.scaleMix += (frames[i - 1] - constraint.scaleMix) * alpha;
            constraint.shearMix += (frames[i] - constraint.shearMix) * alpha;
            return;
        }

        // Interpolate between the previous frame and the current frame.
        var frame = spine.Animation.binarySearch(frames, time, 5);
        var frameTime = frames[frame];
        var percent = 1 - (time - frameTime) / (frames[frame + -5/*PREV_FRAME_TIME*/] - frameTime);
        percent = this.curves.getCurvePercent(frame / 5 - 1, percent);

        var rotate = frames[frame + -4/*PREV_ROTATE_MIX*/];
        var translate = frames[frame + -3/*PREV_TRANSLATE_MIX*/];
        var scale = frames[frame + -2/*PREV_SCALE_MIX*/];
        var shear = frames[frame + -1/*PREV_SHEAR_MIX*/];
        constraint.rotateMix += (rotate + (frames[frame + 1/*ROTATE_MIX*/] - rotate) * percent - constraint.rotateMix) * alpha;
        constraint.translateMix += (translate + (frames[frame + 2/*TRANSLATE_MIX*/] - translate) * percent - constraint.translateMix)
            * alpha;
        constraint.scaleMix += (scale + (frames[frame + 3/*SCALE_MIX*/] - scale) * percent - constraint.scaleMix) * alpha;
        constraint.shearMix += (shear + (frames[frame + 4/*SHEAR_MIX*/] - shear) * percent - constraint.shearMix) * alpha;
    }
};
module.exports = spine.TransformConstraintTimeline;


},{"../SpineUtil":44,"./Animation":2,"./Curves":16}],41:[function(require,module,exports){
var spine = require('../SpineUtil');
spine.Animation = require('./Animation');
spine.Curves = require('./Curves');
spine.TranslateTimeline = function (frameCount)
{
    this.curves = new spine.Curves(frameCount);
    this.frames = []; // time, x, y, ...
    this.frames.length = frameCount * 3;
};
spine.TranslateTimeline.prototype = {
    boneIndex: 0,
    getFrameCount: function ()
    {
        return this.frames.length / 3;
    },
    setFrame: function (frameIndex, time, x, y)
    {
        frameIndex *= 3;
        this.frames[frameIndex] = time;
        this.frames[frameIndex + 1] = x;
        this.frames[frameIndex + 2] = y;
    },
    apply: function (skeleton, lastTime, time, firedEvents, alpha)
    {
        var frames = this.frames;
        if (time < frames[0]) return; // Time is before first frame.

        var bone = skeleton.bones[this.boneIndex];

        if (time >= frames[frames.length - 3])
        { // Time is after last frame.
            bone.x += (bone.data.x + frames[frames.length - 2] - bone.x) * alpha;
            bone.y += (bone.data.y + frames[frames.length - 1] - bone.y) * alpha;
            return;
        }

        // Interpolate between the previous frame and the current frame.
        var frameIndex = spine.Animation.binarySearch(frames, time, 3);
        var prevFrameX = frames[frameIndex - 2];
        var prevFrameY = frames[frameIndex - 1];
        var frameTime = frames[frameIndex];
        var percent = 1 - (time - frameTime) / (frames[frameIndex + -3/*PREV_FRAME_TIME*/] - frameTime);
        percent = this.curves.getCurvePercent(frameIndex / 3 - 1, percent);

        bone.x += (bone.data.x + prevFrameX + (frames[frameIndex + 1/*FRAME_X*/] - prevFrameX) * percent - bone.x) * alpha;
        bone.y += (bone.data.y + prevFrameY + (frames[frameIndex + 2/*FRAME_Y*/] - prevFrameY) * percent - bone.y) * alpha;
    }
};
module.exports = spine.TranslateTimeline;


},{"../SpineUtil":44,"./Animation":2,"./Curves":16}],42:[function(require,module,exports){
var spine = require('../SpineUtil') || {};
spine.AttachmentType = require('./AttachmentType');
spine.WeightedMeshAttachment = function (name)
{
    this.name = name;
};
spine.WeightedMeshAttachment.prototype = {
    type: spine.AttachmentType.weightedmesh,
    parentMesh: null,
    inheritFFD: false,
    bones: null,
    weights: null,
    uvs: null,
    regionUVs: null,
    triangles: null,
    hullLength: 0,
    r: 1, g: 1, b: 1, a: 1,
    path: null,
    rendererObject: null,
    edges: null,
    width: 0, height: 0,
    updateUVs: function (u, v, u2, v2, rotate)
    {
        var width = this.regionU2 - this.regionU, height = this.regionV2 - this.regionV;
        var n = this.regionUVs.length;
        if (!this.uvs || this.uvs.length != n)
        {
            this.uvs = new spine.Float32Array(n);
        }
        var region = this.rendererObject;
        if (!region) return;
        var texture = region.texture;
        var r = texture._uvs;
        var w1 = region.width, h1 = region.height, w2 = region.originalWidth, h2 = region.originalHeight;
        var x = region.offsetX, y = region.pixiOffsetY;
        for (var i = 0; i < n; i += 2)
        {
            var u = this.regionUVs[i], v = this.regionUVs[i+1];
            u = (u * w2 - x) / w1;
            v = (v * h2 - y) / h1;
            this.uvs[i] = (r.x0 * (1 - u) + r.x1 * u) * (1-v) + (r.x3 * (1 - u) + r.x2 * u) * v;
            this.uvs[i+1] = (r.y0 * (1 - u) + r.y1 * u) * (1-v) + (r.y3 * (1 - u) + r.y2 * u) * v;
        }
    },
    computeWorldVertices: function (x, y, slot, worldVertices)
    {
        var skeletonBones = slot.bone.skeleton.bones;
        var weights = this.weights;
        var bones = this.bones;

        var w = 0, v = 0, b = 0, f = 0, n = bones.length, nn;
        var wx, wy, vx, vy, weight;
        var m;
        if (!slot.attachmentVertices.length)
        {
            for (; v < n; w += 2)
            {
                wx = 0;
                wy = 0;
                nn = bones[v++] + v;
                for (; v < nn; v++, b += 3)
                {
                    m = skeletonBones[bones[v]].matrix;
                    vx = weights[b];
                    vy = weights[b + 1];
                    weight = weights[b + 2];
                    wx += (vx * m.a + vy * m.c + m.tx) * weight;
                    wy += (vx * m.b + vy * m.d + m.ty) * weight;
                }
                worldVertices[w] = wx + x;
                worldVertices[w + 1] = wy + y;
            }
        } else {
            var ffd = slot.attachmentVertices;
            for (; v < n; w += 2)
            {
                wx = 0;
                wy = 0;
                nn = bones[v++] + v;
                for (; v < nn; v++, b += 3, f += 2)
                {
                    m = skeletonBones[bones[v]].matrix;
                    vx = weights[b] + ffd[f];
                    vy = weights[b + 1] + ffd[f + 1];
                    weight = weights[b + 2];
                    wx += (vx * m.a + vy * m.c + m.tx) * weight;
                    wy += (vx * m.b + vy * m.d + m.ty) * weight;
                }
                worldVertices[w] = wx + x;
                worldVertices[w + 1] = wy + y;
            }
        }
    },
    applyFFD: function(sourceAttachment) {
        return this === sourceAttachment || (this.inheritFFD && parentMesh === sourceAttachment);
    },
    setParentMesh: function(parentMesh) {
        this.parentMesh = parentMesh;
        if (parentMesh != null) {
            this.bones = parentMesh.bones;
            this.weights = parentMesh.weights;
            this.regionUVs = parentMesh.regionUVs;
            this.triangles = parentMesh.triangles;
            this.hullLength = parentMesh.hullLength;
        }
    }
};
module.exports = spine.WeightedMeshAttachment;


},{"../SpineUtil":44,"./AttachmentType":11}],43:[function(require,module,exports){
/******************************************************************************
 * Spine Runtimes Software License
 * Version 2.1
 *
 * Copyright (c) 2013, Esoteric Software
 * All rights reserved.
 *
 * You are granted a perpetual, non-exclusive, non-sublicensable and
 * non-transferable license to install, execute and perform the Spine Runtimes
 * Software (the "Software") solely for internal use. Without the written
 * permission of Esoteric Software (typically granted by licensing Spine), you
 * may not (a) modify, translate, adapt or otherwise create derivative works,
 * improvements of the Software or develop new applications using the Software
 * or (b) remove, delete, alter or obscure any trademarks or any copyright,
 * trademark, patent or other intellectual property or proprietary rights
 * notices on or in the Software, including any copy thereof. Redistributions
 * in binary or source form must include this license and terms.
 *
 * THIS SOFTWARE IS PROVIDED BY ESOTERIC SOFTWARE "AS IS" AND ANY EXPRESS OR
 * IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
 * EVENT SHALL ESOTERIC SOFTARE BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
 * OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *****************************************************************************/
var spine = require('../SpineUtil');
spine.Animation = require('./Animation');
spine.AnimationStateData = require('./AnimationStateData');
spine.AnimationState = require('./AnimationState');
spine.AtlasAttachmentParser = require('./AtlasAttachmentParser');
spine.Atlas = require('./Atlas');
spine.AtlasPage = require('./AtlasPage');
spine.AtlasReader = require('./AtlasReader');
spine.AtlasRegion = require('./AtlasRegion');
spine.AttachmentTimeline = require('./AttachmentTimeline');
spine.AttachmentType = require('./AttachmentType');
spine.BoneData = require('./BoneData');
spine.Bone = require('./Bone');
spine.BoundingBoxAttachment = require('./BoundingBoxAttachment');
spine.ColorTimeline = require('./ColorTimeline');
spine.Curves = require('./Curves');
spine.DrawOrderTimeline = require('./DrawOrderTimeline');
spine.EventData = require('./EventData');
spine.Event = require('./Event');
spine.EventTimeline = require('./EventTimeline');
spine.FfdTimeline = require('./FfdTimeline');
spine.IkConstraintData = require('./IkConstraintData');
spine.IkConstraint = require('./IkConstraint');
spine.IkConstraintTimeline = require('./IkConstraintTimeline');
spine.TransformConstraintData = require('./TransformConstraintData');
spine.TransformConstraint = require('./TransformConstraint');
spine.TransformConstraintTimeline = require('./TransformConstraintTimeline');
spine.MeshAttachment = require('./MeshAttachment');
spine.RegionAttachment = require('./RegionAttachment');
spine.RotateTimeline = require('./RotateTimeline');
spine.ScaleTimeline = require('./ScaleTimeline');
spine.ShearTimeline = require('./ShearTimeline');
spine.SkeletonBounds = require('./SkeletonBounds');
spine.SkeletonData = require('./SkeletonData');
spine.Skeleton = require('./Skeleton');
spine.SkeletonJsonParser = require('./SkeletonJsonParser');
spine.Skin = require('./Skin.js');
spine.WeightedMeshAttachment = require('./WeightedMeshAttachment');
spine.SlotData = require('./SlotData');
spine.Slot = require('./Slot');
spine.TrackEntry = require('./TrackEntry');
spine.TranslateTimeline = require('./TranslateTimeline');
module.exports = spine;

},{"../SpineUtil":44,"./Animation":2,"./AnimationState":3,"./AnimationStateData":4,"./Atlas":5,"./AtlasAttachmentParser":6,"./AtlasPage":7,"./AtlasReader":8,"./AtlasRegion":9,"./AttachmentTimeline":10,"./AttachmentType":11,"./Bone":12,"./BoneData":13,"./BoundingBoxAttachment":14,"./ColorTimeline":15,"./Curves":16,"./DrawOrderTimeline":17,"./Event":18,"./EventData":19,"./EventTimeline":20,"./FfdTimeline":21,"./IkConstraint":22,"./IkConstraintData":23,"./IkConstraintTimeline":24,"./MeshAttachment":25,"./RegionAttachment":26,"./RotateTimeline":27,"./ScaleTimeline":28,"./ShearTimeline":29,"./Skeleton":30,"./SkeletonBounds":31,"./SkeletonData":32,"./SkeletonJsonParser":33,"./Skin.js":34,"./Slot":35,"./SlotData":36,"./TrackEntry":37,"./TransformConstraint":38,"./TransformConstraintData":39,"./TransformConstraintTimeline":40,"./TranslateTimeline":41,"./WeightedMeshAttachment":42}],44:[function(require,module,exports){
module.exports = {
    radDeg: 180 / Math.PI,
    degRad: Math.PI / 180,
    temp: [],
    Float32Array: (typeof(Float32Array) === 'undefined') ? Array : Float32Array,
    Uint16Array: (typeof(Uint16Array) === 'undefined') ? Array : Uint16Array,
    signum: function(x) {
        if (x>0) return 1;
        if (x<0) return -1;
        return 0;
    }
};


},{}],45:[function(require,module,exports){
var spine = require('../SpineRuntime');
var atlasParser = require('../loaders/atlasParser');

/* Esoteric Software SPINE wrapper for pixi.js */
spine.Bone.yDown = true;

/**
 * A class that enables the you to import and run your spine animations in pixi.
 * The Spine animation data needs to be loaded using either the Loader or a SpineLoader before it can be used by this class
 * See example 12 (http://www.goodboydigital.com/pixijs/examples/12/) to see a working example and check out the source
 *
 * ```js
 * var spineAnimation = new PIXI.Spine(spineData);
 * ```
 *
 * @class
 * @extends Container
 * @memberof PIXI.spine
 * @param spineData {object} The spine data loaded from a spine atlas.
 */
function Spine(spineData)
{
    PIXI.Container.call(this);

    if (!spineData)
    {
        throw new Error('The spineData param is required.');
    }

    if ((typeof spineData) === "string")
    {
        throw new Error('spineData param cant be string. Please use PIXI.spine.Spine.fromAtlas("YOUR_RESOURCE_NAME") from now on.');
    }

    /**
     * The spineData object
     *
     * @member {object}
     */
    this.spineData = spineData;

    /**
     * A spine Skeleton object
     *
     * @member {object}
     */
    this.skeleton = new spine.Skeleton(spineData);
    this.skeleton.updateWorldTransform();

    /**
     * A spine AnimationStateData object created from the spine data passed in the constructor
     *
     * @member {object}
     */
    this.stateData = new spine.AnimationStateData(spineData);

    /**
     * A spine AnimationState object created from the spine AnimationStateData object
     *
     * @member {object}
     */
    this.state = new spine.AnimationState(this.stateData);

    /**
     * An array of containers
     *
     * @member {Container[]}
     */
    this.slotContainers = [];

    for (var i = 0, n = this.skeleton.slots.length; i < n; i++)
    {
        var slot = this.skeleton.slots[i];
        var attachment = slot.attachment;
        var slotContainer = new PIXI.Container();
        this.slotContainers.push(slotContainer);
        this.addChild(slotContainer);

        if (attachment instanceof spine.RegionAttachment)
        {
            var spriteName = attachment.rendererObject.name;
            var sprite = this.createSprite(slot, attachment);
            slot.currentSprite = sprite;
            slot.currentSpriteName = spriteName;
            slotContainer.addChild(sprite);
        }
        else if (attachment instanceof spine.MeshAttachment)
        {
            var mesh = this.createMesh(slot, attachment);
            slot.currentMesh = mesh;
            slot.currentMeshName = attachment.name;
            slotContainer.addChild(mesh);
        }
        else
        {
            continue;
        }

    }

    /**
     * Should the Spine object update its transforms
     *
     * @member {boolean}
     */
    this.autoUpdate = true;

    /**
     * The tint applied to all spine slots. This is a [r,g,b] value. A value of [1,1,1] will remove any tint effect.
     *
     * @member {number}
     * @memberof PIXI.spine.Spine#
     */
    this.tintRgb = new Float32Array([1, 1, 1]);
}

Spine.fromAtlas = function(resourceName) {
    var skeletonData = atlasParser.AnimCache[resourceName];

    if (!skeletonData)
    {
        throw new Error('Spine data "' + resourceName + '" does not exist in the animation cache');
    }

    return new Spine(skeletonData);
}

Spine.prototype = Object.create(PIXI.Container.prototype);
Spine.prototype.constructor = Spine;
module.exports = Spine;

Spine.globalAutoUpdate = true;

Object.defineProperties(Spine.prototype, {
    /**
     * If this flag is set to true, the spine animation will be autoupdated every time
     * the object id drawn. The down side of this approach is that the delta time is
     * automatically calculated and you could miss out on cool effects like slow motion,
     * pause, skip ahead and the sorts. Most of these effects can be achieved even with
     * autoupdate enabled but are harder to achieve.
     *
     * @member {boolean}
     * @memberof PIXI.spine.Spine#
     * @default true
     */
    autoUpdate: {
        get: function ()
        {
            return (this.updateTransform === Spine.prototype.autoUpdateTransform);
        },

        set: function (value)
        {
            this.updateTransform = value ? Spine.prototype.autoUpdateTransform : PIXI.Container.prototype.updateTransform;
        }
    },
    /**
     * The tint applied to the spine object. This is a hex value. A value of 0xFFFFFF will remove any tint effect.
     *
     * @member {number}
     * @memberof PIXI.spine.Spine#
     * @default 0xFFFFFF
     */
    tint: {
        get: function() {
            return PIXI.utils.rgb2hex(this.tintRgb);
        },
        set: function(value) {
            this.tintRgb = PIXI.utils.hex2rgb(value, this.tintRgb);
        }
    }
});

var tempRgb = [0, 0, 0];

/**
 * Update the spine skeleton and its animations by delta time (dt)
 *
 * @param dt {number} Delta time. Time by which the animation should be updated
 */
Spine.prototype.update = function (dt)
{
    this.state.update(dt);
    this.state.apply(this.skeleton);
    this.skeleton.updateWorldTransform();

    var drawOrder = this.skeleton.drawOrder;
    var slots = this.skeleton.slots;

    for (var i = 0, n = drawOrder.length; i < n; i++)
    {
        this.children[i] = this.slotContainers[drawOrder[i]];
    }

    var r0 = this.tintRgb[0];
    var g0 = this.tintRgb[1];
    var b0 = this.tintRgb[2];

    for (i = 0, n = slots.length; i < n; i++)
    {
        var slot = slots[i];
        var attachment = slot.attachment;
        var slotContainer = this.slotContainers[i];

        if (!attachment)
        {
            slotContainer.visible = false;
            continue;
        }

        var type = attachment.type;
        if (type === spine.AttachmentType.region)
        {
            if (attachment.rendererObject)
            {
                if (!slot.currentSpriteName || slot.currentSpriteName !== attachment.rendererObject.name)
                {
                    var spriteName = attachment.rendererObject.name;
                    if (slot.currentSprite !== undefined)
                    {
                        slot.currentSprite.visible = false;
                    }
                    slot.sprites = slot.sprites || {};
                    if (slot.sprites[spriteName] !== undefined)
                    {
                        slot.sprites[spriteName].visible = true;
                    }
                    else
                    {
                        var sprite = this.createSprite(slot, attachment);
                        slotContainer.addChild(sprite);
                    }
                    slot.currentSprite = slot.sprites[spriteName];
                    slot.currentSpriteName = spriteName;
                }
            }

            if (slotContainer.transform ) {
                var transform = slotContainer.transform;
                var lt;
                if (slotContainer.transform.matrix2d) {
                    //gameofbombs pixi fork
                    lt = transform.matrix2d;
                    transform._dirtyVersion++;
                    transform.version = transform._dirtyVersion;
                    transform.isStatic = true;
                    transform.operMode = 0;
                } else
                if (PIXI.TransformManual) {
                    //PIXI v4.0
                    if (transform.position) {
                        transform = new PIXI.TransformManual();
                        slotContainer.transform = transform;
                    }
                    lt = transform.localTransform;
                } else {
                    //PIXI v4.0rc
                    if (!transform._dirtyLocal) {
                        transform = new PIXI.TransformStatic();
                        slotContainer.transform = transform;
                    }
                    lt = transform.localTransform;
                    transform._dirtyParentVersion = -1;
                    transform._dirtyLocal = 1;
                    transform._versionLocal = 1;
                }
                slot.bone.matrix.copy(lt);
                lt.tx += slot.bone.skeleton.x;
                lt.ty += slot.bone.skeleton.y;
            } else {
                //PIXI v3
                var lt = slotContainer.localTransform || new PIXI.Matrix();
                slot.bone.matrix.copy(lt);
                lt.tx += slot.bone.skeleton.x;
                lt.ty += slot.bone.skeleton.y;
                slotContainer.localTransform = lt;
                slotContainer.displayObjectUpdateTransform = SlotContainerUpdateTransformV3;
            }
            tempRgb[0] = r0 * slot.r * attachment.r;
            tempRgb[1] = g0 * slot.g * attachment.g;
            tempRgb[2] = b0 * slot.b * attachment.b;
            slot.currentSprite.tint = PIXI.utils.rgb2hex(tempRgb);
            slot.currentSprite.blendMode = slot.blendMode;
        }
        else if (type === spine.AttachmentType.skinnedmesh || type === spine.AttachmentType.mesh || type === spine.AttachmentType.linkedmesh)
        {
            if (!slot.currentMeshName || slot.currentMeshName !== attachment.name)
            {
                var meshName = attachment.name;
                if (slot.currentMesh !== undefined)
                {
                    slot.currentMesh.visible = false;
                }

                slot.meshes = slot.meshes || {};

                if (slot.meshes[meshName] !== undefined)
                {
                    slot.meshes[meshName].visible = true;
                }
                else
                {
                    var mesh = this.createMesh(slot, attachment);
                    slotContainer.addChild(mesh);
                }

                slot.currentMesh = slot.meshes[meshName];
                slot.currentMeshName = meshName;
            }
            attachment.computeWorldVertices(slot.bone.skeleton.x, slot.bone.skeleton.y, slot, slot.currentMesh.vertices);
            if (PIXI.VERSION[0] !== '3') {
                // PIXI version 4
                slot.currentMesh.dirty = true;
                //only for PIXI v4
                var tintRgb = slot.currentMesh.tintRgb;
                tintRgb[0] = r0 * slot.r * attachment.r;
                tintRgb[1] = g0 * slot.g * attachment.g;
                tintRgb[2] = b0 * slot.b * attachment.b;
            }
            slot.currentMesh.blendMode = slot.blendMode;
        }
        else
        {
            slotContainer.visible = false;
            continue;
        }
        slotContainer.visible = true;

        slotContainer.alpha = slot.a;
    }
};

/**
 * When autoupdate is set to yes this function is used as pixi's updateTransform function
 *
 * @private
 */
Spine.prototype.autoUpdateTransform = function ()
{
    if (Spine.globalAutoUpdate) {
        this.lastTime = this.lastTime || Date.now();
        var timeDelta = (Date.now() - this.lastTime) * 0.001;
        this.lastTime = Date.now();
        this.update(timeDelta);
    } else {
        this.lastTime = 0;
    }

    PIXI.Container.prototype.updateTransform.call(this);
};

/**
 * Create a new sprite to be used with spine.RegionAttachment
 *
 * @param slot {spine.Slot} The slot to which the attachment is parented
 * @param attachment {spine.RegionAttachment} The attachment that the sprite will represent
 * @private
 */
Spine.prototype.createSprite = function (slot, attachment)
{
    var descriptor = attachment.rendererObject;
    var texture = descriptor.texture;
    var sprite = new PIXI.Sprite(texture);
    sprite.scale.x = attachment.scaleX * attachment.width / descriptor.originalWidth;
    sprite.scale.y = - attachment.scaleY * attachment.height / descriptor.originalHeight;
    sprite.rotation = attachment.rotation * spine.degRad;
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    sprite.position.x = attachment.x;
    sprite.position.y = attachment.y;
    sprite.alpha = attachment.a;

    slot.sprites = slot.sprites || {};
    slot.sprites[descriptor.name] = sprite;
    return sprite;
};

/**
 * Creates a Strip from the spine data
 * @param slot {spine.Slot} The slot to which the attachment is parented
 * @param attachment {spine.RegionAttachment} The attachment that the sprite will represent
 * @private
 */
Spine.prototype.createMesh = function (slot, attachment)
{
    var descriptor = attachment.rendererObject;
    var baseTexture = descriptor.page.rendererObject;
    var texture = new PIXI.Texture(baseTexture);

    var strip = new PIXI.mesh.Mesh(
        texture,
        new Float32Array(attachment.uvs.length),
        new Float32Array(attachment.uvs),
        new Uint16Array(attachment.triangles),
        PIXI.mesh.Mesh.DRAW_MODES.TRIANGLES);

    strip.canvasPadding = 1.5;

    strip.alpha = attachment.a;

    slot.meshes = slot.meshes || {};
    slot.meshes[attachment.name] = strip;

    return strip;
};

/**
 * Changes texture in attachment in specific slot.
 *
 * PIXI runtime feature, it was made to satisfy our users.
 *
 * @param slotName {string}
 * @param [texture = null] {PIXI.Texture} If null, take default (original) texture
 * @param [size = null] {PIXI.Point} sometimes we need new size for region attachment, you can pass 'texture.orig' there
 * @returns {boolean} Success flag
 */
Spine.prototype.hackTextureBySlotIndex = function(slotIndex, texture, size) {
    var slot = this.skeleton.slots[slotIndex];
    if (!slot) {
        return false;
    }
    var attachment = slot.attachment;
    if (!attachment || !attachment.hackRegion) {
        return false;
    }
    var region = null;
    if (texture) {
        region = new spine.AtlasRegion();
        region.texture = texture;
        region.size = size;
    }

    attachment.hackRegion(region);
    var descriptor = attachment.rendererObject;
    if (slot.currentSprite) {
        var sprite = slot.currentSprite;
        sprite.texture = descriptor.texture;
        sprite.scale.x = attachment.width / descriptor.originalWidth;
        sprite.scale.y = - attachment.height / descriptor.originalHeight;
    }
    if (slot.currentMesh) {
        var mesh = slot.currentMesh;
        mesh.texture = descriptor.texture;
        for (var i = 0; i < attachment.uvs.length; i++) {
            mesh.uvs[i] = attachment.uvs[i];
        }
        if (PIXI.VERSION[0] !== '3') {
            // PIXI version 4
            mesh.indexDirty = true;
        } else {
            // PIXI version 3
            mesh.dirty = true;
        }
    }
    return true;
};

/**
 * Changes texture in attachment in specific slot.
 *
 * PIXI runtime feature, it was made to satisfy our users.
 *
 * @param slotName {string}
 * @param [texture = null] {PIXI.Texture} If null, take default (original) texture
 * @param [size = null] {PIXI.Point} sometimes we need new size for region attachment, you can pass 'texture.orig' there
 * @returns {boolean} Success flag
 */
Spine.prototype.hackTextureBySlotName = function(slotName, texture, size) {
    var index = this.skeleton.findSlotIndex(slotName);
    if (index == -1) {
        return false;
    }
    return this.hackTextureBySlotIndex(index,texture, size);
};

function SlotContainerUpdateTransformV3()
{
    var pt = this.parent.worldTransform;
    var wt = this.worldTransform;
    var lt = this.localTransform;
    wt.a  = lt.a  * pt.a + lt.b  * pt.c;
    wt.b  = lt.a  * pt.b + lt.b  * pt.d;
    wt.c  = lt.c  * pt.a + lt.d  * pt.c;
    wt.d  = lt.c  * pt.b + lt.d  * pt.d;
    wt.tx = lt.tx * pt.a + lt.ty * pt.c + pt.tx;
    wt.ty = lt.tx * pt.b + lt.ty * pt.d + pt.ty;
    this.worldAlpha = this.alpha * this.parent.worldAlpha;
    this._currentBounds = null;
};

},{"../SpineRuntime":43,"../loaders/atlasParser":47}],46:[function(require,module,exports){
/**
 * @file        Spine resource loader
 * @author      Ivan Popelyshev <ivan.popelyshev@gmail.com>
 * @copyright   2013-2015 GoodBoyDigital
 * @license     {@link https://github.com/GoodBoyDigital/pixi.js/blob/master/LICENSE|MIT License}
 */

/**
 * @namespace PIXI.loaders
 */

var atlasParser = require('./atlasParser');

PIXI.loaders.Loader.addPixiMiddleware(atlasParser);
PIXI.loader.use(atlasParser());

},{"./atlasParser":47}],47:[function(require,module,exports){
var Resource = PIXI.loaders.Resource,
    spine = require('../SpineRuntime'),
    imageLoaderAdapter = require('./imageLoaderAdapter');

var atlasParser = module.exports = function () {
    return function (resource, next) {
        // skip if no data, its not json, or it isn't atlas data
        if (!resource.data || !resource.isJson || !resource.data.bones) {
            return next();
        }

        var metadataAtlas = resource.metadata ? resource.metadata.spineAtlas: null;
        if (metadataAtlas === false) {
            return next();
        }
        if (metadataAtlas && metadataAtlas.pages) {
            //its an atlas!
            var spineJsonParser = new spine.SkeletonJsonParser(new spine.AtlasAttachmentParser(metadataAtlas));
            var skeletonData = spineJsonParser.readSkeletonData(resource.data);

            resource.spineData = skeletonData;
            resource.spineAtlas = metadataAtlas;
            if (atlasParser.enableCaching) {
                atlasParser.AnimCache[resource.name] = resource.spineData;
            }

            return next();
        }

        var metadataAtlasSuffix = '.atlas';
        if (resource.metadata && resource.metadata.spineAtlasSuffix) {
            metadataAtlasSuffix = resource.metadata.spineAtlasSuffix;
        }

        /**
         * use a bit of hackery to load the atlas file, here we assume that the .json, .atlas and .png files
         * that correspond to the spine file are in the same base URL and that the .json and .atlas files
         * have the same name
         */
        var atlasPath = resource.url.substr(0, resource.url.lastIndexOf('.')) + metadataAtlasSuffix;
        //remove the baseUrl
        atlasPath = atlasPath.replace(this.baseUrl, '');

        var atlasOptions = {
            crossOrigin: resource.crossOrigin,
            xhrType: Resource.XHR_RESPONSE_TYPE.TEXT,
            metadata: resource.metadata ? resource.metadata.spineMetadata : null
        };
        var imageOptions = {
            crossOrigin: resource.crossOrigin,
            metadata: resource.metadata ? resource.metadata.imageMetadata: null
        };
        var baseUrl = resource.url.substr(0, resource.url.lastIndexOf('/') + 1);
        //remove the baseUrl
        baseUrl = baseUrl.replace(this.baseUrl, '');

        var adapter = imageLoaderAdapter(this, resource.name + '_atlas_page_', baseUrl, imageOptions);

        this.add(resource.name + '_atlas', atlasPath, atlasOptions, function (res) {
            new spine.Atlas(this.xhr.responseText, adapter, function(spineAtlas) {
                var spineJsonParser = new spine.SkeletonJsonParser(new spine.AtlasAttachmentParser(spineAtlas));
                var skeletonData = spineJsonParser.readSkeletonData(resource.data);

                resource.spineData = skeletonData;
                resource.spineAtlas = spineAtlas;
                if (atlasParser.enableCaching) {
                    atlasParser.AnimCache[resource.name] = resource.spineData;
                }

                next();
            });
        });
    };
};

atlasParser.AnimCache = {};
atlasParser.enableCaching = false;

},{"../SpineRuntime":43,"./imageLoaderAdapter":48}],48:[function(require,module,exports){
var spine = require('../SpineRuntime');

module.exports = function (loader, namePrefix, baseUrl, imageOptions) {
    if (baseUrl && baseUrl.lastIndexOf('/') !== (baseUrl.length-1))
    {
        baseUrl += '/';
    }
    return function(line, callback) {
        var name = namePrefix + line;
        var url = baseUrl + line;
        loader.add(name, url, imageOptions, function(resource) {
            callback(resource.texture.baseTexture);
        });
    }
};

},{"../SpineRuntime":43}],49:[function(require,module,exports){
module.exports = {
    atlasParser: require('./atlasParser'),
    Loader: require('./Loader'),
    syncImageLoaderAdapter: require('./syncImageLoaderAdapter'),
    imageLoaderAdapter: require('./imageLoaderAdapter')
};

},{"./Loader":46,"./atlasParser":47,"./imageLoaderAdapter":48,"./syncImageLoaderAdapter":50}],50:[function(require,module,exports){
var spine = require('../SpineRuntime');

module.exports = function (baseUrl, crossOrigin) {
    if (baseUrl && baseUrl.lastIndexOf('/') !== (baseUrl.length-1))
    {
        baseUrl += '/';
    }
    return function(line, callback) {
        callback(PIXI.BaseTexture.fromImage(line, crossOrigin));
    }
};

},{"../SpineRuntime":43}]},{},[1])


//# sourceMappingURL=pixi-spine.js.map
