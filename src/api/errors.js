// src/api/errors.js
export class TokenParseError extends Error {
  constructor(message = "토큰 파싱에 실패했습니다.") {
    super(message);
    this.name = "TokenParseError";
    this.code = "CLIENT_E001";
  }
}

export class TokenMissingError extends Error {
  constructor(message = "토큰이 존재하지 않습니다.") {
    super(message);
    this.name = "TokenMissingError";
    this.code = "CLIENT_E002";
  }
}
