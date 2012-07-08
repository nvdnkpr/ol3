goog.provide('ol.TileGrid');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.math.Size');
goog.require('ol.Extent');
goog.require('ol.TileBounds');
goog.require('ol.TileCoord');



/**
 * @constructor
 * @param {!Array.<number>} resolutions Resolutions.
 * @param {ol.Extent} extent Extent.
 * @param {goog.math.Size=} opt_tileSize Tile size.
 */
ol.TileGrid =
    function(resolutions, extent, opt_tileSize) {

  /**
   * @private
   * @type {Array.<number>}
   */
  this.resolutions_ = resolutions;
  goog.asserts.assert(goog.array.isSorted(resolutions, function(a, b) {
    return -goog.array.defaultCompare(a, b);
  }, true));

  /**
   * @private
   * @type {ol.Extent}
   */
  this.extent_ = extent;

  /**
   * @private
   * @type {goog.math.Size}
   */
  this.tileSize_ = goog.isDef(opt_tileSize) ?
      opt_tileSize : new goog.math.Size(256, 256);

};


/**
 * @param {ol.TileCoord} tileCoord Tile coordinate.
 * @param {function(number, ol.TileBounds): boolean} callback Callback.
 */
ol.TileGrid.prototype.forEachTileCoordParent = goog.abstractMethod;


/**
 * @return {ol.Extent} Extent.
 */
ol.TileGrid.prototype.getExtent = function() {
  return this.extent_;
};


/**
 * @param {number} z Z.
 * @param {ol.Extent} extent Extent.
 * @return {ol.TileBounds} Tile bounds.
 */
ol.TileGrid.prototype.getExtentTileBounds = function(z, extent) {
  var topRight = new goog.math.Coordinate(extent.right, extent.top);
  var bottomLeft = new goog.math.Coordinate(extent.left, extent.bottom);
  return ol.TileBounds.boundingTileBounds(
      this.getTileCoord(z, topRight),
      this.getTileCoord(z, bottomLeft));
};


/**
 * @return {number} Maximum resolution.
 */
ol.TileGrid.prototype.getMaxResolution = function() {
  return this.getResolutions()[0];
};


/**
 * @param {number} z Z.
 * @return {goog.math.Coordinate} Origin.
 */
ol.TileGrid.prototype.getOrigin = goog.abstractMethod;


/**
 * @param {number} z Z.
 * @return {number} Resolution.
 */
ol.TileGrid.prototype.getResolution = function(z) {
  goog.asserts.assert(0 <= z && z < this.resolutions_.length);
  return this.resolutions_[z];
};


/**
 * @return {Array.<number>} Resolutions.
 */
ol.TileGrid.prototype.getResolutions = function() {
  return this.resolutions_;
};


/**
 * @param {number} z Z.
 * @param {goog.math.Coordinate} coordinate Coordinate.
 * @return {ol.TileCoord} Tile coordinate.
 */
ol.TileGrid.prototype.getTileCoord = goog.abstractMethod;


/**
 * @param {ol.TileCoord} tileCoord Tile coordinate.
 * @return {goog.math.Coordinate} Tile center.
 */
ol.TileGrid.prototype.getTileCoordCenter = goog.abstractMethod;


/**
 * @param {ol.TileCoord} tileCoord Tile coordinate.
 * @return {ol.Extent} Extent.
 */
ol.TileGrid.prototype.getTileCoordExtent = goog.abstractMethod;


/**
 * @param {ol.TileCoord} tileCoord Tile coordinate.
 * @return {number} Tile resolution.
 */
ol.TileGrid.prototype.getTileCoordResolution = goog.abstractMethod;


/**
 * @return {goog.math.Size} Tile size.
 */
ol.TileGrid.prototype.getTileSize = function() {
  return this.tileSize_;
};


/**
 * @param {number} resolution Resolution.
 * @return {number} Z.
 */
ol.TileGrid.prototype.getZForResolution = goog.abstractMethod;
