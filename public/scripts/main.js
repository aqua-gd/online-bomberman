class Bomberman {
    constructor(obj, id, img) {
        this.obj = obj,
        this.id = id,
        this.img = img,
        this.move = false,
        this.posX = 60,
        this.posY = 60,
        this.speed = 6,
        this.bombs = 0,
        this.maxBoms = 4,
        this.sprite = 'ArrowDown'
        this.spritePos = '0 -256px',
        this.key = null,
        this.collisions = {
            top: false,
            bottom: false,
            left: false,
            right: false
        }
    }
}
class Bomb {
    constructor (obj, radius, x, y) {
        this.obj = obj,
        this.radius = radius,
        this.posX = x,
        this.posY = y
    }
}
const socket = io()
const container = getById('container')
const bomber = new Bomberman(getById('bomber'), null, localStorage.getItem('bomber_skin'))
bomber.obj.style.background = `url(${localStorage.getItem('bomber_skin')})`
const playerList = [bomber]

// MOVE EVENTS ---------------------------------------------------------------------------------------------------------------------

window.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        bomber.key = 'ArrowUp'
        bomber.move = true
    } else if ((e.code === 'ArrowRight' || e.code === 'KeyD')) {
        bomber.key = 'ArrowRight'
        bomber.move = true
    } else if ((e.code === 'ArrowDown' || e.code === 'KeyS')) {
        bomber.key = 'ArrowDown'
        bomber.move = true
    } else if ((e.code === 'ArrowLeft' || e.code === 'KeyA')) {
        bomber.key = 'ArrowLeft'
        bomber.move = true
    }
})

window.addEventListener('keyup', (e) => {
    bomber.move = false
    if (e.key === ' ') {
        generateBomb(bomber, socket)
    } else if (e.key === 'u') {
        bomber.speed += 2;
        console.log(bomber.speed)
    }
})

const btns = {
    up: getById('btn-up'),
    down: getById('btn-down'),
    left: getById('btn-left'),
    right: getById('btn-right'),
    bomb: getById('btn-bomb')
}

btns.bomb.addEventListener('touchstart', () => {
    generateBomb(bomber, socket)
})
btns.up.addEventListener('touchstart', () => {
    bomber.key = 'ArrowUp';
    bomber.move = true;
})
btns.down.addEventListener('touchstart', () => {
    bomber.key = 'ArrowDown';
    bomber.move = true;
})
btns.left.addEventListener('touchstart', () => {
    bomber.key = 'ArrowLeft';
    bomber.move = true;
})
btns.right.addEventListener('touchstart', () => {
    bomber.key = 'ArrowRight';
    bomber.move = true;
})

window.addEventListener('touchend', () => {
    bomber.move = false
})

window.addEventListener('touchcancel', () => {
    bomber.move = false
})


// SERVER CONNECTIONS --------------------------------------------------------------------------------------------------------------

socket.on('create:id', (id) => {
    if (!bomber.id) {
        bomber.id = id;
        console.log('Player_id: ' + bomber.id)
    }
});

socket.on('history:players', (data) => {
    console.log(data)
    console.log(playerList)
    if (playerList.length > 1) {
        playerList.push(new Bomberman(document.createElement('div'), data[data.length - 1].id, null));
        playerList[playerList.length - 1].obj.classList.add('bomber')
        // playerList[playerList.length - 1].img = data.img
        // playerList[playerList.length - 1].obj.style.backgroundImage = `url(${data[data.length - 1].img})}) !important`
        playerList[playerList.length - 1].obj.style.transform = `translate(${data[data.length - 1].posX}px, ${data[data.length - 1].posY}px)`;
        console.log(data)
        container.appendChild(playerList[playerList.length - 1].obj)
    } else {
        for (p of data) {
            if (p.id !== bomber.id) {
                playerList.push(new Bomberman(document.createElement('div'), p.id, null));
                playerList[playerList.length - 1].obj.classList.add('bomber');
                // playerList[playerList.length - 1].img = data.img
                // playerList[playerList.length - 1].obj.style.backgroundImage = `url(${p.img})}) !important`
                playerList[playerList.length - 1].obj.style.transform = `translate(${p.posX}px, ${p.posY}px)`;
                console.log(data)
                container.appendChild(playerList[playerList.length - 1].obj);
            }
        }
    }
    console.log(playerList)
});

socket.on('change:moves', (data) => {
    for (player of playerList) {
        if (data.id === player.id) {
            player.posX = data.posX
            player.posY = data.posY
            player.sprite = data.sprite
            player.spritePos = data.spritePos
            player.move = data.move
            player.img = data.img
            player.obj.style.background = `url('${data.img}')`
            player.obj.style.transform = `translate(${data.posX}px, ${data.posY}px)`
            spritePlayer(player)
        }
    }
});

socket.on('disconnect:players', (id) => {
    for (let i = 0; i < playerList.length; i++) {
        if (playerList[i].id === id) {
            console.log('Se desconectó el jugador: ' + playerList[i])
            container.removeChild(playerList[i].obj);
            playerList.splice(i, 1);
        }
    }
});

socket.on('create:bomb', (data) => {
    showBomb(data, container, bomber)
})

socket.on('death:bomber', (id) => {
    if (bomber.id === id) {
        localStorage.removeItem('bomber_skin')
        location.reload()
    } else {
        for (let i = 0; i < playerList.length; i++) {
            if (playerList[i].id === id) {
                console.log('Perdió el jugador: ' + player.id)
                container.removeChild(player.obj)
                playerList.splice(i, 1);
            } 
        }
    }
})
