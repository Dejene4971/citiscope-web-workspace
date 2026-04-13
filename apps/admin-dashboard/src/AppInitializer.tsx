import React, { useEffect, useState } from 'react';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { iotIngestionService } from './services/iotIngestionService';
import { registerIoTWorkflows } from './services/iotWorkflowHandlers';
import { registerAllHandlers } from './workflows';
import { auditService } from './services/auditService';

interface AppInitializerProps {
  children: React.ReactNode;
}

/**
 * Runs once on mount — registers workflow handlers and seeds initial data.
 * Wraps the app in a loading state until initialization completes.
 */
export const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        // 1. Register all workflow handlers (orchestrator + IoT-specific)
        registerAllHandlers();
        registerIoTWorkflows();

        // 2. Simulate an initial sensor reading so the map/notifications
        //    have data on first load (remove in production)
        iotIngestionService.simulateAlert();

        // 3. Audit app start
        auditService.log('USER_LOGIN', {
          entityType: 'system',
          entityId: 'citiscope',
          payload: { timestamp: new Date().toISOString() },
        });

        setReady(true);
      } catch (err) {
        console.error('[AppInitializer] init failed:', err);
        setError(err instanceof Error ? err.message : 'Initialization failed');
      }
    };

    init();
  }, []);

  if (error) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>System Initialization Failed</h2>
        <p style={{ color: '#d32f2f' }}>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!ready) {
    return <LoadingSpinner fullScreen message="Initializing CitiScope…" />;
  }

  return <>{children}</>;
};
