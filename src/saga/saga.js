import { debounce, put } from "redux-saga/effects";

function* sagaHandler(action) {
  if (action.type === "CREATE") {
    // console.log("create data from Saga", action);
    yield put({ type: "CREATE_SAGA", payload: action.payload });
  }
  if (action.type === "SHUFFLE_NOT_ZERO") {
    // console.log("shuffle data from Saga", action);
    yield put({ type: "SHUFFLE", payload: action.payload });
  }
}

function* rootSaga() {
  yield debounce(250, "CREATE", sagaHandler);
  yield debounce(250, "SHUFFLE_NOT_ZERO", sagaHandler);
  // yield takeLatest("CREATE", sagaHandler);
  // yield takeLatest("SHUFFLE_NOT_ZERO", sagaHandler);
}

export default rootSaga;
