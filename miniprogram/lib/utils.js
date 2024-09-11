const db = wx.cloud.database();

function cloudCall(promiseCall, tag = 'Database call', preProcess = null) {
  return new Promise((resolve, reject) => {
    promiseCall
      .then((res) => {
        console.log(`${tag} ====>`, res);
        if (preProcess) {
          preProcess(res);
        }
        resolve(res);
      })
      .catch((err) => {
        reject(`${tag} failure: ${err}`);
      });
  });
}

function cloudFunctionCall(
  collectionName,
  functionName,
  data = null,
  preProcess = null,
) {
  return new Promise((resolve, reject) => {
    wx.cloud
      .callFunction({
        name: collectionName,
        data: {
          func: functionName,
          data,
        },
      })
      .then((res) => {
        console.log(functionName, res);
        const result = res.result;
        if (preProcess) {
          preProcess(result);
        }
        resolve(result);
      })
      .catch((err) => {
        console.error(functionName, err);
        reject(`${functionName} failure: ${err}`);
      });
  });
}

function getAppConfig() {
  return new Promise((resolve, reject) => {
    cloudCall(db.collection('appConfig').get())
      .then((res) => {
        if (res.data.length > 0) {
          resolve(res.data[0]);
        } else {
          reject('No config found in the database.');
        }
      })
      .catch((error) => {
        reject('Error fetching config: ' + error);
      });
  });
}

function extractImageUrls(html) {
  const richTextContent = html;
  const imgTags = richTextContent.match(/<img.*?src=['"](.*?)['"]/g);
  const imgUrls = imgTags.map((tag) => tag.match(/src=['"](.*?)['"]/)[1]);
  return imgUrls;
}

function parseFormattedDate(dateString) {
  const parts = dateString.split(' '); // Split the string into date and time parts
  const datePart = parts[0];
  const timePart = parts[1];
  const [month, day] = datePart.split('/');
  const [hour, minute] = timePart.split(':');
  const now = new Date();
  const year = now.getFullYear();
  const parsedDate = new Date(
    year,
    parseInt(month) - 1,
    parseInt(day),
    parseInt(hour),
    parseInt(minute),
  );
  return parsedDate.getTime(); // Return the timestamp
}

function formatDate(timestamp) {
  var date = new Date(timestamp);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = date.getDate();
  d = d < 10 ? '0' + d : d;
  var h = date.getHours();
  h = h < 10 ? '0' + h : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? '0' + minute : minute;
  second = second < 10 ? '0' + second : second;
  return m + '/' + d + ' ' + h + ':' + minute;
}

function formatDateTwo(timestamp, format = 'yyyy-mm-dd') {
  const date = new Date(timestamp);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');

  const formats = {
    'mm.dd': `${m}.${d}`,
    'yyyy.mm.dd': `${y}.${m}.${d}`,
    'yyyy-mm-dd': `${y}-${m}-${d}`,
    'yyyy/mm/dd': `${y}/${m}/${d}`,
    'yyyy-mm-dd hh:mm:ss': `${y}-${m}-${d} ${h}:${minute}:${second}`,
  };
  return formats[format] || formats['yyyy-mm-dd'];
}

function formatDateThree(timestamp) {
  var date = new Date(timestamp);
  var h = date.getHours();
  h = h < 10 ? '0' + h : h;
  var minute = date.getMinutes();
  minute = minute < 10 ? '0' + minute : minute;
  return h + ':' + minute;
}

function formatDateToMonthDay(timestamp) {
  const date = new Date(timestamp);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}月${day}日`;
}

function calcDistance(la1, lo1, la2, lo2) {
  var La1 = (la1 * Math.PI) / 180.0;
  var La2 = (la2 * Math.PI) / 180.0;
  var La3 = La1 - La2;
  var Lb3 = (lo1 * Math.PI) / 180.0 - (lo2 * Math.PI) / 180.0;
  var s =
    2 *
    Math.asin(
      Math.sqrt(
        Math.pow(Math.sin(La3 / 2), 2) +
          Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2),
      ),
    );
  s = s * 6378.137;
  s = Math.round(s * 10000) / 10000;
  return s.toFixed(2);
}

function dateDiff(date1, date2) {
  return Math.round((date1 - date2) / (1000 * 60 * 60 * 24));
}

function getDayOfWeek(timestamp) {
  const daysOfWeek = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

  const date = new Date(timestamp);
  const dayIndex = date.getDay();
  return daysOfWeek[dayIndex];
}

function getDateString(timestamp) {
  const now = new Date();
  const currentWeekStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - now.getDay(),
  );
  const currentWeekEnd = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - now.getDay() + 6,
  );

  const targetDate = new Date(timestamp);
  const isFuture =
    targetDate > now &&
    targetDate >= currentWeekStart &&
    targetDate <= currentWeekEnd;

  if (isFuture) {
    const weekdays = [
      '星期日',
      '星期一',
      '星期二',
      '星期三',
      '星期四',
      '星期五',
      '星期六',
    ];
    return weekdays[targetDate.getDay()];
  } else {
    const options = {
      month: '2-digit',
      day: '2-digit',
    };
    return targetDate.toLocaleDateString('en-US', options).replace(/\//g, '/');
  }
}

function convertToChineseNumber(number) {
  if (number < 10000) {
    return number.toString();
  } else if (number < 100000000) {
    const quotient = Math.floor(number / 10000);
    return `${quotient}万`;
  } else {
    const quotient = Math.floor(number / 100000000);
    return `${quotient}亿`;
  }
}

function addCommasToNumber(number) {
  const parts = number.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

function formatDateToCSTString(timestamp) {
  const date = new Date(timestamp);
  const chinaDateStr = date.toLocaleString('en-US', {
    timeZone: 'Asia/Shanghai',
  });
  const chinaDate = new Date(chinaDateStr);
  return chinaDate.toISOString().substring(0, 10);
}

function formatEndTime(timestamp) {
  const endTime = new Date(timestamp);
  const formattedEndTime = `${endTime
    .getHours()
    .toString()
    .padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;
  return formattedEndTime;
}

const generateRandomNumber = (digits) => {
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return Math.floor(Math.random() * (max - min + 1) + min);
};

function parseSimpleDate(dateString) {
  if (!dateString || typeof dateString !== 'string') {
    console.error('Invalid dateString:', dateString);
    return null;
  }
  const [year, month, day] = dateString.split('-');
  const parsedDate = new Date(year, parseInt(month) - 1, day);
  return parsedDate.getTime();
}

function formatDateForCalendar(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

module.exports = {
  cloudCall,
  cloudFunctionCall,
  getAppConfig,
  formatDate,
  formatDateTwo,
  formatDateThree,
  formatDateToMonthDay,
  parseFormattedDate,
  calcDistance,
  getDayOfWeek,
  getDateString,
  extractImageUrls,
  convertToChineseNumber,
  addCommasToNumber,
  formatDateToCSTString,
  formatEndTime,
  generateRandomNumber,
  dateDiff,
  parseSimpleDate,
  formatDateForCalendar,
};
