// public/components/CPUUsageChart.tsx
import React, { useEffect, useMemo } from 'react';
import {EmbeddablePanel} from '@kbn/embeddable-plugin/public';
// import { LENS_EMBEDDABLE_TYPE } from '@kbn/lens-plugin/common/constants';
import { LensByValueInput } from '@kbn/lens-plugin/public/embeddable';
import { useKibana } from '@kbn/kibana-react-plugin/public';
import { BSDPluginStartDeps } from '../../../../public/plugin';
import { v4 as uuidv4 } from 'uuid';
import { LegacyCompatibleEmbeddable } from '@kbn/embeddable-plugin/public/embeddable_panel/types';
import { DashboardGridItem } from '@kbn/dashboard-plugin/public/dashboard_container/component/grid/dashboard_grid_item';
import { DashboardContainerContext } from '@kbn/dashboard-plugin/public/dashboard_container/embeddable/dashboard_container';
import { DashboardGrid } from '@kbn/dashboard-plugin/public/dashboard_container/component/grid';

import { EuiButton, EuiDatePicker, EuiDatePickerRange, EuiSpacer } from "@elastic/eui";
import { useState } from "react";
import moment from 'moment';
import { getEmbeddableComponent, TypedLensByValueInput } from '@kbn/lens-plugin/public/embeddable/embeddable_component';
import { CoreStart } from '@kbn/core/public';
import { useTimeRangeUpdates } from '@kbn/ml-date-picker';
import { css } from '@emotion/react';

// interface Props {
//   timeRange?: { from: string; to: string };
// }

// export const StastisticPanel: React.FC<Props> = ({
//   timeRange = { from: 'now-15m', to: 'now' },
// }) => {
//   const {
//     services: { embeddable },
//   } = useKibana<BSDPluginStartDeps>();

//   const [embeddableInstance, setEmbeddableInstance] = useState<any>(null);

//   const dataViewId = 'metrics-*';

//   const lensInput = useMemo<LensByValueInput>(() => ({
//     id: 'cpu-usage-chart',
//     timeRange,
//     attributes: {
//       title: 'JVM GC COUNT',
//       visualizationType: 'lnsXY',
//       type: 'lens',
//       references: [
//         {
//           type: 'index-pattern',
//           id: dataViewId,
//           name: 'indexpattern-datasource-layer-fc65fab9-4db2-4def-9035-b30c77313f8d',
//         },
//       ],
//       state: {
//         datasourceStates: {
//           formBased: {
//             layers: {
//               'fc65fab9-4db2-4def-9035-b30c77313f8d': {
//                 columns: {
//                   'timestamp-column': {
//                     label: '@timestamp',
//                     dataType: 'date',
//                     operationType: 'date_histogram',
//                     sourceField: '@timestamp',
//                     isBucketed: true,
//                     scale: 'interval',
//                     params: {
//                       interval: 'auto',
//                       includeEmptyRows: false,
//                       dropPartials: false,
//                       format: {
//                         id: 'date',
//                       },
//                     },
//                     references: [],
//                   },
//                   'gc-count-column': {
//                     label: 'Max jvm.gc.count',
//                     dataType: 'number',
//                     operationType: 'max',
//                     sourceField: 'jvm.gc.count',
//                     isBucketed: false,
//                     scale: 'ratio',
//                     params: {},
//                     references: [],
//                   },
//                 },
//                 columnOrder: ['timestamp-column', 'gc-count-column'],
//                 incompleteColumns: {},
//                 sampling: 1,
//               },
//             },
//           },
//         },
//         visualization: {
//           legend: { isVisible: true, position: 'right' },
//           valueLabels: 'hide',
//           fittingFunction: 'None',
//           axisTitlesVisibilitySettings: { x: true, yLeft: true, yRight: true },
//           tickLabelsVisibilitySettings: { x: true, yLeft: true, yRight: true },
//           labelsOrientation: { x: 0, yLeft: 0, yRight: 0 },
//           gridlinesVisibilitySettings: { x: true, yLeft: true, yRight: true },
//           preferredSeriesType: 'bar_stacked',
//           missingValues: 'zero',
//           layers: [
//             {
//               layerId: 'fc65fab9-4db2-4def-9035-b30c77313f8d',
//               accessors: ['gc-count-column'],
//               xAccessor: 'timestamp-column',
//               position: 'top',
//               seriesType: 'bar_stacked',
//               showGridlines: false,
//               layerType: 'data',
//               colorMapping: {
//                 assignments: [],
//                 specialAssignments: [
//                   {
//                     rule: { type: 'other' },
//                     color: { type: 'loop' },
//                     touched: false,
//                   },
//                 ],
//                 paletteId: 'eui_amsterdam_color_blind',
//                 colorMode: { type: 'categorical' },
//               },
//             },
//           ],
//         },
//         query: { query: '', language: 'kuery' },
//         filters: [
//           {
//             meta: {},
//             query: {
//               exists: {
//                 field: 'jvm.gc.count',
//               },
//             },
//           },
//         ],
//         internalReferences: [],
//         adHocDataViews: {},
//       },
//     },
//   }), [timeRange, dataViewId]);

