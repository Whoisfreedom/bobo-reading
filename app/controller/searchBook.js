'use strict';

const Controller = require('egg').Controller;
const cheerio = require('cheerio');
const iconvLite = require('iconv-lite');

class ExampleController extends Controller {
  async index() {
    const { ctx } = this;
    if (ctx.query.searchkey) {
      // 若存在搜索条件，则查询书籍，没有则返回查询提示
      // 示例：请求一个 npm 模块信息
      const result = await ctx.curl(`https://www.biquge5200.cc/modules/article/search.php?searchkey=${encodeURI(ctx.query.searchkey)}`, {
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
      $('#main .grid tr').each(function(i, elem) {
        const obj = {};
        if (i > 0) {
          $(this).find('td').each(function(si, selem) {
            if (si === 0) {
              obj.bookLink = $(this).find('a').attr('href');
              obj.name = $(this).text();
            } else if (si === 1) {
              obj.pageLink = $(this).find('a').attr('href');
              obj.newAtr = $(this).text();
            } else if (si === 2) {
              obj.auther = $(this).text();
            } else if (si === 3) {
              obj.type = $(this).text();
            } else if (si === 4) {
              obj.date = $(this).text();
            } else if (si === 5) {
              obj.writeType = $(this).text();
            }
          });
          list.push(obj);
        }


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
        errorMsg: '请输入查询书籍名称',
      };
    }

  }
}

module.exports = ExampleController;
