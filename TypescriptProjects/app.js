"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import necessary libraries
const express_1 = __importDefault(require("express"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const app = (0, express_1.default)();
const execAsync = (0, util_1.promisify)(child_process_1.exec);
// Middleware to check deployment status
app.use((req, res, next) => {
    console.log('Middleware: Deployment health check initiated');
    next();
});
// Endpoint to trigger deployment process
app.post('/deploy', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Deployment process started...');
        // Step 1: TypeScript type-checking for production code
        const tsCheckCommand = 'tsc --noEmit';
        const tsCheckResult = yield execAsync(tsCheckCommand);
        console.log('TypeScript type-checking passed:', tsCheckResult.stdout);
        // Step 2: Build the frontend application
        const buildCommand = 'npm run build';
        const buildResult = yield execAsync(buildCommand);
        console.log('Build successful:', buildResult.stdout);
        // Step 3: Switch traffic to the new build (zero-downtime)
        const switchTrafficCommand = 'pm2 reload all';
        const trafficResult = yield execAsync(switchTrafficCommand);
        console.log('Traffic switched to new build:', trafficResult.stdout);
        // Step 4: Health check to confirm stability
        const healthCheckCommand = 'curl -f http://localhost:3000/health';
        const healthCheckResult = yield execAsync(healthCheckCommand);
        console.log('Health check passed:', healthCheckResult.stdout);
        res.status(200).send('Deployment completed successfully with zero downtime.');
    }
    catch (error) {
        console.error('Deployment failed:', error);
        res.status(500).send('Deployment failed. Check logs for more details.');
    }
}));
// Endpoint for health check
app.get('/health', (req, res) => {
    res.status(200).send('Application is healthy and running.');
});
// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
