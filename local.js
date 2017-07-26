
var dataCatDayTime, dataCatWeekTime, dataCatMonthTime;
var dataDevDayTime, dataDevWeekTime, dataDevMonthTime;

var graphIndex = 29;

var catData = [
    {"id": "Climate Control", "size": [.41], "color": [0]},
    {"id":"Kitchen", "size":[.22], "color": [0.2]},
    {"id":"Always On", "size":[.15], "color": [0.4]},
    {"id":"Bathroom", "size":[.1], "color": [0.6]},
    {"id":"TV/Game", "size":[.07], "color": [0.8]},
    {"id":"Office", "size":[.05], "color": [1]}
];

var devData =
    [
        {"id":"A/C", "size": [.3], "color": [0.75]},
        {"id":"Refrigerator", "size":[.08], "color":[0.1]},
        {"id":"Oven", "size":[.08], "color":[0.2]},
        {"id":"Stove", "size":[.05], "color":[0.3]},
        {"id":"TV", "size":[.0155], "color":[0.4]},
        {"id":"PS4", "size":[.05], "color":[0.5]},
        {"id":"Laptop", "size":[.012], "color":[0.6]},
        {"id":"Microwave", "size": [.04], "color": [0.7]},
        {"id":"Water Heater", "size":[.07], "color":[0.8]},
        {"id":"Dishwasher", "size":[.04], "color":[0.9]},
        {"id":"Dryer", "size":[.18], "color":[0.15]},
        {"id":"Washer", "size":[.08], "color":[0.35]}
    ];

function generateData(data) {
    var total = 0;
    var deviceData2 = JSON.parse(JSON.stringify(data));

    for (var ctr = 0; ctr < deviceData2.length; ctr++) {
        var val = deviceData2[ctr].size[0] + (0.45 * deviceData2[ctr].size[0] * (Math.random() - 0.5));
        total += val;
        deviceData2[ctr].size[0] = val;
    }

    var diff = 1.0 - total;

    for (var ctr = 0; ctr < deviceData2.length; ctr++) {
        deviceData2[ctr].size[0] += (diff / deviceData2.length);
    }

    return { "id":"2fc414e2", "children":deviceData2};
}

function generateTimeData(data, num) {
    var timedata = [];
    for (var ctr = 0; ctr < num; ctr++) {
        timedata[ctr] = generateData(data);
    }

    return timedata;
}

function generateAllData() {
    dataCatDayTime = generateTimeData(catData, 30);
    dataCatWeekTime = generateTimeData(catData, 30);
    dataCatMonthTime = generateTimeData(catData, 30);

    dataDevDayTime = generateTimeData(devData, 30);
    dataDevWeekTime = generateTimeData(devData, 30);
    dataDevMonthTime = generateTimeData(devData, 30);
}


function updateToday() {
    $(".time-button").removeClass("selected");
    $(".today-button").addClass("selected");

    if ($(".cat-button").hasClass("selected")) {
        makeTreeMap(dataCatDayTime[graphIndex]);
    } else {
        makeTreeMap(dataDevDayTime[graphIndex]);
    }

    drawLine();
    updateDateLabel();
    updateHighlighter2();
}


function updateToWeek() {
    graphIndex = 29;
    $(".time-button").removeClass("selected");
    $(".week-button").addClass("selected");

    if ($(".cat-button").hasClass("selected")) {
        makeTreeMap(dataCatWeekTime[graphIndex]);
    } else {
        makeTreeMap(dataDevWeekTime[graphIndex]);
    }

    drawLine();
    updateDateLabel();
    updateHighlighter2();
}


function updateToMonth() {
    graphIndex = 29;
    $(".time-button").removeClass("selected");
    $(".month-button").addClass("selected");

    if ($(".cat-button").hasClass("selected")) {
        makeTreeMap(dataCatMonthTime[graphIndex]);
    } else {
        makeTreeMap(dataDevMonthTime[graphIndex]);
    }

    drawLine();
    updateDateLabel();
    updateHighlighter2();
}


function updateToDevice() {
    graphIndex = 29;
    $(".type-button").removeClass("selected");
    $(".dev-button").addClass("selected");

    if ($(".today-button").hasClass("selected")) {
        makeTreeMap(dataDevDayTime[graphIndex]);
        mouseclickHandler(null, {nodes: dataDevDayTime[graphIndex].children});
    } else if ($(".week-button").hasClass("selected")) {
        makeTreeMap(dataDevWeekTime[graphIndex]);
        mouseclickHandler(null, {nodes: dataDevWeekTime[graphIndex].children});
    } else {
        makeTreeMap(dataDevMonthTime[graphIndex]);
        mouseclickHandler(null, {nodes: dataDevMonthTime[graphIndex].children});
    }

    drawLine();
    updateDateLabel();
    updateHighlighter2();
}


