tui.util.defineNamespace("fedoc.content", {});
fedoc.content["helpers_predicate.js.html"] = "      <div id=\"main\" class=\"main\">\n\n\n\n    \n    <section>\n        <article>\n            <pre class=\"prettyprint source linenums\"><code>/**\n * @fileoverview Predicate.\n * @author NHN Ent.\n *         FE Development Team &lt;dl_javascript@nhnent.com>\n */\n\n'use strict';\n\nvar chartConst = require('../const');\n\n/**\n * predicate.\n * @module predicate\n */\nvar predicate = {\n    /**\n     * Whether bar chart or not.\n     * @memberOf module:predicate\n     * @param {string} chartType - type of chart\n     * @returns {boolean}\n     */\n    isBarChart: function(chartType) {\n        return chartType === chartConst.CHART_TYPE_BAR;\n    },\n\n    /**\n     * Whether column chart or not.\n     * @memberOf module:predicate\n     * @param {string} chartType - type of chart\n     * @returns {boolean}\n     */\n    isColumnChart: function(chartType) {\n        return chartType === chartConst.CHART_TYPE_COLUMN;\n    },\n\n    /**\n     * Whether bar type chart or not.\n     * @memberOf module:predicate\n     * @param {string} chartType - type of chart\n     * @returns {boolean}\n     */\n    isBarTypeChart: function(chartType) {\n        return predicate.isBarChart(chartType) || predicate.isColumnChart(chartType);\n    },\n\n    /**\n     * Whether combo chart or not.\n     * @memberOf module:predicate\n     * @param {string} chartType - type of chart\n     * @returns {boolean}\n     */\n    isComboChart: function(chartType) {\n        return chartType === chartConst.CHART_TYPE_COMBO;\n    },\n\n    /**\n     * Whether pie and donut combo chart or not.\n     * @memberOf module:predicate\n     * @param {string} chartType - type of chart\n     * @param {Array.&lt;string>} subChartTypes - types of chart\n     * @returns {boolean}\n     */\n    isPieDonutComboChart: function(chartType, subChartTypes) {\n        var isAllPieType = tui.util.all(subChartTypes, function(subChartType) {\n            return predicate.isPieTypeChart(subChartType);\n        });\n        return predicate.isComboChart(chartType) &amp;&amp; isAllPieType;\n    },\n\n    /**\n     * Whether line chart or not.\n     * @memberOf module:predicate\n     * @param {string} chartType - type of chart\n     * @returns {boolean}\n     */\n    isLineChart: function(chartType) {\n        return chartType === chartConst.CHART_TYPE_LINE;\n    },\n\n    /**\n     * Whether area chart or not.\n     * @memberOf module:predicate\n     * @param {string} chartType - type of chart\n     * @returns {boolean}\n     */\n    isAreaChart: function(chartType) {\n        return chartType === chartConst.CHART_TYPE_AREA;\n    },\n\n    /**\n     * Whether line type chart or not.\n     * @memberOf module:predicate\n     * @param {string} chartType - type of chart\n     * @returns {boolean}\n     */\n    isLineTypeChart: function(chartType) {\n        return predicate.isLineChart(chartType) || predicate.isAreaChart(chartType);\n    },\n\n    /**\n     * Whether bubble chart or not.\n     * @memberOf module:predicate\n     * @param {string} chartType - type of chart\n     * @returns {boolean}\n     */\n    isBubbleChart: function(chartType) {\n        return chartType === chartConst.CHART_TYPE_BUBBLE;\n    },\n\n    /**\n     * Whether scatter chart or not.\n     * @memberOf module:predicate\n     * @param {string} chartType - chart type\n     * @returns {boolean}\n     */\n    isScatterChart: function(chartType) {\n        return chartType === chartConst.CHART_TYPE_SCATTER;\n    },\n\n    /**\n     * Whether pie chart or not.\n     * @memberOf module:predicate\n     * @param {string} chartType - chart type\n     * @returns {boolean}\n     */\n    isPieChart: function(chartType) {\n        return chartType === chartConst.CHART_TYPE_PIE;\n    },\n\n    /**\n     * Whether donut chart or not.\n     * @memberOf module:predicate\n     * @param {string} chartType -chart type\n     * @returns {boolean}\n     */\n    isDonutChart: function(chartType) {\n        return chartType === chartConst.CHART_TYPE_DONUT;\n    },\n\n    /**\n     * Whether pie type chart or not.\n     * @memberOf module:predicate\n     * @param {string} chartType - chart type\n     * @returns {boolean}\n     */\n    isPieTypeChart: function(chartType) {\n        return predicate.isPieChart(chartType) || predicate.isDonutChart(chartType);\n    },\n\n    /**\n     * Whether map chart or not.\n     * @memberOf module:predicate\n     * @param {string} chartType - type of chart\n     * @returns {boolean}\n     */\n    isMapChart: function(chartType) {\n        return chartType === chartConst.CHART_TYPE_MAP;\n    },\n\n    /**\n     * Whether coordinate type chart or not.\n     * @memberOf module:predicate\n     * @param {string} chartType - chart type\n     * @returns {boolean}\n     */\n    isCoordinateTypeChart: function(chartType) {\n        return predicate.isBubbleChart(chartType) || predicate.isScatterChart(chartType);\n    },\n\n    /**\n     * Whether allow rendering for minus point in area of series.\n     * @memberOf module:predicate\n     * @param {string} chartType - chart type\n     * @returns {boolean}\n     */\n    allowMinusPointRender: function(chartType) {\n        return predicate.isLineTypeChart(chartType) || predicate.isCoordinateTypeChart(chartType);\n    },\n\n    /**\n     * Whether mouse position chart or not.\n     * @memberOf module:predicate\n     * @param {string} chartType - type of chart\n     * @returns {boolean}\n     */\n    isMousePositionChart: function(chartType) {\n        return predicate.isPieTypeChart(chartType) || predicate.isMapChart(chartType)\n            || predicate.isCoordinateTypeChart(chartType);\n    },\n\n    /**\n     * Whether align of label is outer or not.\n     * @memberOf module:predicate\n     * @param {string} align - align of legend\n     * @returns {boolean}\n     */\n    isLabelAlignOuter: function(align) {\n        return align === chartConst.LABEL_ALIGN_OUTER;\n    },\n\n    /**\n     * Whether show label or not.\n     * @param {{showLabel: ?boolean, showLegend: ?boolean}} options - options\n     * @returns {boolean}\n     */\n    isShowLabel: function(options) {\n        return options.showLabel || options.showLegend;\n    },\n\n    /**\n     * Whether show outer label or not.\n     * @param {{showLabel: ?boolean, showLegend: ?boolean, labelAlign: string}} options - options\n     * @returns {*|boolean}\n     */\n    isShowOuterLabel: function(options) {\n        return predicate.isShowLabel(options) &amp;&amp; predicate.isLabelAlignOuter(options.labelAlign);\n    },\n\n    /**\n     * Whether align of legend is left or not.\n     * @memberOf module:predicate\n     * @param {string} align - align of legend\n     * @returns {boolean}\n     */\n    isLegendAlignLeft: function(align) {\n        return align === chartConst.LEGEND_ALIGN_LEFT;\n    },\n\n    /**\n     * Whether align of legend is top or not.\n     * @memberOf module:predicate\n     * @param {string} align - align of legend\n     * @returns {boolean}\n     */\n    isLegendAlignTop: function(align) {\n        return align === chartConst.LEGEND_ALIGN_TOP;\n    },\n\n    /**\n     * Whether align of legend is bottom or not.\n     * @memberOf module:predicate\n     * @param {string} align - align of legend\n     * @returns {boolean}\n     */\n    isLegendAlignBottom: function(align) {\n        return align === chartConst.LEGEND_ALIGN_BOTTOM;\n    },\n\n    /**\n     * Whether horizontal legend align or not.\n     * @memberOf module:predicate\n     * @param {string} align - align of legend\n     * @returns {boolean}\n     */\n    isHorizontalLegend: function(align) {\n        return predicate.isLegendAlignTop(align) || predicate.isLegendAlignBottom(align);\n    },\n\n    /**\n     * Whether has width for vertical type legend or not.\n     * @param {{align: string, visible: boolean}} legendOption - option for legend component\n     * @returns {boolean}\n     */\n    hasVerticalLegendWidth: function(legendOption) {\n        legendOption = legendOption || {};\n\n        return !predicate.isHorizontalLegend(legendOption.align) &amp;&amp; legendOption.visible;\n    },\n\n    /**\n     * Whether allowed stackType option or not.\n     * @memberOf module:predicate\n     * @param {string} chartType - type of chart\n     * @returns {boolean}\n     */\n    isAllowedStackOption: function(chartType) {\n        return predicate.isBarChart(chartType) || predicate.isColumnChart(chartType)\n            || predicate.isAreaChart(chartType);\n    },\n\n    /**\n     * Whether normal stack type or not.\n     * @memberOf module:predicate\n     * @param {boolean} stackType - stackType option\n     * @returns {boolean}\n     */\n    isNormalStack: function(stackType) {\n        return stackType === chartConst.NORMAL_STACK_TYPE;\n    },\n\n    /**\n     * Whether percent stack type or not.\n     * @memberOf module:predicate\n     * @param {boolean} stackType - stackType option\n     * @returns {boolean}\n     */\n    isPercentStack: function(stackType) {\n        return stackType === chartConst.PERCENT_STACK_TYPE;\n    },\n\n    /**\n     * Whether valid stackType option or not.\n     * @memberOf module:predicate\n     * @param {boolean} stackType - stackType option\n     * @returns {boolean}\n     */\n    isValidStackOption: function(stackType) {\n        return stackType &amp;&amp; (predicate.isNormalStack(stackType) || predicate.isPercentStack(stackType));\n    },\n\n    /**\n     * Whether allow range data or not.\n     * @memberOf module:predicate\n     * @param {string} chartType - chart type\n     * @returns {boolean}\n     */\n    isAllowRangeData: function(chartType) {\n        return predicate.isBarTypeChart(chartType) || predicate.isAreaChart(chartType);\n    },\n\n    /**\n     * Whether align of yAxis is center or not.\n     * @memberOf module:predicate\n     * @param {boolean} hasRightYAxis - whether has right yAxis.\n     * @param {string} alignOption - align option of yAxis.\n     * @returns {boolean} whether - align center or not.\n     */\n    isYAxisAlignCenter: function(hasRightYAxis, alignOption) {\n        return !hasRightYAxis &amp;&amp; (alignOption === chartConst.YAXIS_ALIGN_CENTER);\n    },\n\n    /**\n     * Whether minus limit or not.\n     * @memberOf module:predicate\n     * @param {{min: number, max: number}} limit - limit\n     * @returns {boolean}\n     */\n    isMinusLimit: function(limit) {\n        return limit.min &lt;= 0 &amp;&amp; limit.max &lt;= 0;\n    }\n};\n\nmodule.exports = predicate;\n</code></pre>\n        </article>\n    </section>\n\n\n\n</div>\n\n"