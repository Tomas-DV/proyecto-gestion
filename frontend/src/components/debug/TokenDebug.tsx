'use client';

import { useState, useEffect } from 'react';
import { authStorage, tokenUtils } from '@/utils/auth';
import { apiService } from '@/services/api';
import { useColorModeValue } from '@/components/ui/color-mode';

export default function TokenDebug() {
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [testResults, setTestResults] = useState<any>({});
  
  // Colores adaptativos
  const containerBg = useColorModeValue('gray.100', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const infoBg = useColorModeValue('blue.50', 'blue.900');
  const infoBorderColor = useColorModeValue('blue.500', 'blue.300');
  const infoTextColor = useColorModeValue('blue.800', 'blue.200');
  const infoTextSecondary = useColorModeValue('blue.700', 'blue.300');

  useEffect(() => {
    const token = authStorage.getToken();
    if (token) {
      const payload = tokenUtils.getTokenPayload(token);
      const isExpired = tokenUtils.isTokenExpired(token);
      setTokenInfo({
        token: token.substring(0, 20) + '...',
        payload,
        isExpired,
        fullToken: token
      });
    }
  }, []);

  const testEndpoints = async () => {
    const results: any = {};
    
    try {
      // Test público
      const publicResult = await apiService.getPublicData();
      results.public = { success: true, data: publicResult };
    } catch (error) {
      results.public = { success: false, error: (error as Error).message };
    }

    try {
      // Test protegido
      const protectedResult = await apiService.getProtectedData();
      results.protected = { success: true, data: protectedResult };
    } catch (error) {
      results.protected = { success: false, error: (error as Error).message };
    }

    try {
      // Test tasks
      const tasksResult = await apiService.request('/tasks', { method: 'GET' });
      results.tasks = { success: true, data: tasksResult };
    } catch (error) {
      results.tasks = { success: false, error: (error as Error).message };
    }

    try {
      // Test auth info
      const authInfoResult = await apiService.request('/test/auth-info', { method: 'GET' });
      results.authInfo = { success: true, data: authInfoResult };
    } catch (error) {
      results.authInfo = { success: false, error: (error as Error).message };
    }

    setTestResults(results);
  };

  const copyToken = () => {
    if (tokenInfo?.fullToken) {
      navigator.clipboard.writeText(tokenInfo.fullToken);
      alert('Token copiado al portapapeles');
    }
  };

  return (
    <div className="p-6 rounded-lg" style={{backgroundColor: containerBg}}>
      <div className="mb-6 p-4 rounded border-l-4" style={{backgroundColor: infoBg, borderColor: infoBorderColor}}>
        <h2 className="text-xl font-bold mb-2" style={{color: infoTextColor}}>🔧 Herramienta de Debug - Solo Administradores</h2>
        <p className="text-sm" style={{color: infoTextSecondary}}>
          Esta herramienta permite verificar el estado de autenticación y probar endpoints de la API.
          Solo usuarios con rol de administrador deben tener acceso a esta sección.
        </p>
      </div>
      
      {tokenInfo ? (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Token Info:</h3>
            <p className="text-sm">Token (truncado): {tokenInfo.token}</p>
            <p className="text-sm">Expirado: {tokenInfo.isExpired ? 'SÍ' : 'NO'}</p>
            <button 
              onClick={copyToken}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm mt-2"
            >
              Copiar token completo
            </button>
          </div>

          {tokenInfo.payload && (
            <div>
              <h3 className="font-semibold">Payload del Token:</h3>
            <pre className="p-2 rounded text-xs" style={{backgroundColor: cardBg}}>
                {JSON.stringify(tokenInfo.payload, null, 2)}
              </pre>
            </div>
          )}

          <div>
            <button 
              onClick={testEndpoints}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Probar Endpoints
            </button>
          </div>

          {Object.keys(testResults).length > 0 && (
            <div>
              <h3 className="font-semibold">Resultados de Tests:</h3>
              <pre className="p-2 rounded text-xs" style={{backgroundColor: cardBg}}>
                {JSON.stringify(testResults, null, 2)}
              </pre>
            </div>
          )}
        </div>
      ) : (
        <p>No hay token disponible</p>
      )}
    </div>
  );
}
