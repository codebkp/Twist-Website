"use strict";
module.exports = Application.Servers.Database.model("cms_news", {
    tableName   : "cms_news",

    likes       : function() {
        return this.hasMany('cms_news_likes', 'news_id');
    },

    toJSON : function() {
        const values = Application.Servers.Database.Model.prototype.toJSON.apply(this);
        return values;
    }


});
