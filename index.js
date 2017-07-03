require('dotenv').config();

const http = require('http');
const App = require('./app/App');
const DEFAULT_PORT = 8080;
   

const app = new App();
const port = process.env.PORT || DEFAULT_PORT;
const server = http.createServer(app.express);


server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

const jobs = require('./app/jobs/jobs');

jobs.startJobs();

function onError(error) {
    if (error.syscall !== 'listen') throw error;

    switch (error.code) {
        case 'EACCES':
            console.error(`Port ${port} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`Port ${port} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}


function onListening() {
    let addr = server.address();
    let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
    console.log(`Listening on ${bind}`);
}
