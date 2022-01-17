import Phaser from 'phaser'
import Office from './scenes/Office'
import Background from './scenes/Background'
import Bootstrap from './scenes/Bootstrap'
import Lobby from './scenes/Lobby'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'phaser-container',
  backgroundColor: '#93cbee',
  pixelArt: true, // Prevent pixel art from becoming blurred when scaled.
  scale: {
    mode: Phaser.Scale.ScaleModes.RESIZE,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  dom: {
    createContainer: true,
  },
  autoFocus: true,
  scene: [Bootstrap, Background, Office, Lobby],
}

const phaserGame = new Phaser.Game(config)

;(window as any).game = phaserGame

export default phaserGame
