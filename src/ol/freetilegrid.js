goog.provide('ol.FreeTileGrid');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.math.Size');
goog.require('ol.Extent');
goog.require('ol.TileBounds');
goog.require('ol.TileCoord');
goog.require('ol.TileGrid');



/**
 * @constructor
 * @extends {ol.TileGrid}
 * @param {!Array.<number>} resolutions Resolutions.
 * @param {ol.Extent} extent Extent.
 * @param {goog.math.Coordinate|!Array.<goog.math.Coordinate>} origin Origin.
 * @param {boolean=} opt_xEast Tile coordinates increase eastwards.
 * @param {boolean=} opt_ySouth Tile coordinates increas southwards.
 * @param {goog.math.Size=} opt_tileSize Tile size.
 */
ol.FreeTileGrid =
    function(resolutions, extent, origin, opt_xEast, opt_ySouth, opt_tileSize) {

  goog.base(this, resolutions, extent, opt_tileSize);

  /**
   * @private
   * @type {boolean}
   */
  this.xEast_ = goog.isDef(opt_xEast) ? opt_xEast : true;

  /**
   * @private
   * @type {boolean}
   */
  this.ySouth_ = goog.isDef(opt_ySouth) ? opt_ySouth : true;

  /**
   * @private
   * @type {goog.math.Coordinate}
   */
  this.origin_ = null;

  /**
   * @private
   * @type {Array.<goog.math.Coordinate>}
   */
  this.origins_ = null;

  if (origin instanceof goog.math.Coordinate) {
    this.origin_ = origin;
  } else if (goog.isArray(origin)) {
    goog.asserts.assert(origin.length == resolutions.length);
    this.origins_ = origin;
  } else {
    goog.asserts.assert(false);
  }

};
goog.inherits(ol.FreeTileGrid, ol.TileGrid);


/**
 * @inheritDoc
 */
ol.FreeTileGrid.prototype.forEachTileCoordParent =
    function(tileCoord, callback) {
  var tileCoordExtent = this.getTileCoordExtent(tileCoord);
  var z = tileCoord.z - 1;
  while (z >= 0) {
    if (callback(z, this.getExtentTileBounds(z, tileCoordExtent))) {
      return;
    }
    --z;
  }
};


/**
 * @inheritDoc
 */
ol.FreeTileGrid.prototype.getOrigin = function(z) {
  if (!goog.isNull(this.origin_)) {
    return this.origin_;
  } else {
    goog.asserts.assert(!goog.isNull(this.origins_));
    goog.asserts.assert(0 <= z && z < this.origins_.length);
    return this.origins_[z];
  }
};


/**
 * @inheritDoc
 */
ol.FreeTileGrid.prototype.getTileCoord = function(z, coordinate) {
  var origin = this.getOrigin(z);
  var resolution = this.getResolution(z);
  var tileSize = this.getTileSize();
  var x;
  if (this.xEast_) {
    x = Math.floor((coordinate.x - origin.x) / (tileSize.width * resolution));
  } else {
    x = Math.floor((origin.x - coordinate.x) / (tileSize.width * resolution));
  }
  var y;
  if (this.ySouth_) {
    y = Math.floor((origin.y - coordinate.y) / (tileSize.height * resolution));
  } else {
    y = Math.floor((coordinate.y - origin.y) / (tileSize.height * resolution));
  }
  return new ol.TileCoord(z, x, y);
};


/**
 * @inheritDoc
 */
ol.FreeTileGrid.prototype.getTileCoordCenter = function(tileCoord) {
  var origin = this.getOrigin(tileCoord.z);
  var resolution = this.getResolution(tileCoord.z);
  var tileSize = this.getTileSize();
  var x;
  if (this.xEast_) {
    x = origin.x + (tileCoord.x + 0.5) * tileSize.width * resolution;
  } else {
    x = origin.x - (tileCoord.x + 0.5) * tileSize.width * resolution;
  }
  var y;
  if (this.ySouth_) {
    y = origin.y - (tileCoord.y + 0.5) * tileSize.height * resolution;
  } else {
    y = origin.y + (tileCoord.y + 0.5) * tileSize.height * resolution;
  }
  return new goog.math.Coordinate(x, y);
};


/**
 * @inheritDoc
 */
ol.FreeTileGrid.prototype.getTileCoordExtent = function(tileCoord) {
  var origin = this.getOrigin(tileCoord.z);
  var resolution = this.getResolution(tileCoord.z);
  var tileSize = this.getTileSize();
  var left, right;
  if (this.xEast_) {
    left = origin.x + tileCoord.x * tileSize.width * resolution;
    right = left + tileSize.width * resolution;
  } else {
    right = origin.x - tileCoord.x * tileSize.width * resolution;
    left = right - tileSize.height * resolution;
  }
  var top, bottom;
  if (this.ySouth_) {
    top = origin.y - tileCoord.y * tileSize.height * resolution;
    bottom = top - tileSize.height * resolution;
  } else {
    bottom = origin.y + tileCoord.y * tileSize.height * resolution;
    top = bottom + tileSize.height * resolution;
  }
  return new ol.Extent(top, right, bottom, left);
};


/**
 * @return {boolean} X East.
 */
ol.FreeTileGrid.prototype.getXEast = function() {
  return this.xEast_;
};


/**
 * @return {boolean} Y South.
 */
ol.FreeTileGrid.prototype.getYSouth = function() {
  return this.ySouth_;
};


/**
 * @param {number} resolution Resolution.
 * @return {number} Z.
 */
ol.FreeTileGrid.prototype.getZForResolution = function(resolution) {
  var resolutions = this.getResolutions();
  var z;
  for (z = 0; z < resolutions.length; ++z) {
    if (resolutions[z] == resolution) {
      return z;
    } else if (resolutions[z] < resolution) {
      if (z === 0) {
        return z;
      } else if (resolution - resolutions[z] <=
          resolutions[z - 1] - resolution) {
        return z;
      } else {
        return z - 1;
      }
    }
  }
  return resolutions.length - 1;
};
