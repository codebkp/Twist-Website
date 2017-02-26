"use strict";

exports.build = function(messages) {
    console.log("\n           System Messages");
    messages.forEach(function (message) {
        console.log("           -" + message);
    });

    console.log("           -Habbo took " + parseInt(Date.now() - Application.Info.Startup) + "ms to launch");
};

exports.clear = function() {
    return process.stdout.write("\x1B[2J");
};

exports.logo = function() {
    console.log("           Twist my Hotel");
    Application.Console.random();
    console.log("           ---------------");
    console.log("           Created by Chris Pettyjohn");
    console.log("           Application Version: " + Application.Info.Version + "." + Application.Info.Build);
};

exports.random = function() {
    const messages = [
        'Cash me ousside, howbah dah?',
        'The hoes are laughing',
        'What happened to the John I know?',
        'You ain\'t gang',
        'I\'m the plug on the low',
        'Twist is for queers',
        'Oliver is like 12'
    ];

    console.log('           ' + messages.random());

}

exports.error = function(error) {
    console.log("            [ ERROR ] " + error);
}

exports.crash = function(errors) {

};

exports.fatal = function(error) {
    console.log('           ' + error);
    Application.Info.Status = 1;
}