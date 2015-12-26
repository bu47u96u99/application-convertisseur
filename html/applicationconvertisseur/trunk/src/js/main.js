function convert()
{
    var value = document.getElementById("value").value;
    var unit = document.getElementById("unit").value;
    var result = document.getElementById("result");
    var number = parseInt(value);

    if(isNaN(number)){
        result.innerHTML = "";
    }else{
        switch(unit) {
            case 'ko':
                number = number * 1024;
                break;
            case 'mo':
                number = number * 1024 * 1024;
                break;
            case 'go':
                number = number * 1024 * 1024 * 1024;
                break;
            case 'to':
                number = number * 1024 * 1024 * 1024 * 1024;
                break;
        }

        document.getElementById("bits").innerHTML = number*8+" bits";
        document.getElementById("octets").innerHTML = number +" octets";
        document.getElementById("ko").innerHTML = number /1024+" Ko";
        document.getElementById("mo").innerHTML = number /(1024*1024)+" Mo";
        document.getElementById("go").innerHTML = number /(1024*1024*1024)+" Go";
        document.getElementById("to").innerHTML = number /(1024*1024*1024*1024)+" To";
    }



}
