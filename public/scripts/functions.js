function getById(params) {
    return document.getElementById(params)
}

function position(obj, side) {
    if (!side) {
        return obj.getBoundingClientRect()
    } else if (side === 'bottom') {
        return obj.getBoundingClientRect().bottom
    } else if (side === 'height') {
        return obj.getBoundingClientRect().height
    } else if (side === 'left') {
        return obj.getBoundingClientRect().left
    } else if (side === 'right') {
        return obj.getBoundingClientRect().right
    } else if (side === 'top') {
        return obj.getBoundingClientRect().top
    } else if (side === 'width') {
        return obj.getBoundingClientRect().width
    } else if (side === 'x') {
        return obj.getBoundingClientRect().x
    } else if (side === 'y') {
        return obj.getBoundingClientRect().y
    }
}

function borderCollision(obj, collider, side, space) {
    switch (side) {
        case 'top':
            return (position(collider, side) + space < position(obj, side))
            break;
        case 'bottom':
            return (position(collider, side) - space > position(obj, side))
            break;
        case 'left':
            return (position(collider, side) + space < position(obj, side))
            break;
        case 'right':
            return (position(collider, side) - space > position(obj, side))
            break;
    }
}

function spritePlayer(player) {
    if (player.move) {
        player.obj.classList.remove('ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight')
        player.obj.style.backgroundPosition = player.spritePos
        player.obj.classList.add(player.sprite)
    } else {
        player.obj.classList.remove('ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight')
        player.obj.style.backgroundPosition = player.spritePos
    }
}

function showBomb(refBomb, container, player) {
    const bomb = new Bomb(document.createElement('div'), refBomb.radius, refBomb.posX, refBomb.posY)
    bomb.obj.classList.add('bomb')
    bomb.obj.style.transform = `translate(${refBomb.posX + 32}px, ${refBomb.posY + 64}px)`
    container.appendChild(bomb.obj)
    setTimeout(() => {
        bomb.obj.classList.remove('bomb')
        bomb.obj.style.transform = `translate(${refBomb.posX - 64}px, ${refBomb.posY - 16}px)`
        bomb.obj.classList.add('explosion')
        setTimeout(() => {
            const dx = Math.abs((refBomb.posX) - position(player.obj, 'x'))
            const dy = Math.abs((refBomb.posY + 40) - position(player.obj, 'y'))
            console.log('Distancia de la bomba: ' + Math.hypot(dx, dy))
            if (Math.hypot(dx, dy) < refBomb.radius) {
                socket.emit('death:bomber', player.id)
            }
        }, 450);
        setTimeout(() => {
            container.removeChild(bomb.obj)
        }, 1000)
    }, 2000)
}

function generateBomb(player, socket) {
    if (player.bombs < player.maxBoms) {
        player.bombs++
        socket.emit('create:bomb', {posX: player.posX, posY: player.posY, radius: 128})
        setTimeout(() => {
            player.bombs--
        }, 2200);
    }
}

function movePlayer(player = bomber, gameArea = container) {
    if (player.move) {
        switch (player.key) {
            case 'ArrowUp':
                player.spritePos = '0 0'
                player.sprite = 'ArrowUp'
                // spritePlayer(player)
                if (borderCollision(player.obj, gameArea, 'top', 62)) {
                    player.posY -= player.speed;
                } 
                break;
            case 'ArrowDown':
                player.spritePos = '0 -256px'
                player.sprite = 'ArrowDown'
                // spritePlayer(player)
                if (borderCollision(player.obj, gameArea, 'bottom', 62)) {
                    player.posY += player.speed;
                }
                break;
            case 'ArrowLeft':
                player.spritePos = '0 -384px'
                player.sprite = 'ArrowLeft'
                // spritePlayer(player)
                if (borderCollision(player.obj, gameArea, 'left', 62)) {
                    player.posX -= player.speed;
                }
                break;
            case 'ArrowRight':
                player.spritePos = '0 -128px'
                player.sprite = 'ArrowRight'
                // spritePlayer(player)
                if (borderCollision(player.obj, gameArea, 'right', 62)) {
                    player.posX += player.speed;
                }
                break;
        }
    }
    socket.emit('change:moves', {id: player.id,
                                img: player.img,
                                posX: player.posX,
                                posY: player.posY,
                                spritePos: player.spritePos,
                                sprite: player.sprite,
                                move: player.move})
    setTimeout(() => { movePlayer(player, container, socket) }, 20)
}
setTimeout(() => { movePlayer(bomber, container, socket) }, 500)