import { FormatTypes } from '../../domain/screenshot/entities/FormatTypes.js'
import * as screenshotService from '../../domain/screenshot/screenshotService.js'
import validator from 'validator'

export default function screenshotController(app) {
  app.get('/screenshot', async (req, res, next) => {
    const { url, format } = req.query
    console.log(`Capturing screenshot for url ${url} and format ${format}...`)

    if (!url || !validator.isURL(url)) {
      return res.status(400).send('Invalid URL')
    }
    if (!format) {
      return res.status(400).send('Format required')
    }
    if (!Object.values(FormatTypes).includes(format)) {
      return res.status(400).send('Format not supported')
    }

    try {
      const { buffer, contentType } = await screenshotService.getScreenshot(url, format)
      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': buffer.length,
      })
      res.end(buffer)
    } catch (e) {
      next(e)
    }
  })
}
