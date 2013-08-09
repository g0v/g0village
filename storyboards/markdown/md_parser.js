// usage: node md_parser.js overworld/hlb.md

var md = require("markdown").markdown,
    fs = require("fs"),
    util = require('util'),
    _ = require("lodash");

var md2json = function (tree) {
    var o = { say: [] };

    _.each(_.tail(tree), function (n) {
        var result = parseNode(n);

        if (result["say"]) {
            _.each(result["say"], function (x) {
                o.say.push(x);
            });
        } else {
            _.extend(o, result);
        }

        //console.log(result);
    });

    //console.log("result: ");
    console.log(util.inspect(o, false, null));
};

var parseNode = function (exp) {
    switch(_.head(exp)) {
        case "header":
            if (exp[1]["level"] == 1) {
                return { npc: exp[2] }
            }
            break;
        case "para":
            if (exp[1][0] == "em") {
                return { name: exp[1][1] };
            }
            break;
        case "bulletlist":
            return parseList(_.tail(exp));
    }
}

var parseList = function (list) {
    var o = { say: [] };

    _.each(list, function (exp) {
        var item = parseListItem(exp[1]);
        if (_.isObject(item)) {
            o = _.extend(o, item);
        } else {
            o.say.push(item);
        }

        if (exp[2]) {
            if (_.head(exp[2]) == "numberlist") {
                o.say.push(parseOption(_.tail(exp[2])));
            }
        }
    });

    return o;
};

var parseListItem = function (item) {
    if (item.indexOf("mood:") != -1) {
        return {mood: item.substr("mood:".length)};
    }
    if (item.indexOf("scene:") != -1) {
        return {scene: item.substr("scene:".length)};
    }

    return item;
}

var parseOption = function (options) {
    var o = {};

    _.each(options, function (exp) {
        o[exp[1]] = parseList(_.tail(exp[2]));
    });
    return o;
};


fs.readFile(process.argv[2], "utf8", function (err,data) {
    //console.log(data);
    var tree = md.parse(data);
    //console.log(util.inspect(tree, false, null));
    md2json(tree);
});

