const formattedResponse = (
  success: boolean,
  result: any = null,
  message: any = null
) => {
  return {
    success,
    result,
    message,
  };
};

export default formattedResponse;
