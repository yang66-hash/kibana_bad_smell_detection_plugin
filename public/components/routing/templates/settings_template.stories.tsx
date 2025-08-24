
import type { CoreStart } from '@kbn/core/public';
import type { Meta, Story } from '@storybook/react';
import { noop } from 'lodash';
import React, { ComponentProps } from 'react';
import type { BSDPluginContextValue } from '../../../context/bsd_plugin/bsd_plugin_context';
import { MockApmPluginStorybook } from '../../../context/bsd_plugin/mock_bsd_plugin_storybook';
import { mockBSDApiCallResponse } from '../../../services/rest/call_bsd_api_spy';
import { SettingsTemplate } from './settings_template';

type Args = ComponentProps<typeof SettingsTemplate>;

const coreMock = {
  observabilityShared: {
    navigation: {
      PageTemplate: () => {
        return <>hello world</>;
      },
    },
  },
  observabilityAIAssistant: {
    service: { setScreenContext: () => noop },
  },
} as unknown as Partial<CoreStart>;

const configMock = {
  featureFlags: {
    agentConfigurationAvailable: true,
    configurableIndicesAvailable: true,
  },
};

const stories: Meta<Args> = {
  title: 'routing/templates/SettingsTemplate',
  component: SettingsTemplate,
  decorators: [
    (StoryComponent) => {
      mockBSDApiCallResponse('GET /internal/apm/has_data', (params) => ({
        hasData: true,
      }));

      return (
        <MockApmPluginStorybook
          apmContext={
            {
              core: coreMock,
              config: configMock,
            } as unknown as BSDPluginContextValue
          }
        >
          <StoryComponent />
        </MockApmPluginStorybook>
      );
    },
  ],
};
export default stories;

export const Example: Story<Args> = (args) => {
  return <SettingsTemplate {...args} />;
};
Example.args = {
  children: <>test</>,
  selectedTab: 'agent-configuration',
};
