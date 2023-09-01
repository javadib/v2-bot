'use strict';

const OtpLibClient = require('../../common/modules/otp/otplib-client');

module.exports = async function enableAuthentication(app) {
  // enable authentication
  app.enableAuth();

  let secret = 'KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD';
  let otpLibClient = new OtpLibClient(app, secret, {
    digits: 4,
    step: 120,
    window: 2
  });

  app.otpProvider = otpLibClient;




  // const torob = require('../../common/modules/ecommece/torob-crawler');
  // let torobCrawler = new torob(app, {});
  // let rootUrl = 'https://torob.com/browse/508/%DA%A9%D8%A7%D9%BE%D8%B4%D9%86-%D8%A8%D8%A7%D8%B1%D8%A7%D9%86%DB%8C-%D9%88-%D9%BE%D8%A7%D9%84%D8%AA%D9%88-%D9%85%D8%B1%D8%AF%D8%A7%D9%86%D9%87/';
  // let items = await torobCrawler.crawl(rootUrl, {});
  // let items = await torobCrawler.fetchVendors(27574, 30);
  //
  // console.log(items);

};
