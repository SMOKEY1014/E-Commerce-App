// import { Index } from "./index";

// const os = require('os');
// const cluster = require('cluster')

// const numCPUs = os.cpus().length;
// console.log(numCPUs);

// if (cluster.isPrimary) {
//     //For workers
//     for (let i = 0; i < numCPUs.length; i++) { 
//         cluster.fork();
//     }

//     cluster.on('exit', (worker, code, signal) => {
//         console.log(`worker ${worker.process.pid} died`)
//         cluster.fork();
//     });
// } else {
//     console.log(`worker ${process.pid} started`);
//     new Index().init();
// }