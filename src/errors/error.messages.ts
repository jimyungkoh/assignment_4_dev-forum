const errorMessages = {
  stringRequired: (field: string) => ({
    "string.base": `${field}은(는) 문자열이어야 합니다.`,
    "any.required": `${field}을(를) 입력해주세요`,
  }),
  string: (field: string) => ({
    "string.base": `${field}은(는) 문자열이어야 합니다.`,
  }),
};

export default errorMessages;
