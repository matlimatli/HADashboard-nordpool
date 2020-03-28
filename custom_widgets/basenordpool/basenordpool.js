function basenordpool(widget_id, url, skin, parameters)
{
	self = this
	self.widget_id = widget_id
	self.parameters = parameters
	self.OnStateAvailable = OnStateAvailable
	self.OnStateUpdate = OnStateUpdate
	self.states = {}
	var l = Object.keys(self.parameters.entities).length
	var callbacks = []
	var monitored_entities =  []

	for (entity of self.parameters.entities){
		monitored_entities.push({"entity": entity, "initial": self.OnStateAvailable, "update": self.OnStateUpdate})
	}
	
		// Some default values
	self.PAPER_BACKGROUND_COLOR = 'rgba(200,200,200,0)'
	self.GRID_COLOR = "rgb(180,180,180)"
	self.TITLE_COLOR = "rgb(204,204,204)"
	self.X_AXIS_TEXT_COLOR = self.parameters.css.x_axis_text_color
	self.Y_AXIS_LEGEND_COLOR = self.parameters.css.y_axis_legend_color
	self.Y_AXIS_TEXT_COLOR = "rgb(204,204,204)"//self.parameters.css.y_axis_text_color
	// Some default colors for the traces.

	self.TRACE_COLORS = ["rgba(100,220,40,0.7)", "rgba(220,20,20,0.7)"]

	self.FILL_COLORS = [ "rgba(100,220,40,0.4)", "rgba(220,20,20,0.4)"]
	self.MARKER_COLORS = ["rgba(255, 0, 0, 0.7)", "rgba(20, 120, 220, 0.7)"]
	
	self.HA_Data = HA_Data

	self.TIME_ZONE = Settings(self, 'time_zone','Europe/Stockholm')
	self.LOCALE = Settings(self, 'locale','sv')
	
	self.PLOT_BG_COLOR = 'rgba(40,40,40,0)'
	self.TRACE_NAME_COLOR = '#888888'
	self.CANVAS_HTML_BODY_START = '<div id="GRAPH_CANVAS" class="canvasclass widget" data-bind="attr:{style: widget_style}" width="100%" height="100%"'
	self.CANVAS_HTML_BODY_END = '"></div>'
								
	WidgetBase.call(self, widget_id, url, skin, parameters, monitored_entities, callbacks)
	self.DataSeriesArray = new Array ()
	self.index = 1
	self.low_price = false
	self.TomorrowAvailable = false;

	setInterval(Plot, 5000, self);

	function OnStateUpdate(self, state){
		// Log that new data has been received.
		Logger(self,"New value for " + self.parameters.entities[0] + ": " + state.state)
		HA_Data(self, state)
	}

	function OnStateAvailable(self, state){
		Logger(self,"available value for " + self.parameters.entities[0] + ": " + state.state)
		HA_Data(self, state)
	}
	
	function Plot(self)
	{  
		var GRAPH_CANVAS = element(self, 'canvasclass')
		GRAPH_CANVAS.outerHTML = self.CANVAS_HTML_BODY_START + self.CANVAS_HTML_BODY_END
		GRAPH_CANVAS = element(self, 'canvasclass') // Yes, this duplicate line is needed since the line 
													// above destroys the element by modifying outerHTML.

		var d_width = document.getElementById(self.widget_id).offsetWidth
		var min = self.parameters.min
		var max = self.parameters.max
		self.parameters.plot = GRAPH_CANVAS
		var canvas_height = d_width

		var x_grid_color = self.css.grid_color
		var y_grid_color = self.GRID_COLOR

		if (self.TomorrowAvailable)
		{
			tickvals = [12, 24, 36]
			ticktext = ["12:00", "0:00", "12:00"]
		}
		else
		{
			tickvals = [12]
			ticktext = ["12:00"]
		}

		var x_axis = {
					showgrid: false,
					zeroline: true,
					showline: true,
					mirror: 'ticks',
					gridcolor: x_grid_color,
					gridwidth: 1,
					zerolinecolor: self.css.grid_color,
					linecolor: self.css.grid_color,
					zerolinewidth: 1,
					linewidth: 1,
					tickvals: tickvals,
					ticktext: ticktext,
					tickfont: {		
					size: 10,
					color: self.Y_AXIS_TEXT_COLOR
  					},
showticklabels: true
		  		 }
		    
		var y_axis = {
					range: [min,max],
					showgrid: true,
					zeroline: true,
					showline: false,
					mirror: 'ticks',
					gridcolor: y_grid_color,
					gridwidth: 1, 
					zerolinecolor: self.css.grid_color,
					linecolor: self.css.grid_color,
					zerolinewidth: 1,
					linewidth: 1,
					tickfont: {		
						size: 10,
						color: self.Y_AXIS_TEXT_COLOR
					  },
		  		 }
		var now = new Date()
		var current_time = now.getHours() + now.getMinutes()/60.0
		if (self.low_price)
		{
			var colorIndex = 0
		}
		else
		{
			var colorIndex = 1
		}
		var price = self.DataSeriesArray[1][now.getHours()]
		var display = {
					margin: { t:32,l: 15, r: 5 , b: 30 },
					titlefont: {"size": 12,"color": self.TITLE_COLOR, "font-weight":500},
					title: self.parameters.title + ": "+price.toFixed() + " " + self.parameters.units,
					paper_bgcolor: self.PAPER_BACKGROUND_COLOR,
					plot_bgcolor: self.PLOT_BG_COLOR,
					width: d_width, height: canvas_height,
							shapes: [
								{
									type: 'line',
									yref: 'paper',
									x0: current_time,
									y0: 0,
									x1: current_time,
									y1: 1,
									line:{
										color: self.MARKER_COLORS[colorIndex],
										width: 3,
										dash:'dot'
									}
								},
								{
									type: 'line',
									yref: 'paper',
									x0: 12,
									y0: 0,
									x1: 12,
									y1: 1,
									line:{
										color: "rgb(180,180,180)",
										width: 1,
										dash:'dot'
									}
								}, self.TomorrowAvailable?
								{
									type: 'line',
									yref: 'paper',
									x0: 24,
									y0: 0,
									x1: 24,
									y1: 1,
									line:{
										color: "rgb(180,180,180)",
										width: 1,
										dash:'line'
									}
								}:null,
								self.TomorrowAvailable?{
									type: 'line',
									yref: 'paper',
									x0: 36,
									y0: 0,
									x1: 36,
									y1: 1,
									line:{
										color: "rgb(180,180,180)",
										width: 1,
										dash:'dot'
									}
								}:null
								],		
					xaxis: x_axis,
					yaxis: y_axis
		}
		
		var traces = new Array()
		var traceColors = 	self.TRACE_COLORS
		var fillColors = 	self.FILL_COLORS
		
		var d_fill = ""

		d_shape = Settings(self,'shape','hv')
		d_fill = Settings(self,'fill','')
		traces[0] = {
			type: "scatter",
			x: self.DataSeriesArray[0],
			y: self.DataSeriesArray[1],
			mode: 'lines', line:{
									color: traceColors[colorIndex],
									width: 2,shape: d_shape},
									name: "elspot", 
									fill: d_fill, 
									fillcolor: fillColors[colorIndex] 
								}		
		
		try {
			Plotly.plot( GRAPH_CANVAS, traces,display, {displayModeBar: false})
		}
		catch(err) {}
	}

	function HA_Data(self, state){

		var today = state.attributes.today
		var tomorrow = state.attributes.tomorrow
		self.low_price = state.attributes["low price"]
		self.DataSeriesArray[0] = new Array()
		self.DataSeriesArray[1] = new Array()

		self.DataSeriesArray[1].push(...today)
		if ((today.length === tomorrow.length && today.every(function(value, index) { return value === tomorrow[index]})) || 
			tomorrow.length < 12)
		{
			self.TomorrowAvailable = false;
			self.DataSeriesArray[1].push(self.DataSeriesArray[1][23]) // Duplicate last to ensure last hour is drawn
			self.DataSeriesArray[0] = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23, 24]
		}
		else
		{
			self.TomorrowAvailable = true;
			self.DataSeriesArray[1].push(...tomorrow)
			self.DataSeriesArray[0] = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47]
		}

		Plot(self)

	}

    // Helper function to return either a default value or a value passed in parameters.
	function Settings(self,parameter,default_value)
	{
		if(parameter in self.parameters){
			return self.parameters[parameter]
		}
		else{
			return default_value
		}
	}


	// Helper function to return an element from class name
	function element(self, class_name)
    {
        return document.getElementById(self.widget_id).getElementsByClassName(class_name)[0] 
	}
	
	function Logger(self,message){
	
		if ("log" in self.parameters){
			console.log(message)
		}
	}

}