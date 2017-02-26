"use strict";
module.exports = Application.Servers.Database.model("cms_updates", {
    tableName   : "cms_updates",


    author      : function() {
        return this.belongsTo("User", "author");
    },



});
