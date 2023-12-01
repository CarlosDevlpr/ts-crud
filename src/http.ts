import 'reflect-metadata'

import express from 'express'
import { json } from 'body-parser'
import expressFileUpload from 'express-fileupload'
import bodyParserErrorHandler from 'express-body-parser-error-handler'
import http from 'http'

import dotenv from 'dotenv-safe'
import cors from 'cors'
import helmet from 'helmet'
import dataSource, {config} from './database/connection'
import routes from './routes'

dotenv.config()

const app = express()

app.set('trust proxy', true)

app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200
}))

app.use(expressFileUpload())
app.use(helmet())
app.use('/', json())
app.use(bodyParserErrorHandler({
    errorMessage: (error) => `Malformed JSON: ${error.message}}`
}));
app.use('/api/v1', routes)

dataSource.initialize()
    .then(() => {
        console.log('Data source has been initialized!')
        console.log(config)
    }).catch((err: any) => {
        console.error(`Error during data source initialization: ${err}`)
    })

const serverHttp = http.createServer(app)

export { serverHttp }