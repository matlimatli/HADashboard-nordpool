# A Nordpool price graph widget for HADashboard

This is a graph widget for HADashboard that uses plot.ly as the graph engine for plotting data from the HA Nordpool integration.

Features:

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
````

6. Add the widget to your dashboard.yaml file. 

Based on code from  
![HADashboard-widgets](https://github.com/tjntomas/HADashboard-widgets)
which is Copyright (c) 2018 Tomas Jansson
and also includes the Plotly.js library, Copyright Plotly Inc.