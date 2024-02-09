import AWS from 'aws-sdk'
import { generaeteRecoverPaycardEmailTemplate } from '../../libs/recover-merlin-paycard.js'
import settings from '../../config/settings.production.json' assert {type: "json"}

export function sendAWSEmail(email, subject, token, session_token){
  const ses = new AWS.SES({ region: 'us-east-2' })
  const token_expires = Date.now() + settings.verification.tokenExpiry

  const url = `${settings['verification-webview'].baseUrl}/verify?token=${token}&expires=${token_expires}&session_token=${session_token}`
  const sendingEmailResult = new Promise((resolve, reject)=>{
    if(!email) {
      reject('Missing user email')
    } else {
      const params = createInquiryParamsConfig(email, subject, url)
      AWS.config.credentials.refresh(function(){
        ses.sendEmail(params, function(err, data) {
          if(err){
            reject(err)
          } else {
            resolve('Success! Email sent')
          }
        })
      })
    }
  })
  return sendingEmailResult
}

function createInquiryParamsConfig(email, subject, url){
  const params = {
    Destination: { 
      BccAddresses: [],
      CcAddresses: [],
      ToAddresses: [ email ]
    },
    Message: { 
      Body: { 
        Html: {
          Data: generateHTMLInquiryEmail(subject, url),
          Charset: 'UTF-8'
        }
      },
      Subject: { 
        Data: subject,
        Charset: 'UTF-8'
      }
    },
    Source: settings.emailAddress.source, 
    ReplyToAddresses: [ settings.emailAddress.replyTo ],
    ReturnPath: settings.emailAddress.returnPath
  }
  return params
}

function generateHTMLInquiryEmail(subject, url){
  switch(subject) {
    case 'RCC Account Recovery':
      return generaeteRecoverPaycardEmailTemplate(url)
    default: 
    return generaeteRecoverPaycardEmailTemplate(url)
  }
}