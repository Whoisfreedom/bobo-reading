'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/book', controller.searchBook.index);
  router.post('/articleList', controller.articleList.index);
  router.post('/articleDetail', controller.articleDetail.index);
};
