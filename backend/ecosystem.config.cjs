module.exports = {
  apps: [
    {
      name: 'spongebob',
      script: 'server.js',
      node_args: '--experimental-specifier-resolution=node',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '986M',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      merge_logs: true,
      max_restarts: 10,
      restart_delay: 5000,
    },
  ],
};
