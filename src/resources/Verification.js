import DatabaseService from '../services/DatabaseService.js'
import errorHandler from '../services/ErrorHandlingService.js'
import crypto from 'crypto'
import { sendAWSEmail } from '../services/AWSEmailService.js'
import settings from '../../config/settings.production.json' assert {type: "json"}
export default {
  createVerification(requestBody){
    return new Promise((resolve, reject) => {
      requestBody.verification.status = 'unverified'
      requestBody.verification.token = crypto.randomBytes(settings.verification.tokenLength).toString('hex')
      // 1. add a new verification object into the collection
      DatabaseService.addData('verifications', requestBody.verification)
      .then(added => {
        // 2. send email with verification link
        sendAWSEmail(requestBody.emailObject.email, requestBody.emailObject.subject, requestBody.verification.token, requestBody.session_token)
          .then(success => {
            resolve(success)
          }, (err) => {
            reject(errorHandler(400, 'Email process failed.'))
          })
      })
    })
  },

  getVerification(verificationID) {
    return new Promise((resolve, reject) => {
      DatabaseService.getData('verifications', verificationID)
        .then((verification) => {
          resolve(verification)
        }, (err) => { 
          err.errorCode === 404 
            ? reject(errorHandler(404, 'The supplied verification ID was not found or could not retrieved'))
            : reject(err) 
        })
    })
  },

  getVerificationByQuery(query){
    return new Promise((resolve, reject) => {
      DatabaseService.findOneBy('verifications', query)
        .then((verification) => {
          resolve(verification)
        }, (err) => { 
          err.errorCode === 404 
            ? reject(errorHandler(404, 'Verification object could not be retrieved buy the supplied query'))
            : reject(err) 
        })
      })
  },

  updateVerificationStatus(id, status) {
    return new Promise((resolve, reject) => {
      DatabaseService.updateData('verifications', id, { status: status })
        .then((updated) => {
          DatabaseService.getData('verifications', id)
            .then(verification => {
              resolve(verification)
            })
        }, (err) => {
          err.errorCode === 404
          ? reject(errorHandler(404, 'Verification object could not be retrieved buy the supplied query'))
          : reject(err) 
        })
    })
  }
}