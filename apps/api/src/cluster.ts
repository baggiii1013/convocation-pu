import cluster from 'node:cluster';
import os from 'node:os';
import process from 'node:process';
import { createApp } from './app.js';
import { config } from './config/constants.js';
import { logger } from './utils/logger.js';

// Configuration
const NUM_WORKERS = 18; // Number of worker instances
const RESTART_DELAY = 1000; // Delay before restarting a crashed worker (ms)

interface WorkerInfo {
  id: number;
  pid: number;
  startTime: Date;
  restarts: number;
}

const workerRegistry = new Map<number, WorkerInfo>();

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  
  console.log('='.repeat(60));
  console.log('🚀 PU Convocation API - Cluster Mode');
  console.log('='.repeat(60));
  console.log(`📍 Primary process PID: ${process.pid}`);
  console.log(`💻 Available CPUs: ${numCPUs}`);
  console.log(`👷 Starting ${NUM_WORKERS} worker instances...`);
  console.log('='.repeat(60));

  // Fork workers
  for (let i = 0; i < NUM_WORKERS; i++) {
    const worker = cluster.fork({ WORKER_ID: i + 1 });
    
    workerRegistry.set(worker.id!, {
      id: i + 1,
      pid: worker.process.pid!,
      startTime: new Date(),
      restarts: 0,
    });
    
    console.log(`✅ Worker ${i + 1} started with PID: ${worker.process.pid}`);
  }

  // Handle worker exit
  cluster.on('exit', (worker, code, signal) => {
    const workerInfo = workerRegistry.get(worker.id!);
    const workerId = workerInfo?.id || 'unknown';
    
    console.log('='.repeat(60));
    console.log(`⚠️  Worker ${workerId} (PID: ${worker.process.pid}) died`);
    console.log(`   Exit code: ${code}, Signal: ${signal}`);
    
    if (workerInfo) {
      workerInfo.restarts++;
      
      // Check if worker has restarted too many times
      if (workerInfo.restarts > 10) {
        console.log(`❌ Worker ${workerId} has restarted too many times (${workerInfo.restarts}). Not restarting.`);
        workerRegistry.delete(worker.id!);
        return;
      }
    }

    // Restart the worker after a delay
    console.log(`🔄 Restarting worker ${workerId} in ${RESTART_DELAY}ms...`);
    console.log('='.repeat(60));
    
    setTimeout(() => {
      const newWorker = cluster.fork({ WORKER_ID: workerId });
      
      workerRegistry.set(newWorker.id!, {
        id: typeof workerId === 'number' ? workerId : parseInt(workerId) || 0,
        pid: newWorker.process.pid!,
        startTime: new Date(),
        restarts: workerInfo?.restarts || 0,
      });
      
      console.log(`✅ Worker ${workerId} restarted with new PID: ${newWorker.process.pid}`);
    }, RESTART_DELAY);
  });

  // Handle worker online event
  cluster.on('online', (worker) => {
    const workerInfo = workerRegistry.get(worker.id!);
    console.log(`🟢 Worker ${workerInfo?.id || worker.id} is online`);
  });

  // Handle worker listening event
  cluster.on('listening', (worker, address) => {
    const workerInfo = workerRegistry.get(worker.id!);
    console.log(`👂 Worker ${workerInfo?.id || worker.id} is listening on port ${address.port}`);
  });

  // Graceful shutdown for primary
  const gracefulShutdown = (signal: string) => {
    console.log('='.repeat(60));
    console.log(`📛 Received ${signal}. Initiating graceful shutdown...`);
    console.log('='.repeat(60));

    // Send shutdown signal to all workers
    for (const id in cluster.workers) {
      const worker = cluster.workers[id];
      if (worker) {
        console.log(`   Sending shutdown signal to worker ${id}...`);
        worker.send('shutdown');
        worker.disconnect();
      }
    }

    // Wait for workers to exit, then exit primary
    let exitedWorkers = 0;
    const totalWorkers = Object.keys(cluster.workers || {}).length;

    if (totalWorkers === 0) {
      console.log('✅ All workers have exited. Primary shutting down.');
      process.exit(0);
    }

    // Force exit after 30 seconds
    const forceExitTimeout = setTimeout(() => {
      console.log('⏰ Timeout reached. Forcing shutdown...');
      process.exit(1);
    }, 30000);

    cluster.on('exit', () => {
      exitedWorkers++;
      console.log(`   Worker exited (${exitedWorkers}/${totalWorkers})`);
      
      if (exitedWorkers >= totalWorkers) {
        clearTimeout(forceExitTimeout);
        console.log('✅ All workers have exited. Primary shutting down.');
        process.exit(0);
      }
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // Log cluster status periodically
  setInterval(() => {
    const activeWorkers = Object.keys(cluster.workers || {}).length;
    console.log(`📊 Cluster status: ${activeWorkers}/${NUM_WORKERS} workers active`);
  }, 60000); // Log every minute

} else {
  // Worker process - start the server directly
  const workerId = process.env.WORKER_ID || cluster.worker?.id || 'unknown';
  
  console.log(`🔧 Worker ${workerId} (PID: ${process.pid}) initializing...`);

  // Start the server directly (same logic as server.ts)
  const startWorkerServer = async (): Promise<void> => {
    try {
      const app = createApp();

      const server = app.listen(config.PORT, () => {
        logger.info(`✅ Worker ${workerId} started on port ${config.PORT}`);
      });

      // Graceful shutdown handling for worker
      const gracefulShutdown = (signal: string) => {
        logger.info(`Worker ${workerId} received ${signal}, shutting down...`);
        server.close(() => {
          logger.info(`Worker ${workerId} closed successfully`);
          process.exit(0);
        });

        setTimeout(() => {
          logger.error(`Worker ${workerId} forced shutdown after timeout`);
          process.exit(1);
        }, 10000);
      };

      process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
      process.on('SIGINT', () => gracefulShutdown('SIGINT'));

      process.on('unhandledRejection', (reason, promise) => {
        logger.error(`Worker ${workerId} unhandled rejection:`, { promise, reason });
        gracefulShutdown('unhandledRejection');
      });

      process.on('uncaughtException', (error) => {
        logger.error(`Worker ${workerId} uncaught exception:`, error);
        gracefulShutdown('uncaughtException');
      });

    } catch (error) {
      logger.error(`Worker ${workerId} failed to start:`, error);
      process.exit(1);
    }
  };

  startWorkerServer();

  // Handle shutdown message from primary
  process.on('message', (msg) => {
    if (msg === 'shutdown') {
      console.log(`📛 Worker ${workerId} received shutdown signal from primary`);
      process.exit(0);
    }
  });
}
