var CustomAudio = {
  config : {
    level : 1, // MAX 1
    muted : false,
  },

  globalAudio : [],

  Volume : {
    Mute : function () {
      CustomAudio.muted = true;
    },

    unMute : function () {
      CustomAudio.muted = false;
    },

    Change : function (level) {
      CustomAudio.config.level = level;
      for (var key in CustomAudio.globalAudio) {
        CustomAudio.globalAudio[key].volume = level;
      }
      return;
    },
  },

  Play : {
    bullet : function () {
      if (CustomAudio.config.muted) { return; }
      var audio = new Audio('/sounds/effects/laserSimple.mp3');
      audio.volume = CustomAudio.config.level;
      audio.play();
    },

    hit : function () {
      if (CustomAudio.config.muted) { return; }
      var audio = new Audio('/sounds/effects/hitLaserSimple.mp3');
			audio.volume = 0.05*CustomAudio.config.level;
			audio.play();
    },

    background : function () {
      if (CustomAudio.config.muted) { return; }
      var audio = new Audio('/sounds/audio/Stellardrone-OpenCluster.mp3');
			audio.volume = 0.9*CustomAudio.config.level;
			audio.play();
      CustomAudio.globalAudio['background'] = audio;
    },
  },
};
