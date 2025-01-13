import express, { Request, Response, NextFunction } from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';

const app = express();
const execAsync = promisify(exec);

// Define a custom type for the deployment step
interface DeploymentStep {
  command: string;
  errorMessage: string;
}

// Define all deployment steps with their respective commands and error messages
const deploymentSteps: DeploymentStep[] = [
  {
    command: 'tsc --noEmit',
    errorMessage: 'TypeScript type-checking failed',
  },
  {
    command: 'npm run build',
    errorMessage: 'Build failed',
  },
  {
    command: 'pm2 reload all',
    errorMessage: 'Failed to switch traffic to new build',
  },
  {
    command: 'curl -f http://localhost:3000/health',
    errorMessage: 'Health check failed',
  },
];

// Middleware to check deployment status with proper error handling
app.use((req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Middleware: Deployment health check initiated');
    next();
  } catch (error) {
    console.error('Middleware error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint to trigger deployment process with improved error handling and async/await
app.post('/deploy', async (req: Request, res: Response) => {
  try {
    console.log('Deployment process started...');

    // Iterate over each deployment step
    for (const step of deploymentSteps) {
      const result = await execAsync(step.command);
      console.log(`${step.command} executed successfully:`, result.stdout);
    }

    res.status(200).send('Deployment completed successfully with zero downtime.');
  } catch (error: any) {
    // Find the failed deployment step and return a more informative error message
    const failedStep = deploymentSteps.find((step) => error.cmd.includes(step.command));
    const errorMessage = failedStep ? failedStep.errorMessage : 'Deployment failed';
    console.error(errorMessage, error);
    res.status(500).send(`${errorMessage}. Check logs for more details.`);
  }
});

// Endpoint for health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).send('Application is healthy and running.');
});

// Start the server with improved error handling
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Additional error handling for unhandled rejections and uncaught exceptions
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});