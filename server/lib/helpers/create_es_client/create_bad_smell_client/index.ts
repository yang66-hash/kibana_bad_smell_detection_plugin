import { ElasticsearchClient, KibanaRequest, KibanaResponseFactory } from "@kbn/core/server";
import { ESSearchRequest } from "@kbn/es-types";
import { callAsyncWithDebug, getDebugBody, getDebugTitle } from "../call_async_with_debug";
import { getRequestBase } from "../create_apm_event_client/get_request_base";


export interface BadSmellSetClientConfig {
  esClient: ElasticsearchClient;
  index: string;
}

export class BadSmellClient {
  private readonly esClient: ElasticsearchClient;
  private readonly index: string;

  constructor(config: BadSmellSetClientConfig) {
    this.esClient = config.esClient;
    this.index = config.index;
  }

  public async search(query:Record<string,any>, size: number=10):Promise<KibanaResponseFactory> {

    try {
            const searchParams = {
            index: this.index,
            body: {
                query, 
                size,  
            },
            };
            const result = await this.esClient.search(searchParams);

            if (result.hits.total.value === 0) {
                return response.notFound({
                  body: `No bad smell found with name: ${name}`,
                });
              }
        
              return response.ok({
                body: {
                  badSmell: result.hits.hits[0]._source, 
                },
              });

        } catch (error) {
            
            console.error('Error executing search query:', error);
            throw new Error('Failed to execute search query');
        }
  }
}
