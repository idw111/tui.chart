tui.util.defineNamespace("fedoc.content", {});
fedoc.content["charts_mapChart.js.html"] = "      <div id=\"main\" class=\"main\">\n\n\n\n    \n    <section>\n        <article>\n            <pre class=\"prettyprint source linenums\"><code>/**\n * @fileoverview Map chart.\n * @author NHN Ent.\n *         FE Development Team &lt;dl_javascript@nhnent.com>\n */\n\n'use strict';\n\nvar ChartBase = require('./chartBase'),\n    chartConst = require('../const'),\n    MapChartMapModel = require('./mapChartMapModel'),\n    MapChartColorModel = require('./mapChartColorModel'),\n    MapChartDataProcessor = require('../dataModels/mapChartDataProcessor'),\n    axisDataMaker = require('../helpers/axisDataMaker'),\n    Series = require('../series/mapChartSeries'),\n    Zoom = require('../series/zoom'),\n    Legend = require('../legends/mapChartLegend'),\n    MapChartTooltip = require('../tooltips/mapChartTooltip'),\n    mapChartCustomEvent = require('../customEvents/mapChartCustomEvent');\n\nvar MapChart = tui.util.defineClass(ChartBase, /** @lends MapChart.prototype */ {\n    /**\n     * Map chart.\n     * @constructs MapChart\n     * @extends ChartBase\n     * @param {Array.&lt;Array>} rawData raw data\n     * @param {object} theme chart theme\n     * @param {object} options chart options\n     */\n    init: function(rawData, theme, options) {\n        /**\n         * class name\n         * @type {string}\n         */\n        this.className = 'tui-map-chart';\n\n        options.tooltip = options.tooltip || {};\n        options.legend = options.legend || {};\n\n        ChartBase.call(this, {\n            rawData: rawData,\n            theme: theme,\n            options: options,\n            DataProcessor: MapChartDataProcessor\n        });\n\n        this._addComponents(options);\n    },\n\n    /**\n     * Add components\n     * @param {object} options chart options\n     * @private\n     */\n    _addComponents: function(options) {\n        options.legend = options.legend || {};\n\n        this.componentManager.register('legend', Legend);\n\n        this.componentManager.register('tooltip', MapChartTooltip, this._makeTooltipData());\n\n        this.componentManager.register('mapSeries', Series, {\n            libType: options.libType,\n            chartType: options.chartType,\n            componentType: 'series',\n            userEvent: this.userEvent\n        });\n        this.componentManager.register('zoom', Zoom);\n    },\n\n    /**\n     * Add custom event component.\n     * @private\n     */\n    _addCustomEventComponent: function() {\n        this.componentManager.register('customEvent', mapChartCustomEvent, {\n            chartType: this.chartType\n        });\n    },\n\n    /**\n     * Make axes data\n     * @returns {object} axes data\n     * @private\n     */\n    _makeAxesData: function() {\n        var axisScaleMaker = this._createAxisScaleMaker({}, 'legend', null, this.chartType, {\n            valueCount: chartConst.MAP_CHART_LEGEND_TICK_COUNT\n        });\n\n        return axisDataMaker.makeValueAxisData({\n            axisScaleMaker: axisScaleMaker,\n            isVertical: true\n        });\n    },\n\n    /**\n     * Add data ratios.\n     * @private\n     * @override\n     */\n    _addDataRatios: function() {\n        var axesData = this.boundsMaker.getAxesData();\n\n        this.dataProcessor.addDataRatios(axesData.limit);\n    },\n\n    /**\n     * Make rendering data for map chart.\n     * @returns {object} data for rendering\n     * @private\n     * @override\n     */\n    _makeRenderingData: function() {\n        var axesData = this.boundsMaker.getAxesData();\n        var seriesTheme = this.theme.series;\n        var colorModel = new MapChartColorModel(seriesTheme.startColor, seriesTheme.endColor);\n        var mapModel = new MapChartMapModel(this.dataProcessor, this.options.map);\n\n        return {\n            legend: {\n                colorModel: colorModel,\n                axesData: axesData\n            },\n            mapSeries: {\n                mapModel: mapModel,\n                colorModel: colorModel\n            },\n            tooltip: {\n                mapModel: mapModel\n            }\n        };\n    },\n\n    /**\n     * Attach custom evnet.\n     * @private\n     * @override\n     */\n    _attachCustomEvent: function() {\n        var customEvent = this.componentManager.get('customEvent'),\n            mapSeries = this.componentManager.get('mapSeries'),\n            legend = this.componentManager.get('legend'),\n            tooltip = this.componentManager.get('tooltip'),\n            zoom = this.componentManager.get('zoom');\n\n        customEvent.on({\n            clickMapSeries: mapSeries.onClickSeries,\n            moveMapSeries: mapSeries.onMoveSeries,\n            dragStartMapSeries: mapSeries.onDragStartSeries,\n            dragMapSeries: mapSeries.onDragSeries,\n            dragEndMapSeries: mapSeries.onDragEndSeries,\n            wheel: tui.util.bind(zoom.onWheel, zoom)\n        }, mapSeries);\n\n        mapSeries.on({\n            showWedge: legend.onShowWedge,\n            hideWedge: legend.onHideWedge\n        }, legend);\n\n        mapSeries.on({\n            showTooltip: tooltip.onShow,\n            hideTooltip: tooltip.onHide,\n            showTooltipContainer: tooltip.onShowTooltipContainer,\n            hideTooltipContainer: tooltip.onHideTooltipContainer\n        }, tooltip);\n\n        zoom.on('zoom', mapSeries.onZoom, mapSeries, mapSeries);\n    }\n});\n\nmodule.exports = MapChart;\n</code></pre>\n        </article>\n    </section>\n\n\n\n</div>\n\n"