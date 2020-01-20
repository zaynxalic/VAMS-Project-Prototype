document.getElementsByClassName('introduction')[0].onmouseover = function(){

    document.getElementById('navigation').style.display = 'block'; 
    
    document.getElementById('navigation').style.transform = 'translateY(5em)';

    document.getElementById('navigation').style.transitionTimingFunction = 'ease-in';
}



document.getElementsByClassName('introduction')[0].onmouseout = function(){

    document.getElementById('navigation').style.display = 'none'; 
    
    document.getElementById('navigation').style.transform = 'translateY(-5em)';

    document.getElementById('navigation').style.transitionTimingFunction = 'ease-in';
}
