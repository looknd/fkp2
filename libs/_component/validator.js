
//兼容addEventListener和attachEvent
function addEvent(elm, evType, fn, useCapture) {
  if (elm.addEventListener) {
    elm.addEventListener(evType, fn, useCapture); //DOM2.0
  } else if (elm.attachEvent) {
    elm.attachEvent('on' + evType, fn); //IE5+
  } else {
    elm['on' + evType] = fn; //DOM 0
  }
}

//兼容removeEventListener和detachEvent
function rmvEvent(elm, evType, fn, useCapture) {
  if (elm.removeEventListener) {
    elm.removeEventListener(evType, fn, useCapture); //DOM2.0
  } else if (elm.detachEvent) {
    elm.detachEvent('on' + evType, fn); //IE5+
  } else {
    elm['on' + evType] = null; //DOM 0
  }
}


function assertString(input) {
  if (typeof input !== 'string') {
    throw new TypeError('Validates strings only');
  }
}

function isCreditCard(str){
  const creditCard = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|(222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})|62[0-9]{14}$/;
  assertString(str);
  const sanitized = str.replace(/[^0-9]+/g, '');
  if (!creditCard.test(sanitized)) {
    return false;
  }
  let sum = 0;
  let digit;
  let tmpNum;
  let shouldDouble;
  for (let i = sanitized.length - 1; i >= 0; i--) {
    digit = sanitized.substring(i, (i + 1));
    tmpNum = parseInt(digit, 10);
    if (shouldDouble) {
      tmpNum *= 2;
      if (tmpNum >= 10) {
        sum += ((tmpNum % 10) + 1);
      } else {
        sum += tmpNum;
      }
    } else {
      sum += tmpNum;
    }
    shouldDouble = !shouldDouble;
  }
  return !!((sum % 10) === 0 ? sanitized : false);
}

function isEmpty(str) {
  assertString(str);
  return str.length === 0;
}

function $$(id){
  return document.getElementById(id)
}

// function password(passwd, reg){
//   var tmp = true;
//   val = passwd;
//   //level  0  1  2  3  4  password stronger
//   level = (val.length>5) ? 0 + (val.length>7) + (/[a-z]/.test(val) && /[A-Z]/.test(val)) + (/\d/.test(val) && /\D/.test(val)) + (/\W/.test(val) && /\w/.test(val)) + (val.length > 12) : 0;
//   if(val.length>20||/\s/.test(val)) level=0; //不包括空格
//   return level;
// }

