import { get, post } from './base'
// Collection
import type { Collection, CustomCollectionBackend, CustomParamSchema, Tool, ToolCredential } from '@/app/components/tools/types'
import type { ToolWithProvider } from '@/app/components/workflow/types'

export const fetchCollectionList = () => {
  return get<Collection[]>('/workspaces/current/tool-providers')
  // return [
  //   {
  //     id: 'bing',
  //     author: 'HomeGPT',
  //     name: 'bing',
  //     description: {
  //       zh_Hans: 'Bing \u641C\u7D22',
  //       en_US: 'Bing Search',
  //       pt_BR: 'Bing Search',
  //     },
  //     icon: '/console/api/workspaces/current/tool-provider/builtin/bing/icon',
  //     label: {
  //       zh_Hans: 'Bing',
  //       en_US: 'Bing',
  //       pt_BR: 'Bing',
  //     },
  //     type: 'builtin',
  //     team_credentials: {
  //       subscription_key: '',
  //       server_url: '',
  //       allow_entities: '',
  //       allow_web_pages: '',
  //       allow_computation: '',
  //       allow_news: '',
  //       allow_related_searches: '',
  //     },
  //     is_team_authorization: true,
  //     allow_delete: true,
  //     tools: [],
  //   }, {
  //     id: 'maths',
  //     author: 'HomeGPT',
  //     name: 'maths',
  //     description: {
  //       zh_Hans: '\u4E00\u4E2A\u7528\u4E8E\u6570\u5B66\u8BA1\u7B97\u7684\u5DE5\u5177\u3002',
  //       en_US: 'A tool for maths.',
  //       pt_BR: 'A tool for maths.',
  //     },
  //     icon: '/console/api/workspaces/current/tool-provider/builtin/maths/icon',
  //     label: {
  //       zh_Hans: '\u6570\u5B66\u5DE5\u5177',
  //       en_US: 'Maths',
  //       pt_BR: 'Maths',
  //     },
  //     type: 'builtin',
  //     team_credentials: {},
  //     is_team_authorization: true,
  //     allow_delete: false,
  //     tools: [],
  //   },
  //   {
  //     id: 'chart',
  //     author: 'HomeGPT',
  //     name: 'chart',
  //     description: {
  //       zh_Hans: '\u56FE\u8868\u751F\u6210\u662F\u4E00\u4E2A\u7528\u4E8E\u751F\u6210\u53EF\u89C6\u5316\u56FE\u8868\u7684\u5DE5\u5177\uFF0C\u4F60\u53EF\u4EE5\u901A\u8FC7\u5B83\u6765\u751F\u6210\u67F1\u72B6\u56FE\u3001\u6298\u7EBF\u56FE\u3001\u997C\u56FE\u7B49\u5404\u7C7B\u56FE\u8868',
  //       en_US: 'Chart Generator is a tool for generating statistical charts like bar chart, line chart, pie chart, etc.',
  //       pt_BR: 'Chart Generator is a tool for generating statistical charts like bar chart, line chart, pie chart, etc.',
  //     },
  //     icon: '/console/api/workspaces/current/tool-provider/builtin/chart/icon',
  //     label: {
  //       zh_Hans: '\u56FE\u8868\u751F\u6210',
  //       en_US: 'ChartGenerator',
  //       pt_BR: 'ChartGenerator',
  //     },
  //     type: 'builtin',
  //     team_credentials: {},
  //     is_team_authorization: true,
  //     allow_delete: false,
  //     tools: [],
  //   },
  //   {
  //     id: 'time',
  //     author: 'HomeGPT',
  //     name: 'time',
  //     description: {
  //       zh_Hans: '\u4E00\u4E2A\u7528\u4E8E\u83B7\u53D6\u5F53\u524D\u65F6\u95F4\u7684\u5DE5\u5177\u3002',
  //       en_US: 'A tool for getting the current time.',
  //       pt_BR: 'A tool for getting the current time.',
  //     },
  //     icon: '/console/api/workspaces/current/tool-provider/builtin/time/icon',
  //     label: {
  //       zh_Hans: '\u65F6\u95F4',
  //       en_US: 'CurrentTime',
  //       pt_BR: 'CurrentTime',
  //     },
  //     type: 'builtin',
  //     team_credentials: {},
  //     is_team_authorization: true,
  //     allow_delete: false,
  //     tools: [],
  //   },
  //   {
  //     id: 'spark',
  //     author: 'HomeGPT',
  //     name: 'spark',
  //     description: {
  //       zh_Hans: '\u8BAF\u98DE\u661F\u706B\u5E73\u53F0\u5DE5\u5177',
  //       en_US: 'Spark Platform Toolkit',
  //       pt_BR: 'Spark Platform Toolkit',
  //     },
  //     icon: '/console/api/workspaces/current/tool-provider/builtin/spark/icon',
  //     label: {
  //       zh_Hans: '\u8BAF\u98DE\u661F\u706B',
  //       en_US: 'Spark',
  //       pt_BR: 'Spark',
  //     },
  //     type: 'builtin',
  //     team_credentials: {
  //       APPID: '',
  //       APISecret: '',
  //       APIKey: '',
  //     },
  //     is_team_authorization: false,
  //     allow_delete: true,
  //     tools: [],
  //   },
  // ]
}

