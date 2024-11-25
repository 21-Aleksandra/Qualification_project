const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,255}$/;

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!.\-_])[a-zA-Z\d!.\-_]{8,80}$/;

const MISSION_NAME_REGEX = /^[a-zA-Z0-9,. ]{3,100}$/;

module.exports = {
  EMAIL_REGEX,
  USERNAME_REGEX,
  PASSWORD_REGEX,
  MISSION_NAME_REGEX,
};
