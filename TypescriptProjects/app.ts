import express, { Request, Response, NextFunction } from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';

const app = express();
const execAsync = promisify(exec);

// Define a custom logging function with timestamps
const log = (message: string) => {
    console.log(`[${new Date().toISOString()}] ${message}`);
};

// Define a custom error logging function
const logError = (error: Error) => {
    console.error(`[${new Date().toISOString()}] Error: ${error.message}`);
};

// Middleware to check deployment status
app.use((req: Request, res: Response, next: NextFunction) => {
    log('Middleware: Deployment health check initiated');
    next();
});

// Enum for deployment steps
enum DeploymentStep {
    TYPE_CHECKING = 'TypeScript type-checking',
    BUILD = 'Building frontend application',
    SWITCH_TRAFFIC = 'Switching traffic to new build',
    HEALTH_CHECK = 'Health check',
}

// Function to execute a command and handle errors
const executeCommand = async (command: string, step: DeploymentStep) => {
    try {
        const result = await execAsync(command);
        log(`${step} passed: ${result.stdout}`);
    } catch (error) {
        logError(error);
        throw new Error(`${step} failed: ${error.message}`);
    }
};

// Endpoint to trigger deployment process
app.post('/deploy', async (req: Request, res: Response) => {
    try {
        log('Deployment process started...');

        // Step 1: TypeScript type-checking for production code
        await executeCommand('tsc --noEmit', DeploymentStep.TYPE_CHECKING);

        // Step 2: Build the frontend application
        await executeCommand('npm run build', DeploymentStep.BUILD);

        // Step 3: Switch traffic to the new build (zero-downtime)
        await executeCommand('pm2 reload all', DeploymentStep.SWITCH_TRAFFIC);

        // Step 4: Health check to confirm stability
        await executeCommand('curl -f http://localhost:3000/health', DeploymentStep.HEALTH_CHECK);

        res.status(200).send('Deployment completed successfully with zero downtime.');
    } catch (error) {
        logError(error);
        res.status(500).send('Deployment failed. Check logs for more details.');
    }
});

// Endpoint for health check
app.get('/health', (req: Request, res: Response) => {
    res.status(200).send('Application is healthy and running.');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    log(`Server running on http://localhost:${PORT}`);
});

// Define a process exit handler to handle unexpected crashes
process.on('exit', (code) => {
    log(`Process exited with code ${code}`);
});

// Define an unhandled rejection handler to catch and log unhandled promises
process.on('unhandledRejection', (reason, promise) => {
    logError(new Error(`Unhandled rejection: ${reason}`));
});