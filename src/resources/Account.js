import axios from 'axios'
import errorHandler from '../services/ErrorHandlingService.js'
import settings from '../../config/settings.production.json' assert {type: "json"}

export default {
  updateAccount(id, status, authHeader) {
    return new Promise((resolve, reject) => {
      axios.patch(`${settings.rcc.api.domain}/accounts/${id}`, 
        { account_status: status },  
        { headers: {authorization: authHeader} }
      )
      .then(res =>{
        resolve(res.data)
      }, err => {
          err.errorCode === 404
          ? reject(errorHandler(404, 'Account object could not be retrieved buy the supplied query'))
          : reject(err) 
      })
    })
  }
}