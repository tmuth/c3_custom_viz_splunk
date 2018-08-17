define([
            'jquery',
            'underscore',
            'api/SplunkVisualizationBase',
            'api/SplunkVisualizationUtils',
            'd3',
            'c3'
        ],
        function(
            $,
            _,
            SplunkVisualizationBase,
            SplunkVisualizationUtils,
            d3,
            c3
        ) {

    return SplunkVisualizationBase.extend({

        initialize: function() {
            // Save this.$el for convenience
            this.$el = $(this.el);

            // Add a css selector class
            this.$el.attr('id','lineChartContainer');
        },

        getInitialDataParams: function() {
            return ({
                outputMode: SplunkVisualizationBase.ROW_MAJOR_OUTPUT_MODE,
                count: 10000
            });
        },

        updateView: function(data, config) {

          if(data.rows.length < 1){
              return;
          }

          $('#lineChartContainer').empty();

          // get data
          //var dataRows = data.results;

           // print the data object returned by Splunk
           console.log('Data:',data);

           // Create a global variable so we can work with the array in the console.
           //window.data1 = data

           // this function extracts a column of an array
           function arrayColumn(arr, n) {
              return arr.map(x=> x[n]);
            }

            function parseDateColumn(arr) {
               return arr.map(x=> Date.parse(x));
             }

            var dataArray=[];

            for (i in data.fields) {
                if(data.fields[i].name){
                  console.log(data.fields[i]);
                  // call arrayColumn with data1.rows[i] and assign to temp array
                  var tmpArray = arrayColumn(data.rows,i);
                  if(data.fields[i].name=='_time'){
                    tmpArray = parseDateColumn(tmpArray);
                  }
                  // prepend data1.fields[i].name
                  tmpArray=[data.fields[i].name, ...tmpArray];
                  // push that array into dataArray so we end up with an array of arrays
                  dataArray.push(tmpArray);
                }
            }

            console.log(dataArray);
            console.log('Tyler');


        // Get back the first column in the array into a new 1-dimensional array (for now)
        //var data1 = arrayColumn(data.rows, 0);
        // all elements come out wrapped in quotes which are text so convert to numbers
        // but it appears we don't need to do this
        //var data1=data1.map(Number);

        //console.log(data1);
        // get the column name from data and prepend it to the array as this is what C3 expects:
        // https://c3js.org/reference.html#data-columns
        //data1=data1.unshift(data.fields[0].name);

        ///console.log([data.fields[0].name, ...data1]);
        // Extract the field name for column 0 and glue it onto the beginning of the array
        //data1=[data.fields[0].name, ...data1]

        //console.log(data1);

        //console.log(Array.isArray(data1));
        var xAxisType = 'indexed'; //indexed|category|timeseries
        if(data.fields[0].name=='_time'){
          xAxisType = 'timeseries';
        }


        var sSearches = 'display.visualizations.custom.c3_custom_viz_app.spline.'

        rotate = config[sSearches + 'rotate_Angle'] || 0,

        showXLabel = (config[sSearches + 'xDisplay'] === 'true'),
        showYLabel = (config[sSearches + 'yDisplay'] === 'true'),
        rSlider = (config[sSearches + 'showRSlider'] === 'true'),

        dispHigh = (config[sSearches + 'showHigh'] === 'true'),
        dispLow = (config[sSearches + 'showLow'] === 'true'),

        tHighCol = config[sSearches + 'thColor'] || '#1556C5',
        tLowCol = config[sSearches + 'tlColor'] || '#FFA500',

        dispLegend = (config[sSearches + 'showLegend'] === 'true') || 'true',

        typeChart = config[sSearches + 'chartType'] || 'spline'

        incColor = config[sSearches + 'highColor'],
        decColor = config[sSearches + 'lowColor'];


        //if ($('#lineChartContainer').has('svg').length != 99) {
           c3.generate({
               bindto: '#lineChartContainer',
                data: {
                    x: data.fields[0].name,
                    columns: dataArray,
                    // make this a config variable and all the user to choose line | spline | step
                    type: 'spline' // change to 'step' or 'line' to change chart type
                },
                subchart: {
                   show: false
               }
               // you need to detect time-series and optionally add this in
               // splunk date 2018-08-03T10:05:36.000-04:00

               ,axis: {
                    x: {
                        type: xAxisType,
                        tick: {
                            format: '%Y-%m-%d %H:%M'
                            //format: '%Y-%m'
                        }
                    }
                }

            });



/*
        this.offset += data.rows.length;

                        setTimeout(function(that) {
                            that.updateDataParams({count: that.chunk, offset: that.offset});
                        }, 100, this);
*/
/*
           chart.flow({
             columns: [
               ['data1', 500, 200],
               ['data2', 100, 300],
               ['data3', 200, 120]
             ]
           });

*/
       }
    });
});
