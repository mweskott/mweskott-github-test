// const app = new PIXI.Application({
//     width: 800, height: 600, backgroundColor: 0x1099bb, resolution: window.devicePixelRatio || 1,
// });
const app = new PIXI.Application({ backgroundColor: 0x1099bb });

app.renderer.autoResize = true;
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);
app.renderer.backgroundColor = 0x00ff50;

document.body.appendChild(app.view);

// create a new Sprite from an image path
const bunny = PIXI.Sprite.from('bunny.png');

// center the sprite's anchor point
bunny.anchor.set(0.5);

// move the sprite to the center of the screen
bunny.x = app.screen.width / 2;
bunny.y = app.screen.height / 2;

app.stage.addChild(bunny);

console.log("app=", app);

bunny.velocity = {x: 5.0, y: 3.0};


let count = 0;

// Listen for animate update
app.ticker.add((delta) => {
    // just for fun, let's rotate mr rabbit a little
    // delta is 1 if running at 100% performance
    // creates frame-independent transformation
    // bunny.rotation += 0.1 * delta;

    count++;
    let multiplikator = 0.5;
    if (count % 2 == 0) {
        multiplikator = 2;
    }

    bunny.x = bunny.x + bunny.velocity.x;
    bunny.y = bunny.y + bunny.velocity.y;

    if (bunny.x < 0 || bunny.x > app.screen.width) {
        bunny.velocity.x = -bunny.velocity.x;
        bunny.velocity.x = bunny.velocity.x * multiplikator;
    }
    if (bunny.y < 0 || bunny.y > app.screen.height) {
        bunny.velocity.y = -bunny.velocity.y;
        bunny.velocity.y = bunny.velocity.y * multiplikator;
    }
});
