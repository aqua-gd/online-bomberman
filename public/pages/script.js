function getById(id) {
    return document.getElementById(id)
}
const btnPlay = getById('btn_play')
const btnJoystick = getById('btn_joystick')
if (localStorage.getItem('active_joystick') === 'true') {
    btnJoystick.checked = true
}

btnPlay.addEventListener('click', () => {
    if (btnJoystick.checked) {
        localStorage.setItem('active_joystick', 'true')
    } else {
        localStorage.setItem('active_joystick', 'false')
    }

    if (getById('bomber_white').checked) {
        localStorage.setItem('bomber_skin', '../images/bomber-white.webp')
    } else if (getById('bomber_blue').checked) {
        localStorage.setItem('bomber_skin', '../images/bomber-blue.webp')
    } else if (getById('bomber_yellow').checked) {
        localStorage.setItem('bomber_skin', '../images/bomber-yellow.webp')
    } else if (getById('bomber_red').checked) {
        localStorage.setItem('bomber_skin', '../images/bomber-red.webp')
    } else if (getById('bomber_green').checked) {
        localStorage.setItem('bomber_skin', '../images/bomber-green.webp')
    } else if (getById('bomber_rock').checked) {
        localStorage.setItem('bomber_skin', '../images/bomber-rock.webp')
    }
    window.location = '/'
})