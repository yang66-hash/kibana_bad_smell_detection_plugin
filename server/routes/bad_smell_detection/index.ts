import { schema } from "@kbn/config-schema";
import { IRouter } from '../../../../../src/core/server';
import { IBSDetectionItem, IBSDFurtherItem, IBSDStatistics } from "./bsd_item_info";
export function defineBadSmellDetectionRoutes(router: IRouter) {
    console.log("register bad smell detection routes ...");
    router.get(
        {
          path: '/api/bsd/detect_records',
          validate: {
            query: schema.object({
                 start: schema.string(), 
                 end:  schema.string(),
            }) 
          },
        },
        async (context, request, response) => {
          const esClient = (await context.core).elasticsearch.client.asCurrentUser;

          const {start , end } = request.query;
          const rangeQuery = start && end ? {
            timestamp: {
                gte: start,
                lte: end,
                format: 'strict_date_time'
            }
          }:{};
          console.log("rangeQuery",rangeQuery);
          const result = await esClient.search({
            index: 'bsd.detection.results',
            _source: true,
            body: {
              size:0,
              query: {
                bool: {
                  filter: [
                    ...Object.keys(rangeQuery).length ? [{ range: rangeQuery }] : [],
                  ],
                },
              },
              aggs: {
                by_target_instance: {
                    terms: {
                        field: 'targetInstance',
                        size: 1000,
                    },
                    aggs: {
                      names: {
                        terms: {
                          field: "name",
                          size: 100,
                        }
                      },
                      typeNames: {
                        terms: {
                          field: "typeName",
                          size: 100,
                        }
                      },
                      categoryNames: {
                        terms: {
                          field: "categoryName",
                          size: 100,
                        }
                      },
                      bad_smell_status: {
                        max: {
                          script: {
                            source: "doc['status'].value ? 1 : 0"
                          }
                        }
                      }
                    }
                }
              }
            },
          });
          console.log(result);
          const transformedData: IBSDFurtherItem[] = [];
          const aggs = result.aggregations?.by_target_instance.buckets;
          const total = result.hits.total?.value;
          aggs.forEach((bucket: any) => {
            const targetInstance = bucket.key;
            
            const bsSet = bucket.names.buckets.map((item: any) => item.key);
            const bsCategorySet = bucket.categoryNames.buckets.map((item: any) => item.key);
            const bsTypeSet = bucket.typeNames.buckets.map((item: any) => item.key);
            const status = bucket.bad_smell_status.value===1?true:false;
            console.log(bsSet);
            console.log(bsCategorySet);
            console.log(bsTypeSet);

            const item: IBSDFurtherItem = {
              status,
              targetInstance,
              involvedBSSet:bsSet,
              involvedBSPriType:bsCategorySet,
              involvedBSSecType:bsTypeSet,
            };
          
            transformedData.push(item);
          });
          
          return response.ok({
            body: {
              total: total,
              items: transformedData,
            },
          });
        }
      );

    router.get(
      {
        path: '/api/bsd/records_statistics',
        validate: {
          query: schema.object({
               start: schema.string(), 
               end:  schema.string(),
          }) 
        },
      },
      async (context, request, response) => {
        const esClient = (await context.core).elasticsearch.client.asCurrentUser;

        const {start , end } = request.query;
        const rangeQuery = start && end ? {
          timestamp: {
              gte: start,
              lte: end,
              format: 'strict_date_time'
          }
        }:{};
        
        const result = await esClient.search({
          index: 'bsd.detection.results',
          _source: true,
          body: {
            size:0,
            query: {
              bool: {
                filter: [
                  ...Object.keys(rangeQuery).length ? [{ range: rangeQuery }] : [],
                ],
              },
            },
            aggs: {
              by_category_name: {
                terms: {
                  field: 'categoryName',
                  size: 10,
                },
              }
            }
             
          },
        });
        console.log(" api of records_statistics");
        console.log(rangeQuery);
        console.log(result);

        const transformedData: IBSDStatistics[] = [];
        const aggs = result.aggregations?.by_category_name.buckets;
        aggs.forEach((bucket: any) => {
          const categoryName = bucket.key;
          const records = bucket.doc_count;
          
          const item: IBSDStatistics = {
            categoryName:categoryName,
            count:records,
          };
        
          transformedData.push(item);
        });
        
        return response.ok({
          body: {
            items: transformedData,
          },
        });
      }
    );


    router.post(
      {
        path: '/api/bsd/get_filterd_records',
        validate: {
          body: schema.object({
                start: schema.string(), 
                end:  schema.string(),
                targetInstance: schema.string(),
                searchedPriType: schema.arrayOf(schema.string()),
          }) 
        },
      },
      async (context, request, response) => {
        const esClient = (await context.core).elasticsearch.client.asCurrentUser;

        const {start , end, targetInstance, searchedPriType } = request.body;
        const rangeQuery = start && end ? {
          timestamp: {
              gte: start,
              lte: end,
              format: 'strict_date_optional_time'
          }
        }:{};
        console.log("/api/bsd/get_filterd_records, before query");
        console.log(start);
        console.log(end);
        console.log(targetInstance);
        console.log(searchedPriType);
        const result = await esClient.search({
          index: 'bsd.detection.results',
          _source: true,
          body: {
            query: {
              bool: {
                filter: [
                  ...Object.keys(rangeQuery).length ? [{ range: rangeQuery }] : [],
                  {
                    terms: {
                      categoryName:searchedPriType,
                    },
                  },
                  {
                    term: {
                      targetInstance:targetInstance,
                    }
                  }
                ],
                
              },

              
            },
            size:1000
          },
        });
        console.log(" api of get_filterd_records");
        console.log(rangeQuery);
        console.log(result);
        const totalResults = result.hits.total.value;

        if (totalResults > 1000) {
          return response.ok({
            body: {
              maxCountExceeded: true,
              items: [],
            },
          })
        }
        const transformedData: IBSDetectionItem[] = [];
        result.hits.hits.forEach(item=>{
          let tempTranformedItem:IBSDetectionItem = {
            id: item._id,
            detectionID:item._source.detectionID,
            status: item._source.status,
            timestamp: item._source.timestamp,
            detector: item._source.detector,
            name: item._source.name,
            categoryName: item._source.categoryName,
            typeName: item._source.typeName,
            detectMethod: item._source.detectMethod,
            targetInstance: item._source.targetInstance,
            context: item._source.context
          };
          transformedData.push(tempTranformedItem);
        })
    
        
        return response.ok({
          body: {
            items: transformedData,
          },
        });
      }
    );

    // 修改现有的路由，添加版本信息
    router.get(
        {
          path: '/internal/bsd/anomalous_traces',
          validate: {
            query: schema.object({
                 start: schema.string(), 
                 end: schema.string(),
                 serviceName: schema.maybe(schema.string()),
                 size: schema.maybe(schema.number()),
            }) 
          },
          options: {
            tags: ['access:apm'],
          },
        },
        async (context, request, response) => {
          const esClient = (await context.core).elasticsearch.client.asCurrentUser;

          const { start, end, serviceName, size = 100 } = request.query;
          
          const rangeQuery = {
            range: {
              startTime: {
                gte: start,
                lte: end,
                format: 'strict_date_time'
              }
            }
          };

          const serviceFilter = serviceName ? {
            term: {
              'serviceName': serviceName
            }
          } : {};

          const query = {
            bool: {
              filter: [
                rangeQuery,
                ...(serviceName ? [serviceFilter] : [])
              ]
            }
          };

          console.log("anomalous traces query", JSON.stringify(query));

          const result = await esClient.search({
            index: 'bsd.analysis.metrics.anomalous.traces',
            _source: true,
            body: {
              size,
              query,
              sort: [
                { startTime: { order: 'desc' } }
              ]
            }
          });

          console.log("anomalous traces result", result);
          
          // 转换数据格式 - 直接使用预计算的字段
          const transformedData = result.hits.hits.map((hit: any) => {
            const source = hit._source;
            const requestChain = source.requestChain;
            
            return {
              id: hit._id,
              startTime: source.startTime,
              endTime: source.endTime,
              interval: source.interval,
              language: source.language,
              serviceName: source.serviceName,
              podName: source.podName,
              collector: source.collector,
              traceId: requestChain?.traceId,
              sourceSvc: requestChain?.sourceSvc,
              apiname: requestChain?.apiname,
              // 直接使用预计算的字段
              chainDepth: source.chainDepth || 0,
              sqlCount: source.sqlCount || 0,
              totalExecTime: source.totalExecTime || 0
            };
          });

          console.log("anomalous traces =======================");
          console.log("transformedData length:", transformedData.length);
          
          return response.ok({
            body: {
              traces: transformedData,
              total: result.hits.total?.value || 0
          },
        });
      }
    );

    // 新增：根据 traceId 获取请求链路数据
    router.get(
        {
          path: '/internal/bsd/request_chain/{traceId}',
          validate: {
            params: schema.object({
              traceId: schema.string(),
            }),
          },
          options: {
            tags: ['access:apm'],
          },
        },
        async (context, request, response) => {
          const esClient = (await context.core).elasticsearch.client.asCurrentUser;
          const { traceId } = request.params;

          console.log("Fetching request chain for traceId:", traceId);

          try {
            const result = await esClient.search({
              index: 'bsd.analysis.metrics.anomalous.traces',
              body: {
                size: 1,
                query: {
                  term: {
                    'requestChain.traceId': traceId
                  }
                }
              }
            });

            console.log("Request chain search result:", result);

            if (!result.hits.hits || result.hits.hits.length === 0) {
              console.log("No request chain found for traceId:", traceId);
              return response.ok({
                body: {
                  found: false,
                  requestChain: null,
                },
              });
            }

            const source = result.hits.hits[0]._source as any;
            const requestChain = source.requestChain;

            console.log("Found request chain:", requestChain);

            return response.ok({
              body: {
                found: true,
                requestChain: requestChain,
                metadata: {
                  startTime: source.startTime,
                  endTime: source.endTime,
                  serviceName: source.serviceName,
                  language: source.language,
                  podName: source.podName,
                  collector: source.collector,
                  chainDepth: source.chainDepth,
                  sqlCount: source.sqlCount,
                  totalExecTime: source.totalExecTime,
                },
              },
            });
          } catch (error: any) {
            console.error("Error fetching request chain:", error);
            return response.customError({
              statusCode: 500,
              body: {
                message: error.message || 'Unknown error',
              },
            });
          }
        }
    );

}
