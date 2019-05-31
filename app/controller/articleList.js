'use strict';

const Controller = require('egg').Controller;
const cheerio = require('cheerio');
const iconvLite = require('iconv-lite');

class ExampleController extends Controller {
  async index() {
    const { ctx } = this;
    if (ctx.request.body) {
      // 若存在搜索条件，则查询书籍，没有则返回查询提示
      // 示例：请求一个 npm 模块信息
      const result = await ctx.curl(`${ctx.request.body.bookLink}`, {
        // 必须指定 method
        method: 'GET',
        // 自动解析 JSON response
        dataType: 'text/html',
        // 3 秒超时
        timeout: 3000,
      });
      // const data = result.data.toString('utf8');
      const data = iconvLite.decode(result.data, 'GBK');
      const $ = cheerio.load(data);
      const list = [];
      $('#list dl').each(function(i, elem) {

        $(this).find('dd').each(function(si, selem) {
          const obj = {};
          obj.text = $(this).text();
          console.log($(this).text());
          if ($(this).find('a')) {
            obj.articleLink = $(this).find('a').attr('href');
          }
          list.push(obj);
        });

      });
      ctx.body = {
        data: list,
        state: 200,
        errorMsg: '',
      };
    } else {
      ctx.body = {
        data: [],
        state: -1,
        errorMsg: '查询失败',
      };
    }

  }
}

module.exports = ExampleController;
