$(document).ready(function(){
    // $('#switch').click(function(event){
        
    //     data = {
    //         IDDevice: 0,
    //         IndexAction: 0,
    //         Params: []
    //       }
    //     data = {param: JSON.stringify(data)}
        
    //     console.log(data)
    //     // send data
    //     $.post('/switch', data, function(res){if (res == 'ok') window.location.replace('/')}, 'text')
        
    // });


    $('#thingN_1').click(function(event){
        if($('#thingN_1').hasClass('afterClick')){
            $('.btn').removeClass('kitchen')
            $('.btn').addClass('bedroom')
            $('#thingN_1').removeClass('afterClick')
        }else{
            $('#thingN_1').addClass('afterClick')
        }
    });

    $('#thingN_2').click(function(event){
        if($('#thingN_2').hasClass('afterClick')){
            $('.btn').removeClass('bedroom')
            $('.btn').addClass('kitchen')
            $('#thingN_2').removeClass('afterClick')
        }else{
            $('#thingN_2').addClass('afterClick')
        }
    });

    $('#switch').click(function(event){
        $('#switch').toggleClass('isOn')
    if ($('#switch').hasClass('isOn')){
        var data = {
            IDDevice: 3,
            IndexAction: 1,
            Params: ['on']
        };
    }
    else{
        var data = {
            IDDevice: 3,
            IndexAction: 1,
            Params: ['off']
        };
    }

        data = {param: JSON.stringify(data)}
        $.post('/switch', data, function(res){alert(res)}, 'text')
    });
});