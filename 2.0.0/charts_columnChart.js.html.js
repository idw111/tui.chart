tui.util.defineNamespace("fedoc.content", {});
fedoc.content["charts_columnChart.js.html"] = "      <div id=\"main\" class=\"main\">\n\n\n\n    \n    <section>\n        <article>\n            <pre class=\"prettyprint source linenums\"><code>/**\n * @fileoverview Column chart.\n * @author NHN Ent.\n *         FE Development Team &lt;dl_javascript@nhnent.com>\n */\n\n'use strict';\n\nvar ChartBase = require('./chartBase');\nvar chartConst = require('../const');\nvar axisTypeMixer = require('./axisTypeMixer');\nvar barTypeMixer = require('./barTypeMixer');\nvar predicate = require('../helpers/predicate');\nvar Series = require('../series/columnChartSeries');\n\nvar ColumnChart = tui.util.defineClass(ChartBase, /** @lends ColumnChart.prototype */ {\n    /**\n     * Column chart.\n     * @constructs ColumnChart\n     * @extends ChartBase\n     * @mixes axisTypeMixer\n     * @mixes verticalTypeMixer\n     * @param {Array.&lt;Array>} rawData raw data\n     * @param {object} theme chart theme\n     * @param {object} options chart options\n     * @param {object} initedData initialized data from combo chart\n     */\n    init: function(rawData, theme, options) {\n        /**\n         * className\n         * @type {string}\n         */\n        this.className = 'tui-column-chart';\n\n        options.series = options.series || {};\n        options.yAxis = options.yAxis || {};\n\n        if (predicate.isValidStackOption(options.series.stackType)) {\n            rawData.series = this._sortRawSeriesData(rawData.series);\n        }\n\n        if (options.series.diverging) {\n            rawData.series = this._makeRawSeriesDataForDiverging(rawData.series, options.series.stackType);\n            options.series.stackType = options.series.stackType || chartConst.NORMAL_STACK_TYPE;\n        }\n\n        ChartBase.call(this, {\n            rawData: rawData,\n            theme: theme,\n            options: options,\n            hasAxes: true,\n            isVertical: true\n        });\n\n        this._addComponents(options.chartType);\n    },\n\n    /**\n     * Make map for AxisScaleMaker of axes(xAxis, yAxis).\n     * @returns {Object.&lt;string, AxisScaleMaker>}\n     * @private\n     */\n    _makeAxisScaleMakerMap: function() {\n        return {\n            yAxis: this._createAxisScaleMaker(this.options.yAxis, 'yAxis')\n        };\n    },\n\n    /**\n     * Add components\n     * @param {string} chartType chart type\n     * @private\n     */\n    _addComponents: function(chartType) {\n        this._addComponentsForAxisType({\n            axes: [\n                {\n                    name: 'yAxis'\n                },\n                {\n                    name: 'xAxis',\n                    isLabel: true\n                }\n            ],\n            chartType: chartType,\n            serieses: [\n                {\n                    name: 'columnSeries',\n                    SeriesClass: Series,\n                    data: {\n                        allowNegativeTooltip: true\n                    }\n                }\n            ]\n        });\n    }\n});\n\naxisTypeMixer.mixin(ColumnChart);\nbarTypeMixer.mixin(ColumnChart);\n\nmodule.exports = ColumnChart;\n</code></pre>\n        </article>\n    </section>\n\n\n\n</div>\n\n"