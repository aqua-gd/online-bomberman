if (!localStorage.getItem('bomber_skin')) {
    window.location = '/select-skin'
}

if (localStorage.getItem('active_joystick') !== 'true') {
    document.getElementById('groupBtns').style.display = 'none'
}