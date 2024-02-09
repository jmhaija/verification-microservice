import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import router from './routes/router.js'
import DatabaseService from './services/DatabaseService.js'
import settings from '../config/settings.production.json' assert {type: "json"}

const app = express()
app.use(bodyParser.json({
  strict: false
}))
app.use(cors())
app.use(helmet())
app.use(morgan('combined'))
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Content-Length,Server,Date,access-control-allow-methods,access-control-allow-origin')
  res.setHeader('Access-Control-Allow-Methods','PUT, POST, GET, DELETE, OPTIONS, PATCH')
  next()
});

const startApplicationServer = async function() {
  DatabaseService.createConnection()
  router.applyRoutes(app)
  app.listen(settings.server.port, function() {
    console.log(`listening to localhost:${settings.server.port}`)
  })
}

export {
  startApplicationServer
}