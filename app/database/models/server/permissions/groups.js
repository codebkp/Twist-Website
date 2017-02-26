"use strict";
module.exports = Application.Servers.Database.model("permissions_groups", {
    tableName   : "permissions_groups",


    users      : function() {
        return this.hasMany('User', 'rank');
    }


});