function updateToCategory() {
    graphIndex = 29;
    $(".type-button").removeClass("selected");
    $(".cat-button").addClass("selected");

    if ($(".today-button").hasClass("selected")) {
        makeTreeMap(dataCatDayTime[graphIndex]);
        mouseclickHandler(null, {nodes: dataCatDayTime[graphIndex].children});
    } else if ($(".week-button").hasClass("selected")) {
        makeTreeMap(dataCatWeekTime[graphIndex]);
        mouseclickHandler(null, {nodes: dataCatWeekTime[graphIndex].children});
    } else {
        makeTreeMap(dataCatMonthTime[graphIndex]);
        mouseclickHandler(null, {nodes: dataCatMonthTime[graphIndex].children});
    }

    drawLine();
    updateDateLabel();
    updateHighlighter2();
}


var mouseclickHandler = function(e,data, ignore) {
    var nodes = data.nodes;
    if (data.nodes[0] == undefined) return;

    var label = $("#details-name").html();
    var obj = _.find(data.nodes, function(item) {
        return item.id == label;
    });

    if (!obj) {
        obj = data.nodes[0];
    }


    $("#details-name").html(obj.id);
    $("#details-val").html((100 * obj.size[0]).toFixed(1) + "% of Usage");
    $("#details-cost").html("$" + (200 * obj.size[0]).toFixed(2) + " Estimated energy cost");
    $("#details-tips").html("Tips for saving money...<br />Other details...");

    $("#details").show();
    updateHighlighter(e,obj, true);

    if (ignore === undefined) {
        graphIndex = 29;
    }

    drawLine();
    updateDateLabel();
};


var updateHighlighter2 = function() {
    var timedata;
    if ($(".today-button").hasClass("selected")) {
        if ($(".cat-button").hasClass("selected")) {
            timedata = dataCatDayTime;
        } else {
            timedata = dataDevDayTime;
        }
    } else if ($(".week-button").hasClass("selected")) {
        if ($(".cat-button").hasClass("selected")) {
            timedata = dataCatWeekTime;
        } else {
            timedata = dataDevWeekTime;
        }
    } else {
        if ($(".cat-button").hasClass("selected")) {
            timedata = dataCatMonthTime;
        } else {
            timedata = dataDevMonthTime;
        }
    }

    $("#highlighter0").hide();
    var data = {nodes: timedata[graphIndex].children};
    mouseclickHandler(null, data, true);
};


var updateHighlighter = function(e, node, selected) {
    var i = 0;
    var offset = $("#treemap").offset();
    var divId = "highlighter"+i;
    if ( $("#"+divId+ (selected ? '-selected' : '')).length == 0 ) {
        $("#highlighter" + (selected ? '-selected' : '')).append("<div id=\""+divId+ (selected ? '-selected' : '')+"\" class=\"highlighter\"></div>");
    }
    var bodyRect = node.geometry.body;
    var highlighterRect = [0,0,0,0];
    highlighterRect[0] = bodyRect[0] + offset.left;
    highlighterRect[1] = bodyRect[1] + offset.top;
    highlighterRect[2] = bodyRect[2];
    highlighterRect[3] = bodyRect[3];

    $("#"+divId + (selected ? '-selected' : '')).css({
        "display":"inline",
        "left":highlighterRect[0],
        "top":highlighterRect[1],
        "width":highlighterRect[2] - 4,
        "height":highlighterRect[3] - 4
    });

    $("#"+divId + (selected ? '-selected' : '')).show();
    $("#highlighter" + (selected ? '-selected' : '')).show();
};


function makeTreeMap(nd, first) {
    if (!first) {
        $("#treemap").unbind().treemap("destroy");
    }

    $("#treemap").treemap({
        "labelsEnabled":true,
        "dimensions": [500,300],
        leafNodeBodyLabeller: function(ctx,rect,rgb,id) {
            ctx.rect(rect[0] + 5,rect[1] + 5,rect[2],rect[3]);
            ctx.clip();
            if (TreemapUtils.avgRgb(rgb) <= 200) {
                ctx.fillStyle = '#fff';
            } else {
                ctx.fillStyle = '#888';
            }
            ctx.font = '14px Verdana, Geneva, sans-serif';
            ctx.fillText(id,rect[0] + 5,rect[1]+20);
        },
        "nodeData": nd
    }).bind('treemapclick',mouseclickHandler);
}


