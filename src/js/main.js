/* Appliquer la couleur à la résistance */
function colorband(band,value){
    var file = "img/";
    if(band === document.getElementById('band1')||band === document.getElementById('band6') ){
        file +="b_";
    }else{
        file +="s_";
    }

    if(band === document.getElementById('band1')||band === document.getElementById('band2') ||band === document.getElementById('band3')){
        switch(value){
            case "0":
                file+="black";
                break;
            case "1":
                file+="brown";
                break;
            case "2":
                file+="red";
                break;
            case "3":
                file+="orange";
                break;
            case "4":
                file+="yellow";
                break;
            case "5":
                file+="green";
                break;
            case "6":
                file+="blue";
                break;
            case "7":
                file+="violet";
                break;
            case "8":
                file+="grey";
                break;
            case "9":
                file+="white";
                break;
            default:
                file+="clear";
                break;
        }
    }else if(band === document.getElementById('band4')){
        switch(value){
            case "1":
                file+="silver";
                break;
            case "10":
                file+="gold";
                break;
            case "100":
                file+="black";
                break;
            case "1000":
                file+="brown";
                break;
            case "10000":
                file+="red";
                break;
            case "100000":
                file+="orange";
                break;
            case "1000000":
                file+="yellow";
                break;
            case "10000000":
                file+="green";
                break;
            case "100000000":
                file+="blue";
                break;
            case "1000000000":
                file+="violet";
                break;
            default:
                file+="clear";
                break;
        }
    }else if(band === document.getElementById('band5')){
        switch(value){
            case "1":
                file+="brown";
                break;
            case "2":
                file+="red";
                break;
            case "0.5":
                file+="green";
                break;
            case "0.25":
                file+="blue";
                break;
            case "0.1":
                file+="violet";
                break;
            case "5":
                file+="gold";
                break;
            case "10":
                file+="silver";
                break;
            default:
                file+="clear";
                break;
        }
    }else if(band === document.getElementById('band6')){
        switch(value){
            case "100":
                file+="brown";
                break;
            case "50":
                file+="red";
                break;
            case "15":
                file+="orange";
                break;
            case "25":
                file+="yellow";
                break;
            case "10":
                file+="blue";
                break;
            case "5":
                file+="violet";
                break;
            default:
                file+="clear";
                break;
        }
    }
    band.src = file+".gif";
}

/* Calculer resistance depuis couleurs */
function calculate() {
    var d1s = document.getElementById('one');
    var d1  = document.getElementById('one').options[d1s.selectedIndex].value;
    var d2s = document.getElementById('two');
    var d2  = document.getElementById('two').options[d2s.selectedIndex].value;
    var d3s = document.getElementById('three');
    var d3  = document.getElementById('three').options[d3s.selectedIndex].value;
    var mults = document.getElementById('four');
    var mult  = document.getElementById('four').options[mults.selectedIndex].value;
    var tols = document.getElementById('five');
    var tol  = document.getElementById('five').options[tols.selectedIndex].value;
    var tolcs = document.getElementById('six');
    var tolc  = document.getElementById('six').options[tolcs.selectedIndex].value;

    var band1 = document.getElementById('band1');
    colorband(band1,d1);
    var band2 = document.getElementById('band2');
    colorband(band2,d2);
    var band3 = document.getElementById('band3');
    colorband(band3,d3);
    var band4 = document.getElementById('band4');
    colorband(band4,mult);
    var band5 = document.getElementById('band5');
    colorband(band5,tol);
    var toltab = document.getElementById('tol');
    toltab.selectedIndex=tols.selectedIndex;
    toltab.style.backgroundColor=toltab.options[tols.selectedIndex].style.backgroundColor;
    toltab.style.color=toltab.options[tols.selectedIndex].style.color;


    var band6 = document.getElementById('band6');
    colorband(band6,tolc);
    var tolctab = document.getElementById('tolc');
    tolctab.selectedIndex=tolcs.selectedIndex;
    tolctab.style.backgroundColor=tolctab.options[tolcs.selectedIndex].style.backgroundColor;
    tolctab.style.color=tolctab.options[tolcs.selectedIndex].style.color;


    var res;
    var unit;

    if (d1 !=="" && d2 !=="" && d3 !=="" && mult !==""){
        res = ((100 * d1) + (10 * d2) + (1 * d3)) * mult / 100;
    }else if(d1 !=="" && d2 !=="" && mult !==""){
        res = ((10 * d1) + (1 * d2)) * mult / 100;
    }else{
        return;
    }
    if (res >= 1e6) {
        res /= 1e6;
        unit = 2;
    }else{
        if (res >= 1e3) {
            res /= 1e3;
            unit = 1;
        }else{
            unit = 0;
        }
    }

    document.getElementById('res-label').value = res;
    document.getElementById('unit').selectedIndex = unit;
}

/* Calculer couleur tolerance thermique depuis valeur */
function set_tolc(){
    var band6 = document.getElementById('band6');
    var tolcs  = document.getElementById('tolc');
    var six = document.getElementById('six');
    colorband(band6,tolcs.value);
    six.selectedIndex=tolcs.selectedIndex;
    six.style.backgroundColor=six.options[tolcs.selectedIndex].style.backgroundColor;
    six.style.color=six.options[tolcs.selectedIndex].style.color;



}

