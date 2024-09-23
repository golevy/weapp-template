import { checkUserLogin } from '../../apis/user';

Page({
  data: {},

  onLoad(options) {
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
});
