const express = require('express');
const fs = require('fs');
const http = require('http');
const https = require('https');
const app = express();
const port = 80;

app.get('/.well-known/acme-challenge/kUJFarTBixJXRc1-rVxlUsNqXTf9aQtNl76uAI_zqJ4', (req, res) => {
    res.send('kUJFarTBixJXRc1-rVxlUsNqXTf9aQtNl76uAI_zqJ4.WdKRUYY0yuuaOGtSwHSBd9AzrQD-xIlJg8o5GAYnHzA');
})
app.get('/', (req, res) => res.send('redirecting... <script>window.location.href ="https://cpsslab.club";</script>'));

/**
 * 접속 URL에 대한 정보를 콘솔 로그에 남깁니다.
 * @param {import("http").IncomingMessage} req 클라이언트 메세지 객체
 * @param {string} message 
 */
function writeLog(req, message) {
    const datetime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    var ipAddress = req.connection.remoteAddress;
    if (ipAddress !== undefined) {
        if (ipAddress.substr(0, 7) == "::ffff:") ipAddress = ipAddress.substr(7);
    }
    console.log(`[${datetime}] origin:${ipAddress} / ${message}`);
}

function logger(req, res, next) {
    writeLog(req, "connecting to server");
    res.send(`redirecting... <script>window.location.href ="https://cpsslab.club${req.originalUrl}";</script>`)
    next();
}


app.use(logger);

app.listen(port, () => console.log(`자동 리다이렉트 모드 활성화됨`));

var privateKey = fs.readFileSync('/etc/letsencrypt/live/cpss.sch.ac.kr/privkey.pem').toString();
var certificate = fs.readFileSync('/etc/letsencrypt/live/cpss.sch.ac.kr/cert.pem').toString();

var credentials = {key: privateKey, cert: certificate};

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(port);
httpsServer.listen(443);