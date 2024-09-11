App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error(
        'Please use Base Library version 2.2.3 or above to utilize cloud capabilities.',
      );
    } else {
      wx.cloud.init({
        traceUser: true,
      });
    }

    wx.getSystemSetting({
      success: (e) => {
        this.windowWidth = e.windowWidth;
        this.screenHeight = e.screenHeight;
        this.windowHeight = e.windowHeight;
        this.statusBarHeight = e.statusBarHeight;

        // Bottom navigation bar
        this.navigationBarHeight = e.screenHeight - e.safeArea.bottom;

        // Toolbar
        let menu = wx.getMenuButtonBoundingClientRect();
        this.menu = menu;
        this.toolbarHeight = menu.height + (menu.top - e.statusBarHeight) * 2;
      },
    });
  },
  globalData: {
    userInfo: null,
  },
});
