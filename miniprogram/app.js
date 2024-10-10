App({
  globalData: {
    userInfo: null,
    windowWidth: null,
    statusBarHeight: null,
    navigationBarHeight: null,
    toolbarHeight: null,
    menu: null,
  },

  onLaunch() {
    if (!wx.cloud) {
      console.error(
        'Please use Base Library version 2.2.3 or above to utilize cloud capabilities.',
      );
    } else {
      wx.cloud.init({
        traceUser: true,
      });
    }

    const windowInfo = wx.getWindowInfo();

    this.globalData.windowWidth = windowInfo.windowWidth;
    this.globalData.statusBarHeight = windowInfo.statusBarHeight;

    // Bottom navigation bar
    this.globalData.navigationBarHeight =
      windowInfo.screenHeight - windowInfo.safeArea.bottom;

    // Toolbar
    const menu = wx.getMenuButtonBoundingClientRect();
    this.globalData.menu = menu;
    this.globalData.toolbarHeight =
      menu.height + (menu.top - windowInfo.statusBarHeight) * 2;
  },
});
