import { useKibana } from "@kbn/kibana-react-plugin/public";
import { IBadSmellType } from "../../common/interfaces/interfaces";
import { useEffect, useState } from "react";
import { BSDPluginStartDeps } from "../plugin";
import { BS_DATA_FETCH_STATUS } from "./use_bad_smell_fetcher";

  export function useBSSetTypeDataFetcher(){
    const { services } = useKibana<BSDPluginStartDeps>();
    const { http } = services;

    const [BSTypeSet, setBSTypeSet] = useState<IBadSmellType[]>([]);
    const [loading, setLoading] = useState<BS_DATA_FETCH_STATUS>(BS_DATA_FETCH_STATUS.LOADING);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        
        const getBSTypeData = async () => {
            try {
                console.log('Fetching BSDTypeSet data...');
                const response = await http?.get('/api/bsd/bsd_type_set');
                console.log('Fetched BSDTypeSet:', response);
                setBSTypeSet(response.BSTSet || []);
                setLoading(BS_DATA_FETCH_STATUS.SUCCESS);
            } catch (e: any) {
                const errorMsg = e.response?.status
                    ? `${e.response.status} ${e.message}`
                    : e.message || 'Unknown error';
                setError(errorMsg);
                setLoading(BS_DATA_FETCH_STATUS.FAILURE);
            }
        }
        getBSTypeData();
    }, []);

    return { BSTypeSet, loading, error };
}