/* Calculer couleur tolerance depuis valeur */
function set_tol(){
    var band5 = document.getElementById('band5');
    var tols  = document.getElementById('tol');
    var five = document.getElementById('five');
    colorband(band5,tols.value);
    five.selectedIndex=tols.selectedIndex;
    five.style.backgroundColor=five.options[tols.selectedIndex].style.backgroundColor;
    five.style.color=five.options[tols.selectedIndex].style.color;

}

/* Convertir en flottant */
function toFloat(v) {
    return parseFloat(v.replace(',', '.'));
}

/* Appliquer la couleur à la résistance */
function set_mult(digit, value, band){
    var file = "img/s_";
    if(value < -0.5) {
        digit.value = 1;
        file+= "silver";
    } else if(value < 0.5) {
        file+= "gold";
        digit.value = 10;
    } else if(value < 1.5) {
        file += "black";
        digit.value = 100;
    } else if(value < 2.5) {
        file += "brown";
        digit.value = 1000;
    } else if(value < 3.5) {
        file+= "red";
        digit.value = 10000;
    } else if(value < 4.5) {
        file+= "orange";
        digit.value = 100000;
    } else if(value < 5.5){
        file+= "yellow";
        digit.value = 1000000;
    } else if(value < 6.5){
        file+= "green";
        digit.value = 10000000;
    } else if(value < 7.5){
        file+= "blue";
        digit.value = 100000000;
    } else {
        file+= "violet";
        digit.value = 1000000000;
    }
    band.src = file+".gif";

    digit.style.backgroundColor=digit.options[digit.selectedIndex].style.backgroundColor;
    digit.style.color=digit.options[digit.selectedIndex].style.color;
}

/* Appliquer la couleur à la résistance */
function set_digit(digit, value, band){
    var file = "img/";
    if(band === document.getElementById('band1')){
        file +="b_";
    }else{
        file +="s_";
    }
    if(value < 0.5) {
        digit.value = 0;
        file += "black";
    } else if(value < 1.5) {
        file += "brown";
        digit.value = 1;
    } else if(value < 2.5) {
        file += "red";
        digit.value = 2;
    } else if(value < 3.5) {
        file += "orange";
        digit.value = 3;
    } else if(value < 4.5) {
        file += "yellow";
        digit.value = 4;
    } else if(value < 5.5) {
        file += "green";
        digit.value = 5;
    } else if(value < 6.5) {
        file += "blue";
        digit.value = 6;
    } else if(value < 7.5) {
        file += "violet";
        digit.value = 7;
    } else if(value < 8.5) {
        file += "grey";
        digit.value = 8;
    } else {
        file += "white";
        digit.value = 9;
    }
    digit.style.backgroundColor=digit.options[digit.selectedIndex].style.backgroundColor;
    digit.style.color=digit.options[digit.selectedIndex].style.color;
    band.src = file +".gif";
}

/* Calculer resistance depuis valeur */
function set_res(){

    var d1 = document.getElementById('one');
    var d2 = document.getElementById('two');
    var d3 = document.getElementById('three');
    var mult = document.getElementById('four');



    var band1 = document.getElementById('band1');
    var band2 = document.getElementById('band2');
    var band3 = document.getElementById('band3');
    var band4 = document.getElementById('band4');


    var res = document.getElementById('res-label').value;

    var units = document.getElementById('unit');
    var unit  = document.getElementById('unit').options[units.selectedIndex].value;


    if(res === ""){
        d1.value = "";
        d2.value = "";
        d3.value = "";
        mult.value = "";

        d1.style.backgroundColor=d1.options[d1.selectedIndex].style.backgroundColor;
        d1.style.color=d1.options[d1.selectedIndex].style.color;
        d2.style.backgroundColor=d2.options[d2.selectedIndex].style.backgroundColor;
        d2.style.color=d2.options[d2.selectedIndex].style.color;
        d3.style.backgroundColor=d3.options[d3.selectedIndex].style.backgroundColor;
        d3.style.color=d3.options[d3.selectedIndex].style.color;
        mult.style.backgroundColor=mult.options[mult.selectedIndex].style.backgroundColor;
        mult.style.color=mult.options[mult.selectedIndex].style.color;

        return;
    }

    var r = toFloat(res)*Math.pow(10, parseInt(unit));
    if(r<1){
        r=1;
        res=1;
        units.value = 0;
    } else if(r>9990.0e6){
        r=9990.0e6;
        res=9990;
        units.value = 6;
    }


    var tmpr = r*10;
    var nb1=0, nb2=0, nb3=0, nbmult=0;

    for(var i=-2;i<10;i++)
    {
        if(tmpr < 10.0 && tmpr > 0.1)
        {
            tmpr = Math.floor(tmpr*100.0)/100.0;
            nb1 = Math.floor(tmpr);

            tmpr = (tmpr - nb1)*10.0 + 0.01;
            nb2 = Math.floor(tmpr);
            tmpr = Math.floor(tmpr*10.0)/10.0;

            tmpr = (tmpr - nb2)*10.0 + 0.1;
            nb3 = Math.floor(tmpr);

            nbmult = i;
            break;
        }
        tmpr = tmpr/10;
    }


    set_digit(d1, nb1, band1);
    set_digit(d2, nb2, band2);
    set_digit(d3, nb3, band3);
    set_mult(mult, nbmult , band4);

}





