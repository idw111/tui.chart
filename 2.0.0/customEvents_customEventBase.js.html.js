tui.util.defineNamespace("fedoc.content", {});
fedoc.content["customEvents_customEventBase.js.html"] = "      <div id=\"main\" class=\"main\">\n\n\n\n    \n    <section>\n        <article>\n            <pre class=\"prettyprint source linenums\"><code>/**\n * @fileoverview CustomEventBase is base class for event handle layers.\n * @author NHN Ent.\n *         FE Development Team &lt;dl_javascript@nhnent.com>\n */\n\n'use strict';\n\nvar eventListener = require('../helpers/eventListener'),\n    TickBaseCoordinateModel = require('./tickBaseCoordinateModel'),\n    BoundsBaseCoordinateModel = require('./boundsBaseCoordinateModel'),\n    chartConst = require('../const'),\n    dom = require('../helpers/domHandler'),\n    renderUtil = require('../helpers/renderUtil');\n\nvar CustomEventBase = tui.util.defineClass(/** @lends CustomEventBase.prototype */ {\n    /**\n     * CustomEventBase is base class for custom event components.\n     * @constructs CustomEventBase\n     * @param {object} params parameters\n     *      @param {{\n     *          dimension: {width: number, height: number},\n     *          position: {left: number, top: number}\n     *      }} params.bound bound\n     *      @param {string} params.chartType chart type\n     *      @param {boolean} params.isVertical whether vertical or not\n     */\n    init: function(params) {\n        this.chartType = params.chartType;\n        this.isVertical = params.isVertical;\n        this.dataProcessor = params.dataProcessor;\n        this.boundsMaker = params.boundsMaker;\n        this.selectedData = null;\n    },\n\n    /**\n     * Render event handle layer area.\n     * @param {HTMLElement} customEventContainer - container element for custom event\n     * @param {object} data - data for rendering\n     * @private\n     */\n    _renderCustomEventArea: function(customEventContainer, data) {\n        var expandedBound, tbcm;\n\n        this.dimension = this.boundsMaker.getDimension('customEvent');\n        tbcm = new TickBaseCoordinateModel(this.dimension, data.tickCount, this.chartType, this.isVertical);\n        this.tickBaseCoordinateModel = tbcm;\n        expandedBound = renderUtil.expandBound(this.boundsMaker.getBound('customEvent'));\n        renderUtil.renderDimension(customEventContainer, expandedBound.dimension);\n        renderUtil.renderPosition(customEventContainer, expandedBound.position);\n    },\n\n    /**\n     * Render for customEvent component.\n     * @param {object} data - data for rendering\n     * @returns {HTMLElement} container for custom event\n     */\n    render: function(data) {\n        var container = dom.create('DIV', 'tui-chart-series-custom-event-area');\n\n        this._renderCustomEventArea(container, data);\n        this.attachEvent(container);\n        this.customEventContainer = container;\n        return container;\n    },\n\n    /**\n     * Create BoundsBaseCoordinateModel from seriesBounds for custom event.\n     * @param {Array.&lt;object>} seriesBounds - series bounds\n     */\n    initCustomEventData: function(seriesBounds) {\n        this.boundsBaseCoordinateModel = new BoundsBaseCoordinateModel(seriesBounds);\n    },\n\n    /**\n     * Rerender for customEvent component.\n     * @param {{tickCount: number}} data - data for rerendering\n     */\n    rerender: function(data) {\n        this._renderCustomEventArea(this.customEventContainer, data);\n    },\n\n    /**\n     * Resize for customEvent component.\n     * @param {{tickCount: number}} data - data for resizing\n     */\n    resize: function(data) {\n        this.rerender(data);\n    },\n\n    /**\n     * Whether changed select data or not.\n     * @param {object} prev - previous data\n     * @param {object} cur - current data\n     * @returns {boolean}\n     * @private\n     */\n    _isChangedSelectData: function(prev, cur) {\n        return !prev || !cur || prev.chartType !== cur.chartType ||\n            prev.indexes.groupIndex !== cur.indexes.groupIndex || prev.indexes.index !== cur.indexes.index;\n    },\n\n    /**\n     * Find coordinate data from boundsCoordinateModel.\n     * @param {HTMLElement} target - target element\n     * @param {number} clientX mouse - position x\n     * @param {number} clientY mouse - position y\n     * @returns {object}\n     * @private\n     */\n    _findDataFromBoundsCoordinateModel: function(target, clientX, clientY) {\n        var bound = target.getBoundingClientRect(),\n            layerX = clientX - bound.left,\n            layerY = clientY - bound.top,\n            groupIndex = this.tickBaseCoordinateModel.findIndex(this.isVertical ? layerX : layerY);\n        return this.boundsBaseCoordinateModel.findData(groupIndex, layerX + chartConst.SERIES_EXPAND_SIZE, layerY);\n    },\n\n    /**\n     * Unselect selected data.\n     * @private\n     */\n    _unselectSelectedData: function() {\n        var eventName = renderUtil.makeCustomEventName('unselect', this.selectedData.chartType, 'series');\n        this.fire(eventName, this.selectedData);\n        this.selectedData = null;\n    },\n\n    /**\n     * On mouse event.\n     * @param {string} eventType - custom event type\n     * @param {MouseEvent} e - mouse event\n     * @private\n     */\n    _onMouseEvent: function(eventType, e) {\n        var eventName = renderUtil.makeCustomEventName(eventType, this.chartType, 'series');\n\n        dom.addClass(this.customEventContainer, 'hide');\n        this.fire(eventName, {\n            left: e.clientX,\n            top: e.clientY\n        });\n        dom.removeClass(this.customEventContainer, 'hide');\n    },\n\n    /**\n     * On click\n     * @param {MouseEvent} e - mouse event\n     * @private\n     */\n    _onClick: function(e) {\n        var target = e.target || e.srcElement,\n            clientX = e.clientX - chartConst.SERIES_EXPAND_SIZE,\n            foundData = this._findDataFromBoundsCoordinateModel(target, clientX, e.clientY);\n        if (!this._isChangedSelectData(this.selectedData, foundData)) {\n            this._unselectSelectedData();\n        } else if (foundData) {\n            if (this.selectedData) {\n                this._unselectSelectedData();\n            }\n            this.fire(renderUtil.makeCustomEventName('select', foundData.chartType, 'series'), foundData);\n            this.selectedData = foundData;\n        }\n    },\n\n    /**\n     * On mouse down\n     * @private\n     * @abstract\n     */\n    _onMousedown: function() {},\n\n    /**\n     * On mouse up\n     * @private\n     * @abstract\n     */\n    _onMouseup: function() {},\n\n    /**\n     * On mouse move\n     * @private\n     * @abstract\n     */\n    _onMousemove: function() {},\n\n    /**\n     * On mouse out\n     * @private\n     * @abstract\n     */\n    _onMouseout: function() {},\n\n    /**\n     * Attach event\n     * @param {HTMLElement} target - target element\n     */\n    attachEvent: function(target) {\n        eventListener.bindEvent('click', target, this._onClick, this);\n        eventListener.bindEvent('mousedown', target, this._onMousedown, this);\n        eventListener.bindEvent('mouseup', target, this._onMouseup, this);\n        eventListener.bindEvent('mousemove', target, this._onMousemove, this);\n        eventListener.bindEvent('mouseout', target, this._onMouseout, this);\n    }\n});\n\ntui.util.CustomEvents.mixin(CustomEventBase);\n\nmodule.exports = CustomEventBase;\n</code></pre>\n        </article>\n    </section>\n\n\n\n</div>\n\n"