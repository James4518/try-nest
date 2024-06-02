const NAME_REGEX = /^(?![_0-9])[\u4e00-\u9fa5a-zA-Z0-9\s_]+$/
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{6,}$/

const NAME_OR_PASSWORD_IS_REQUIRED = "用户名或者密码不能为空~";
const NAME_IS_ALREADY_EXISTS = "用户名已经被占用~";
const NAME_LENGTH = "用户名长度超过10字符~";
const NAME_IS_LIMITED = "用户名不符合规范~";
const PASSWORD_LENGTH = "密码最少6位~";
const PASSWORD_IS_LIMITED = "密码不符合规范~";
const NO_CONFRIMPASSWORD = "缺少确认密码~";
const WRONG_CONFRIMPASSWORD = "两次密码不同~";

export {
  NAME_REGEX,
  PASSWORD_REGEX,
  NAME_OR_PASSWORD_IS_REQUIRED,
  NAME_IS_ALREADY_EXISTS,
  NAME_LENGTH,
  NAME_IS_LIMITED,
  PASSWORD_LENGTH,
  PASSWORD_IS_LIMITED,
  NO_CONFRIMPASSWORD,
  WRONG_CONFRIMPASSWORD,
}