(function () {
    window.Components.Pages.TownLanding = {

        template: `
<div>

    <div>

        <div id="main" class="container">
            <h4>Weather and forecast for {{ $root.town.name }}</h4>
            <br>
            <div class="row">
                <div v-if="weather.length > 0" id="table" class="col-sm-3">
                    Current Weather
                    <table id="weatherTable">
                        <tr>
                            <td><img :src="weather[0].icon"></td>
                            <td><h5>{{weather[0].temp}} °C</h5></td>
                        </tr>
                        <tr>
                            <td colspan=10>{{weather[0].desc}}</td>
                        </tr>
                        <tr>
                            <td>Wind:</td>
                            <td align="right">{{weather[0].wind}} m/s</td>
                        </tr>
                        <tr>
                            <td>Clouds:</td>
                            <td align="right">{{weather[0].clouds}}%</td>
                        </tr>
                        <tr>
                            <td>Sunrise:</td>
                            <td align="right">{{weather[0].sunrise}}</td>
                        </tr>
                        <tr>
                            <td>Sunset:</td>
                            <td align="right">{{weather[0].sunset}}</td>
                        </tr>
                    </table>
                </div>
                <div id="forecast" class="col-sm-9">
                    Forecast
                    <div id="graph"></div>
                </div>
            </div>
            <hr>
            <div class="row">
                <div v-if="description != null" id="description">
                    <h5>What to expect in Tayside, Central & Fife</h5>
                    <p><b>Today:</b> {{description.Period[0].Paragraph[0].$}}</p>
                    <p><b>{{description.Period[0].Paragraph[1].title}}</b> {{description.Period[0].Paragraph[1].$}}</p>
                    <p><b>{{description.Period[0].Paragraph[2].title}}</b> {{description.Period[0].Paragraph[2].$}}</p>
                    <p><b>{{description.Period[1].Paragraph.title}}</b> {{description.Period[1].Paragraph.$}}</p>
                    <p><b>{{description.Period[2].Paragraph.title}}</b> {{description.Period[2].Paragraph.$}}</p>
                    <p><b>{{description.Period[3].Paragraph.title}}</b> {{description.Period[3].Paragraph.$}}</p>
                    <p>Forecast provided by the <a href="https://www.metoffice.gov.uk" target="_blank">UK Met Office</a>
                    </p>
                </div>
            </div>
        </div>

    </div>

</div>

        `,

        data() {
            return {
                weather: '',
                forecast: null,
                description: null
            };
        },

        watch: {
            forecast() {
                // checks for changes to the forecast and calls function to redraw
                // the graph if changes are detected
                this.weatherGraph();
            }
        },

        methods: {
            /**
             * Handlers that send a request to the internal weather API to get the 
             * current and forecast weather data based on each town ID.
             * 
             */

            getCurrentWeather() {

                if (!this.$root.town) return;

                // make a call to the internal weather API to get current weather;
                // sends over town weather ID
                let weatherID = this.$root.town.weatherID;


                fetch('/getCurrentWeather/' + weatherID)
                    .then(res => res.json())
                    .then(data => this.weather = data)
                    .catch(err => console.log(err));
            },

            getForecast() {

                if (!this.$root.town) return;


                // make a call to the internal weather API to get weather forecastl
                // sends over town weather ID
                let weatherID = this.$root.town.weatherID;

                fetch('/getForecast/' + weatherID)
                    .then(res => res.json())
                    .then(data => this.forecast = data)
                    .catch(err => console.log(err));
            },

            getDescription() {
                // make a call to the internal weather API to get text weather description
                // the same description is provided for the whole area so no need to specify town
                fetch('/getDescription/')
                    .then(res => res.json())
                    .then(data => {
                        this.description = data.RegionalFcst.FcstPeriods;
                    })
                    .catch(err => console.log(err));
            },

            // draw weather graph based on latest data
            // the below code was based on CS5044 D3 tutorial 4 material from
            // https://studres.cs.st-andrews.ac.uk/CS5044/Tutorials/D3/d3Tutorial_4_timeSeries.pdf
            weatherGraph() {
                let data = this.forecast;

                d3.select("#graph").html("");

                let margin = 20;
                let width = 600;
                let height = 230;

                // format data to make it human-friendly
                let formatTime = d3.timeFormat("%d %b %H:%M");

                let formatRain = d3.format(".2f");
                let formatTemp = d3.format(".1f");

                function format(e) {
                    if (isNaN(e)) {
                        return 0;
                    }
                    else {
                        return formatRain(e);
                    }
                };

                // specify graph axes; slice the data sent over to only
                // display forecast for the next 2 days
                let temp_extent = d3.extent(data.list.slice(0, 14), function (d) {
                    return Math.trunc(d.main.temp);
                });

                let temp_scale = d3.scaleLinear()
                    .domain([temp_extent[0] - 3, temp_extent[1] + 3])
                    .range([height - margin, margin]);

                let time_extent = d3.extent(data.list.slice(0, 14), function (d) {
                    return d.dt * 1000;
                });

                let time_scale = d3.scaleTime()
                    .domain(time_extent) //.domain([time_extent[0], time_extent[1]])
                    .range([margin + 10, width - margin]);

                let x_axis = d3.axisBottom(time_scale)
                    .ticks(d3.timeHour.every(3))
                    .tickFormat(d3.timeFormat("%H:%M"));

                let y_axis = d3.axisLeft(temp_scale);

                let line = d3.line()
                    .x(function (d) {
                        return time_scale(d.dt * 1000);
                    })
                    .y(function (d) {
                        return temp_scale(Math.trunc(d.main.temp));
                    });

                let svgElement = d3.select("#graph")
                    .append("svg")
                    .attr("id", "graphWeather")
                    .attr("width", width)
                    .attr("height", height);

                // add tooltip with further weather data which
                // will appear on hover
                let tooltip = d3.select("#graph").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);

                // apend graph circles and line
                svgElement.append("path")
                    .attr("d", line(data.list.slice(0, 14)))
                    .attr("class", "temp");

                svgElement.selectAll("circle.list")
                    .data(data.list.slice(0, 14))
                    .enter()
                    .append("circle")
                    .attr("class", "temp");

                d3.selectAll("circle")
                    .attr("cy", function (d) {
                        return temp_scale(Math.trunc(d.main.temp));
                    })
                    .attr("cx", function (d) {
                        return time_scale(d.dt * 1000);
                    })
                    .attr("r", 4)
                    .on("mouseover", function (d) {
                        tooltip.transition()
                            .duration(200)
                            .style("opacity", .9);
                        tooltip.html(formatTime(d.dt * 1000) +
                            "<br><b>Temperature</b>: " + formatTemp(d.main.temp) + " °C<br>");
                    })
                    .on("mouseout", function (d) {
                        tooltip.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });

                // call axes
                d3.select("#graphWeather")
                    .append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + (height - margin) + ")")
                    .call(x_axis);

                d3.select("#graphWeather")
                    .append("g")
                    .attr("class", "y axis")
                    .attr("transform", "translate(" + margin + ",0)")
                    .call(y_axis);
            }

        },

        mounted() {
            this.getCurrentWeather();
            this.getForecast();
            this.getDescription();

            Events.$on('town-switched', () => {
                // update current weather and forecast each time
                // a town view is switched
                this.getCurrentWeather();
                this.getForecast();
            });
        },

    };
})();
