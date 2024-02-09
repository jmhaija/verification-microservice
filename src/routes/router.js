import verificationRoutes from './verifications.js'
import accountRoutes from './accounts.js'

const applyRoutes = function(app) {
  verificationRoutes.applyRoutes(app)
  accountRoutes.applyRoutes(app)
}

export default {
  applyRoutes
}
