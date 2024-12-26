/**
 * Regular expression to validate an email address.
 *
 * This regex matches a wide range of valid email formats, ensuring that:
 * - The email has a local part (before the '@') that can contain letters, numbers, and special characters like `.`, `+`, `!`, etc.
 * - The domain part (after the '@') can include letters, numbers, and hyphens, and can have subdomains.
 * - The top-level domain (TLD) must consist of letters and can have multiple segments.
 *
 * @constant {RegExp} EMAIL_REGEX - Email validation regex.
 */
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * Regular expression to validate a username.
 *
 * This regex ensures that:
 * - The username consists only of alphanumeric characters and underscores.
 * - The username must be between 3 and 255 characters in length.
 *
 * @constant {RegExp} USERNAME_REGEX - Username validation regex.
 */
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,255}$/;

/**
 * Regular expression to validate a password.
 *
 * This regex ensures that:
 * - The password is between 8 and 80 characters in length.
 * - It contains at least one lowercase letter, one uppercase letter, one digit, and one special character (such as `.`, `-`, `_`, or `!`).
 *
 * @constant {RegExp} PASSWORD_REGEX - Password validation regex.
 */
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!.\-_])[a-zA-Z\d!.\-_]{8,80}$/;

/**
 * Regular expression to validate a mission name.
 *
 * This regex ensures that:
 * - The mission name consists of letters, numbers, spaces, commas, and periods.
 * - It must be between 3 and 100 characters in length.
 *
 * @constant {RegExp} MISSION_NAME_REGEX - Mission name validation regex.
 */
const MISSION_NAME_REGEX = /^[a-zA-Z0-9,. ]{3,100}$/;

module.exports = {
  EMAIL_REGEX,
  USERNAME_REGEX,
  PASSWORD_REGEX,
  MISSION_NAME_REGEX,
};
