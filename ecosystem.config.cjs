module.exports = {
  apps: [
    // ===========================================
    // BACKEND API - Using Bun with Node Cluster (18 workers)
    // ===========================================
    {
      name: 'convocation-api',
      cwd: '/home/appadmin/convocation-pu/apps/api',
      script: 'dist/cluster.js',  // Use cluster entry point
      interpreter: '/home/appadmin/.bun/bin/bun',
      
      // Single PM2 instance - cluster.js handles 18 workers internally
      instances: 1,
      exec_mode: 'fork',
      
      // Environment
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      
      // Logging
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: '/home/appadmin/logs/api-error.log',
      out_file: '/home/appadmin/logs/api-out.log',
      merge_logs: true,
      
      // Process Management
      max_memory_restart: '1G',
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      
      // Graceful shutdown
      kill_timeout: 10000,
      wait_ready: false,
      listen_timeout: 10000,
      
      // Watch (disable in production)
      watch: false,
      ignore_watch: ['node_modules', 'logs', 'uploads'],
      
      autorestart: true,
    },
    
    // ===========================================
    // FRONTEND NEXT.JS - SINGLE INSTANCE
    // ===========================================
    {
      name: 'convocation-web',
      cwd: '/home/appadmin/convocation-pu/apps/web',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      interpreter: '/home/appadmin/.bun/bin/bun',
      
      // Single instance (Next.js handles its own optimization)
      instances: 1,
      exec_mode: 'fork',
      
      // Environment
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      
      // Logging
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: '/home/appadmin/logs/web-error.log',
      out_file: '/home/appadmin/logs/web-out.log',
      merge_logs: true,
      
      // Process Management
      max_memory_restart: '2G',
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      
      // Graceful shutdown
      kill_timeout: 10000,
      
      // Watch (disable in production)
      watch: false,
      ignore_watch: ['node_modules', '.next', 'dist'],
      
      autorestart: true,
    },
  ],
};