var block = {
  email    : /^[\.a-zA-Z0-9_=-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
  username : /^[a-zA-Z0-9_\u4e00-\u9fa5]{4,}$/,
  verify   : /^[a-z\d]{4}$/i,
  verify_d : /^[\d]{4}$/i,
  verify_m : /^[\d]{6}$/,
  password : /^(?=.{5,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$/,//密码
  guhua    : /^(\d{3,4})?[-]?\d{7,8}$/,//电话号码的格式
  mobile   : /^(\+?0?86\-?)?1[345789]\d{9}$/, //手机
  url      : /^http[s]?:\/\/([\w-]+\.)+[\w-]+([\w-.\/?%&=]*)?$/, //url
  ip4      : /^(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)$/, //ip地址
  isEmpty  : isEmpty,
  qq       : /^[1-9]*[1-9][0-9]*$/, //QQ号码
  idcard   : /^[1-9]([0-9]{14}|[0-9]{17})$/, //身份证
  birthday : /^(\d{4})[\.-](\d{1,2})[\.-](\d{1,2})$/,
  money    : /^[\d]{1,8}(\.\d{1,2})?$/,
  all      : /[\s\S]/,
  tips     : function(msg){ console.log(msg) },
  noop     : function(){ return true },
  isAscii  : function(str){
    assertString(str)
    var ascii = /^[\x00-\x7F]+$/;
    return ascii.test(str);
  },
  isBase64 : function(str){
    assertString(str)
    var notBase64 = /[^A-Z0-9+\/=]/i;
    var len = str.length;
    if (!len || len % 4 !== 0 || notBase64.test(str)) {
      return false;
    }
    var firstPaddingChar = str.indexOf('=');
    return firstPaddingChar === -1 ||
      firstPaddingChar === len - 1 ||
      (firstPaddingChar === len - 2 && str[len - 1] === '=');
  },
  isCreditCard: isCreditCard
}

var errs = {
  "100": ['必须指定检测类型', block],
  "110": '指定id的dom对象不存在',
  "120": {msg: ''},
  "130": {msg: ''},
  "140": {msg: ''},
  "username": "用户名不正确",
  "mobile": "手机号码不正确",
  email: "邮箱地址不正确",
  verify: "验证码不正确",
  verify_m: "验证码不正确",
  password: "请正确输入密码，匹配6位以上及包含大小写及数字",
  url: "url地址不正确",
  ip4: "ip地址不正确",
  qq: "qq地址不正确",
}

//匹配
function check(val, reg, block){
  var result = (!val)
    ? false
    : typeof block[reg] === 'function'
      ? block[reg](val)
      : block[reg].test(val)
    return result
}

/**
* form表单校验
* form_valide be dependent SAX, SAX is a global function
  SAX like localstorage, but more. SAX.set like .setItem, .get like .getItem
  you must special @name, @name is one of SAX's param
  use SAX.get(@name), then you get the data of @name
  use SAX.set(@name, [JSON/String/Array]) will set value of @name in browse memery

* @name  {String}  special SAX name for stroe

* SAMPLE
* form_valide(name)
             @id {String}     dom element's id
             @type {String}     regular's type
             @callback  {Function}     custom function to regular your self
             (id, type, [callback])   -->   it's a function
             -----------------------------------
             ('user', 'username', [cb])    -->   it's a function
             ('telephone', 'mobile', [cb])
             ('comment', 'notempty', [cb])
             ('code', 'verify', [cb])

   @stat {Boolean}   //@stat is resault of regular.test(value)
   @block {Object}

   cb = function(stat, block){
        //this is form-element of you special id
   }

   valide('Form_bind')
         ('mobile', 'noop', function(res, old){ ... })   //res是noop的检测结果, old为默认正则的检测类型
         ('validatecode', 'verify')
         ("agreement", 'noop')
*/

function form_valide(opts) {
  if (_.isPlainObject(opts)) block = _.merge(block, opts)
  var ckstat=true
  , ii = 0
  , resault
  , element = {}
  , args = {}
  , nblock
  , _noop = function(){}
  , _query = {}
  , query = {
    stat: true
  }
  nblock = _.merge({}, block)

  function validator(value, reg, cb){
    if (!arguments.length) {
      ii = 0
      return ckstat
    }
    if (typeof value == 'function') {
      ii = 0
      ckstat = true
      var _fun = value
        , _errs = []
      Object.keys(query).map(function(item, jj){
        if (!query[item] && item!='stat') {
          ckstat = false
          var tmp = {}
          tmp.key = args[jj]
          tmp.info = errs[args[jj]]
          _errs.push(tmp)
        }
      })
      query.stat = ckstat;
      return _fun(query, _errs)
    }

    if (!reg || !nblock[reg]) return errs['100']
    args[ii] = reg

    ckstat = check(value, reg, nblock)
    if (typeof cb == 'function') {
      var cb_result = cb(value, nblock, errs)
      ckstat = cb_result
    }
    query[ii] = ckstat
    ii++
    return validator
  }
  return validator

  // function _valide(id ,reg, cb, name) {
  //   var tips = block.tips
  //   , formobj
  //   , value
  //
  //   //arguments为空
  //   if (!arguments.length){
  //     return query
  //   }
  //
  //   if (typeof id === 'function'){
  //     var _fun = id
  //     , _errs = {}
  //     , _ckstat = true;
  //     Object.keys(args).map(function(item){
  //       var _stat = _valide.apply(null, args[item])()
  //       if (!_stat){
  //         _ckstat = false;
  //         _errs[item] = element[item]
  //       }
  //     })
  //     query.stat = _ckstat;
  //     return _fun(query, _errs)
  //   }
  //
  //   //id
  //   if (typeof id === 'string' && $$(id)){
  //     formobj = $$(id)
  //     value = formobj.value
  //   }
  //
  //   if (typeof id == 'object' && !Array.isArray(id) && id.nodeType) {
  //     formobj = id
  //     value = formobj.value
  //   }
  //
  //   if (!formobj || !formobj.length) return errs['110']
  //
  //   //reg
  //   if (!reg || !block[reg]) return errs['100']
  //   if (reg === 'noop') return _valide
  //
  //   _query[id] = false;
  //   query[id] = value;
  //   element[id] = formobj;
  //   args[id] = arguments
  //
  //   // 匹配数据是否正确
  //   ckstat = check(value, reg, formobj, block);
  //
  //   _query[id] = ckstat
  //   query.stat = ckstat;
  //
  //   //返回值
  //   var cb_result;
  //
  //   _nblock = _.merge({}, nblock);
  //   _nblock.event = 'blur';
  //   rmvEvent(formobj, 'blur')
  //   addEvent(formobj, 'blur', function(){
  //     var chk_result = check(this.value)
  //     cb_result = typeof cb == 'function' ? cb.call(this, chk_result, _nblock, errs) : ''
  //     if (cb_result || chk_result){
  //       query[this.id] = this.value
  //       _query[this.id] = true
  //       var _v = true;
  //       _.forEach(_query, function(k, v){
  //         if (!v) _v = false
  //       })
  //       ckstat = _v
  //       query.stat = _v;
  //     } else {
  //       _query[this.id] = false
  //       query.stat = false;
  //       ckstat = false;
  //       if (!cb && errs[reg]) tips(errs[reg])
  //     }
  //   })
  //
  //   if (typeof cb == 'function'){
  //     cb_result = cb.call(formobj[0], ckstat, old, errs)
  //     if (cb_result){
  //       ckstat = true;
  //       query.stat = true
  //       if (cb_result === 'end'){
  //         return query
  //       }
  //     } else {
  //       ckstat = false
  //       query.stat = false
  //     }
  //   }
  //   if (cb=='end' || cb == 'finish') return query
  //   return _valide;
  // }
  // return _valide
}

module.exports = form_valide
