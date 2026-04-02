import { schema } from "@kbn/config-schema";
import { IRouter } from '../../../../../src/core/server';
import { IBadSmellType } from "./knowledge_base_item_info";

export function defineKnowledgeBaseRoutes(router: IRouter) {
  console.log('Registering routes...');
  router.get(
    {
      path: '/api/bsd/bsd_type_set',
      validate: false,
    },
    async (context, request, response) => {
      const esClient = (await context.core).elasticsearch.client.asCurrentUser;
    
      const result = await esClient.search({
        index: 'bs-type-set',
        _source: true,
        body: {
          query: {
            match_all: {},
          },
          size:50
        },
      });
      return response.ok({
        body: {
          BSTSet: result.hits.hits.map(hit => hit._source), 
        },
      });
    }
  );


  router.get(
    {
      path: '/api/bsd/bs-set',
      validate: false,
    },
    async (context, request, response) => {
      const esClient = (await context.core).elasticsearch.client.asCurrentUser;
    
      const result = await esClient.search({
        index: 'bs-set',
        _source: true,
        body: {
          query: {
            match_all: {},
          },
          size:100
        },
      });
      return response.ok({
        body: {
          BSSet: result.hits.hits.map(hit => hit._source), 
        },
      });
    }
  );


  router.get(
    {
      path: `/api/bsd/single_bad_smell/{name}`,
      validate: { params: schema.object({ name: schema.string() }) },
    },
    async (context, request, response) => {
      console.log("single_bad_smell ....................");
      const esClient = (await context.core).elasticsearch.client.asCurrentUser;
  
      const name:string = request.params.name;
      let lastName = name
      console.log("name:" + name);
      //to resolve the + will be automatically repalced as space
      if(name.startsWith("N 1")){
        lastName = name.replace("N 1","N+1");
      }

      console.log("name:" + lastName);

      try {
        const result = await esClient.search({
          index: 'bs-set', 
          _source: true, 
          body: {
            query: {
              match: {
                "name": lastName,
              },
            },
            size: 1, 
          },
        });

        console.log("result");
        console.log(result);
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
        return response.customError({
          body: `An error occurred while searching for bad smell: ${error.message}`,
          statusCode: 0
        });
      }

    }
  );

  router.get(
    {
      path: `/api/bsd/bs_by_type/{badSmellType}`,
      validate: { params: schema.object({ badSmellType: schema.string() }) },
    },
    async (context, request, response) => {
      const esClient = (await context.core).elasticsearch.client.asCurrentUser;
  
      const badSmellType = request.params.badSmellType;

      try {
        const result = await esClient.search({
          index: 'bs-set', 
          _source: true, 
          body: {
            query: {
              match: {
                "categoryName": badSmellType,
              },
            },
            size:100
          },
        });
        console.log("result");
        console.log(result);
        if (result.hits.total.value === 0) {
          return response.notFound({
            body: `No bad smell found with type: ${badSmellType}`,
          });
        }
  
        return response.ok({
          body: {
            BSSet: result.hits.hits.map(hit => hit._source), 
          },
        });
      } catch (error) {
        return response.customError({
          body: `An error occurred while searching for bad smell: ${error.message}`,
          statusCode: 0
        });
      }

    }
  );


  router.get(
    {
      path: `/api/bsd/bs_by_detct_way/{detectMethod}`,
      validate: { params: schema.object({ detectMethod: schema.string() }) },
    },
    async (context, request, response) => {
      const esClient = (await context.core).elasticsearch.client.asCurrentUser;
  
      const detectMethod = request.params.detectMethod;

      try {
        const result = await esClient.search({
          index: 'bs-set', 
          _source: true, 
          body: {
            query: {
              query_string: {
                default_field: "detectMethod",
                query: detectMethod
              },
            },
            size:100
          },
        });
        console.log("result");
        console.log(result);
        if (result.hits.total.value === 0) {
          return response.notFound({
            body: `No bad smell found with detect method: ${detectMethod}`,
          });
        }
  
        return response.ok({
          body: {
            BSSet: result.hits.hits.map(hit => hit._source), 
          },
        });
      } catch (error) {
        return response.customError({
          body: `An error occurred while searching for bad smell: ${error.message}`,
          statusCode: 0
        });
      }

    }
  );



  //get set if type name by category name
  router.get(
    {
      path: '/api/bsd/kbase/get_type_set',
      validate: {
        query: schema.object({
             categoryName: schema.string(), 
        }) 
      },
    },
    async (context, request, response) => {
      const esClient = (await context.core).elasticsearch.client.asCurrentUser;

      const { categoryName } = request.query;
      
      const categoryItem = await esClient.search({
        index: 'bs-type-set',
        _source: true,
        body: {
          query: {
            match: {
              "name": categoryName,
            },
          },
          size:50
        },
      });
      console.log(" api of /api/bsd/kbase/get_type_set");
      const parentData:IBadSmellType = categoryItem.hits.hits[0]._source;

      const childRecords = await esClient.search({
        index: 'bs-type-set',
        body: {
          query: {
            term: {
              parentId: parentData.orderIndex,
            }
          }
        }
      });
      const transformedData: IBadSmellType[] = childRecords.hits.hits.map(hit => hit._source);
      return response.ok({
        body: {
          items: transformedData,
        },
      });
    }
  );


  //detect with bad smell
  router.get(
    {
      path: `/api/bsd/bs_by_status/{detectable}`,
      validate: { params: schema.object({ detectable: schema.boolean() }) },
    },
    async (context, request, response) => {
      const esClient = (await context.core).elasticsearch.client.asCurrentUser;
  
      const detectable = request.params.detectable;

      try {
        const result = await esClient.search({
          index: 'bs-set', 
          _source: true, 
          body: {
            query: {
              match: {
                "detectable": detectable,
              },
            },
            size:100
          },
        });
        console.log("result");
        console.log(result);
        if (result.hits.total.value === 0) {
          return response.notFound({
            body: `No detectable bad smell found with type.`,
          });
        }
  
        return response.ok({
          body: {
            BSSet: result.hits.hits.map(hit => hit._source), 
          },
        });
      } catch (error) {
        return response.customError({
          body: `An error occurred while searching for detectable bad smell: ${error.message}`,
          statusCode: 0
        });
      }

    }
  );


}
