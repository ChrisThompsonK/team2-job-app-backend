/**
 * Application configuration management
 */

interface DatabaseConfig {
	path: string;
	verbose: boolean;
}

interface ServerConfig {
	port: number;
	host: string;
	cors: {
		origin: string | string[];
		credentials: boolean;
	};
}

interface LoggingConfig {
	level: 'error' | 'warn' | 'info' | 'debug';
	format: 'json' | 'simple';
	file: boolean;
}

export interface AppConfig {
	name: string;
	version: string;
	environment: 'development' | 'production' | 'test';
	server: ServerConfig;
	database: DatabaseConfig;
	logging: LoggingConfig;
}

const getConfig = (): AppConfig => {
	const env = process.env['NODE_ENV'] as AppConfig['environment'] || 'development';
	
	return {
		name: process.env['APP_NAME'] || 'team2-job-app-backend',
		version: process.env['APP_VERSION'] || '1.0.0',
		environment: env,
		server: {
			port: parseInt(process.env['PORT'] || '3000', 10),
			host: process.env['HOST'] || 'localhost',
			cors: {
				origin: env === 'production' 
					? process.env['CORS_ORIGIN']?.split(',') || ['http://localhost:3000']
					: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'],
				credentials: true,
			},
		},
		database: {
			path: process.env['DATABASE_PATH'] || 'database.sqlite',
			verbose: env === 'development',
		},
		logging: {
			level: (process.env['LOG_LEVEL'] as LoggingConfig['level']) || 
				(env === 'production' ? 'info' : 'debug'),
			format: env === 'production' ? 'json' : 'simple',
			file: env === 'production',
		},
	};
};

export const config = getConfig();