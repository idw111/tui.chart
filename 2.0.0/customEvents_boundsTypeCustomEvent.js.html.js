tui.util.defineNamespace("fedoc.content", {});
fedoc.content["customEvents_boundsTypeCustomEvent.js.html"] = "      <div id=\"main\" class=\"main\">\n\n\n\n    \n    <section>\n        <article>\n            <pre class=\"prettyprint source linenums\"><code>/**\n * @fileoverview BoundsTypeCustomEvent is event handle layer for bounds.\n * @author NHN Ent.\n *         FE Development Team &lt;dl_javascript@nhnent.com>\n */\n\n'use strict';\n\nvar chartConst = require('../const'),\n    CustomEventBase = require('./customEventBase');\n\nvar BoundsTypeCustomEvent = tui.util.defineClass(CustomEventBase, /** @lends BoundsTypeCustomEvent.prototype */ {\n    /**\n     * BoundsTypeCustomEvent is event handle layer for line type chart.\n     * @constructs BoundsTypeCustomEvent\n     * @extends CustomEventBase\n     */\n    init: function() {\n        CustomEventBase.apply(this, arguments);\n\n        /**\n         * previous found data\n         * @type {null | object}\n         */\n        this.prevFoundData = null;\n    },\n\n    /**\n     * On mousemove.\n     * @param {MouseEvent} e - mouse event\n     * @private\n     * @override\n     */\n    _onMousemove: function(e) {\n        var target = e.target || e.srcElement,\n            clientX = e.clientX - chartConst.SERIES_EXPAND_SIZE,\n            foundData = this._findDataFromBoundsCoordinateModel(target, clientX, e.clientY);\n\n        if (!this._isChangedSelectData(this.prevFoundData, foundData)) {\n            return;\n        }\n\n        if (this.prevFoundData) {\n            this.fire('hideTooltip', this.prevFoundData);\n        }\n\n        if (foundData) {\n            this.fire('showTooltip', foundData);\n        }\n\n        this.prevFoundData = foundData;\n    },\n\n    /**\n     * On mouseout.\n     * @override\n     */\n    _onMouseout: function() {\n        if (this.prevFoundData) {\n            this.fire('hideTooltip', this.prevFoundData);\n            this.prevFoundData = null;\n        }\n    }\n});\n\nmodule.exports = BoundsTypeCustomEvent;\n</code></pre>\n        </article>\n    </section>\n\n\n\n</div>\n\n"