//   useEffect(() => {
//     const createEmbeddable = async () => {
//       const factory = embeddable.getEmbeddableFactory('lens');
//       if (!factory) return;
//       const instance = await factory.create(lensInput);
//       if (instance && !('error' in instance)) {
//         setEmbeddableInstance(instance);
//       }
//     };
//     createEmbeddable();
//   }, [embeddable, lensInput]);

//   return embeddableInstance ? (
//   <div style={{ height: 400 }}>
//     <EmbeddablePanel embeddable={embeddableInstance} index={0} />
//   </div>
//   ) : (
//     <div>Loading chart...</div>
//   );
// };

export const StastisticPanel = () => {

  const timeRange = { from: 'now-15M', to: 'now' };
  const dataViewId = 'metrics-*';

  const {
    services :{
      lens: {EmbeddableComponent}
      }
    } = useKibana<BSDPluginStartDeps>();
  const attributes = useMemo<TypedLensByValueInput['attributes']>(() => {
    return {
      title: 'JVM GC COUNT',
      visualizationType: 'lnsXY',
      type: 'lens',
      references: [
        {
          type: 'index-pattern',
          id: dataViewId,
          name: 'indexpattern-datasource-layer-fc65fab9-4db2-4def-9035-b30c77313f8d',
        },
      ],
      state: {
        datasourceStates: {
          formBased: {
            layers: {
              'fc65fab9-4db2-4def-9035-b30c77313f8d': {
                columns: {
                  'timestamp-column': {
                    label: '@timestamp',
                    dataType: 'date',
                    operationType: 'date_histogram',
                    sourceField: '@timestamp',
                    isBucketed: true,
                    scale: 'interval',
                    params: {
                      interval: 'auto',
                      includeEmptyRows: false,
                      dropPartials: false,
                      format: {
                        id: 'date',
                      },
                    },
                    references: [],
                  },
                  'gc-count-column': {
                    label: 'Max jvm.gc.count',
                    dataType: 'number',
                    operationType: 'max',
                    sourceField: 'jvm.gc.count',
                    isBucketed: false,
                    scale: 'ratio',
                    params: {},
                    references: [],
                  },
                },
                columnOrder: ['timestamp-column', 'gc-count-column'],
                incompleteColumns: {},
                sampling: 1,
              },
            },
          },
        },
        visualization: {
          legend: { isVisible: true, position: 'right' },
          valueLabels: 'hide',
          fittingFunction: 'None',
          axisTitlesVisibilitySettings: { x: true, yLeft: true, yRight: true },
          tickLabelsVisibilitySettings: { x: true, yLeft: true, yRight: true },
          labelsOrientation: { x: 0, yLeft: 0, yRight: 0 },
          gridlinesVisibilitySettings: { x: true, yLeft: true, yRight: true },
          preferredSeriesType: 'bar_stacked',
          missingValues: 'zero',
          layers: [
            {
              layerId: 'fc65fab9-4db2-4def-9035-b30c77313f8d',
              accessors: ['gc-count-column'],
              xAccessor: 'timestamp-column',
              position: 'top',
              seriesType: 'bar_stacked',
              showGridlines: false,
              layerType: 'data',
              colorMapping: {
                assignments: [],
                specialAssignments: [
                  {
                    rule: { type: 'other' },
                    color: { type: 'loop' },
                    touched: false,
                  },
                ],
                paletteId: 'eui_amsterdam_color_blind',
                colorMode: { type: 'categorical' },
              },
            },
          ],
        },
        query: { query: '', language: 'kuery' },
        filters: [
          {
            meta: {},
            query: {
              exists: {
                field: 'jvm.gc.count',
              },
            },
          },
        ],
        internalReferences: [],
        adHocDataViews: {},
      },
    } as TypedLensByValueInput['attributes'];;
  }, [timeRange, dataViewId]);

  return (
    <div style={{ height: 400 }}>
      <EmbeddableComponent
        id="gcCountChart"
        style={{ height: 400 }}
        timeRange={timeRange}
        attributes={attributes}
        renderMode={'edit'}
        executionContext={{
          type: 'jvm_gc_count_chart',
          name: 'jvm chart',
        }}
        disableTriggers
      />
    </div>
  );
};