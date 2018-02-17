var tempuUrl = '/current-temperature';

function updateTempu(tempEl, humEl) {
    $.get(tempuUrl, function(response){
        tempEl.html(response.temperature);
        humEl.html(response.humidity);
    });
}

function getLast7Days() {
    var url = '/last-7-days';
    $.get(url, function(response){
        var tableHtml = '';

        console.log(response.days);

        response.days.forEach(function(element) {
            console.log(element);
            tableHtml += '<tr>';
            tableHtml += '<td>' + element.date + '</td>';
            tableHtml += '<td style="text-align: right">' + element.avgTemp + ' °C</td>';
            tableHtml += '<td style="text-align: right">' + element.avgHum + ' %</td>';
            tableHtml += '</tr>';
        });

        console.log(tableHtml);
        $('.last-measurements table tbody').html(tableHtml);
    });
}

$(document).ready(function(){
    var currentTempEl = $('.current-temperature'),
    currentHumiEl = $('.current-humidity');

    updateTempu(currentTempEl, currentHumiEl);
    getLast7Days();

    window.setInterval(function(){
        updateTempu(currentTempEl, currentHumiEl);
    }, 3000);
});