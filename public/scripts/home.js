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

    var initData = {
        IDDevice: 0,
        IndexAction: 0,
        Params: []
    };
    var device1 = {}
    var device2 = {}

    var currentDev = device1;

    initData = {param: JSON.stringify(initData)}
    $.post('/switch', initData, function(res){
        res = JSON.parse(res);
        device1['ID'] = res.Params[2].ID
        device1['Name'] = res.Params[2].Name 
        device1['Type'] = res.Params[2].Type

        device2['ID'] = res.Params[3].ID
        device2['Name'] = res.Params[3].Name 
        device2['Type'] = res.Params[3].Type

        var stateReq1 = {
            IDDevice: device1['ID'],
            IndexAction: 0,
            Params: []
        };
        var stateReq2 = {
            IDDevice: device2['ID'],
            IndexAction: 0,
            Params: []
        };

        stateReq1 = {param: JSON.stringify(stateReq1)}
        $.post('/switch', stateReq1, function(res){ 
             var state1 = JSON.parse(res).Params[0];
             console.log('state1 ' + state1);
             if (state1 == "ERR" || state1 == "off"){
                device1['state'] = 0;
             }else{
                device1['state'] = 1;
                $('#shar').addClass('isOn') // устройство 1 (которое на странице в самом начале) уже включено
                $('#switch').attr('src', 'images/with_shar.png');
             }

            console.log('dev1 state: ' + device1['state']);
        }, 'text')


        stateReq2 = {param: JSON.stringify(stateReq2)}
        $.post('/switch', stateReq2, function(res){
             var state2 = JSON.parse(res).Params[0];
             console.log('state2 ' + state2);
             if (state2 == "ERR" || state2 == "off"){
                device2['state'] = 0;
             }else{
                device2['state'] = 1;
             }
            console.log('dev2 state: ' + device2['state'])
        }, 'text')

    }, 'text')


    $('#thingN_1').click(function(event){
        if($('#thingN_1').hasClass('afterClick')){
            currentDev = device1;
            if(currentDev.state == '1'){
                $('#shar').addClass('isOn')
                $('#switch').attr('src', 'images/with_shar.png');
            }else{
                $('#shar').removeClass('isOn')
                $('#switch').attr('src', 'images/without_shar.png');
            }
            $('.btn').removeClass('kitchen')
            $('.btn').addClass('bedroom')
            $('#thingN_1').removeClass('afterClick')
        }else{
            $('#thingN_1').addClass('afterClick')
        }
    });

    $('#thingN_2').click(function(event){
        if($('#thingN_2').hasClass('afterClick')){
            currentDev = device2;
            if(currentDev.state == '1'){
                $('#shar').addClass('isOn')
                $('#switch').attr('src', 'images/with_shar.png');
            }else{
                $('#shar').removeClass('isOn')
                $('#switch').attr('src', 'images/without_shar.png');
            }
            $('.btn').removeClass('bedroom')
            $('.btn').addClass('kitchen')
            $('#thingN_2').removeClass('afterClick')
        }else{
            $('#thingN_2').addClass('afterClick')
        }
    });

    $('#switch').click(function(event){
        $('#shar').toggleClass('isOn')
    if ($('#shar').hasClass('isOn')){
        $('#switch').attr('src', 'images/with_shar.png');
        var data = {
            IDDevice: currentDev.ID,
            IndexAction: 1,
            Params: ['on']
        };
        currentDev['state'] = 1
    }
    else{
        $('#switch').attr('src', 'images/without_shar.png');
        var data = {
            IDDevice: currentDev.ID,
            IndexAction: 1,
            Params: ['off']
        };
        currentDev['state'] = 0
    }

        data = {param: JSON.stringify(data)}
        $.post('/switch', data, function(res){console.log(res)}, 'text')
    });
});