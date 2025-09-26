import { i18n } from "@kbn/i18n";


export const BAD_SMELL_APP_ID = 'badSmellDetection';
export const BAD_SMELL_DETECTION_OVERVIEW_ID = 'overview'
export const BAD_SMELL_DETECTION_BASE_ID = 'base'


export const BAD_SMELL_DETECTION_NAME = i18n.translate('plugins.badSmellDetection.productName', {
  defaultMessage: 'bad smell detection',
});

export const BAD_SMELL_DETECTION_OVERVIEW_NAME = 'overview';


export const BAD_SMELL_DETECTION_BASE_NAME = i18n.translate('plugins.badSmellDetection.base.productName', {
    defaultMessage: 'bad smell base',
  });

export const BAD_SMELL_PLUGIN = {
    ID: BAD_SMELL_APP_ID,
    NAME: BAD_SMELL_DETECTION_NAME,
    NAV_TITLE: i18n.translate('plugins.badSmellDetection.base.navTitle', {
      defaultMessage: 'Bad Smell Detection',
    }),
    DESCRIPTION: i18n.translate('plugins.badSmellDetection.base.description', {
      defaultMessage:
        'This plugin is used to detect bad smells of microservice systems.'
    }),
    URL: '/app/bad_smell_detection',
    LOGO: 'logoCloud',
};
  

export const BAD_SMELL_DETECTION_OVERVIEW = {
  ID: BAD_SMELL_DETECTION_OVERVIEW_ID,
  NAME: BAD_SMELL_DETECTION_OVERVIEW_NAME,
  NAV_TITLE: 'Overview',
  DESCRIPTION: 'This part is introduction to bad smell detection and out team.',
  URL: '/app/bsd/overview',
  LOGO: 'logoCloud',
};

export const BAD_SMELL_DETECTION_BASE = {
  ID: BAD_SMELL_DETECTION_BASE_ID,
  NAME: BAD_SMELL_DETECTION_BASE_NAME,
  NAV_TITLE: i18n.translate('plugins.badSmellDetection.base.navTitle', {
    defaultMessage: 'Knowledge base',
  }),
  DESCRIPTION: i18n.translate('plugins.badSmellDetection.base.description', {
    defaultMessage: 'This part introduce the bad smells and list all bad smells we summarized.',
  }),
  URL: '/app/bad_smell_detection/base',
  LOGO: 'logoSecurity',
};


//monitor


export const BAD_SMELL_DETECTION_MONITOR_SERVICE = {
  ID: "monitor-service",
  NAME: "service monitoring",
  NAV_TITLE: "Monitor - Service",
  DESCRIPTION: 'This part use to monitor service based on Spring Cloud.',
  URL: '/app/bad_smell_detection/monitor/servicemonitoring',
  LOGO: 'logoSecurity',
};


export const BAD_SMELL_DETECTION_MONITOR_TRACE = {
  ID: "monitor-traces",
  NAME: "traces monitoring",
  NAV_TITLE: "Monitor - Traces",
  DESCRIPTION: 'This part use to monitor traces of microservices based on Spring Cloud.',
  URL: '/app/bad_smell_detection/monitor/tracesmonitoring',
  LOGO: 'logoSecurity',
};
export const BAD_SMELL_DETECTION_MONITOR_SYSTEM = {
  ID: "monitor-system",
  NAME: "system monitoring",
  NAV_TITLE: "Monitor - System",
  DESCRIPTION: 'This part use to monitor infrastructures of microservices running on.',
  URL: '/app/bad_smell_detection/monitor/systemmonitoring',
  LOGO: 'logoSecurity',
};



export const BSD_PRODUCT_NAME = i18n.translate('plugins.badSmellDetection.productName', {
  defaultMessage: 'Bad Smell Detection',
});

export const JSON_HEADER = {
  'Content-Type': 'application/json', // This needs specific casing or Chrome throws a 415 error
  Accept: 'application/json', // Required for Enterprise Search APIs
};

export const ERROR_CONNECTING_HEADER = 'x-ent-search-error-connecting';
export const READ_ONLY_MODE_HEADER = 'x-ent-search-read-only-mode';



// use in bad smell knowledge base

export const DETECTION_SUPPORT_LABEL = i18n.translate('plugis.badSmellDetection.supportLabel', {
  defaultMessage: 'Support',
});
export const DETECTION_BETA_LABEL = i18n.translate('plugis.badSmellDetection.betaLabel', {
  defaultMessage: 'Beta',
});

export const DETECTION_INTRO_LABEL = i18n.translate('plugis.badSmellDetection.introLabel', {
  defaultMessage: 'Introduction Only',
});

//bad smell detection

export const INITIAL_BS_PAGE_SIZE = 10;

export const DETECTION_URL_KEY = "DetectionURL";

export const DETECTION_COMPONENT_DEFAULT_ENDPOINT = "http://localhost:32000";


export enum BAD_SMELL_CATEGORY {
  BS1="Communication & Interaction",
  BS2="Decomposition",
  BS3="Dynamic",
  BS4="Internal Design",
  BS5="Lifecycle Management",
  BS6="Security",
  BS7="Structure & Infrastructure",
  BS8="Team & Technology",
};

export enum BAD_SMELL_DETECTION_PEFIX {
  "Communication & Interaction"="com-inter",
  "Decomposition"="decomposition",
  "Dynamic"="dynamic",
  "Internal Design"="internal-design",
  "Lifecycle Management"="lifecycle-management",
  "Security"="security",
  "Structure & Infrastructure"="struct-infra",
  "Team & Technology"="team-technology",
};

export function getBadSmellPrefixByName(prefix: string): string | undefined {
  const badSmellPrefix = BAD_SMELL_DETECTION_PEFIX[prefix as keyof typeof BAD_SMELL_DETECTION_PEFIX];
  return badSmellPrefix;
}