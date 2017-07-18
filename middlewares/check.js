module.exports = {
  checkLogin: function checkLogin(req, res, next) {
    if (!req.session.user) {
      req.flash('error', '未登录'); 
      res.redirect('/signin');
    }
    next();
  },

  checkNotLogin: function checkNotLogin(req, res, next) {
    if (req.session.user) {
      req.flash('error', '已登录'); 
      res.redirect('back');
      //返回之前的页面//return res.redirect('back');这两种写法没有区别,redirect后就返回来，不会执行next()
    }
    next();
  }
};
