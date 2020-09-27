import {getJwtToken} from "../util/auth-util";

const {UserListRequest} = require('../proto/vmr/user_pb');
const {UserServiceClient} = require('../proto/vmr/user_grpc_web_pb');

let ENVOY_ROOT = process.env.REACT_APP_ENVOY_ROOT;

const userClient = new UserServiceClient(ENVOY_ROOT, null, null);

export function queryUser(queryString) {
  return new Promise(resolve => {
    // Create request object
    let userListRq = new UserListRequest();
    userListRq.setQueryString(queryString);

    // Call grpc service
    userClient.queryUser(userListRq, {'x-jwt-token': getJwtToken()}, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        resolve(res.getUserList());
      }
    });
  });
}