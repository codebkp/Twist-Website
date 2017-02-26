"use strict";
module.exports = Application.Servers.Database.model("User", {
  tableName     : "users",


    badges      : function() {
      return this.hasMany('user_badges');
    },

    badge_slots : function() {
        return this.badges().query(function(qb) { qb.where('badge_slot', '>', 0) })
    },


    logins      : function() {
      return this.hasMany('cms_logins');
    },

    toJSON      : function() {
      const values = Application.Servers.Database.Model.prototype.toJSON.apply(this);
      // Theme Adjuster
      switch (values.skin)
      {
          case "1": values.skin = "red"; break;
          case "2": values.skin = "yellow"; break;
          case "3": values.skin = "green"; break;
          case "4": values.skin = "blue"; break;
          case "5": values.skin = "purple"; break;
          case "6": values.skin = "pink"; break;
      }
      // Currency Format
      values.credits_format     = Application.Libraries.Numeral(values.credits).format('(0.0a)').toUpperCase();
      values.pixels_format      = Application.Libraries.Numeral(values.activity_points).format('(0.0a)').toUpperCase();
      values.diamonds_format    = Application.Libraries.Numeral(values.vip_points).format('(0.0a)').toUpperCase();;


      return values;
    }


});
