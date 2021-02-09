# A Nordpool price graph widget for HADashboard

This is a graph widget for HADashboard that uses plot.ly as the graph engine for plotting data from the HA Nordpool integration.

The graph shows the price for today and tomorrow (when available), and is colorized to reflect low or high current price.

Features:

Show the current day electricity price in a graph. If tomorrow's prices are available, display them too.

If the price is above the daily average and above a set limit, the graph will be colored red. Otherwise green.

The prices are (currently) in EUR. If another currency is desired, use the exchange_rate parameter, which will use a HA sensor contining the exchange rate to your current. 

To use it, you need to:
1. Make sure you have configured the nordpool integration in Home Assistant https://github.com/custom-components/nordpool
2. Copy the basenordpool folder to your custom_widgets folder
3. Copy the nordpool.yaml file to your custom_widgets folder
4. Copy the custom_css/nordpool directory to yout custom_css folder 
5. Define a widget:
````yaml
# Example of a simple widget definition showing a single entity:
np:
    widget_type: nordpool
    entities:
      - sensor.nordpool_kwh_se3_sek_3_10_025  # The entity_id to be plotted.
    units:  "Öre/kWh"   # The unit_of_measurement for your sensors/entities
    title: "Elpris"  # Widget title
    fill: "tozeroy" # options are  "none" | "tozeroy" | "tozerox" | "tonexty" | "tonextx" | "toself" 
    exchange_rate: sensor.exchange_rate # optional, if you want to scale the price with a currency exchange rate
    always_low: 10 # Everything below this is always considered low price
````

6. Add the widget to your dashboard.yaml file. 

---
Based on code from  
[HADashboard-widgets](https://github.com/tjntomas/HADashboard-widgets), which is Copyright (c) 2018 Tomas Jansson and also includes the Plotly.js library, Copyright Plotly Inc.