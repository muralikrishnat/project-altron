const { Worker, isMainThread, parentPort, workerData, MessageChannel } = require('worker_threads');
const { port1, port2 } = new MessageChannel();

if (isMainThread) {
  const worker = new Worker(__filename, {
    workerData: "data sending to worker"
  });
  const worker2 = new Worker(__filename, {
    workerData: "data sending to worker2"
  });
  worker.once('message', (message) => {
    console.log('Worker', message);
  });
  worker.postMessage('Hello, world!');
  worker2.once('message', (message) => {
    console.log('Worker 2', message);
  });
  worker2.postMessage('Hello, world!');
  // port1.on('message', (message) => {
  //   console.log("Got data from slave in Port", message);
  // });
} else {
  // When a message from the parent thread is received, send it back:
  console.log("worker data in thread", workerData)
  parentPort.once('message', (message) => {
    console.log("Got message from Parent", isMainThread);
    parentPort.postMessage(message);
  });

  // port1.postMessage("from worker");
}
