const app = getApp();

const Pages = {
  Index: {
    authRequired: false,
    url: '/pages/index/index',
  },
  OnBoarding: {
    authRequired: false,
    url: '/pages/onboarding/index',
  },
  UserProfile: {
    authRequired: false,
    url: '/pages/user/profile/index',
  },
};
å
export const navigateToIndexPage = () => {
  navigate(Pages.Index);
};

export function navigateToOnboarding() {
  navigate(Pages.OnBoarding);
}

export function navigateToUserProfile() {
  navigate(Pages.UserProfile);
}

export const navigate = (page, urlParam = null) => {
  if (!page || !page.url) {
    return;
  }

  const url = urlParam ? page.url + urlParam : page.url;
  if (page.authRequired) {
    if (app.userInfo) {
      wx.navigateTo({
        url,
      });
    } else {
      //
    }
  } else {
    wx.navigateTo({
      url,
    });
  }
};
