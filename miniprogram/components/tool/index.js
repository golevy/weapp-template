const app = getApp();
const MAX_APP_BAR_HEIGHT = 150; // px

Component({
  options: {
    addGlobalClass: true,
  },
  properties: {},
  data: {
    toolbarHeight: app.globalData.toolbarHeight,
    statusBarHeight: app.globalData.statusBarHeight,
    appBarHeight: MAX_APP_BAR_HEIGHT,
  },

  lifetimes: {
    attached() {},
  },

  methods: {},
});
