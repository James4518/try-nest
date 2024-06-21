const NAME_REGEX = /^(?![_0-9])[\u4e00-\u9fa5a-zA-Z0-9\s_]+$/
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{6,}$/
const PICTURE_REGEX = /(\d+)-([a-zA-Z\u4e00-\u9fa5\-\s]+)\.(jpg|jpeg|png)/

const NAME_OR_PASSWORD_IS_REQUIRED = "用户名或者密码不能为空~";
const NAME_IS_ALREADY_EXISTS = "用户名已经被占用~";
const NAME_LENGTH = "用户名长度超过10字符~";
const NAME_IS_LIMITED = "用户名不符合规范~";
const PASSWORD_LENGTH = "密码最少6位~";
const PASSWORD_IS_LIMITED = "密码不符合规范~";
const NO_CONFRIMPASSWORD = "缺少确认密码~";
const WRONG_CONFRIMPASSWORD = "两次密码不同~";
const UNKNOW_FIELD = "未知字段~";
const NOFILE = "没有文件~";
const FORMAT_WRONG = "文件格式错误~";
const FILENAME_WRONG = "文件名错误~";
const MORE_THAN_FILESIZE = "文件太大~";
const Exceeds_MAXIMUM_NUMBER = "超出最大数量~";

const AVATAR_PATH = "uploads/avatar";
const PICTURE_PATH = "uploads/picture";

export {
  AVATAR_PATH,
  PICTURE_PATH,
  NAME_REGEX,
  PASSWORD_REGEX,
  PICTURE_REGEX,
  NAME_OR_PASSWORD_IS_REQUIRED,
  NAME_IS_ALREADY_EXISTS,
  NAME_LENGTH,
  NAME_IS_LIMITED,
  PASSWORD_LENGTH,
  PASSWORD_IS_LIMITED,
  NO_CONFRIMPASSWORD,
  WRONG_CONFRIMPASSWORD,
  UNKNOW_FIELD,
  NOFILE,
  FILENAME_WRONG,
  FORMAT_WRONG,
  MORE_THAN_FILESIZE,
  Exceeds_MAXIMUM_NUMBER,
}