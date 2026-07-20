/**
 * Passenger (cPanel "Setup Node.js App") entry point.
 *
 * Next.js is built with `output: 'standalone'`; the postbuild script copies
 * `public/` and `.next/static` into `.next/standalone/`, so requiring the
 * generated server here is all Passenger needs. Passenger provides PORT.
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.chdir(__dirname);
require('./.next/standalone/server.js');
