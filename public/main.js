$(document).ready(function(){
    $('#button').click(function(event){
        $('#button').toggleClass('on');
        if($('#button').text() == 'OFF'){
            $('#button').text('ON')
        }
        else{
            $('#button').text('OFF')
        }

        $.ajax(
            {
                type: 'GET',
                url: '/192.199.222.52/ON',
                success: function(res) {
                    if(JSON.stringify(res) == 'OK'){
                        $('.button').toggleClass('on')
                    }
                },
                error: function(err){
                    alert('Get request is interrupted')
                }
            });
    });
});