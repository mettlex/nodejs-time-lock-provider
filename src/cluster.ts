import cluster from "cluster";
import { cpus } from "os";

const cpuCount = cpus().length;

export class Cluster {
  static register(callback: Function): void {
    if (cluster.isPrimary) {
      console.log(`Primary server started on ${process.pid}`);

      process.on("SIGINT", () => {
        console.log("Cluster shutting down...");

        for (const id in cluster.workers) {
          cluster.workers[id].kill();
        }

        process.exit(0);
      });

      for (let i = 0; i < cpuCount; i++) {
        cluster.fork();
      }

      cluster.on("online", (worker) => {
        console.log("Worker %s is online", worker.process.pid);
      });

      cluster.on("exit", (worker, _code, _signal) => {
        console.log(`Worker ${worker.process.pid} died. Restarting...`);

        cluster.fork();
      });
    } else {
      callback();
    }
  }
}
