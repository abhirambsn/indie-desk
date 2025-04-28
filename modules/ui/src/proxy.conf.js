const PROXY_CONFIG = [
  {
    context: [
      "/api/v1/auth/**"
    ],
    target: "http://localhost:3001",
    secure: false,
    logLevel: "debug",
    changeOrigin: true
  },
  {
    context: [
      "/api/v1/clients/**"
    ],
    target: "http://localhost:3000",
    secure: false,
    logLevel: "debug",
    changeOrigin: true
  },
  {
    context: [
      "/api/v1/**"
    ],
    target: "http://localhost:3001",
    secure: false,
    logLevel: "debug",
    changeOrigin: true
  }
];

module.exports = PROXY_CONFIG;
