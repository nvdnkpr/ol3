goog.provide('ol.bounds');

goog.require('ol.Bounds');
goog.require('ol.projection');


/**
 * @typedef {ol.Bounds|Array.<number>|Object} bounds Location.
 */
ol.LocLike;



/**
 * @export
 * @param {ol.LocLike} opt_arg Location.
 * @return {ol.Bounds} Location.
 */
ol.bounds = function(opt_arg){

    if (opt_arg instanceof ol.Bounds) {
        return opt_arg;
    }

    var minX = 0;
    var minY = 0;
    var maxX = 0;
    var maxY = 0;
    var projection;

    var x = 0;
    var y = 0;
    var z;

    if (goog.isArray(opt_arg)) {
        minX = opt_arg[0];
        minY = opt_arg[1];
        maxX = opt_arg[2];
        maxY = opt_arg[3];
    } else if (goog.isObject(opt_arg)) {
        ol.base.checkKeys(opt_arg, ['minX', 'minY', 'maxX', 'maxY', 'projection']);
        minX = ol.API ? opt_arg['minX'] : opt_arg.minX;
        minY = ol.API ? opt_arg['minY'] : opt_arg.minY;
        maxX = ol.API ? opt_arg['maxX'] : opt_arg.maxX;
        maxY = ol.API ? opt_arg['maxY'] : opt_arg.maxY;
        projection = ol.projection(ol.API ? opt_arg['projection'] : opt_arg.projection);
    }
    else {
        throw new Error('ol.bounds');
    }

    var bounds = new ol.Bounds(minX, minY, maxX, maxY, projection);
    return bounds;

};


/**
 * @export
 * @param {ol.Projection=} opt_arg Projection.
 * @return {ol.Bounds|ol.Projection|undefined} Result.
 */
ol.Bounds.prototype.projection = function(opt_arg){
    if (arguments.length == 1 && goog.isDef(opt_arg)) {
        this.setProjection(opt_arg);
        return this;
    }
    else {
        return this.getProjection();
    }
};


/**
 * @export
 * @param {number=} opt_arg Minimum X.
 * @return {!ol.Bounds|number} Result.
 */
ol.Bounds.prototype.minX = function(opt_arg){
    if (arguments.length == 1 && goog.isDef(opt_arg)) {
        this.setMinX(opt_arg);
        return this;
    }
    else {
        return this.getMinX();
    }
};


/**
 * @export
 * @param {number=} opt_arg Minimum Y.
 * @return {ol.Bounds|number} Result.
 */
ol.Bounds.prototype.minY = function(opt_arg){
    if (arguments.length == 1 && goog.isDef(opt_arg)) {
        this.setMinY(opt_arg);
        return this;
    }
    else {
        return this.getMinY();
    }
};


/**
 * @export
 * @param {number=} opt_arg Maximum X.
 * @return {ol.Bounds|number} Result.
 */
ol.Bounds.prototype.maxX = function(opt_arg){
    if (arguments.length == 1 && goog.isDef(opt_arg)) {
        this.setMaxX(opt_arg);
        return this;
    }
    else {
        return this.getMaxX();
    }
};


/**
 * @export
 * @param {number=} opt_arg Maximum Y.
 * @return {ol.Bounds|number} Result.
 */
ol.Bounds.prototype.maxY = function(opt_arg){
    if (arguments.length == 1 && goog.isDef(opt_arg)) {
        this.setMaxY(opt_arg);
        return this;
    }
    else {
        return this.getMaxY();
    }
};

/**
 * Transform this node into another coordinate reference system.  Returns a new
 * bounds instead of modifying this bounds.
 *
 * @param {ol.Projection|string} proj Target projection (or string identifier).
 * @return {ol.Bounds} A new bounds in the target projection.
 */
ol.Bounds.prototype.transform = function(proj) {
    if (goog.isString(proj)) {
        proj = new ol.Projection(proj);
    }
    return this.doTransform(proj);
};
