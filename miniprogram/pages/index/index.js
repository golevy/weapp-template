import { checkUserLogin } from '../../apis/user';

const app = getApp();

Page({
  data: {
    showingModal: null,
    currentTab: 'home',
    navigationBarHeight: app.globalData.navigationBarHeight, // Safe area
    selectedGenderIndex: 0,

    tabs: [
      {
        id: 'home',
        title: 'Home',
        icon: '../../images/ic_home.png',
        iconActive: '../../images/ic_home_active.png',
      },
      {
        id: 'tool',
        title: 'Tool',
        icon: '../../images/ic_tool.png',
        iconActive: '../../images/ic_tool_active.png',
      },
      {
        id: 'user',
        title: 'User',
        icon: '../../images/ic_user.png',
        iconActive: '../../images/ic_user_active.png',
      },
    ],
  },

  onLoad(options) {
    const { windowWidth, statusBarHeight } = app.globalData;
    this.setData({
      tabWidth: windowWidth / (this.data.tabs.length + 1),
      statusBarHeight,
    });

    checkUserLogin()
      .then((isLoggedIn) => {
        if (isLoggedIn) {
          console.log('User is logged in, preparing to doSomething...');
        }
      })
      .catch((error) => {
        console.error('Login check failed:', error);
      });
  },

  onTabSelect(e) {
    const currentTab = e.currentTarget.dataset.tabid;
    this.setData({
      currentTab,
    });
  },
});
