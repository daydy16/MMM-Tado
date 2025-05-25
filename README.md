# MagicMirror Module: MMM-Tado
A MagicMirror Module for your Tado Smart Thermostat. 

Forked from https://github.com/WouterEekhout and updated with the new login flow supported by Tado.

> ⚠️ **Deprecation Notice:**  
> I no longer use or maintain this plugin.  
> I suggest switching to [MMM-HomeAssistantDisplay by wonderslug](https://github.com/wonderslug/MMM-HomeAssistantDisplay).

### The module displays the following information:

* A symbol to show if the heater is currently active.
* The current temperature
* The target temperature
* The humidity
* The hot water temperature, if not available; the current power state

### Screenshot
![screenshot](https://github.com/WouterEekhout/MMM-Tado/blob/master/img/screenshot.png)

## Installation

In your terminal, go to your MagicMirror's Module folder:
```
cd ~/MagicMirror/modules
```

Clone this repository:
```
git clone https://github.com/daydy16/MMM-Tado
```

Install NPM dependencies from inside the MMM-Tado folder:
```
cd MMM-Tado/
npm install
```

## Configuration

Add the module to the `config.js` file of your Magic Mirror installation:
```javascript
{
    module: 'MMM-Tado',
    position: 'top_right',
    config: {
        updateInterval: 60000 // Update interval in milliseconds
    }
}
```

## Authentication

The first time you run the module, you will need to authenticate with the Tado API. The module will log a URL that you need to visit in your browser to complete the authentication process. Check the logs for a message like this:
```
MMM-Tado: Device authentication required. Please visit the following URL:
https://example.com/verify?user_code=XXXX
```
Visit the URL in your browser and follow the instructions to authenticate the module with your Tado account.

## Usage

Once authenticated, the module will automatically fetch data from your Tado account and display it on your Magic Mirror. The data will be updated at the interval specified in the configuration.

## Configuration options

The following properties can be configured:


<table width="100%">
	<thead>
		<tr>
			<th>Option</th>
			<th width="100%">Description</th>
		</tr>
	</thead>
	<tbody>
            <td><code>updateInterval</code></td>
            <td><b>Optional</b> - In milliseconds the update interval. Default: <code>300000</code> 
            (5 minutes). This value cannot be lower than <code>300000</code>. Otherwise users get a
             <code>Tado block</code>.</td>
        </tr>
        <tr>
            <td><code>units</code></td>
            <td>
                What units to use. This property can be set in the general configuration settings. See the <a href="https://docs.magicmirror.builders/getting-started/configuration.html#general">MagicMirror Documentation</a> for more information.
            </td>
        </tr>
	</tbody>
</table>

---
<p align="center">
    <a href="https://www.tado.com">This module is powered by the Tado API.</a>    
</p>


## Credits
This module is highly inspired by the 
MMM-Toon module: https://github.com/MichMich/MMM-Toon.

Using the NPM package node-tado-client: https://github.com/mattdavis90/node-tado-client
