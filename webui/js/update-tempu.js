var tempuUrl = '/current-temperature';

function drawChart(days) {
    var tempChartCtx = document.getElementById("temperature-chart").getContext('2d');
    var humChartCtx = document.getElementById("humidity-chart").getContext('2d');

    var colors = [
        '#39CCCC',
        '#0074D9',
        '#3D9970',
        '#2ECC40',
        '#FFDC00',
        '#DDDDDD',
        '#FF4136'
    ];

    var labels = days.map(function(element) {
        return element.date;
    });

    var tempDays = days.map(function(element) {
        return element.avgTemp.toFixed(2);
    });

    var humDays = days.map(function(element) {
        return element.avgHum.toFixed(2);
    });

    var tempChart = new Chart(tempChartCtx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Ø Temperature',
                data: tempDays,
                backgroundColor: colors,
                borderColor: colors,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });

    var humChart = new Chart(humChartCtx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Ø Luftfeuchtigkeit',
                data: humDays,
                backgroundColor: colors,
                borderColor: colors.reverse(),
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
}

function updateTempu(tempEl, humEl, lastMeasurementEl) {
    $.get(tempuUrl, function(response){
        if(response.data !== false) {
            tempEl.html(response.temperature);
            humEl.html(response.humidity);
            lastMeasurementEl.html(response.time);
            $('#led-indicator').attr('src', 'images/' + response.ledColor + '_led.svg');
        }
    });
}

function getLast7Days() {
    var url = '/last-7-days';
    $.get(url, function(response){
        var tableHtml = '';

        var days = response.days.filter(function(elem) {
            return (elem.date !== null);
        });

        days.forEach(function(element) {
            tableHtml += '<tr>';
            tableHtml += '<td>' + element.date + '</td>';
            tableHtml += '<td style="text-align: right">' + element.avgTemp.toFixed(1) + ' °C</td>';
            tableHtml += '<td style="text-align: right">' + element.avgHum.toFixed(1) + ' %</td>';
            tableHtml += '</tr>';
        });

        $('.last-measurements table tbody').html(tableHtml);
        drawChart(days);
    });
}

$(document).ready(function(){
    var currentTempEl = $('.current-temperature'),
    currentHumiEl = $('.current-humidity'),
    lastMeasurementEl = $('.last-measurement');

    updateTempu(currentTempEl, currentHumiEl, lastMeasurementEl);
    getLast7Days();


    window.setInterval(function(){
        updateTempu(currentTempEl, currentHumiEl, lastMeasurementEl);
    }, 3000);
});