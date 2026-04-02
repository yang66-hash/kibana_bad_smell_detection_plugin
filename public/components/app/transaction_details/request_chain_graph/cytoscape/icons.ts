import { getAgentIcon } from '@kbn/custom-icons';
import cytoscape from 'cytoscape';
import { AGENT_NAME, SPAN_SUBTYPE, SPAN_TYPE } from '../../../../../../common/es_fields/bsd';
import { getSpanIcon } from '../../../../shared/span_icon/get_span_icon';

export function iconForNode(node: cytoscape.NodeSingular) {
  const agentName = node.data(AGENT_NAME);
  const subtype = node.data(SPAN_SUBTYPE);
  const type = node.data(SPAN_TYPE);

  return agentName ? getAgentIcon(agentName, false) : getSpanIcon(type, subtype);
}
