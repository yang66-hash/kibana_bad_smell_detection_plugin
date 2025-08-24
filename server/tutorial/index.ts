/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { i18n } from '@kbn/i18n';
import { ArtifactsSchema, TutorialsCategory, TutorialSchema } from '@kbn/home-plugin/server';
import { CloudSetup } from '@kbn/cloud-plugin/server';
import type { APMIndices } from '@kbn/apm-data-access-plugin/server';
import { BSDConfig } from '..';
import { createElasticCloudInstructions } from './envs/elastic_cloud';
import { onPremInstructions } from './envs/on_prem';

const BSDIntro = 'Collect performance metrics from your applications with Elastic BSD.';
const moduleName = 'bsd';

// set tutorial
export const tutorialProvider =
  ({
    apmConfig,
    apmIndices,
    cloud,
    isFleetPluginEnabled,
  }: {
    apmConfig: BSDConfig;
    apmIndices: APMIndices;
    cloud?: CloudSetup;
    isFleetPluginEnabled: boolean;
  }) =>
  () => {
    const artifacts: ArtifactsSchema = {
      dashboards: [
        {
          id: '8d3ed660-7828-11e7-8c47-65b845b5cfb3',
          linkLabel: i18n.translate(
            'xpack.apm.tutorial.specProvider.artifacts.dashboards.linkLabel',
            {
              defaultMessage: 'BSD dashboard',
            }
          ),
          isOverview: true,
        },
      ],
    };

    if (apmConfig.ui.enabled) {
      // @ts-expect-error artifacts.application is readonly
      artifacts.application = {
        path: '/app/bsd',
        label: i18n.translate('xpack.apm.tutorial.specProvider.artifacts.application.label', {
          defaultMessage: 'Launch BSD',
        }),
      };
    }

    return {
      id: 'apm',
      name: i18n.translate('xpack.apm.tutorial.specProvider.name', {
        defaultMessage: 'BSD',
      }),
      moduleName,
      category: TutorialsCategory.OTHER,
      shortDescription: apmIntro,
      longDescription: i18n.translate('xpack.apm.tutorial.specProvider.longDescription', {
        defaultMessage:
          'Application Performance Monitoring (BSD) collects in-depth \
performance metrics and errors from inside your application. \
It allows you to monitor the performance of thousands of applications in real time. \
[Learn more]({learnMoreLink}).',
        values: {
          learnMoreLink:
            '{config.docs.base_url}guide/en/apm/guide/{config.docs.version}/index.html',
        },
      }),
      euiIconType: 'apmApp',
      integrationBrowserCategories: ['observability', 'apm'],
      artifacts,
      customStatusCheckName: 'apm_fleet_server_status_check',
      onPrem: onPremInstructions({ apmIndices, isFleetPluginEnabled }),
      elasticCloud: createElasticCloudInstructions({
        apmIndices,
        isFleetPluginEnabled,
        cloudSetup: cloud,
      }),
      previewImagePath: '/plugins/apm/assets/apm.png',
    } as TutorialSchema;
  };
