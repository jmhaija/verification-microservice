import Verification from '../resources/Verification.js'

const applyRoutes = function(app) {
  app.post('/verifications', (req, res) => {
    Verification.createVerification(req.body)
      .then((verification) => {
        res.status(201).send({
          'success': true,
          'status': 'CREATED',
          'message': 'Verification object was successfully created and recover email is sent.'
        })
      }, (err) => {
        res.status(err.errorCode).send(err.errorMessage)
      })
  })

  app.get('/verifications/:id', (req, res) => {
    Verification.getVerification(req.params.id)
      .then((verification) => {
        res.status(200).send({
          'success': true,
          'status': 'RETRIEVED',
          'message': 'Verification object was successfully retrieved.',
          'verification': verification
        })
      }, (err) => {
        res.status(err.errorCode).send(err.errorMessage)
      })
  })

  app.get('/verifications', (req, res) => {
    Verification.getVerificationByQuery(req.query)
      .then((verification) => {
        res.status(200).send({
          'success': true,
          'status': 'RETRIEVED',
          'message': 'Verification object was successfully retrieved.',
          'verification': verification
        })
      }, (err) => {
        res.status(err.errorCode).send(err.errorMessage)
      })
  })

  app.patch('/verifications/:id', (req, res) => {
    Verification.updateVerificationStatus(req.params.id, req.body)
      .then((verification) => {
        res.status(200).send({
          'success': true,
          'status': 'UPDATED',
          'message': 'Verification status was successfully updated.',
          'verification': verification
        })
      }, (err) => {
        res.status(err.errorCode).send(err.errorMessage)
      })
  })
}

export default {
  applyRoutes
}
