(() => {
  // Change this if your font has a different name or extension
  const fontName = "Vazirmatn";
  const fontPath = "fonts/Vazirmatn-Regular.ttf"; // Or "fonts/Vazirmatn.ttf" if you're using TTF

  try {
    const font = new FontFace(fontName, `url(${fontPath})`);

    font.load().then(loadedFont => {
      if (loadedFont) {
        document.fonts.add(loadedFont);
        console.log(`✅ PersianFix: ${fontName} loaded and added.`);
        document.body.style.fontFamily = `${fontName}, sans-serif`;
      } else {
        console.error("❌ PersianFix: Font loaded but was undefined.");
      }
    }).catch(err => {
      console.error("❌ PersianFix: Failed to load font:", err);
    });

    const _SceneManager_run = SceneManager.run;
    SceneManager.run = function(sceneClass) {
      document.body.style.fontFamily = `${fontName}, sans-serif`;
      _SceneManager_run.call(this, sceneClass);
    };

  } catch (e) {
    console.error("❌ PersianFix: Exception while loading font:", e);
  }
})();