function drawLine() {
    var m = [15, 5, 55, 250]; // margins
    var w = 650 - m[1] - m[3]; // width
    var h = 200 - m[0] - m[2]; // height

    var data = [];

    var timedata;
    if ($(".today-button").hasClass("selected")) {
        if ($(".cat-button").hasClass("selected")) {
            timedata = dataCatDayTime;
        } else {
            timedata = dataDevDayTime;
        }
    } else if ($(".week-button").hasClass("selected")) {
        if ($(".cat-button").hasClass("selected")) {
            timedata = dataCatWeekTime;
        } else {
            timedata = dataDevWeekTime;
        }
    } else {
        if ($(".cat-button").hasClass("selected")) {
            timedata = dataCatMonthTime;
        } else {
            timedata = dataDevMonthTime;
        }
    }

    var label = $("#details-name").html();
    $.each(timedata, function(index, value) {
        var obj = _.find(value.children, function(item) {
            return item.id == label;
        });

        data.push(obj.size[0]);
    });

    $("#details-graph").html('<div id="graph" class="aGraph" style="position:absolute;top:0px;left:0; float:left;"></div>');

    var x = d3.scale.linear().domain([0, data.length]).range([0, w]);
    var y = d3.scale.linear().domain([0, 0.5]).range([h, 0]);
    var line = d3.svg.line()
        .x(function(d,i) {return x(i);})
        .y(function(d) {return y(d);});

    var graph = d3.select("#graph").append("svg:svg")
        .attr("width", w + m[1] + m[3])
        .attr("height", h + m[0] + m[2])
        .append("svg:g")
        .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

    graph.append("svg:path").attr("d", line(data));

    var dataCirclesGroup = graph.append('svg:g');
    var circles = dataCirclesGroup.selectAll('.data-point').data(data);
    circles
        .enter()
        .append('svg:circle')
        .attr('class', 'dot')
        .attr('fill', function(d,i) {
            if (i == graphIndex) {
                return "red";
            } else {
                return "black";
            }

        })
        .attr('cx', function(d,i) {return x(i);})
        .attr('cy', function(d) {return y(d);})
        .attr('r', function(d, i) {
            if (i == graphIndex) {
                return 5;
            } else {
                return 3;
            }
        });
}

function updateDateLabel() {
    if ($(".today-button").hasClass("selected")) {
        var today = new Date();
        today.setDate(today.getDate() - (29 - graphIndex));
        $("#date-label").html(today.toDateString().substring(4));
    } else if ($(".week-button").hasClass("selected")) {
        var first = new Date();
        first.setDate(first.getDate() - 7 * (29 - graphIndex));

        var second = new Date();
        second.setDate(second.getDate() - 7 * (29 - graphIndex + 1));

        $("#date-label").html(second.toDateString().substring(4) + " - " + first.toDateString().substring(4));
    } else {
        var first = new Date();
        first.setDate(first.getDate() - 30 * (29 - graphIndex));

        var second = new Date();
        second.setDate(second.getDate() - 30 * (29 - graphIndex + 1));

        $("#date-label").html(second.toDateString().substring(4) + " - " + first.toDateString().substring(4));
    }
}

function doPrevious() {
    if (graphIndex > 0) {
        graphIndex--;
        updateDateLabel();
        drawLine();

        var timedata;
        if ($(".today-button").hasClass("selected")) {
            if ($(".cat-button").hasClass("selected")) {
                timedata = dataCatDayTime;
            } else {
                timedata = dataDevDayTime;
            }
        } else if ($(".week-button").hasClass("selected")) {
            if ($(".cat-button").hasClass("selected")) {
                timedata = dataCatWeekTime;
            } else {
                timedata = dataDevWeekTime;
            }
        } else {
            if ($(".cat-button").hasClass("selected")) {
                timedata = dataCatMonthTime;
            } else {
                timedata = dataDevMonthTime;
            }
        }

        makeTreeMap(timedata[graphIndex]);
        updateHighlighter2();
    }
}

function doNext() {
    if (graphIndex < 29) {
        graphIndex++;
        updateDateLabel();
        drawLine();

        var timedata;
        if ($(".today-button").hasClass("selected")) {
            if ($(".cat-button").hasClass("selected")) {
                timedata = dataCatDayTime;
            } else {
                timedata = dataDevDayTime;
            }
        } else if ($(".week-button").hasClass("selected")) {
            if ($(".cat-button").hasClass("selected")) {
                timedata = dataCatWeekTime;
            } else {
                timedata = dataDevWeekTime;
            }
        } else {
            if ($(".cat-button").hasClass("selected")) {
                timedata = dataCatMonthTime;
            } else {
                timedata = dataDevMonthTime;
            }
        }

        makeTreeMap(timedata[graphIndex]);

        updateHighlighter2();
    }
}

$(document).ready(function() {
    generateAllData();
    makeTreeMap(dataCatDayTime[graphIndex], true);
    $(".today-button").addClass("selected");
    $(".cat-button").addClass("selected");

    setTimeout(function() {
        mouseclickHandler(null, {nodes: dataCatDayTime[graphIndex].children});
    }, 100)
});
