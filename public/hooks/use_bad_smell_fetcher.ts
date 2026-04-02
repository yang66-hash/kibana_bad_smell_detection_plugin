import { useState, useEffect } from 'react';
import { BSDPluginStartDeps } from '../plugin';
import { useKibana } from '@kbn/kibana-react-plugin/public';
import { IBadSmell } from '../../common/interfaces/interfaces';
export enum BS_DATA_FETCH_STATUS {
    LOADING = 'loading',
    SUCCESS = 'success',
    FAILURE = 'failure',
}
export function useBSSetDataFetcher(){
    const { services } = useKibana<BSDPluginStartDeps>();
    const { http } = services;

    const [BSSet, setBSSet] = useState<IBadSmell[]>([]);
    const [loading, setLoading] = useState<BS_DATA_FETCH_STATUS>(BS_DATA_FETCH_STATUS.LOADING);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const getBSSetData = async () => {
            try {
                console.log('Fetching BSSet data...');
                const response = await http?.get('/api/bsd/bs-set');
                console.log('Fetched BSSet:', response);
                console.log('BSSet length in response:', response.BSSet.length);
                setBSSet(response.BSSet);
                setLoading(BS_DATA_FETCH_STATUS.SUCCESS);
            } catch (e: any) {
                const errorMsg = e.response?.status
                ? `${e.response.status} ${e.message}`
                : e.message || 'Unknown error';
                console.error('Error fetching BSSet:', errorMsg);
                setError(errorMsg);
                setLoading(BS_DATA_FETCH_STATUS.FAILURE);
            }
        };

        getBSSetData();
    }, []);

    return { BSSet, loading, error };
}
