
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
                format: 'strict_date_optional_time'
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
              format: 'strict_date_optional_time'
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

}
