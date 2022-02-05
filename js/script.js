// Damn Those Birds!
let game = {};
class Game extends Phaser.Scene {
  constructor() {
    super();
  }
  preload() {
    this.load.image("car0", "assets/car0.png");
    this.load.image("car1", "assets/car1.png");
  }
  create() {
    // Create the car
    game.car = this.physics.add.sprite(0, 0, "car0").setScale(8).setCollideWorldBounds(true).setSize(16, 8).setOffset(0, 0).setDrag(800);

    // Input
    game.cursors = this.input.keyboard.createCursorKeys();

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
  }
}
