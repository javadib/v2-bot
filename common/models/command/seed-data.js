'use strict';

module.exports = {
  data: {
    "name": "Seed Command",
    data: [
      {
        "model": {
          "id": "app.authRequest",
          "code": "authRequest",
          "name": "شماره موبایل",
          "body": `لطفا شماره موبایل خود را وارد کنید`,
          "successText": "ممنون 🙏\n" +
            "کد یکبار مصرف برای شماره {tInput} ارسال شد.",
          "helpText": `مثال: 09123456789`,
          "postFunc": 'sendToken',
          "firstCommand": true,
          "lastCommand": false,
          // "description": "string",
          "nextId": "app.otpCode",
        }
      },
      {
        "model": {
          "prevId": "app.authRequest",
          "id": "app.otpCode",
          "code": "otpCode",
          "name": "کد دو مرحله ای",
          "body": `لطفا کد ار سال شده را وارد کنید`,
          "successText": "شماره موبایل شما با موفقیت ثبت شد ✅",
          // "helpText": '',
          "postFunc": 'validateToken',
          "firstCommand": true,
          "lastCommand": false,
          // "description": "string",
          "nextId": "app.nameRequest"
        }
      },
      {
        "model": {
          "prevId": "app.otpCode",
          "id": "app.nameRequest",
          "code": "fullName",
          "name": "نام و نام خانودگی",
          "body": `لطفا نام و نام خانودگی را وارد کنید`,
          "successText": "{tInput} عزیز خوش آمدید \n" +
            "ثبتنام شما با موفقیت انجام شد 🌹",
          "helpText": `مثال: محمد رضایی`,
          "postFunc": 'validateFullName',
          "firstCommand": true,
          "lastCommand": false,
          // "description": "string",
          "nextId": "product.count",
        }
      },
      {
        "model": {
          "prevId": "app.nameRequest",
          "id": "product.count",
          "code": "productCount",
          "name": "تعداد",
          "body": `لطفا تعداد را فقط به عدد وارد کنید`,
          "successText": "تعداد {tInput} {productName} به سبد خرید شما افزوده شد 🛒",
          "helpText": `مثال: 2`,
          "firstCommand": false,
          "lastCommand": false,
          // "description": "string",
          "nextId": "product.suggestions"
        }
      },
      {
        "model": {
          "prevId": "product.count",
          "id": "product.suggestions",
          "code": "suggestions",
          "name": "پیشنهادات",
          "body": `نوشیدنی؟ ماست؟ سالاد؟`,
          "successText": "تعداد {tInput} {productName} به سبد خرید شما افزوده شد.",
          // "helpText": "string",
          "firstCommand": false,
          "lastCommand": false,
          // "description": "string",
          "nextId": "order.url",
        }
      },
      {
        "model": {
          "id": "order.url",
          "code": "orderUrl",
          "name": "ادامه خرید/پرداخت",
          "body": `سفارش ثبت شد. برای ادامه از این لینک استفاده کنید
{confirmOrderUrl}`,
          // "successText": "x{product.count} {productName} به سبد خرید افزوده شد.",
          // "helpText": "string",
          "firstCommand": false,
          "lastCommand": true,
          // "description": "string",
          "nextId": "product.count",
          "prevId": "product.suggestions"
        }
      },
      {
        "model": {
          "id": "app.generalHelp",
          "code": "generalHelp",
          "name": "راهنمای بات",
          "body": `متن پیشنهادی`,
        }
      },
      {
        "model": {
          "id": "app.welcome",
          "code": "welcome",
          "name": "خوش آمدگویی",
          "body": `به ربات سفارش‌گیر خوش آمدید 🌹
برای استفاده از دستورات راهنما استفاده کنید یا یک پیام بفرستید`,
        }
      },
      {
        "model": {
          "id": "order.cancel",
          "code": "cancelOrder",
          "name": "لغو سفارش",
          "body": `از لغو سفارش مطمین هستید؟ 🤔`,
          "successText": "سفارش شما لغو شد 🙏",
        }
      }
    ],
  },
};
