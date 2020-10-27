// const app = new PIXI.Application({
//     width: 800, height: 600, backgroundColor: 0x1099bb, resolution: window.devicePixelRatio || 1,
// });
const app = new PIXI.Application(
    { 
         backgroundColor: 0x808080 
    }
);

app.renderer.autoResize = true;
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

document.body.appendChild(app.view);

const particleContainer = new PIXI.ParticleContainer(10000, {
    scale: true,
    position: true,
    rotation: true,
    uvs: true,
    alpha: true,
});
app.stage.addChild(particleContainer);

// create particles
const particles = [];
for(let index = 0; index < 1000; index++) {

    const particle = PIXI.Sprite.from('particle.png');

    particle.anchor.set(0.5);
    particle.x = Math.random() * app.screen.width;
    particle.y = Math.random() * app.screen.height;
    particle.x = app.screen.width / 2.0;
    particle.y = app.screen.height / 2.0;

    particle.velocity = {x: Math.random() * 20.0 - 10.0, y: Math.random() * 20.0 - 10.0};
    particle.tint = ((Math.random() * 0xff) << 16) | ((Math.random() * 0xbb ) << 8);

    particleContainer.addChild(particle);
    particles.push(particle);
}

// create obstacles
const obstacles = [];
obstacles.push(new wheeler.LineObstacle(new wheeler.Vector(100, 400), new wheeler.Vector(400, -300)));
obstacles.push(new wheeler.LineObstacle(new wheeler.Vector(600, 100), new wheeler.Vector(200, 300)));
obstacles.push(new wheeler.LineObstacle(new wheeler.Vector(300, 500), new wheeler.Vector(200, 0)));

// draw obstacles
const graphics = new PIXI.Graphics();
for (let obstacle of obstacles) {
    graphics.lineStyle(4, 0xff2000, 1);
    graphics.moveTo(obstacle.position.x, obstacle.position.y);
    graphics.lineTo(obstacle.position.x + obstacle.direction.x, obstacle.position.y + obstacle.direction.y);
    app.stage.addChild(graphics);
}


// Listen for animate update
app.ticker.add((delta) => {

    for(let dude of particles) {

        const p1 = new wheeler.Vector(dude.x, dude.y);
        const v = new wheeler.Vector(dude.velocity.x, dude.velocity.y);
        const p2 = p1.add(v);

        for (let obstacle of obstacles) {
            let vnext = v;
            const next = obstacle.reflectMovement(p1, p2);
            dude.x = next.x;
            dude.y = next.y;

            if (next.x != p2.x || next.y != p2.y) {
                vnext = obstacle.reflect(v.add(obstacle.position)).sub(obstacle.position);
                dude.velocity.x = vnext.x;
                dude.velocity.y = vnext.y;
                break;
            }
        }

        if (dude.x < 0 || dude.x > app.screen.width) {
            dude.velocity.x = -dude.velocity.x;
            dude.velocity.x = dude.velocity.x;
        }
        if (dude.y < 0 || dude.y > app.screen.height) {
            dude.velocity.y = -dude.velocity.y;
            dude.velocity.y = dude.velocity.y;
        }
    }
});
