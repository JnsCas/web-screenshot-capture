import express from 'express'
import cors from 'cors'
import registerControllers from './application/controllers/index.js'
import errorHandler from './application/middlewares/errorHandler.js'
import logger from './application/middlewares/logger.js'
import * as puppeteerUtils from './domain/screenshot/puppeteerUtils.js'

const PORT = 4000

const app = express()

//middlewares
app.use(cors())
app.use(logger)

//controllers
registerControllers(app)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

process.on('exit', async () => {
  await puppeteerUtils.closeBrowser()
})
