module.exports = {
  apps: [
    {
      name: 'vidsiq',
      cwd: __dirname,
      script: '.output/server/index.mjs',
      interpreter: 'node',
      interpreter_args: '--env-file=/etc/vidsiq.env',
      env: {
        NODE_ENV: 'production',
        PORT: '3000',
      },
      autorestart: true,
      max_restarts: 10,
      restart_delay: 1000,
    },
  ],
};
