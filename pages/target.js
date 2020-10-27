// const app = new PIXI.Application({
//     width: 900, height: 700, backgroundColor: 0x1099bb, resolution: window.devicePixelRatio || 1,
// });
const app = new PIXI.Application(
    { 
//          backgroundColor: 0x808080
        transparent: true
    }
);

// app.renderer.autoResize = true;
// app.renderer.view.style.position = "absolute";
// app.renderer.view.style.display = "block";
// app.renderer.autoResize = true;
app.renderer.resize(900, 700);

document.getElementById("playground").appendChild(app.view);

// document.body.appendChild(app.view);


console.log(app.screen.width, app.screen.height);


const particleContainer = new PIXI.ParticleContainer(10000, {
    scale: true,
    position: true,
    rotation: true,
    uvs: true,
    alpha: true,
});
app.stage.addChild(particleContainer);

function emitParticle(angle) {
    const particle = PIXI.Sprite.from('cloud1.png');

    particle.anchor.set(0.5);
    particle.x = 150;
    particle.y = 550;

    const angleRad = angle * Math.PI / 180.0 ;
    particle.velocity = {x: 5.0 * Math.sin(angleRad), y: -5.0 * Math.cos(angleRad)};

    particleContainer.addChild(particle);
    particles.push(particle);
}


// create particles
const particles = [];
for(let index = 0; index < 0; index++) {

    const particle = PIXI.Sprite.from('particle.png');

    particle.anchor.set(0.5);
    particle.x = Math.random() * app.screen.width;
    particle.y = Math.random() * app.screen.height;
    particle.x = app.screen.width / 2.0;
    particle.y = app.screen.height / 2.0;
    particle.x = 150;
    particle.y = 550;

    particle.velocity = {x: 5.0, y: -5.0};
    particle.tint = 0xe92828;

    particleContainer.addChild(particle);
    particles.push(particle);
}

// create obstacles
const obstacles = [];
obstacles.push(new wheeler.LineObstacle(new wheeler.Vector(100, 350), new wheeler.Vector(400, -300)));
obstacles.push(new wheeler.LineObstacle(new wheeler.Vector(600, 100), new wheeler.Vector(200, 300)));
obstacles.push(new wheeler.LineObstacle(new wheeler.Vector(400, 300), new wheeler.Vector(100, 300)));
obstacles.push(new wheeler.LineObstacle(new wheeler.Vector(500, 450), new wheeler.Vector(50, -200)));


// Sprites
const truck = PIXI.Sprite.from('truck.png');
truck.anchor.set(0.75, 0.1);
truck.x = 150;
truck.y = 550;
truck.zIndex = 2; 
app.stage.addChild(truck);

const bottle = PIXI.Sprite.from('bottle.png');
bottle.anchor.set(0.5, 0.75);
bottle.zIndex = 3;
bottle.angle = 45;
truck.addChild(bottle);

var kerzen = PIXI.Texture.fromFrame('kerzen.png');
var kerzenOhne = PIXI.Texture.fromFrame('kerzen-ohne.png');
const hotdog = PIXI.Sprite.from(kerzen);
hotdog.anchor.set(0.5, 0.5);
hotdog.x = 700;
hotdog.y = 600;
app.stage.addChild(hotdog);




// draw obstacles
const graphics = new PIXI.Graphics();
for (let obstacle of obstacles) {
    graphics.lineStyle(6, 0x000080, 1);
    graphics.moveTo(obstacle.position.x, obstacle.position.y);
    graphics.lineTo(obstacle.position.x + obstacle.direction.x, obstacle.position.y + obstacle.direction.y);
    app.stage.addChild(graphics);
}


document.onkeydown = (e) => {
    e = e || window.event;
    if (e.keyCode == '38') {
        // up arrow
    }
    else if (e.keyCode == '40') {
        // down arrow
    }
    else if (e.keyCode == '37') {
       // left arrow
       bottle.angle -= 1;
       console.log('angle', bottle.angle);
    }
    else if (e.keyCode == '39') {
       // right arrow
       bottle.angle += 1;
       console.log('angle', bottle.angle);
    }
    else if (e.keyCode == '32') {
        // right arrow
        emitParticle(bottle.angle);
        playSound('Abschuss.m4a');
     }
}


let particleGame = true;


// Listen for animate update
app.ticker.add((delta) => {
    if(particleGame) {
        moveCloud();
    }
});

function moveCloud() {
    const removals = [];

    for(let particle of particles) {

        const p1 = new wheeler.Vector(particle.x, particle.y);
        const v = new wheeler.Vector(particle.velocity.x, particle.velocity.y);
        const p2 = p1.add(v);

        for (let obstacle of obstacles) {
            let vnext = v;
            const next = obstacle.reflectMovement(p1, p2);
            particle.x = next.x;
            particle.y = next.y;

            if (next.x != p2.x || next.y != p2.y) {
                vnext = obstacle.reflect(v.add(obstacle.position)).sub(obstacle.position);
                particle.velocity.x = vnext.x;
                particle.velocity.y = vnext.y;
                playSound('skweak3.ogg');
                break;
            }
        }

        if (particle.x < 0 || particle.x > app.screen.width) {
            removals.push(particle);
            particleContainer.removeChild(particle);
            particle.velocity.x = -particle.velocity.x;
            particle.velocity.x = particle.velocity.x;
        }
        if (particle.y < 0 || particle.y > app.screen.height) {
            removals.push(particle);
            particleContainer.removeChild(particle);
            particle.velocity.y = -particle.velocity.y;
            particle.velocity.y = particle.velocity.y;
        }

        if (particle.x > 650 && particle.x < 750 && particle.y > 570 && particle.y < 620) {
            app.stage.removeChild(particleContainer);
            particleGame = false;
            hotdog.texture = kerzenOhne;
            playSound('lava.flac');
            playSound('HappyBirthday.m4a');
        }
    }

    for(let removal of removals) {
        particles.splice(particles.indexOf(removal), 1);
        playSound('OhWeh.m4a');
    }
}



function playSound(url) {
    const audio = new Audio(url);
    audio.play();
}

