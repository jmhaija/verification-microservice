function errorHandler(errorCode, errorMessage) {
  let errorStatus

  if (errorCode === 500) {
      errorStatus = 'INTERNAL_ERROR'
      errorMessage = errorMessage.toString()
      return generateErrorObject(errorCode, errorStatus, errorMessage)
  } else if (errorCode === 400) {
    errorStatus = 'BAD_REQUEST'
  } else if (errorCode === 401) {
    errorStatus = 'NOT_AUTHORIZED'
  } else if (errorCode === 404) {
    errorStatus = 'NOT_FOUND'
  } else if (errorCode === 405) {
    errorStatus = 'METHOD_NOT_ALLOWED'
  } else if (errorCode === 409) {
    errorStatus = 'ALREADY_EXISTS'
  } else if (errorCode === 415) {
    errorStatus = 'UNSUPPORTED_MEDIA_TYPE'
  } else if (errorCode === 429) {
    errorStatus = 'TOO_MANY_REQUESTS'
  }

  return generateErrorObject(errorCode, errorStatus, errorMessage)
}

function generateErrorObject(code, status, message) {
  return {
    'errorCode': code,
    'errorMessage': {
      'success': false,
      'status': status,
      'message': message
    }
  }
}

export default errorHandler
