// Module aliases
var Engine = Matter.Engine,
  Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite,
  Constraint = Matter.Constraint,
  MouseConstraint = Matter.MouseConstraint,
  Mouse = Matter.Mouse,
  Runner = Matter.Runner;

var engine;
var world;
var box1;
var runner = Runner.create();
var circles = [];
var boundaries = [];
var mConstraint;
var ground;

function setup() {
  var canvas = createCanvas(400, 400);
  engine = Engine.create();
  world = engine.world;

  var prev = null;

  for (var x = 200; x < 400; x += 10) {
    var fixed = false;
    if (!prev) {
      fixed = true;
    }
    var p = new Circle(x, 100, 5, fixed);
    circles.push(p);

    if (prev) {
      var options = {
        bodyA: p.body,
        bodyB: prev.body,
        length: 10,
        stiffness: 0.4,
        isStatic: fixed,
      };

      var constraint = Constraint.create(options);
      Composite.add(world, constraint);
    }
    prev = p;
    boundaries.push(new Boundary(200, height, width, 50, 0));
    //   boundaries.push(new Boundary(150, 200, width * 0.6, 20, 0.3));
    //   boundaries.push(new Boundary(250, 300, width * 0.6, 20, -0.3));
  }
  Runner.run(engine);
  Runner.run(runner, engine);
  var canvasmouse = Mouse.create(canvas.elt);
  canvasmouse.pixelRatio = pixelDensity();
  options = {
    mouse: canvasmouse,
  };

  mConstraint = MouseConstraint.create(engine);
  Composite.add(world, mConstraint);
}

// function mouseDragged() {
//   circles.push(new Circle(mouseX, mouseY, random(5, 10)));
// }
function draw() {
  background(51);
  Engine.update(engine);
  for (var i = 0; i < circles.length; i++) {
    circles[i].show();
    if (circles[i].isOffScreen()) {
      circles[i].removeFromWorld();
      circles.splice(i, 1);
      i--;
    }
  }

  for (var i = 0; i < boundaries.length; i++) {
    boundaries[i].show();
  }
  if (mConstraint.body) {
    var pos = mConstraint.body.position;
    var offset = mConstraint.constraint.pointB;
    var m = mConstraint.mouse.position;
    stroke(0, 255, 0);
    line(pos.x + offset.x, pos.y + offset.y, m.x, m.y);
  }
  //   line(
  //     circles[0].body.position.x,
  //     circles[0].body.position.y,
  //     circles[1].body.position.x,
  //     circles[1].body.position.y
  //   );
}
