/**
 * Updated MMM-Tado Module with the new login flow
 */
Module.register("MMM-Tado", {
    // Standard configuration
    defaults: {
        updateInterval: 300000,
        // No user data needed here – the refresh token is managed by the NodeHelper
        refreshToken: "",
        // Use globally defined units (metric/imperial)
        units: "metric"
    },

    tadoMe: {},
    tadoHomes: [],

    getStyles: function () {
        return [ this.file('css/MMM-Tado.css') ];
    },

    start: function () {
        // If units are set in the global config object, use them
        if (config && config.units) {
            this.config.units = config.units;
        }
        // Send the configuration to the NodeHelper
        this.sendSocketNotification('CONFIG', this.config);
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === 'NEW_DATA') {
            this.tadoMe = payload.tadoMe;
            this.tadoHomes = payload.tadoHomes;
            this.updateDom();
        }
    },

    // Creates the DOM structure to display the tado° data
    getDom: function () {
        let self = this;
        let wrapper = document.createElement("div");
        wrapper.className = "tado-info";

        self.tadoHomes.forEach(home => {
            let homeWrapper = document.createElement("div");
            homeWrapper.className = "tado-home";

            let logoWrapper = document.createElement("i");
            logoWrapper.className = "tado-icon-tado_logo tado-logo";
            homeWrapper.appendChild(logoWrapper);

            let tableWrapper = document.createElement("table");
            tableWrapper.className = "tado-table small";

            home.zones.forEach(zone => {
                let rowWrapper = document.createElement("tr");

                if (zone.type === "HOT_WATER") {
                    let firstTd = document.createElement("td");
                    firstTd.className = "tado-table-name";
                    let zoneName = document.createElement("span");
                    zoneName.innerText = zone.name;
                    firstTd.appendChild(zoneName);
                    rowWrapper.appendChild(firstTd);

                    let secondTd = document.createElement("td");
                    secondTd.className = "tado-table-data";
                    let tempSpan = document.createElement("span");
                    let tempIcon = document.createElement("i");
                    tempIcon.className = "fa fa-thermometer-half";
                    tempSpan.appendChild(tempIcon);
                    let tempText = "";
                    if (zone.state.setting.temperature == null) {
                        tempText = zone.state.setting.power;
                    } else {
                        if (self.config.units === "metric") {
                            tempText = zone.state.setting.temperature.celsius + "°";
                        } else {
                            tempText = zone.state.setting.temperature.fahrenheit + "°";
                        }
                    }
                    tempSpan.appendChild(document.createTextNode(tempText));
                    secondTd.appendChild(tempSpan);
                    rowWrapper.appendChild(secondTd);
                }
                else if (zone.type === "HEATING") {
                    let firstTd = document.createElement("td");
                    firstTd.className = "tado-table-name";
                    let zoneName = document.createElement("span");
                    zoneName.innerText = zone.name;
                    firstTd.appendChild(zoneName);
                    rowWrapper.appendChild(firstTd);

                    let secondTd = document.createElement("td");
                    secondTd.className = "tado-table-data";

                    // current temperature
                    let tempSpan = document.createElement("span");
                    tempSpan.className = "bright";
                    let tempIcon = document.createElement("i");
                    tempIcon.className = "fa fa-thermometer-half";
                    tempSpan.appendChild(tempIcon);
                    let currentTemp = "";
                    if (self.config.units === "metric") {
                        currentTemp = zone.state.sensorDataPoints.insideTemperature.celsius + "°";
                    } else {
                        currentTemp = zone.state.sensorDataPoints.insideTemperature.fahrenheit + "°";
                    }
                    tempSpan.appendChild(document.createTextNode(currentTemp));
                    if (zone.state.activityDataPoints.heatingPower.percentage > 0) {
                        let heatIcon = document.createElement("i");
                        heatIcon.className = "fa fa-fire bright";
                        tempSpan.appendChild(heatIcon);
                    }
                    secondTd.appendChild(tempSpan);

                    // target temperature
                    let targetSpan = document.createElement("span");
                    targetSpan.className = "xsmall";
                    let targetIcon = document.createElement("i");
                    targetIcon.className = "fa fa-thermometer-half";
                    targetSpan.appendChild(targetIcon);
                    let targetTemp = "";
                    if (zone.state.setting.temperature == null) {
                        targetTemp = zone.state.setting.power;
                    } else {
                        if (self.config.units === "metric") {
                            targetTemp = zone.state.setting.temperature.celsius + "°";
                        } else {
                            targetTemp = zone.state.setting.temperature.fahrenheit + "°";
                        }
                    }
                    targetSpan.appendChild(document.createTextNode(targetTemp));
                    secondTd.appendChild(targetSpan);

                    let br = document.createElement("br");
                    secondTd.appendChild(br);

                    // humidity
                    let humiditySpan = document.createElement("span");
                    let humidityIcon = document.createElement("i");
                    humidityIcon.className = "fa fa-tint";
                    humiditySpan.appendChild(humidityIcon);
                    humiditySpan.appendChild(document.createTextNode(zone.state.sensorDataPoints.humidity.percentage + "%"));
                    secondTd.appendChild(humiditySpan);

                    rowWrapper.appendChild(secondTd);
                }
                else if (zone.type === "AIR_CONDITIONING") {
                    let firstTd = document.createElement("td");
                    firstTd.className = "tado-table-name";
                    let zoneName = document.createElement("span");
                    zoneName.innerText = zone.name;
                    firstTd.appendChild(zoneName);
                    rowWrapper.appendChild(firstTd);

                    let secondTd = document.createElement("td");
                    secondTd.className = "tado-table-data";

                    // current temperature
                    let tempSpan = document.createElement("span");
                    tempSpan.className = "bright";
                    let tempIcon = document.createElement("i");
                    tempIcon.className = "fa fa-thermometer-half";
                    tempSpan.appendChild(tempIcon);
                    let currentTemp = "";
                    if (self.config.units === "metric") {
                        currentTemp = zone.state.sensorDataPoints.insideTemperature.celsius + "°";
                    } else {
                        currentTemp = zone.state.sensorDataPoints.insideTemperature.fahrenheit + "°";
                    }
                    tempSpan.appendChild(document.createTextNode(currentTemp));
                    if (zone.state.setting.mode === "HEAT") {
                        let heatIcon = document.createElement("i");
                        heatIcon.className = "fa fa-fire bright";
                        tempSpan.appendChild(heatIcon);
                    }
                    else if (zone.state.setting.mode === "COOL") {
                        let coolIcon = document.createElement("i");
                        coolIcon.className = "fa fa-snowflake bright";
                        tempSpan.appendChild(coolIcon);
                    }
                    secondTd.appendChild(tempSpan);

                    // target temperature
                    let targetSpan = document.createElement("span");
                    targetSpan.className = "xsmall";
                    let targetIcon = document.createElement("i");
                    targetIcon.className = "fa fa-thermometer-half";
                    targetSpan.appendChild(targetIcon);
                    let targetTemp = "";
                    if (zone.state.setting.temperature == null) {
                        targetTemp = zone.state.setting.power;
                    } else {
                        if (self.config.units === "metric") {
                            targetTemp = zone.state.setting.temperature.celsius + "°";
                        } else {
                            targetTemp = zone.state.setting.temperature.fahrenheit + "°";
                        }
                    }
                    targetSpan.appendChild(document.createTextNode(targetTemp));
                    secondTd.appendChild(targetSpan);

                    let br = document.createElement("br");
                    secondTd.appendChild(br);

                    // humidity
                    let humiditySpan = document.createElement("span");
                    let humidityIcon = document.createElement("i");
                    humidityIcon.className = "fa fa-tint";
                    humiditySpan.appendChild(humidityIcon);
                    humiditySpan.appendChild(document.createTextNode(zone.state.sensorDataPoints.humidity.percentage + "%"));
                    secondTd.appendChild(humiditySpan);

                    rowWrapper.appendChild(secondTd);
                }
                else {
                    // do not display other zone types
                    return;
                }
                tableWrapper.appendChild(rowWrapper);
            });

            homeWrapper.appendChild(tableWrapper);
            wrapper.appendChild(homeWrapper);
        });
        return wrapper;
    }
});
