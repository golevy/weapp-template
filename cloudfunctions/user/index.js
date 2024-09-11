const deleteAccount = require('./functions/deleteAccount');
const updateUserInfo = require('./functions/updateUserInfo');

exports.main = async (event, context) => {
  const data = event.data;
  switch (event.func) {
    case 'updateUserInfo':
      return await updateUserInfo.main(data, context);
    case 'deleteAccount':
      return await deleteAccount.main(data, context);
  }
};