export const fetchBuiltInToolList = (collectionName: string) => {
  return get<Tool[]>(`/workspaces/current/tool-provider/builtin/${collectionName}/tools`)
}

export const fetchCustomToolList = (collectionName: string) => {
  return get<Tool[]>(`/workspaces/current/tool-provider/api/tools?provider=${collectionName}`)
}

export const fetchModelToolList = (collectionName: string) => {
  return get<Tool[]>(`/workspaces/current/tool-provider/model/tools?provider=${collectionName}`)
}

export const fetchBuiltInToolCredentialSchema = (collectionName: string) => {
  return get<ToolCredential[]>(`/workspaces/current/tool-provider/builtin/${collectionName}/credentials_schema`)
}

export const fetchBuiltInToolCredential = (collectionName: string) => {
  return get<ToolCredential[]>(`/workspaces/current/tool-provider/builtin/${collectionName}/credentials`)
}
export const updateBuiltInToolCredential = (collectionName: string, credential: Record<string, any>) => {
  return post(`/workspaces/current/tool-provider/builtin/${collectionName}/update`, {
    body: {
      credentials: credential,
    },
  })
}

export const removeBuiltInToolCredential = (collectionName: string) => {
  return post(`/workspaces/current/tool-provider/builtin/${collectionName}/delete`, {
    body: {},
  })
}

export const parseParamsSchema = (schema: string) => {
  return post<{ parameters_schema: CustomParamSchema[]; schema_type: string }>('/workspaces/current/tool-provider/api/schema', {
    body: {
      schema,
    },
  })
}

export const fetchCustomCollection = (collectionName: string) => {
  return get<CustomCollectionBackend>(`/workspaces/current/tool-provider/api/get?provider=${collectionName}`)
}

export const createCustomCollection = (collection: CustomCollectionBackend) => {
  return post('/workspaces/current/tool-provider/api/add', {
    body: {
      ...collection,
    },
  })
}

export const updateCustomCollection = (collection: CustomCollectionBackend) => {
  return post('/workspaces/current/tool-provider/api/update', {
    body: {
      ...collection,
    },
  })
}

export const removeCustomCollection = (collectionName: string) => {
  return post('/workspaces/current/tool-provider/api/delete', {
    body: {
      provider: collectionName,
    },
  })
}

export const importSchemaFromURL = (url: string) => {
  return get('/workspaces/current/tool-provider/api/remote', {
    params: {
      url,
    },
  })
}

export const testAPIAvailable = (payload: any) => {
  return post('/workspaces/current/tool-provider/api/test/pre', {
    body: {
      ...payload,
    },
  })
}

export const fetchAllBuiltInTools = () => {
  return get<ToolWithProvider[]>('/workspaces/current/tools/builtin')
}

export const fetchAllCustomTools = () => {
  return get<ToolWithProvider[]>('/workspaces/current/tools/api')
}
