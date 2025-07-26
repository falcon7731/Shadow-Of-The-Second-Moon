(() => {
  const width = 1280;
  const height = 720;

  SceneManager._screenWidth  = width;
  SceneManager._screenHeight = height;
  SceneManager._boxWidth     = width;
  SceneManager._boxHeight    = height;

  ScreenManager._screenWidth  = width;
  ScreenManager._screenHeight = height;
  ScreenManager._boxWidth     = width;
  ScreenManager._boxHeight    = height;

  window.screenWidth  = width;
  window.screenHeight = height;
})();
