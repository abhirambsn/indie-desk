const PROXY_CONFIG = [
  {
    context: [
      "/api/v1/auth/**",
      "/api/v1/kpi/**"
    ],
    target: "http://localhost:3000",
    secure: false,
    logLevel: "debug",
    changeOrigin: true
  },
  {
    context: [
      "/api/v1/clients/**"
    ],
    target: "http://localhost:3001",
    secure: false,
    logLevel: "debug",
    changeOrigin: true
  },
  {
    context: [
      "/api/v1/projects/**"
    ],
    target: "http://localhost:3002",
    secure: false,
    logLevel: "debug",
    changeOrigin: true
  },
  {
    context: [
      "/api/v1/*/task/**",
      "/api/v1/*/task",
    ],
    target: "http://localhost:3003",
    secure: false,
    logLevel: "debug",
    changeOrigin: true
  },
  {
    context: [
      "/api/v1/tickets/**",
      "/api/v1/tickets/*"
    ],
    target: "http://localhost:3004",
    secure: false,
    logLevel: "debug",
    changeOrigin: true
  },
  {
    context: [
      "/api/v1/invoices",
      "/api/v1/invoices/**"
    ],
    target: "http://localhost:3005",
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
