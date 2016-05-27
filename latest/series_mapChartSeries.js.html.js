tui.util.defineNamespace("fedoc.content", {});
fedoc.content["series_mapChartSeries.js.html"] = "      <div id=\"main\" class=\"main\">\n\n\n\n    \n    <section>\n        <article>\n            <pre class=\"prettyprint source linenums\"><code>/**\n * @fileoverview Map chart series component.\n * @author NHN Ent.\n *         FE Development Team &lt;dl_javascript@nhnent.com>\n */\n\n'use strict';\n\nvar Series = require('./series');\nvar dom = require('../helpers/domHandler');\nvar predicate = require('../helpers/predicate');\nvar renderUtil = require('../helpers/renderUtil');\n\nvar MapChartSeries = tui.util.defineClass(Series, /** @lends MapChartSeries.prototype */ {\n    /**\n     * Map chart series component.\n     * @constructs MapChartSeries\n     * @extends Series\n     * @param {object} params parameters\n     *      @param {object} params.options series options\n     *      @param {object} params.theme series theme\n     *      @param {MapChartDataProcessor} params.dataProcessor data processor for map chart\n     */\n    init: function(params) {\n        /**\n         * Base position.\n         * @type {{left: number, top: number}}\n         */\n        this.basePosition = {\n            left: 0,\n            top: 0\n        };\n\n        /**\n         * Zoom magnification.\n         * @type {number}\n         */\n        this.zoomMagn = 1;\n\n        /**\n         * Map ratio.\n         * @type {number}\n         */\n        this.mapRatio = 1;\n\n        /**\n         * Graph dimension.\n         * @type {{}}\n         */\n        this.graphDimension = {};\n\n        /**\n         * Limit position.\n         * @type {{}}\n         */\n        this.limitPosition = {};\n\n        /**\n         * Map model.\n         * @type {MapChartMapModel}\n         */\n        this.mapModel = null;\n\n        /**\n         * Previous mouse position.\n         * @type {?{left: number, top: number}}\n         */\n        this.prevPosition = null;\n\n\n        /**\n         * Previous moved index.\n         * @type {?number}\n         */\n        this.prevMovedIndex = null;\n\n        /**\n         * Whether drag or not.\n         * @type {boolean}\n         */\n        this.isDrag = false;\n\n        /**\n         * Start position.\n         * @type {?{left: number, top: number}}\n         */\n        this.startPosition = null;\n\n        Series.call(this, params);\n    },\n\n    /**\n     * Set map ratio.\n     * @private\n     */\n    _setMapRatio: function() {\n        var seriesDimension = this.boundsMaker.getDimension('series'),\n            mapDimension = this.mapModel.getMapDimension(),\n            widthRatio = seriesDimension.width / mapDimension.width,\n            heightRatio = seriesDimension.height / mapDimension.height;\n\n        this.mapRatio = Math.min(widthRatio, heightRatio);\n    },\n\n    /**\n     * Set graph dimension.\n     * @private\n     */\n    _setGraphDimension: function() {\n        var seriesDimension = this.boundsMaker.getDimension('series');\n\n        this.graphDimension = {\n            width: seriesDimension.width * this.zoomMagn,\n            height: seriesDimension.height * this.zoomMagn\n        };\n    },\n\n    /**\n     * Render series component.\n     * @param {object} data data for rendering\n     * @returns {HTMLElement} series element\n     */\n    render: function(data) {\n        var container;\n\n        this.mapModel = data.mapModel;\n        this._setMapRatio();\n\n        container = Series.prototype.render.call(this, data);\n        return container;\n    },\n\n    /**\n     * Set limit position to move map.\n     * @private\n     */\n    _setLimitPositionToMoveMap: function() {\n        var seriesDimension = this.boundsMaker.getDimension('series'),\n            graphDimension = this.graphDimension;\n\n        this.limitPosition = {\n            left: seriesDimension.width - graphDimension.width,\n            top: seriesDimension.height - graphDimension.height\n        };\n    },\n\n    /**\n     * Render raphael graph.\n     * @param {{width: number, height: number}} dimension dimension\n     * @private\n     * @override\n     */\n    _renderGraph: function() {\n        if (!this.graphContainer) {\n            this.graphContainer = dom.create('DIV', 'tui-chart-series-graph-area');\n            this.seriesContainer.appendChild(this.graphContainer);\n        }\n\n        this._setGraphDimension();\n        renderUtil.renderDimension(this.graphContainer, this.graphDimension);\n\n        this._setLimitPositionToMoveMap();\n\n        this.graphRenderer.render(this.graphContainer, {\n            colorModel: this.data.colorModel,\n            mapModel: this.mapModel,\n            dimension: this.graphDimension,\n            theme: this.theme\n        });\n    },\n\n    /**\n     * Render series label.\n     * @param {HTMLElement} seriesLabelContainer series label area element\n     * @private\n     */\n    _renderSeriesLabel: function(seriesLabelContainer) {\n        var self = this,\n            htmls = tui.util.map(this.mapModel.getLabelData(this.zoomMagn * this.mapRatio), function(datum, index) {\n                var label = datum.name || datum.code,\n                    left = datum.labelPosition.left - (renderUtil.getRenderedLabelWidth(label, self.theme.label) / 2),\n                    top = datum.labelPosition.top - (renderUtil.getRenderedLabelHeight(label, self.theme.label) / 2);\n\n                return self._makeSeriesLabelHtml({\n                    left: left,\n                    top: top\n                }, datum.name, index);\n            });\n        seriesLabelContainer.innerHTML = htmls.join('');\n    },\n\n    /**\n     * Render series area.\n     * @param {HTMLElement} seriesContainer series area element\n     * @param {object} data data for rendering\n     * @param {function} funcRenderGraph function for graph rendering\n     * @private\n     */\n    _renderSeriesArea: function(seriesContainer, data, funcRenderGraph) {\n        Series.prototype._renderSeriesArea.call(this, seriesContainer, data, funcRenderGraph);\n\n        if (predicate.isShowLabel(this.options) &amp;&amp; !this.seriesLabelContainer) {\n            this.graphContainer.appendChild(this.seriesLabelContainer);\n        }\n    },\n\n    /**\n     * Adjust map position.\n     * @param {{left: number, top: number}} targetPosition target position\n     * @returns {{left: number, top: number}} adjusted position\n     * @private\n     */\n    _adjustMapPosition: function(targetPosition) {\n        return {\n            left: Math.max(Math.min(targetPosition.left, 0), this.limitPosition.left),\n            top: Math.max(Math.min(targetPosition.top, 0), this.limitPosition.top)\n        };\n    },\n\n    /**\n     * Update base position for zoom.\n     * @param {{width: number, height: number}} prevDimension previous dimension\n     * @param {{left: number, top: number}} prevLimitPosition previous limit position\n     * @param {number} changedRatio changed ratio\n     * @private\n     */\n    _updateBasePositionForZoom: function(prevDimension, prevLimitPosition, changedRatio) {\n        var prevBasePosition = this.basePosition,\n            prevLeft = prevBasePosition.left - (prevLimitPosition.left / 2),\n            prevTop = prevBasePosition.top - (prevLimitPosition.top / 2),\n            newBasePosition = {\n                left: (prevLeft * changedRatio) + (this.limitPosition.left / 2),\n                top: (prevTop * changedRatio) + (this.limitPosition.top / 2)\n            };\n\n        this.basePosition = this._adjustMapPosition(newBasePosition);\n    },\n\n    /**\n     * Zoom.\n     * @param {number} changedRatio changed ratio\n     * @private\n     */\n    _zoom: function(changedRatio) {\n        var prevDimension = this.graphDimension,\n            prevLimitPosition = this.limitPosition;\n\n        this._setGraphDimension();\n        renderUtil.renderDimension(this.graphContainer, this.graphDimension);\n        this.graphRenderer.setSize(this.graphDimension);\n\n        this._setLimitPositionToMoveMap();\n        this._updateBasePositionForZoom(prevDimension, prevLimitPosition, changedRatio);\n        renderUtil.renderPosition(this.graphContainer, this.basePosition);\n\n        if (this.seriesLabelContainer) {\n            this._renderSeriesLabel(this.seriesLabelContainer);\n        }\n    },\n\n    /**\n     * Update positions to resize.\n     * @param {number} prevMapRatio previous ratio\n     * @private\n     */\n    _updatePositionsToResize: function(prevMapRatio) {\n        var changedRatio = this.mapRatio / prevMapRatio;\n\n        this.basePosition.left *= changedRatio;\n        this.basePosition.top *= changedRatio;\n\n        this.limitPosition.left *= changedRatio;\n        this.limitPosition.top *= changedRatio;\n    },\n\n    /**\n     * Resize graph.\n     * @private\n     */\n    _resizeGraph: function() {\n        var prevRatio = this.mapRatio;\n\n        this._setMapRatio();\n\n        this._setGraphDimension();\n        renderUtil.renderDimension(this.graphContainer, this.graphDimension);\n        this.graphRenderer.setSize(this.graphDimension);\n\n        this._updatePositionsForResizing(prevRatio);\n        renderUtil.renderPosition(this.graphContainer, this.basePosition);\n\n        if (this.seriesLabelContainer) {\n            this._renderSeriesLabel(this.seriesLabelContainer);\n        }\n    },\n\n    /**\n     * On click series.\n     */\n    onClickSeries: function() {},\n\n    /**\n     * Whether changed or not.\n     * @param {?{left: number, top: number}} prevPosition previous position\n     * @param {{left: number, top: number}} position position\n     * @returns {boolean} result boolean\n     * @private\n     */\n    _isChangedPosition: function(prevPosition, position) {\n        return !prevPosition || prevPosition.left !== position.left || prevPosition.top !== position.top;\n    },\n\n    /**\n     * Show wedge.\n     * @param {number} index map data index\n     * @private\n     */\n    _showWedge: function(index) {\n        var datum = this.mapModel.getDatum(index);\n\n        if (!tui.util.isUndefined(datum.ratio)) {\n            this.fire('showWedge', datum.ratio);\n        }\n    },\n\n    /**\n     * Show tooltip\n     * @param {number} index map data index\n     * @param {{left: number, top: number}} mousePosition mouse position\n     * @private\n     */\n    _showTooltip: function(index, mousePosition) {\n        this.fire('showTooltip', {\n            chartType: this.chartType,\n            indexes: {\n                index: index\n            },\n            mousePosition: mousePosition\n        });\n    },\n\n    /**\n     * Get series container bound.\n     * @returns {{left: number, top: number}} container bound\n     * @private\n     */\n    _getContainerBound: function() {\n        if (!this.containerBound) {\n            this.containerBound = this.seriesContainer.getBoundingClientRect();\n        }\n        return this.containerBound;\n    },\n\n    /**\n     * On move series.\n     * @param {{left: number, top: number}} position position\n     */\n    onMoveSeries: function(position) {\n        var foundIndex = this._executeGraphRenderer(position, 'findSectorIndex'),\n            containerBound;\n\n        if (!tui.util.isNull(foundIndex)) {\n            if (this.prevMovedIndex !== foundIndex) {\n                if (!tui.util.isNull(this.prevMovedIndex)) {\n                    this.graphRenderer.restoreColor(this.prevMovedIndex);\n                    this.fire('hideWedge');\n                    this.fire('hideTooltip');\n                }\n\n                this.graphRenderer.changeColor(foundIndex);\n            }\n\n            if (this._isChangedPosition(this.prevPosition, position)) {\n                containerBound = this._getContainerBound();\n                this._showTooltip(foundIndex, {\n                    left: position.left - containerBound.left,\n                    top: position.top - containerBound.top\n                });\n                this.prevMovedIndex = foundIndex;\n            }\n\n            this._showWedge(foundIndex);\n        } else if (!tui.util.isNull(this.prevMovedIndex)) {\n            this.graphRenderer.restoreColor(this.prevMovedIndex);\n            this.fire('hideWedge');\n            this.fire('hideTooltip');\n            this.prevMovedIndex = null;\n        }\n        this.prevPosition = position;\n    },\n\n    /**\n     * On drag start series.\n     * @param {{left: number, top: number}} position position\n     */\n    onDragStartSeries: function(position) {\n        this.startPosition = {\n            left: position.left,\n            top: position.top\n        };\n    },\n\n    /**\n     * Move position.\n     * @param {{left: number, top: number}} startPosition start position\n     * @param {{left: number, top: number}} endPosition end position\n     * @private\n     */\n    _movePosition: function(startPosition, endPosition) {\n        var movementPosition = this._adjustMapPosition({\n            left: this.basePosition.left + (endPosition.left - startPosition.left),\n            top: this.basePosition.top + (endPosition.top - startPosition.top)\n        });\n\n        renderUtil.renderPosition(this.graphContainer, movementPosition);\n\n        this.basePosition = movementPosition;\n    },\n\n    /**\n     * On drag series.\n     * @param {{left: number, top: number}} position position\n     */\n    onDragSeries: function(position) {\n        this._movePosition(this.startPosition, position);\n\n        this.startPosition = position;\n\n        if (!this.isDrag) {\n            this.isDrag = true;\n            this.fire('hideTooltip');\n        }\n    },\n\n    /**\n     * On drag end series.\n     */\n    onDragEndSeries: function() {\n        this.isDrag = false;\n    },\n\n    /**\n     * Move position for zoom.\n     * @param {{left: number, top: number}} position mouse position\n     * @param {number} changedRatio changed ratio\n     * @private\n     */\n    _movePositionForZoom: function(position, changedRatio) {\n        var seriesDimension = this.boundsMaker.getDimension('series'),\n            containerBound = this._getContainerBound(),\n            startPosition = {\n                left: (seriesDimension.width / 2) + containerBound.left,\n                top: (seriesDimension.height / 2) + containerBound.top\n            },\n            movementPosition = {\n                left: position.left - startPosition.left,\n                top: position.top - startPosition.top\n            },\n            endPosition;\n\n        changedRatio = changedRatio > 1 ? -(changedRatio / 2) : changedRatio;\n\n        endPosition = {\n            left: startPosition.left + (movementPosition.left * changedRatio),\n            top: startPosition.top + (movementPosition.top * changedRatio)\n        };\n\n        this._movePosition(startPosition, endPosition);\n    },\n\n    /**\n     * On zoom.\n     * @param {number} newMagn new zoom magnification\n     * @param {?{left: number, top: number}} position mouse position\n     */\n    onZoom: function(newMagn, position) {\n        var changedRatio = newMagn / this.zoomMagn;\n\n        this.zoomMagn = newMagn;\n\n        this._zoom(changedRatio);\n\n        if (position) {\n            this._movePositionForZoom(position, changedRatio);\n        }\n\n        this.userEvent.fire('zoom', newMagn);\n    },\n\n    /**\n     * Animate component.\n     */\n    animateComponent: function() {\n        this.animateShowingAboutSeriesLabelArea();\n    }\n});\n\ntui.util.CustomEvents.mixin(MapChartSeries);\n\nmodule.exports = MapChartSeries;\n</code></pre>\n        </article>\n    </section>\n\n\n\n</div>\n\n"