module.exports = {
  apps: [{
    name: 'houseiana',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/var/www/houseiana/web',
    instances: 'max', // Use all available CPU cores
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/houseiana-error.log',
    out_file: '/var/log/pm2/houseiana-out.log',
    log_file: '/var/log/pm2/houseiana-combined.log',
    time: true,
    merge_logs: true,
    
    // Graceful shutdown
    kill_timeout: 5000,
    listen_timeout: 3000,
    
    // Auto-restart on file changes (optional, for development)
    // watch: ['./next.config.js', './package.json'],
    
    // Ignore watch for these paths
    ignore_watch: [
      'node_modules',
      '.next',
      'logs',
      '.git',
      'public/uploads',
      '*.log'
    ],
    
    // Environment specific settings
    min_uptime: '10s',
    max_restarts: 10,
    
    // CPU and memory monitoring
    monitoring: true,
    
    // Cron restart (optional - restart every Sunday at 2:30 AM)
    // cron_restart: '30 2 * * 0',
  }],

  // Deploy configuration (optional)
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'YOUR-EC2-PUBLIC-IP',
      ref: 'origin/main',
      repo: 'git@github.com:YOUR-USERNAME/houseiana.git',
      path: '/var/www/houseiana',
      'pre-deploy': 'git fetch --all',
      'post-deploy': 'cd web && pnpm install && pnpm build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': 'echo "Setting up production server..."',
      ssh_options: 'StrictHostKeyChecking=no'
    }
  }
};