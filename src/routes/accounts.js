import Account from '../resources/Account.js'

const applyRoutes = function(app) {
  app.patch('/accounts/:id', (req, res) => {
    Account.updateAccount(req.params.id, req.body, req.headers.authorization)
      .then((account) => {
        res.status(200).send({
          'success': true,
          'status': 'UPDATED',
          'message': 'Account status was successfully updated.',
          'account': account
        })
      }, (err) => {
        res.send(err)
      })
  })
}

export default {
  applyRoutes
}
