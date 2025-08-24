import styled from '@emotion/styled';
import { EuiFlexGroup, EuiFlexItem, EuiStat, EuiText } from '@elastic/eui';
import React from 'react';
import { euiThemeVars } from '@kbn/ui-theme';



const Stat = styled(EuiStat)`
  .euiText {
    line-height: 1;
  }
`;


export function DetectStats({
    RunningServiceTitle,
    ServiceTitle,
    ServiceNum,
    ServiceDNum,
    RunningServiceNum,
    BSTitle,
    BSNum,
    BSDNum,
}:{
    RunningServiceTitle?:string;
    ServiceTitle?:string;
    ServiceNum?:number;
    ServiceDNum?:number;
    RunningServiceNum?:number;
    BSTitle?:string;
    BSNum?:number;
    BSDNum?:number;
}){    
    return (
    <>
    <EuiFlexGroup gutterSize='m' alignItems='center' justifyContent='flexEnd'>

    <EuiFlexItem grow={false}>
            {RunningServiceNum !== undefined && (
            <EuiFlexGroup gutterSize='m' alignItems='center'>
                <EuiText textAlign='center' style={{fontWeight:'bold'}}>
                    {RunningServiceTitle}
                </EuiText>
                <Stat
                    title={RunningServiceNum}
                    description= {<EuiText>Total</EuiText>}
                    color="primary"
                    titleSize="s"
                />
            </EuiFlexGroup>
        )}
        </EuiFlexItem>


        <EuiFlexItem grow={false}>
            {ServiceNum !== undefined && ServiceDNum !== undefined && (
            <EuiFlexGroup gutterSize='m' alignItems='center'>
                <EuiText textAlign='center' style={{fontWeight:'bold'}}>
                    {ServiceTitle}
                </EuiText>
                <Stat
                    title={ServiceNum}
                    description= {<EuiText>Total</EuiText>}
                    color="primary"
                    titleSize="s"
                />
                <Stat
                    title={ServiceDNum}
                    description= 'Detectable'
                    color="primary"
                    titleSize="s"
                />

            </EuiFlexGroup>
        )}
        </EuiFlexItem>

        <EuiFlexItem grow={false}>
            {BSNum !== undefined && BSDNum !== undefined && (
                <EuiFlexGroup gutterSize='m' alignItems='center'>
                <EuiText textAlign='center' style={{fontWeight:'bold'}}>
                    {BSTitle}
                </EuiText>
                <Stat
                    title={BSNum}
                    description= {<EuiText>Total</EuiText>}
                    color="primary"
                    titleSize="s"
                />
                <Stat
                    title={BSDNum}
                    description= 'Detectable'
                    color="primary"
                    titleSize="s"
                />
            </EuiFlexGroup>

            )}
        </EuiFlexItem>

    </EuiFlexGroup>
      
    </>
        
    );
}