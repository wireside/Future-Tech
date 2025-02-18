const rootSelector = '[data-js-video-player]'

class VideoPlayer {
  selectors = {
    root: rootSelector,
    video: '[data-js-video-player-video]',
    panel: '[data-js-video-player-panel]',
    playButton: '[data-js-video-player-play-button]',
  }
  
  stateClasses = {
    isActive: 'is-active',
  }
  
  constructor(rootElement) {
    this.rootElement = rootElement
    this.videoElement = this.rootElement.querySelector(this.selectors.video)
    this.panelElement = this.rootElement.querySelector(this.selectors.panel)
    this.playButtonElement = this.rootElement.querySelector(this.selectors.playButton)
  }
}

class VideoPlayerCollection {
  constructor() {
    this.init()
  }
  
  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new VideoPlayer(element)
    })
  }
}

export default VideoPlayerCollection