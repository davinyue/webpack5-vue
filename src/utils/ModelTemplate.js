import sysRequest from '../app/sysRequest';
import mergeObj from '../utils/mergeObj';
import config from 'sysConfig';

class ModelTemplate {
  constructor(model, config) {
    this.model = model;
    this.config = config;
  }

  /** 生成state */
  generateState() {
    let state = {
      /** 分页数据查询条件 */
      query: {
        limit: {
          currentPage: 1,
          pageSize: 16
        }
      },
      /** 后端返回的分页数据 */
      pageData: {},
      /** 前端新增的数据,还未保存 */
      neweData: {},
      /** 单个实体详细信息 */
      detail: {},
    };
    state = Object.assign({}, state, this.model.state);
    return state;
  }

  /** 生成reducer */
  generateReducer() {
    let reducers = {
      saveState(state, action) {
        return {
          ...state,
          ...action.payload
        };
      },
    };
    reducers = Object.assign({}, reducers, this.model.reducers);
    return reducers;
  }

  /** 生成subscription */
  generateSubscription() {
    /** 以key/value 格式定义 subscription。subscription 是订阅，
     * 用于订阅一个数据源，然后根据需要 dispatch 相应的 action。
     * 在 app.start() 时被执行，数据源可以是当前的时间、
     * 服务器的 websocket 连接、keyboard 输入、geolocation 变化、
     * history 路由变化等等。*/
    let subscriptions = {
      setup({ dispatch, history }) {
        return history.listen(({ pathname, search }) => {
          //const queryParams = queryString.parse(search);
          // if (pathname.indexOf(`/${namespace}`) === 0) {
          //   dispatch({
          //     type: 'query',
          //     payload: {
          //       queryParams
          //     }
          //   });
          // }
        });
      },
    };
    subscriptions = Object.assign({}, subscriptions, this.model.subscriptions);
    return subscriptions;
  }

  /** 生成effect */
  generateEffect() {
    let model = this.model;
    let dataSource = this.model.namespace;
    /** 如果指定了数据源 */
    if (this.config.dataSource) {
      dataSource = this.config.dataSource;
    }
    let queryMethod = 'getPageInfo';
    /** 如果指定了查询列表的方法 */
    if (this.config.queryMethod) {
      queryMethod = this.config.queryMethod;
    }
    let detailMethod = 'getDetail';
    /** 如果指定了查询一个实体的方法 */
    if (this.config.detailMethod) {
      detailMethod = this.config.detailMethod;
    }
    let saveMethod = 'save';
    /** 如果指定了保存一个方法 */
    if (this.config.saveMethod) {
      saveMethod = this.config.saveMethod;
    }
    let updateMethod = 'update.do';
    /** 如果指定了更新方法 */
    if (this.config.updateMethod) {
      updateMethod = this.config.updateMethod;
    }
    let replaceMethod = 'replace';
    /** 如果指定了批量更新方法 */
    if (this.config.replaceMethod) {
      replaceMethod = this.config.replaceMethod;
    }
    let deleteMethod = 'delete';
    /** 如果指定了删除方法 */
    if (this.config.deleteMethod) {
      deleteMethod = this.config.deleteMethod;
    }
    let batchDeleteMethod = 'delete.do';
    /** 如果指定了批量删除方法 */
    if (this.config.batchDeleteMethod) {
      batchDeleteMethod = this.config.batchDeleteMethod;
    }
    let effects = {
      *query({ payload }, { call, put, select }) {
        /** 获取model的query */
        let queryParam = yield select((models) => {
          return models[model.namespace].query;
        });
        queryParam = mergeObj(queryParam, payload);
        let result = yield call(sysRequest.getRequest, `${config.serverProxy}${dataSource}/${queryMethod}`, queryParam);
        if (result.status >= 200 && result.status < 300) {
          if (result.data.status_code === '0000') {
            let pageData = {
              pagination: {
                current_page: result.data.nowPage,
                page_size: result.data.nowPageNo,
                total: result.data.dataCount
              },
              list: result.data.data
            };
            yield put({
              type: 'saveState',
              payload: {
                query: queryParam,
                pageData: pageData,
              }
            });
          }
        }
        return result;
      },
      *getDetail({ payload }, { call, put, select }) {
        let result = yield call(sysRequest.getRequest, `${config.serverProxy}${dataSource}/${detailMethod}`, payload);
        if (result.status >= 200 && result.status < 300) {
          if (result.data.errorcode === 0 && result.data.ret === 0) {
            yield put({
              type: 'saveState',
              payload: {
                detail: result.data.data,
              }
            });
          }
        }
        return result;
      },
      *delete({ payload }, { call, put, select }) {
        let result = yield call(sysRequest.deleteRequest, `${config.serverProxy}${dataSource}/${deleteMethod}`, payload);
        return result;
      },
      *batchDelete({ payload }, { call, put, select }) {
        let result = yield call(sysRequest.deleteRequest, `${config.serverProxy}${dataSource}/${batchDeleteMethod}`, payload);
        return result;
      },
      *save({ payload }, { call, put, select }) {
        let result = yield call(sysRequest.postRequest, `${config.serverProxy}${dataSource}/${saveMethod}`, payload);
        return result;
      },
      *update({ payload }, { call, put, select }) {
        let result = yield call(sysRequest.putRequest, `${config.serverProxy}${dataSource}/${updateMethod}`, payload);
        return result;
      },
      *replace({ payload }, { call, put, select }) {
        let result = yield call(sysRequest.putRequest, `${config.serverProxy}${dataSource}/${replaceMethod}`, payload);
        return result;
      }
    };
    effects = Object.assign({}, effects, this.model.effects);
    return effects;
  }

  createModel() {
    let newmodel = {};
    /** 设置模型名称 */
    newmodel.namespace = this.model.namespace;
    /** 设置state参数 */
    newmodel.state = this.generateState();
    //2 设置消息处理参数
    newmodel.effects = this.generateEffect();
    newmodel.reducers = this.generateReducer();
    newmodel.subscriptions = this.generateSubscription();
    return newmodel;
  }
}
export default ModelTemplate;