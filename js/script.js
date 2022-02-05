// Damn Those Birds!
let game = {};
class Game extends Phaser.Scene {
  constructor() {
    super();
  }
  preload() {
    this.load.image("car0", "assets/car0.png");
    this.load.image("car1", "assets/car1.png");
    this.load.image("plant0", "assets/plant0.png");
    this.load.image("plant1", "assets/plant1.png");
    this.load.image("pigeon0", "assets/pigeon0.png");
    this.load.image("pigeon1", "assets/pigeon1.png");
    this.load.image("poop0", "assets/poop0.png");
    this.load.image("poop1", "assets/poop1.png");
    this.load.image("poop2", "assets/poop2.png");
  }
  create() {
    // Create plants first layer
    game.plants = this.physics.add.group();
    for (var i = 0; i < 5; i++) {
      game.plants.create(Math.random() * 2000, this.sys.game.canvas.height - 32, "plant0").setScale(8).setGravityY(-config.physics.arcade.gravity.y);
    }

    // Create the car
    game.car = this.physics.add.sprite(0, 0, "car0").setScale(8).setCollideWorldBounds(true).setSize(16, 8).setOffset(0, 0).setDrag(800);

    // Create plants second layer
    for (var i = 0; i < 5; i++) {
      game.plants.create(Math.random() * 2000, this.sys.game.canvas.height - 32, "plant1").setScale(8).setGravityY(-config.physics.arcade.gravity.y);
    }

    // Create birds
    game.birds = this.physics.add.group();
    game.poop = this.physics.add.group();
    setInterval(function () {
      let dir = Math.floor(Math.random() * 2) === 1 ? 0 : 2000;
      let bird = game.birds.create(dir, Math.random() * 200, "pigeon0").setScale(8).setGravityY(-config.physics.arcade.gravity.y);
      bird.setVelocityX(dir > 0 ? -100 : 100);
      bird.poopTimer = 100;
      bird.dir = dir;
      if (dir < 2000) {
        bird.flipX = true;
      }
    }, Math.random() * 5000);

    // Input
    game.cursors = this.input.keyboard.createCursorKeys();

    // Camera
    this.cameras.main.setBounds(0, 0, 2000, this.sys.game.canvas.height);
    this.physics.world.setBounds(0, 0, 2000, this.sys.game.canvas.height);
    this.cameras.main.startFollow(game.car, true, 0.1, 0.1);

    // Animation
    this.anims.create({
      key: "drive",
      frames: [{
        key: "car1"
      }, {
        key: "car0"
      }],
      frameRate: 5,
      repeat: 0
    });

    // Colliders
    this.physics.add.collider(game.plants, game.plants, (plant1, plant2) => {
      plant1.destroy();
    });
    this.physics.add.collider(game.car, game.poop, (car, poop) => {
      
    });
  }
  update() {
    if (game.cursors.right.isDown) {
      game.car.setVelocityX(500);
      game.car.flipX = true;
      game.car.anims.play("drive", true);
    } else if (game.cursors.left.isDown) {
      game.car.setVelocityX(-500);
      game.car.flipX = false;
      game.car.anims.play("drive", true);
    }
    game.birds.getChildren().forEach(bird => {
      bird.poopTimer--;
      console.log(bird.poopTimer);
      if (bird.poopTimer <= 0) {
        let poop = game.poop.create(bird.x, bird.y, "poop0").setScale(8).setSize(1, 1).setOffset(6, 6);
        if (bird.dir < 2000) {
          poop.flipX = true;
          poop.setOffset(1, 6);
        }
        bird.poopTimer = 100;
      }
    });
  }
}
