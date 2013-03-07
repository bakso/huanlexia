
var path = require('path');

module.exports = {
  debug: true,
  name: '欢乐虾',
  description: '欢乐虾是基于Node.js开发的搞笑图片网站',
  version: '0.0.1',
  siteroot: 'http://www.huanlexia.com/',

  // site settings
  site_headers: [
    '<meta name="author" content="EDP@TAOBAO" />',
  ],

  site_logo: '', // default is `name`

  db: 'mongodb://127.0.0.1/huanlexia',

  // mail SMTP
  mail_port: 25,
  mail_user: 'club',
  mail_pass: 'club',
  mail_host: 'smtp.126.com',
  mail_sender: 'club@126.com',
  mail_use_authentication: true,  
};