const NodeHelper = require("node_helper");
const { Tado } = require("node-tado-client");
const logger = require("mocha-logger");
const fs = require("fs");
const path = require("path");

// Path to the token file in the module directory
const TOKEN_FILE = path.join(__dirname, "tado_refresh_token.json");

module.exports = NodeHelper.create({
    tadoClient: null,
    tadoMe: {},
    tadoHomes: [],
    refreshToken: null,

    start: function() {
        this.tadoClient = new Tado();

        // Load a previously saved refresh token, if available
        if (fs.existsSync(TOKEN_FILE)) {
            try {
                const data = fs.readFileSync(TOKEN_FILE, "utf8");
                const tokenData = JSON.parse(data);
                if (tokenData && tokenData.refresh_token) {
                    this.refreshToken = tokenData.refresh_token;
                    logger.log("MMM-Tado: Refresh token loaded.");
                }
            } catch (err) {
                logger.error("MMM-Tado: Error loading refresh token", err);
            }
        } else {
            logger.log("MMM-Tado: No saved refresh token found.");
        }

        // Set the token callback to save the refresh token whenever a new token is issued
        this.tadoClient.setTokenCallback((token) => {
            logger.log("MMM-Tado: New token received:", token);
            if (token && token.refresh_token) {
                this.refreshToken = token.refresh_token;
                try {
                    fs.writeFileSync(TOKEN_FILE, JSON.stringify(token), "utf8");
                    logger.log("MMM-Tado: Refresh token saved.");
                } catch (err) {
                    logger.error("MMM-Tado: Error saving refresh token", err);
                }
            }
        });
    },

    getData: async function() {
        try {
            // Authenticate with the saved refresh token (if available)
            const [verify, futureToken] = await this.tadoClient.authenticate(this.refreshToken);
            if (verify) {
                logger.log("MMM-Tado: Device authentication required. Please visit the following URL:");
                logger.log(verify.verification_uri_complete);
                // Manual confirmation by the user is required here
            }
            await futureToken;
            logger.log("MMM-Tado: Successfully authenticated.");

            // Fetch user information
            this.tadoMe = await this.tadoClient.getMe();
            logger.log("MMM-Tado: User information retrieved.");

            // Fetch all homes and their zones
            this.tadoHomes = [];
            for (const home of this.tadoMe.homes) {
                logger.log(`MMM-Tado: Processing home: ${home.name}`);
                const homeInfo = {
                    id: home.id,
                    name: home.name,
                    zones: []
                };
                this.tadoHomes.push(homeInfo);

                const zones = await this.tadoClient.getZones(home.id);
                logger.log(`MMM-Tado: Found ${zones.length} zone(s) for ${home.name}.`);
                for (const zone of zones) {
                    const zoneInfo = {
                        id: zone.id,
                        name: zone.name,
                        type: zone.type,
                        state: {}
                    };
                    homeInfo.zones.push(zoneInfo);
                    zoneInfo.state = await this.tadoClient.getZoneState(home.id, zone.id);
                    logger.log(`MMM-Tado: Retrieved state for zone ${zone.name}.`);
                }
            }

            // Send the collected data to the frontend module
            this.sendSocketNotification("NEW_DATA", {
                tadoMe: this.tadoMe,
                tadoHomes: this.tadoHomes
            });
            logger.log("MMM-Tado: Data sent to the frontend.");
        } catch (err) {
            logger.error("MMM-Tado: Error in getData:", err);
        }
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "CONFIG") {
            this.config = payload;
            // Start the initial data fetch
            this.getData();
            // Regularly update the data according to the updateInterval
            setInterval(() => {
                this.getData();
            }, this.config.updateInterval);
        }
    }
});
