function error(errorMessage, errorData={}) {
  return {
      status: 'error',
      message: errorMessage,
      data: errorData ? errorData : null
  };
}

function success(errorData={}, errorMessage="") {
  return {
      status: 'success',
      message: errorMessage ? errorMessage : null,
      data: errorData ? errorData : null
  };
}

module.exports = {
  error, success
}