export const LIMITS = {
  MAX_UPLOAD_SIZE_BYTES: 50 * 1024 * 1024,      // 50 MB
  MAX_EXTRACTED_SIZE_BYTES: 150 * 1024 * 1024,  // 150 MB
  MAX_FILE_COUNT: 1500,                         // 1500 files
  MAX_SINGLE_FILE_SIZE_BYTES: 2 * 1024 * 1024,  // 2 MB
  MAX_AI_PAYLOAD_BYTES: 350 * 1024,             // ~350 KB text to Claude
  MAX_MODULE_FILES_FOR_STAGE2: 25,              // Max key source files to inspect closely
};

export const IGNORED_DIRECTORIES = new Set([
  'node_modules',
  '.git',
  '.svn',
  '.hg',
  'dist',
  'build',
  'out',
  'coverage',
  '.next',
  '.nuxt',
  '.svelte-kit',
  'vendor',
  'target',
  '__pycache__',
  '.pytest_cache',
  '.mypy_cache',
  '.idea',
  '.vscode',
  'bin',
  'obj',
  '.venv',
  'venv',
  'env',
  '.expo',
  '.gradle',
]);

export const SECRET_FILE_PATTERNS = [
  /^\.env(\..+)?$/i,
  /\.pem$/i,
  /\.key$/i,
  /\.p12$/i,
  /\.pfx$/i,
  /\.asc$/i,
  /^id_rsa/i,
  /^id_dsa/i,
  /^id_ed25519/i,
  /credentials\.json$/i,
  /service-account.*\.json$/i,
  /\.keystore$/i,
  /htpasswd/i,
  /shadow/i,
  /secret/i,
];

export const BINARY_EXTENSIONS = new Set([
  'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'ico', 'svg',
  'mp3', 'mp4', 'm4a', 'wav', 'avi', 'mov', 'webm', 'flv',
  'zip', 'tar', 'gz', 'bz2', '7z', 'rar', 'pdf', 'doc', 'docx',
  'xls', 'xlsx', 'ppt', 'pptx', 'exe', 'dll', 'so', 'dylib',
  'class', 'jar', 'pyc', 'pyo', 'woff', 'woff2', 'ttf', 'eot',
  'db', 'sqlite', 'sqlite3', 'iso', 'bin', 'dat',
]);

export const HIGH_PRIORITY_CONFIG_FILES = [
  'package.json',
  'requirements.txt',
  'pyproject.toml',
  'Cargo.toml',
  'pom.xml',
  'build.gradle',
  'go.mod',
  'composer.json',
  'Dockerfile',
  'docker-compose.yml',
  'docker-compose.yaml',
  'tsconfig.json',
  'jsconfig.json',
  'README.md',
  'readme.md',
  'README',
  'Makefile',
];
