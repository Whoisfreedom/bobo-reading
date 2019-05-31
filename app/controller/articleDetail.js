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
      const result = await ctx.curl(`${ctx.request.body.articleLink}`, {
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
      const bookname = $('.bookname h1').text();
      const list = [];
      $('.bottem1').each(function(i, elem) {
        $(this).find('a').each(function(si, selem) {
          const obj = {};
          obj.articleLink = $(this).attr('href');
          obj.articleName = $(this).text();
          list.push(obj);
        });
      });
      const bookBody = $('#content').html();
      ctx.body = {
        data: list,
        state: 200,
        bookname,
        bookBody,
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
