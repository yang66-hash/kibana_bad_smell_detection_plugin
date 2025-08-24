import { EuiButton, EuiDescribedFormGroup, EuiFieldText, EuiFlexGroup, EuiFlexItem, EuiForm, EuiFormRow, EuiPanel, EuiText, EuiToast } from "@elastic/eui";
import { DETECTION_COMPONENT_DEFAULT_ENDPOINT, DETECTION_URL_KEY } from "../../../../common/constants";
import React, { useState } from "react";
import { useBSDPluginContext } from "../../../context/bsd_plugin/use_bsd_plugin_context";
import { setTimeout } from "timers";



interface ConnectionStatus{
    success:boolean;
    message:string;
}

const testConnection = async (URLValue:string, setConnectionStatus, setLoading, navigateToApp) =>{
    try {
        setLoading(true);
        const response = await fetch(`${URLValue}/health`);

        if (response.ok) {

            const data = await response.json();
            setConnectionStatus({ success: true, message: data.data });
            localStorage.setItem(DETECTION_URL_KEY, URLValue);
            setTimeout(()=>{
                navigateToApp('bsd',{path:'/detect'});
            },1500);
            

        } else {
            setConnectionStatus({ success: false, message: "connection failed!" });
        }
    } catch (error) {
        setConnectionStatus({ success: false, message: "connection error!" });
    }finally{
        setLoading(false);
    }
    
}

export function DetectionComConfigView(){

    const {
        core: {
          application: { navigateToApp },
        },
      } = useBSDPluginContext();

    const [URLValue, setURLValue] = useState(DETECTION_COMPONENT_DEFAULT_ENDPOINT);
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus|null>(null);
    const [isLoading, setLoading] = useState(false);
    return (
        <>
        <EuiPanel>
        <EuiFlexGroup direction="column">
            <EuiFlexItem grow={false}>
            <EuiForm component="form">
                <EuiDescribedFormGroup
                title={<h3>Description</h3>}
                description={
                    <p>
                    URL defines the reachable URL of detection component.
                    </p>
                }
                >
                <EuiFormRow label="URL">
                    <EuiFieldText
                     defaultValue={DETECTION_COMPONENT_DEFAULT_ENDPOINT}
                     value={URLValue} 
                     onChange={(e) => setURLValue(e.target.value)}
                    />
                </EuiFormRow>
                </EuiDescribedFormGroup>
            </EuiForm>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
            <EuiButton
                color="primary"
                isDisabled={false}
                onClick={() => testConnection(URLValue, setConnectionStatus, setLoading,navigateToApp)}
                style={{ alignSelf: 'flex-start' }} 
                isLoading={isLoading}
            >
                Test connection
            </EuiButton>
            {connectionStatus && connectionStatus.success && (
                                <EuiText color="success" size="s">
                                    {connectionStatus.message}
                                </EuiText>
            )}
            {connectionStatus && !connectionStatus.success && (
                                <EuiText color="danger" size="s">
                                    {connectionStatus.message}
                                </EuiText>
            )}
            </EuiFlexItem>
        </EuiFlexGroup>
        </EuiPanel>
        </>
    )

}