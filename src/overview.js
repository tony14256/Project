(function (overview) {

    overview.histogram = function (posts) {

        var max = Math.floor((d3.max(posts, (d) => {
            return d.comment
        })) / 100);
        var min = Math.floor((d3.min(posts, (d) => {
            return d.comment
        })) / 100);
        console.log([max, min]);

        var his_array = new Array((max - min) + 1).fill(0);

        for (var i = 0; i < posts.length; i++) {
            var Quantity = Math.floor(posts[i].comment / 100);
            his_array[Quantity]++;
        }

        console.log(his_array);

        overview_svg.select("#xaxis").remove();
        overview_svg.select("#yaxis").remove();
        overview_svg.select("#tread").remove();

        var width = parseInt(overview_svg.style("width"), 10) - 80,
            height = 60;

        var max = d3.max(his_array),
            min = d3.min(his_array);

        var x = d3.scaleLinear().domain([0, (his_array.length + 1)]).range([0, width]);
        var y = d3.scaleLinear().domain([min, max]).range([0, height]);

        overview_svg.append("g")
            .attr("id", "xaxis")
            .attr("class", "axis")
            .attr("transform", "translate(40," + (parseInt(overview_svg.style("height"), 10) - 18) + ")")
            .call(d3.axisBottom(x));

        overview_svg.append("g")
            .attr("id", "yaxis")
            .attr("class", "axis")
            .attr("transform", "translate(35," + (parseInt(overview_svg.style("height"), 10) - 80) + ")")
            .call(d3.axisLeft(y).ticks(0));

        var path_data = [];

        for (var i = 0; i < his_array.length - 1; i++) {
            path_data.push({
                "start": [i + 1, his_array[i]],
                "end": [i + 2, his_array[i + 1]]
            });
        }

        overview_svg.append("g")
            .attr("id", "tread")
            .attr("transform", "translate(40," + (parseInt(overview_svg.style("height"), 10) - 80) + ")")
            .selectAll("rect")
            .data(his_array)
            .enter()
            .append("rect")
            .attr("x", function (d, i) {
                return x(i);
            })
            .attr("y", function (d, i) {
                if (d != 0)
                    return height - y(d) - 1;
                return height - y(d);
            })
            .attr("width", function (d, i) {
                return width / his_array.length;
            })
            .attr("height", function (d, i) {
                if (d != 0)
                    return y(d) + 1;
                return y(d);
            })
            .attr('fill', 'red');

    }

    overview.normalize = function (posts) {

        var likescale = d3.scaleLinear().range([0.5, 6]).domain([d3.min(normalize_temp, function (d) {
            return d.like
        }), d3.max(normalize_temp, function (d) {
            return d.like
        })]);
        var commentscale = d3.scaleLinear().range([0.5, 6]).domain([d3.min(normalize_temp, function (d) {
            return d.comment
        }), d3.max(normalize_temp, function (d) {
            return d.comment
        })]);
        var sharescale = d3.scaleLinear().range([0.5, 6]).domain([d3.min(normalize_temp, function (d) {
            return d.share
        }), d3.max(normalize_temp, function (d) {
            return d.share
        })]);
        var totalreplyscale = d3.scaleLinear().range([0.5, 6]).domain([d3.min(normalize_temp, function (d) {
            return d.totalreply
        }), d3.max(normalize_temp, function (d) {
            return d.totalreply
        })]);
        var messagescale = d3.scaleLinear().range([0.5, 6]).domain([d3.min(normalize_temp, function (d) {
            return d.message
        }), d3.max(normalize_temp, function (d) {
            return d.message
        })]);


        var lovescale = d3.scaleLinear().range([0, 1]).domain([d3.min(normalize_temp, function (d) {
            return d.love
        }), d3.max(normalize_temp, function (d) {
            return d.love
        })]);
        var hahascale = d3.scaleLinear().range([0, 1]).domain([d3.min(normalize_temp, function (d) {
            return d.haha
        }), d3.max(normalize_temp, function (d) {
            return d.haha
        })]);
        var wowscale = d3.scaleLinear().range([0, 1]).domain([d3.min(normalize_temp, function (d) {
            return d.wow
        }), d3.max(normalize_temp, function (d) {
            return d.wow
        })]);
        var sadscale = d3.scaleLinear().range([0, 1]).domain([d3.min(normalize_temp, function (d) {
            return d.sad
        }), d3.max(normalize_temp, function (d) {
            return d.sad
        })]);
        var angryscale = d3.scaleLinear().range([0, 1]).domain([d3.min(normalize_temp, function (d) {
            return d.angry
        }), d3.max(normalize_temp, function (d) {
            return d.angry
        })]);


        for (var i = 0; i < posts.length; i++) {
            posts[i].nor_like = likescale(posts[i].like);
            posts[i].nor_share = sharescale(posts[i].share);
            posts[i].nor_comment = commentscale(posts[i].comment);
            posts[i].message_length = totalreplyscale(posts[i].message.length);
            posts[i].total_reply = messagescale(posts[i].total_reply);

            posts[i].reactions_nor.love = lovescale(posts[i].reactions.love);
            posts[i].reactions_nor.wow = hahascale(posts[i].reactions.wow);
            posts[i].reactions_nor.haha = wowscale(posts[i].reactions.haha);
            posts[i].reactions_nor.sad = sadscale(posts[i].reactions.sad);
            posts[i].reactions_nor.angry = angryscale(posts[i].reactions.angry);
        }

        //console.log(posts);

        return posts;
    }

    overview.distance = function (posts) {
        var distance_matrix = [];
        var time_metrix = [];
        var texst_metrix = [];
        for (var i = 0; i < posts.length; i++) {
            distance_matrix[i] = [];
            time_metrix[i] = [];
            texst_metrix[i] = [];
            for (var j = 0; j < posts.length; j++) {
                distance_matrix[i][j] = 0;
                time_metrix[i][j] = 0;
                texst_metrix[i][j] = 0;
            }
        }

        for (var i = 0; i < posts.length; i++) {
            for (var j = i + 1; j < posts.length; j++) {


                distance_matrix[i][j] += Math.pow((posts[i].nor_comment - posts[j].nor_comment), 2);
                distance_matrix[i][j] += Math.pow((posts[i].nor_like - posts[j].nor_like), 2);
                distance_matrix[i][j] += Math.pow((posts[i].nor_share - posts[j].nor_share), 2);
                //distance_matrix[i][j] += Math.pow((posts[i].message_length - posts[j].message_length), 2);
                //distance_matrix[i][j] += Math.pow((posts[i].total_reply - posts[j].total_reply), 2);

                /*
                time_metrix[i][j] += Math.pow((posts[i].reactions_nor.love - posts[j].reactions_nor.love), 2);
                time_metrix[i][j] += Math.pow((posts[i].reactions_nor.haha - posts[j].reactions_nor.haha), 2);
                time_metrix[i][j] += Math.pow((posts[i].reactions_nor.wow - posts[j].reactions_nor.wow), 2);
                time_metrix[i][j] += Math.pow((posts[i].reactions_nor.sad - posts[j].reactions_nor.sad), 2);
                time_metrix[i][j] += Math.pow((posts[i].reactions_nor.angry - posts[j].reactions_nor.angry), 2);
                */

                time_metrix[i][j] += Math.pow((posts[i].reactions_percentage.love - posts[j].reactions_percentage.love), 2);
                time_metrix[i][j] += Math.pow((posts[i].reactions_percentage.haha - posts[j].reactions_percentage.haha), 2);
                time_metrix[i][j] += Math.pow((posts[i].reactions_percentage.wow - posts[j].reactions_percentage.wow), 2);
                time_metrix[i][j] += Math.pow((posts[i].reactions_percentage.sad - posts[j].reactions_percentage.sad), 2);
                time_metrix[i][j] += Math.pow((posts[i].reactions_percentage.angry - posts[j].reactions_percentage.angry), 2);

                distance_matrix[i][j] = Math.sqrt(distance_matrix[i][j]);
                distance_matrix[j][i] = distance_matrix[i][j];

                time_metrix[i][j] = Math.sqrt(time_metrix[i][j]);
                time_metrix[j][i] = time_metrix[i][j];

                texst_metrix[i][j] += Math.pow((posts[i].nor_comment - posts[j].nor_comment), 2);
                texst_metrix[i][j] += Math.pow((posts[i].nor_like - posts[j].nor_like), 2);
                texst_metrix[i][j] += Math.pow((posts[i].nor_share - posts[j].nor_share), 2);

                texst_metrix[i][j] += Math.pow((posts[i].reactions_percentage.love - posts[j].reactions_percentage.love), 2);
                texst_metrix[i][j] += Math.pow((posts[i].reactions_percentage.haha - posts[j].reactions_percentage.haha), 2);
                texst_metrix[i][j] += Math.pow((posts[i].reactions_percentage.wow - posts[j].reactions_percentage.wow), 2);
                texst_metrix[i][j] += Math.pow((posts[i].reactions_percentage.sad - posts[j].reactions_percentage.sad), 2);
                texst_metrix[i][j] += Math.pow((posts[i].reactions_percentage.angry - posts[j].reactions_percentage.angry), 2);

                texst_metrix[i][j] = Math.sqrt(texst_metrix[i][j]);
                texst_metrix[j][i] = texst_metrix[i][j];

            }
        }

        console.log(distance_matrix.length);

        var Y = mds.classic(texst_metrix);

        /*
        var LS = numeric.transpose(Y)

        console.log(LS);
        LS = findLineByLeastSquares(LS[0], LS[1]);
        console.log(LS);
        */
        //** mds position Slope vector distance */

        var max = [d3.max(Y, (d) => {
            return d[0]
        }), d3.max(Y, (d) => {
            return d[1]
        })];
        var min = [d3.min(Y, (d) => {
            return d[0]
        }), d3.min(Y, (d) => {
            return d[1]
        })];
        var mid = [(max[0] + min[0]) / 2, (max[1] + min[1]) / 2];

        var position_array = []
        for (var i = 0; i < Y.length; i++) {
            position_array[i] = [];
            for (var j = 0; j < Y.length; j++) {
                var relation = [0, 0];
                var mid2this = Math.sqrt((Math.pow((Y[i][0] - mid[0]), 2) + Math.pow((Y[i][1] - mid[1]), 2)));
                if (i != j) {

                    relation[0] = Math.sqrt((Math.pow((Y[j][0] - mid[0]), 2) + Math.pow((Y[j][1] - mid[1]), 2)));
                    relation[0] = Math.pow(relation[0] - mid2this, 2)
                    relation[1] = Math.sqrt((Math.pow((Y[i][0] - Y[j][0]), 2) + Math.pow((Y[i][1] - Y[j][1]), 2)));
                }

                position_array[i][j] = relation;
            }
        }
        console.log(position_array);
        /*
                for (var i = 0; i < posts.length; i++) {
                    for (var j = 0; j < posts.length; j++) {
                        time_metrix[i][j] = Math.pow(time_metrix[i][j], 2) + position_array[i][j][0] * 0.5;
                        time_metrix[i][j] = Math.sqrt(time_metrix[i][j]);
                    }
                }
        */
        console.log(time_metrix)

        //** mds position relation*/

        //==========================t-sne==========================================================
        var opt = {}
        opt.epsilon = 10; // epsilon is learning rate (10 = default)
        opt.perplexity = 30; // roughly how many neighbors each point influences (30 = default)
        opt.dim = 2; // dimensionality of the embedding (2 = default)

        var tsne = new tsnejs.tSNE(opt); // create a tSNE instance

        //tsne.initDataDist(time_metrix, numeric.transpose(LS));
        tsne.initDataDist(time_metrix, Y);

        console.log("//////////////////////////////////");
        for (var k = 0; k < 1000; k++) {
            //console.log(k);
            tsne.step(); // every time you call this, solution gets better
        }

        var P = tsne.getSolution(); // Y is an array of 2-D points that you can plot
        //==========================t-sne==========================================================

        //console.log((P));

        //var P = mds.classic(texst_metrix);
        var Positions = numeric.transpose(P);

        //console.log(Positions);
        function findLineByLeastSquares(values_x, values_y) {
            var sum_x = 0;
            var sum_y = 0;
            var sum_xy = 0;
            var sum_xx = 0;
            var count = 0;

            /*
             * We'll use those variables for faster read/write access.
             */
            var x = 0;
            var y = 0;
            var values_length = values_x.length;

            if (values_length != values_y.length) {
                throw new Error('The parameters values_x and values_y need to have same size!');
            }

            /*
             * Nothing to do.
             */
            if (values_length === 0) {
                return [
                    [],
                    []
                ];
            }

            /*
             * Calculate the sum for each of the parts necessary.
             */
            for (var v = 0; v < values_length; v++) {
                x = values_x[v];
                y = values_y[v];
                sum_x += x;
                sum_y += y;
                sum_xx += x * x;
                sum_xy += x * y;
                count++;
            }

            /*
             * Calculate m and b for the formular:
             * y = x * m + b
             */
            var m = (count * sum_xy - sum_x * sum_y) / (count * sum_xx - sum_x * sum_x);
            var b = (sum_y / count) - (m * sum_x) / count;

            /*
             * We will make the x and y result line now
             */
            var result_values_x = [];
            var result_values_y = [];

            for (var v = 0; v < values_length; v++) {
                x = values_x[v];
                y = x * m + b;
                result_values_x.push(x);
                result_values_y.push(y);
            }

            return [result_values_x, result_values_y];
        }

        return Positions;
        //return (LS);
    }

    overview.rander = function (position) {

        var x = position[0],
            y = position[1];

        Xscale = d3.scaleLinear().domain([d3.min(x), d3.max(x)]).range([40, parseInt(overview_svg.style("width"), 10) - 40]);
        Yscale = d3.scaleLinear().domain([d3.max(y), d3.min(y)]).range([40, parseInt(overview_svg.style("height"), 10) - 100]);


        overview_svg.append("g")
            .attr("id", "posts")
            .selectAll("circle")
            .data(posts)
            .enter()
            .append("circle")
            .attr("class", "post_node")
            .attr("id", function (d, i) {
                return "post_" + d.post;
            })
            .attr("cx", function (d, i) {
                return Xscale(position[0][i]);
            })
            .attr("cy", function (d, i) {
                return Yscale(position[1][i]);
            })
            .attr("r", 4)
            .attr("fill", function (d, i) {
                //return "orange";
                return color_scale(d.log_attribute.comment);
            })
            .attr("stroke", "black")
            .attr("stroke-width", "1px")
            .style("opacity", 1)
            .on("click", function (d, i) {
                if (!mode) {
                    if (d3.select(this).style("opacity") != 0.2) {
                        var month = d.created_time.getMonth(),
                            date = d.created_time.getDate();
                        var postcir = overview_svg.select("#posts");

                        postcir.selectAll("circle").attr("r", 4).attr("fill", function (d, i) {
                            return "orange";
                            //return color_scale(d.log_attribute[colorbtn]);
                        });


                        overview_svg.select("#timecurve").selectAll("path").attr("stroke-width", "0px");
                        timeblock_svg.selectAll("path").attr("fill", function (d, i) {
                            return "orange";
                            //return color_scale(d.log_attribute[colorbtn]);
                        });


                        postcir.select("#post_" + d.post).attr("r", 8).attr("fill", "purple");
                        postcir.select("#post_" + (d.post - 1)).attr("r", 8);
                        postcir.select("#post_" + (d.post + 1)).attr("r", 8);

                        overview_svg.select("#timecurve")
                            .select("#link_" + d.post + "_" + (d.post + 1))
                            .attr("stroke-width", "4px");

                        overview_svg.select("#timecurve")
                            .select("#link_" + (d.post - 1) + "_" + d.post)
                            .attr("stroke-width", "4px");


                        timeblock_svg.select("#post_" + d.post).attr("fill", "purple");

                        button.detial([posts[i - 1], d, posts[i + 1]]);
                    }
                }
            });

    }

    overview.timeline = function (position, timeblock) {

        overview_svg.select("#timecurve").remove();

        var time = [];
        for (var i = 0; i < timeblock.length - 1; i++) {
            time.push({
                "start": timeblock[i],
                "end": timeblock[i + 1],
            });
        }

        var color = d3.scaleLinear().domain([0, timeblock.length - 1])
            .interpolate(d3.interpolateHcl)
            .range([d3.rgb("#FFFF00"), d3.rgb('#AA0000')]);


        var curve = d3.line()
            .x(function (d) {
                return d.x
            })
            .y(function (d) {
                return d.y
            })
            .curve(d3.curveBasis);


        overview_svg.append("defs").append('marker')
            .attr('id', 'arrowhead')
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 7)
            .attr("refY", -1)
            .attr("markerWidth", 3)
            .attr("markerHeight", 3)
            .attr("orient", "auto")
            .append("path")
            .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
            .attr("fill", "green")
            .attr('stroke', 'green');


        console.log(time);

        overview_svg.append("g")
            .attr("id", "timecurve")
            .selectAll("path")
            .data(time)
            .enter()
            .append("path")
            .attr("id", function (d, i) {
                return "link_" + d.start.post + "_" + d.end.post;
            })
            .attr("d", function (d, i) {
                //console.log(i);
                var start = [Xscale(position[0][d.start.post]), Yscale(position[1][d.start.post])],
                    end = [Xscale(position[0][d.end.post]), Yscale(position[1][d.end.post])],
                    pre = [Xscale(position[0][d.start.post - 1]), Yscale(position[1][d.start.post - 1])],
                    pov = [Xscale(position[0][d.end.post + 1]), Yscale(position[1][d.end.post + 1])];
                var m1 = [(end[0] - pre[0]), (end[1] - pre[1])],
                    m2 = [(start[0] - pov[0]), (start[1] - pov[1])];
                var D = Math.sqrt(Math.pow(start[0] - end[0], 2) + Math.pow(start[1] - end[1], 2)),
                    MD1 = Math.sqrt(Math.pow(m1[0], 2) + Math.pow(m1[1], 2)),
                    MD2 = Math.sqrt(Math.pow(m2[0], 2) + Math.pow(m2[1], 2));

                //console.log(D);

                var line;

                if (d.start.post == 0) {
                    line = [{
                            "x": Xscale(position[0][d.start.post]),
                            "y": Yscale(position[1][d.start.post])
                        },
                        {
                            "x": end[0] + ((0.15 * D) / MD2) * m2[0],
                            "y": end[1] + ((0.15 * D) / MD2) * m2[1]
                        },
                        {
                            "x": Xscale(position[0][d.end.post]),
                            "y": Yscale(position[1][d.end.post])
                        }
                    ]
                } else if (d.end.post == (timeblock.length - 1)) {
                    line = [{
                            "x": Xscale(position[0][d.start.post]),
                            "y": Yscale(position[1][d.start.post])
                        },
                        {
                            "x": start[0] + ((0.15 * D) / MD1) * m1[0],
                            "y": start[1] + ((0.15 * D) / MD1) * m1[1]
                        },
                        {
                            "x": Xscale(position[0][d.end.post]),
                            "y": Yscale(position[1][d.end.post])
                        }
                    ]
                } else {
                    line = [{
                            "x": Xscale(position[0][d.start.post]),
                            "y": Yscale(position[1][d.start.post])
                        },
                        {
                            "x": start[0] + ((0.15 * D) / MD1) * m1[0],
                            "y": start[1] + ((0.15 * D) / MD1) * m1[1]
                        },
                        {
                            "x": end[0] + ((0.15 * D) / MD2) * m2[0],
                            "y": end[1] + ((0.15 * D) / MD2) * m2[1]
                        },
                        {
                            "x": Xscale(position[0][d.end.post]),
                            "y": Yscale(position[1][d.end.post])
                        }
                    ]
                }

                return curve(line);
            })
            .attr("stroke-width", "0px")
            .attr("stroke", function (d, i) {
                //return color(i);
                return "green";
            })
            .attr("fill", "none")
            .attr('marker-mid', 'url(#arrowhead)');


        // return time;
    }

    overview.daybar = function (block_posts) {

        //console.log(block_posts);

        overview_svg.select("#xaxis").remove();
        overview_svg.select("#yaxis").remove();
        overview_svg.select("#daybar").remove();

        var width = parseInt(overview_svg.style("width"), 10) - 80,
            height = 60;

        var x = d3.scaleLinear().domain([0, 31]).range([0, width]);
        var y = d3.scaleLinear().domain([24, 0]).range([0, height]);

        var date = [];

        for (var i = 0; i < 32; i++) {
            date[i] = [];
        }

        for (var i = 0; i < block_posts.length; i++) {
            date[block_posts[i].created_time.getDate()].push(block_posts[i]);
        }

        date = date.filter(function (d) {
            return d.length > 0;
        });

        //console.log(date);

        overview_svg.append("g")
            .attr("id", "xaxis")
            .attr("class", "axis")
            .attr("transform", "translate(40," + (parseInt(overview_svg.style("height"), 10) - 18) + ")")
            .call(d3.axisBottom(x).ticks(31));

        overview_svg.append("g")
            .attr("id", "yaxis")
            .attr("class", "axis")
            .attr("transform", "translate(35," + (parseInt(overview_svg.style("height"), 10) - 80) + ")")
            .call(d3.axisLeft(y).ticks(5));


        var timebar = overview_svg.append("g")
            .attr("id", "daybar");

        timebar.append("rect")
            .attr("x", 40)
            .attr("y", parseInt(overview_svg.style("height"), 10) - 80)
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "white")
            .attr("stroke-width", "2px")
            .attr("stroke", "black");


        timebar.selectAll("line")
            .data(date)
            .enter()
            .append("line")
            .attr("x1", function (d, i) {
                return x(d[0].created_time.getDate()) + 40;
            })
            .attr("y1", function (d, i) {
                return parseInt(overview_svg.style("height"), 10) - 80;
            })
            .attr("x2", function (d, i) {
                return x(d[0].created_time.getDate()) + 40;
            })
            .attr("y2", function (d, i) {
                return parseInt(overview_svg.style("height"), 10) - 80 + height;
            })
            .attr("stroke", "black")
            .attr("stroke-width", "2.5px")
            .on("mouseover", function (d) {
                console.log(d);

                for (var i = 0; i < d.length; i++) {

                    d3.select("#timecurve")
                        .select("#link_" + d[i].post + "_" + (d[i].post + 1))
                        .attr("stroke-width", "4px")
                        .attr("stroke", "yellow");

                    d3.select("#timecurve")
                        .select("#link_" + (d[i].post - 1) + "_" + d[i].post)
                        .attr("stroke-width", "4px")
                        .attr("stroke", "yellow");

                }

            })
            .on("mouseout", function () {
                d3.select("#timecurve")
                    .selectAll("path")
                    .attr("stroke-width", "0px")
                    .attr("stroke", "green");
            });

        timebar.selectAll("circle")
            .data(block_posts)
            .enter()
            .append("circle")
            .attr("id", function (d) {
                return "Date" + d.created_time.getDate();
            })
            .attr("cx", function (d) {
                //console.log(d);
                return x(d.created_time.getDate()) + 40;
            })
            .attr("cy", function (d) {
                return y(d.created_time.getHours()) + parseInt(overview_svg.style("height"), 10) - 80;
            })
            .attr("r", 5)
            .attr("fill", "red")
            .attr("stroke", "black");



    }

    overview.bar = function (accumulation, feature) {

        overview_svg.select("#xaxis").remove();
        overview_svg.select("#yaxis").remove();
        overview_svg.select("#tread").remove();

        var width = parseInt(overview_svg.style("width"), 10) - 80,
            height = 60;

        var max = d3.max(accumulation, function (d) {
                return d[feature];
            }),
            min = d3.min(accumulation, function (d) {
                return d[feature];
            });

        //console.log(max);

        var x = d3.scaleLinear().domain([1, (accumulation.length)]).range([0, width]);
        var y = d3.scaleLinear().domain([max, min]).range([0, height]);

        overview_svg.append("g")
            .attr("id", "xaxis")
            .attr("class", "axis")
            .attr("transform", "translate(40," + (parseInt(overview_svg.style("height"), 10) - 18) + ")")
            .call(d3.axisBottom(x));

        overview_svg.append("g")
            .attr("id", "yaxis")
            .attr("class", "axis")
            .attr("transform", "translate(35," + (parseInt(overview_svg.style("height"), 10) - 80) + ")")
            .call(d3.axisLeft(y).ticks(0));

        var path_data = [];

        for (var i = 0; i < accumulation.length - 1; i++) {
            path_data.push({
                "start": [i + 1, accumulation[i]],
                "end": [i + 2, accumulation[i + 1]]
            });
        }

        overview_svg.append("g")
            .attr("id", "tread")
            .attr("transform", "translate(40," + (parseInt(overview_svg.style("height"), 10) - 80) + ")")
            .selectAll("line")
            .data(path_data)
            .enter()
            .append("line")
            .attr("x1", function (d, i) {
                return x(d.start[0]);
            })
            .attr("y1", function (d, i) {
                return y(d.start[1][feature]);
            })
            .attr("x2", function (d, i) {
                return x(d.end[0]);
            })
            .attr("y2", function (d, i) {
                return y(d.end[1][feature]);
            })
            .attr("stroke-width", "1px")
            .attr("stroke", "black");


    }

    overview.brush = function () {

        var height = parseInt(overview_svg.style("height"), 10) - 85,
            width = parseInt(overview_svg.style("width"), 10);


        var brush = d3.brush()
            .extent([
                [0, 0],
                [width, height]
            ])
            //.on("start", brushstart)
            .on("brush end", brushmoved);

        //console.log(brush);

        overview_svg.append("g")
            .attr("id", "brush")
            .attr("class", "brush")
            .call(brush);

        $("#overview").find("#switch").insertAfter($("#overview").find("#brush"));

        function brushmoved() {
            console.log("success");

            var s = d3.event.selection;

            console.log(s);

            brush_select = [];

            var circle = overview_svg.select("#posts").selectAll(".post_node");

            overview_svg.select("#timecurve").selectAll("path").attr("stroke-width", "0px");
            detial_svg.selectAll("text").remove();

            circle.attr("r", 4).style("opacity", 0.2);
            timeblock_svg.selectAll("g").select("g").selectAll("g").selectAll("path").style("opacity", 0.2);

            for (var i = 0; i < circle._groups[0].length; i++) {

                if (circle._groups[0][i].attributes.cx.value >= s[0][0] && circle._groups[0][i].attributes.cx.value <= s[1][0]) {

                    if (circle._groups[0][i].attributes.cy.value >= s[0][1] && circle._groups[0][i].attributes.cy.value <= s[1][1]) {

                        //console.log(circle._groups[0][i].attributes);

                        //var time = d3.select(circle._groups[0][i])._groups[0][0].__data__.created_time;
                        var post = circle._groups[0][i].attributes.id.nodeValue;

                        d3.select(circle._groups[0][i]).style("opacity", 1);

                        brush_select.push(circle._groups[0][i]);

                        timeblock_svg.select("#" + post).style("opacity", 1);

                        //console.log(timeblock_svg.select("#block" + time.getMonth()).select("g").select("#Date" + (time.getDate() - 1)).select("#pie" + post))

                    }

                }
            }

        }
    }

    overview.multibrush = function () {

        var height = parseInt(overview_svg.style("height"), 10) - 85,
            width = parseInt(overview_svg.style("width"), 10);


        brushes = [];
        count = -1;



        var gBrushes = overview_svg.append('g')
            .attr("class", "brushes");

        $("#overview").find("#switch").insertAfter($("#overview").find(".brushes"));
        $("#overview").find("#save").insertAfter($("#overview").find(".brushes"));
        $("#overview").find("#load").insertAfter($("#overview").find(".brushes"));


        function newBrush() {
            var brush = d3.brush()
                .extent([
                    [0, 0],
                    [width, height]
                ])
                .on("brush", brushed)
                .on("end", brushend);

            count++;

            brushes.push({
                id: count,
                brush: brush
            });

            function brushed() {

                //console.log(d3.brushSelection(this));
                brush_select = [];
                brush_block = [];
                for (var i = 0; i < brushes.length - 1; i++) {
                    var brushsel = document.getElementById('brush-' + brushes[i].id);
                    if (d3.brushSelection(brushsel)) {
                        filter(d3.brushSelection(brushsel), i);
                    }
                }
                selectpost();
                button.Attention();
            }

            function brushend() {

                //console.log(brushes.length);

                // Figure out if our latest brush has a selection
                var lastBrushID = brushes[brushes.length - 1].id;
                var lastBrush = document.getElementById('brush-' + lastBrushID);
                var selection = d3.brushSelection(lastBrush);


                // If it does, that means we need another one
                if (selection && selection[0] !== selection[1]) {
                    newBrush();
                }

                if (brushes.length > 3) {
                    brushes.splice(0, 1);
                }
                console.log(brushes);

                brush_select = [];
                brush_block = [];
                for (var i = 0; i < brushes.length - 1; i++) {
                    var brushsel = document.getElementById('brush-' + brushes[i].id);
                    if (d3.brushSelection(brushsel)) {
                        filter(d3.brushSelection(brushsel), i);
                    }
                }

                selectpost();
                //console.log(brush_block);
                button.Attention();
                var frequent = compare.frequent();
                compare.render(frequent);
                // Always draw brushes
                drawBrushes();
            }
        }

        function filter(extent, index) {

            //console.log(extent);

            var circle = overview_svg.select("#posts").selectAll(".post_node");
            //var temp = [];

            for (var i = 0; i < circle._groups[0].length; i++) {

                if (circle._groups[0][i].attributes.cx.value >= extent[0][0] && circle._groups[0][i].attributes.cx.value <= extent[1][0]) {

                    if (circle._groups[0][i].attributes.cy.value >= extent[0][1] && circle._groups[0][i].attributes.cy.value <= extent[1][1]) {
                        //console.log(d3.select(circle._groups[0][i]).data());
                        brush_block.push({
                            "post": d3.select(circle._groups[0][i]).data()[0],
                            "index": index
                        })

                        brush_select.push({
                            "post": circle._groups[0][i],
                            "index": index
                        });
                    }

                }
            }
            //brush_block.push(temp);
        }

        function selectpost() {

            overview_svg.select("#posts").selectAll(".post_node").attr("r", 4).style("opacity", 0.2);
            detial_svg.select("#detialinfo").remove();
            overview_svg.select("#timecurve").selectAll("path").attr("stroke-width", "0px");

            timeblock_svg.selectAll("g").select("#postsunburst").selectAll("g").selectAll("path").style("opacity", 0.2).attr("stroke", "black");


            for (var i = 0; i < brush_select.length; i++) {
                var post = brush_select[i].post.attributes.id.nodeValue;
                d3.select(brush_select[i].post).style("opacity", 1);
                if (brush_select[i].index == 0) {
                    //timeblock_svg.select("#" + post).style("opacity", 1).attr("stroke", "#872657");
                    timeblock_svg.select("#" + post).style("opacity", 1).attr("stroke", "red");
                } else if (brush_select[i].index == 1) {
                    // timeblock_svg.select("#" + post).style("opacity", 1).attr("stroke", "#0B1746");
                    timeblock_svg.select("#" + post).style("opacity", 1).attr("stroke", "blue");
                }
            }
        }

        function drawBrushes() {

            var brushSelection = gBrushes
                .selectAll('.brush')
                .data(brushes, function (d) {
                    return d.id
                });

            // Set up new brushes
            brushSelection.enter()
                .insert("g", '.brush')
                .attr('class', 'brush')
                .attr('id', function (brush) {
                    return "brush-" + brush.id;
                })
                .each(function (brushObject, i) {
                    //call the brush
                    brushObject.brush(d3.select(this));
                });

            /* REMOVE POINTER EVENTS ON BRUSH OVERLAYS
             *
             * This part is abbit tricky and requires knowledge of how brushes are implemented.
             * They register pointer events on a .overlay rectangle within them.
             * For existing brushes, make sure we disable their pointer events on their overlay.
             * This frees the overlay for the most current (as of yet with an empty selection) brush to listen for click and drag events
             * The moving and resizing is done with other parts of the brush, so that will still work.
             */
            brushSelection
                .each(function (brushObject, i) {

                    d3.select(this)
                        .selectAll(".selection")
                        .attr("fill", function () {
                            if (i == 0) {
                                return "red"
                            } else if (i == 1) {
                                return "blue";
                            } else {
                                return "#777";
                            }
                        });

                    d3.select(this)
                        .attr('class', 'brush')
                        .selectAll('.overlay')
                        .style('pointer-events', function () {
                            var brush = brushObject.brush;
                            if (brushObject.id === count && brush !== undefined) {
                                return 'all';
                            } else {
                                return 'none';
                            }
                        });
                })

            brushSelection.exit()
                .remove();
        }

        newBrush();
        drawBrushes();

    }

    overview.setdrawbrush = function (logdata) {
        console.log(logdata);

        var height = parseInt(overview_svg.style("height"), 10) - 85,
            width = parseInt(overview_svg.style("width"), 10);

        var brush_extent = logdata.brushes;

        brushes.push(brushes[0]);
        brushes.push(brushes[0]);
        count = brush_extent[0].id;

        var brush_state = overview_svg.select(".brushes").select(".brush").attr("id", "brush-" + (brush_extent[brush_extent.length - 1].id + 1));

        //console.log(brush_state);

        var attr = brush_state.node().attributes;
        var length = attr.length;
        var node_name = brush_state.property("nodeName");
        var parent = d3.select(brush_state.node().parentNode);
        var child = d3.select(brush_state.node().childNodes)._groups[0];

        for (var i = 0; i < brush_extent.length; i++) {
            var cloned = parent.append(node_name)
                .attr("id", "brush-" + brush_extent[i].id)
                .style("pointer-events", "all");
            for (var j = 0; j < length; j++) { // Iterate on attributes and skip on "id"
                if (attr[j].nodeName == "id") continue;
                cloned.attr(attr[j].name, attr[j].value);
            }
            append_chile(cloned, child, i);
        }

        function append_chile(cloned, child, index) {
            var length = child[0].length;
            var node_name = child[0][0].nodeName;
            console.log(child[0]);
            for (var i = 0; i < length; i++) {
                var attr = child[0][i].attributes;
                var the_rect = cloned.append(node_name);
                console.log(attr)
                if (attr[0].value == "overlay") {
                    for (var j = 0; j < attr.length; j++) {
                        the_rect.attr(attr[j].name, attr[j].value);
                    }
                    the_rect.style("pointer-events", "none")
                }

                if (attr[0].value == "selection") {
                    for (var j = 0; j < attr.length; j++) {
                        if (attr[j].nodeName == "style") continue;
                        the_rect.attr(attr[j].name, attr[j].value);
                    }
                    the_rect.attr("x", brush_extent[index].brush.x)
                        .attr("y", brush_extent[index].brush.y)
                        .attr("width", brush_extent[index].brush.width)
                        .attr("height", brush_extent[index].brush.height)
                        .attr("fill", brush_extent[index].color);
                }

                if (attr[0].value == "handle handle--n") {
                    for (var j = 0; j < attr.length; j++) {
                        if (attr[j].nodeName == "style") continue;
                        the_rect.attr(attr[j].name, attr[j].value);
                    }
                    the_rect.attr("x", brush_extent[index].brush.x - 3)
                        .attr("y", brush_extent[index].brush.y - 3)
                        .attr("width", brush_extent[index].brush.width + 6)
                        .attr("height", 6);
                }

                if (attr[0].value == "handle handle--e") {
                    for (var j = 0; j < attr.length; j++) {
                        if (attr[j].nodeName == "style") continue;
                        the_rect.attr(attr[j].name, attr[j].value);
                    }
                    the_rect.attr("x", (brush_extent[index].brush.x + brush_extent[index].brush.width) - 3)
                        .attr("y", brush_extent[index].brush.y - 3)
                        .attr("width", 6)
                        .attr("height", brush_extent[index].brush.height + 6);
                }

                if (attr[0].value == "handle handle--s") {
                    for (var j = 0; j < attr.length; j++) {
                        if (attr[j].nodeName == "style") continue;
                        the_rect.attr(attr[j].name, attr[j].value);
                    }
                    the_rect.attr("x", brush_extent[index].brush.x - 3)
                        .attr("y", (brush_extent[index].brush.y + brush_extent[index].brush.height) - 3)
                        .attr("width", brush_extent[index].brush.width + 6)
                        .attr("height", 6);
                }

                if (attr[0].value == "handle handle--w") {
                    for (var j = 0; j < attr.length; j++) {
                        if (attr[j].nodeName == "style") continue;
                        the_rect.attr(attr[j].name, attr[j].value);
                    }
                    the_rect.attr("x", brush_extent[index].brush.x - 3)
                        .attr("y", brush_extent[index].brush.y - 3)
                        .attr("width", 6)
                        .attr("height", brush_extent[index].brush.height + 6);
                }

                if (attr[0].value == "handle handle--nw") {
                    for (var j = 0; j < attr.length; j++) {
                        if (attr[j].nodeName == "style") continue;
                        the_rect.attr(attr[j].name, attr[j].value);
                    }
                    the_rect.attr("x", brush_extent[index].brush.x - 3)
                        .attr("y", brush_extent[index].brush.y - 3)
                        .attr("width", 6)
                        .attr("height", 6);
                }

                if (attr[0].value == "handle handle--ne") {
                    for (var j = 0; j < attr.length; j++) {
                        if (attr[j].nodeName == "style") continue;
                        the_rect.attr(attr[j].name, attr[j].value);
                    }
                    the_rect.attr("x", (brush_extent[index].brush.x + brush_extent[index].brush.width) - 3)
                        .attr("y", brush_extent[index].brush.y - 3)
                        .attr("width", 6)
                        .attr("height", 6);
                }

                if (attr[0].value == "handle handle--se") {
                    for (var j = 0; j < attr.length; j++) {
                        if (attr[j].nodeName == "style") continue;
                        the_rect.attr(attr[j].name, attr[j].value);
                    }
                    the_rect.attr("x", (brush_extent[index].brush.x + brush_extent[index].brush.width) - 3)
                        .attr("y", (brush_extent[index].brush.y + brush_extent[index].brush.height) - 3)
                        .attr("width", 6)
                        .attr("height", 6);
                }

                if (attr[0].value == "handle handle--sw") {
                    for (var j = 0; j < attr.length; j++) {
                        if (attr[j].nodeName == "style") continue;
                        the_rect.attr(attr[j].name, attr[j].value);
                    }
                    the_rect.attr("x", brush_extent[index].brush.x - 3)
                        .attr("y", (brush_extent[index].brush.y + brush_extent[index].brush.height) - 3)
                        .attr("width", 6)
                        .attr("height", 6);
                }

            }
        }

        console.log(brushes);

    }



})(window.overview = window.overview || {});