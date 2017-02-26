"use strict";
module.exports = Application.Servers.Database.model("server_graph", {
    tableName   : "server_graph",

    toJSON      : function() {
        const values = Application.Servers.Database.Model.prototype.toJSON.apply(this);
        values.created_at = Application.Libraries.Moment(values.created_at).format('MMMM DD, YYYY (h A)');
        return values;
    }
});
