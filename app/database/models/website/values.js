"use strict";
module.exports = Application.Servers.Database.model("cms_values", {
    tableName   : "cms_values",

    toJSON      : function() {
        const values         = Application.Servers.Database.Model.prototype.toJSON.apply(this);
        // Date
        values.timestamp     = Application.Libraries.Moment.unix(values.timestamp).fromNow();

        // Currency Format
        values.price_display = Application.Libraries.Numeral(values.price).format('(0a)').toUpperCase();
        values.price_edit    = Application.Libraries.Numeral(values.price).format('0,0');

        return values;
    }


});
