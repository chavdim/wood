//labes for chart
var  getTries = function (scores) {
    tries = []
    for (var i = 1 ; i <= scores.length; i++) {
        tries.push("テスト: "+String(i))
    };
    return tries
};
var  getScore = function (t) {
    s =Math.random() * (10 + (t*100))
    return s
};
var  getData = function (t) {
    d = []
    for (var i = 1 ; i <= t; i++) {
        d.push(getScore(i))
    };
    return d
};
var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var randomScalingFactor = function() {
    return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * 100);
    
};
var randomColorFactor = function() {
    return Math.round(Math.random() * 255);
};
var randomColor = function() {
    return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',.7)';
};
window.onload = function() {
//////////////////////////////////////////////////////////////////////////////
// get user data
//////////////////////////////////////////////////////////////////////////////
    //scores from string to list
    scores = $("#userScoresDict").html();
    scores = $.parseJSON(scores)
    
    cleanScores = [];
    for (var key in scores) {
        cleanScores.push( scores[key] ) 
    };
    //console.log(cleanScores2)
    //
    var barChartData = {
        //labels: ["January", "February", "March", "April", "May", "June", "July"],
        
        labels: getTries(cleanScores),
        datasets: [{
            label: 'テスト成績',
            backgroundColor: "rgba(0,220,0,0.8)",
            //data: getData(numData)
            data: cleanScores
        } /*{
            hidden: true,
            label: 'Dataset 2',
            backgroundColor: "rgba(151,187,205,0.5)",
            data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()]
        }, {
            hidden: true,
            label: 'Dataset 3',
            backgroundColor: "rgba(151,187,205,0.5)",
            data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()]
        }*/]
    };
//window.onload = function() {
    var ctx = document.getElementById("chartCanvas").getContext("2d");
    Chart.defaults.global.legend.display = false;
    window.myBar = new Chart(ctx, {
        type: 'bar',
        data: barChartData,
        options: {
            // Elements options apply to all of the options unless overridden in a dataset
            // In this case, we are setting the border of each bar to be 2px wide and green
            
            elements: {
                rectangle: {
                    borderWidth: 2,
                    borderColor: 'rgb(0, 255, 0)',
                    borderSkipped: 'bottom'
                }
            },
            responsive: true,
            legend: {
                position: 'left',
            },
            title: {
                display: true,
                text: 'テスト成績'
            },
            scales: {
                yAxes: [{
                    ticks: {
                         display: false,
                        min: 0,
                        beginAtZero: true,
                        steps:10,
                        max:100
                    }
                }],
                xAxes: [{
                    barPercentage: 0.1 ,
                    ticks: {
                         display: false,
                        min: 10,
                        beginAtZero: true,
                        steps:10
                    }
                }]
            }
        }
    });
    $('#randomizeData').click(function() {
    var zero = Math.random() < 0.2 ? true : false;
    $.each(barChartData.datasets, function(i, dataset) {
        dataset.backgroundColor = randomColor();
        dataset.data = dataset.data.map(function() {
            return zero ? 0.0 : randomScalingFactor();
        });
    });
    window.myBar.update();
    });
    $('#addDataset').click(function() {
        var newDataset = {
            label: 'Dataset ' + barChartData.datasets.length,
            backgroundColor: randomColor(),
            data: []
        };
        for (var index = 0; index < barChartData.labels.length; ++index) {
            newDataset.data.push(randomScalingFactor());
        }
        barChartData.datasets.push(newDataset);
        window.myBar.update();
    });
    $('#addData').click(function() {
        if (barChartData.datasets.length > 0) {
            var month = MONTHS[barChartData.labels.length % MONTHS.length];
            barChartData.labels.push(month);
            for (var index = 0; index < barChartData.datasets.length; ++index) {
                //window.myBar.addData(randomScalingFactor(), index);
                barChartData.datasets[index].data.push(randomScalingFactor());
            }
            window.myBar.update();
        }
    });
    $('#removeDataset').click(function() {
        barChartData.datasets.splice(0, 1);
        window.myBar.update();
    });
    $('#removeData').click(function() {
        barChartData.labels.splice(-1, 1); // remove the label first
        barChartData.datasets.forEach(function(dataset, datasetIndex) {
            dataset.data.pop();
        });
        window.myBar.update();
    });
    //////////////PROGRESS
    /*
    var bar = new ProgressBar.Line(container, {
      strokeWidth: 4,
      easing: 'easeInOut',
      duration: 1400,
      color: '#FFEA82',
      trailColor: '#eee',
      trailWidth: 1,
      svgStyle: {width: '100%', height: '100%'}
    });
    //scores = $("#userExperience").html();             //TO DO
    bar.animate(0.8);  // Number from 0.0 to 1.
    //timeRemaining.animate(1.0);
    */
};

