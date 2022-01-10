import Phaser from 'phaser'
import { BackgroundMode } from '../../../types/BackgroundMode'
import Lobby from './Lobby'
import Office from './Office'
import TeleportZone from '../zones/TeleportZone'

import network from '../services/Network'
import store from '../stores'
import { setRoomJoined } from '../stores/RoomStore'
import { resetChat } from '../stores/ChatStore'

export default class Bootstrap extends Phaser.Scene {
  currentScene?: Office | Lobby
  private lobbyReturnPosition?: Phaser.Math.Vector2
  private preloadComplete = false

  constructor() {
    super('bootstrap')
  }

  preload() {
    // background images
    this.load.atlas(
      'cloud_day',
      'assets/background/cloud_day.png',
      'assets/background/cloud_day.json'
    )
    this.load.image('backdrop_day', 'assets/background/backdrop_day.png')
    this.load.atlas(
      'cloud_night',
      'assets/background/cloud_night.png',
      'assets/background/cloud_night.json'
    )
    this.load.image('backdrop_night', 'assets/background/backdrop_night.png')
    this.load.image('sun_moon', 'assets/background/sun_moon.png')

    // tilemaps
    this.load.tilemapTiledJSON('lobby_map', 'assets/map/lobby.json')
    this.load.tilemapTiledJSON('tilemap', 'assets/map/map.json')

    // item images
    this.load.spritesheet('tiles_wall', 'assets/map/FloorAndGround.png', {
      frameWidth: 32,
      frameHeight: 32,
    })
    this.load.spritesheet('upstairs', 'assets/items/UpstairsConnectorsStairsAndOthers.png', {
      frameWidth: 32,
      frameHeight: 32,
    })
    this.load.spritesheet('classroom', 'assets/items/Classroom_and_library.png', {
      frameWidth: 32,
      frameHeight: 32,
    })
    this.load.spritesheet('glassdoor', 'assets/items/glassdoor.png', {
      frameWidth: 32,
      frameHeight: 64,
    })
    this.load.spritesheet('escalator', 'assets/items/escalator.png', {
      frameWidth: 96,
      frameHeight: 160,
    })
    this.load.spritesheet('receptionist', 'assets/items/receptionist.png', {
      frameWidth: 32,
      frameHeight: 64,
    })
    this.load.spritesheet('chairs', 'assets/items/chair.png', {
      frameWidth: 32,
      frameHeight: 64,
    })
    this.load.spritesheet('computers', 'assets/items/computer.png', {
      frameWidth: 96,
      frameHeight: 64,
    })
    this.load.spritesheet('whiteboards', 'assets/items/whiteboard.png', {
      frameWidth: 64,
      frameHeight: 64,
    })
    this.load.spritesheet('office', 'assets/items/Modern_Office_Black_Shadow.png', {
      frameWidth: 32,
      frameHeight: 32,
    })
    this.load.spritesheet('basement', 'assets/items/Basement.png', {
      frameWidth: 32,
      frameHeight: 32,
    })
    this.load.spritesheet('generic', 'assets/items/Generic.png', {
      frameWidth: 32,
      frameHeight: 32,
    })

    //character images
    this.load.spritesheet('adam', 'assets/character/adam.png', {
      frameWidth: 32,
      frameHeight: 48,
    })
    this.load.spritesheet('ash', 'assets/character/ash.png', {
      frameWidth: 32,
      frameHeight: 48,
    })
    this.load.spritesheet('lucy', 'assets/character/lucy.png', {
      frameWidth: 32,
      frameHeight: 48,
    })
    this.load.spritesheet('nancy', 'assets/character/nancy.png', {
      frameWidth: 32,
      frameHeight: 48,
    })

    this.load.on('complete', () => (this.preloadComplete = true))
  }

  create() {
    this.launchBackground(store.getState().user.backgroundMode)
  }

  private launchBackground(backgroundMode: BackgroundMode) {
    this.scene.launch('background', { backgroundMode })
  }

  launchGame() {
    if (!this.preloadComplete) return
    this.scene.launch('lobby', { onLeave: this.handleEnterOffice })
    this.currentScene = this.scene.get('lobby') as Lobby

    store.dispatch(setRoomJoined(true))
    network.webRTC?.checkPreviousPermission()
  }

  changeBackgroundMode(backgroundMode: BackgroundMode) {
    this.scene.stop('background')
    this.launchBackground(backgroundMode)
  }

  private handleEnterLobby = () => {
    const { x, y } = this.lobbyReturnPosition!

    this.scene.stop('office')
    network.leave()
    store.dispatch(resetChat())
    this.scene.launch('lobby', { onLeave: this.handleEnterOffice, enterX: x, enterY: y })
    this.currentScene = this.scene.get('lobby') as Lobby
  }

  private handleEnterOffice = (teleportZone: TeleportZone) => {
    this.lobbyReturnPosition = teleportZone.getBottomCenter()

    this.scene.stop('lobby')
    network.leave()
    store.dispatch(resetChat())
    this.scene.launch('office', {
      onLeave: this.handleEnterLobby,
      teleportTo: teleportZone.teleportTo,
    })
    this.currentScene = this.scene.get('office') as Office
  }
}
