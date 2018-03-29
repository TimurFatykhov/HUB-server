$(document).ready(function(){
    $('#button').click(function(event){
        $('#button').toggleClass('on');
        if($('#button').text() == 'OFF'){
            $('#button').text('ON')
        }
        else{
            $('#button').text('OFF')
        }

        data = {params: JSON.stringify([1,2,3,4])};
        $.post('/switch', data, function(res){}, 'text')
            .fail(function(){alert('GET REQUEST FAILED')});
    });
});