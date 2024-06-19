import { createStore, combineReducers, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import rootSaga from "../saga/saga";

const sagaMiddleware = createSagaMiddleware();

//-------------reducer cho pokemon Array ---------------
// lấy data từ LocalStorage:
const pokeArrayDefault = localStorage.getItem("pokeArray")
  ? JSON.parse(localStorage.getItem("pokeArray"))
  : [];

const initStateArray = {
  pokeArray: pokeArrayDefault,
};
//Ham xao tron 1 Array
function shuffle(array) {
  let currentIndex = array.length;
  while (currentIndex !== 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

const reducerPokeArray = (state = initStateArray, action) => {
  switch (action.type) {
    case "CREATE_SAGA":
      // save Localstorage
      localStorage.setItem("pokeArray", JSON.stringify(action.payload));
      return { pokeArray: action.payload };
    case "SHUFFLE_ALL":
      const rootArr = [...state.pokeArray];

      //lay arr 6x6 ben trong
      const insideArr = [];

      for (let i = 0; i < 6; i++) {
        insideArr[i] = new Array(6);
        for (let j = 0; j < 6; j++) {
          insideArr[i][j] = rootArr[i + 1][j + 1];
        }
      }
      //xao tron
      shuffle(insideArr);

      //Tao 1 mang 8x8 de tao duong bao quanh insideArr
      const shuffleArr = [];
      for (let i = 0; i < 8; i++) {
        shuffleArr[i] = new Array(8);

        for (let j = 0; j < 8; j++) {
          shuffleArr[i][j] = {
            row: i,
            col: j,
            status: 0,
            data: { id: "", img: "" },
          };
        }
      }

      //nap gia tri tu A vao B
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
          shuffleArr[i + 1][j + 1] = insideArr[i][j];
        }
      }

      //thay doi thuoc tinh row, col theo vi tri moi
      const finalArr = shuffleArr.map((row, index) => {
        return row.map((cell, i) => {
          return { ...cell, row: index, col: i };
        });
      });

      // console.log(finalArr);

      localStorage.setItem("pokeArray", JSON.stringify(finalArr));
      return { pokeArray: finalArr };
    case "SHUFFLE":
      const sourceArr = [...state.pokeArray];

      //lay cac cell co status khac 0
      const statusNotZero = [];
      sourceArr.forEach((row) => {
        row.forEach((cell) => {
          if (cell.status !== 0) {
            statusNotZero.push(cell);
          }
        });
      });

      //lay vi tri ban dau - gia tri {row, col} cua cac Cell statusNotZero
      const address = [];
      statusNotZero.forEach((i) => address.push({ row: i.row, col: i.col }));

      //Xao tron mang vi tri ban dau
      shuffle(address);

      //Gan cac vi tri moi cho cac phan tu trong statusNotZero
      for (let i = 0; i < statusNotZero.length; i++) {
        statusNotZero[i] = {
          ...statusNotZero[i],
          row: address[i].row,
          col: address[i].col,
        };
      }

      //thay doi cac cell ban dau cua mang source theo vi tri cac cell moi
      const final = sourceArr.map((row) => {
        return row.map((cell) => {
          const indexCell = statusNotZero.findIndex(
            (item) => item.row === cell.row && item.col === cell.col
          );
          if (indexCell >= 0) {
            return statusNotZero[indexCell];
          }
          return cell;
        });
      });

      // console.log(final);

      localStorage.setItem("pokeArray", JSON.stringify(final));
      return { pokeArray: final };
    case "UPDATE":
      const updatedArray = state.pokeArray.map((row) => {
        return row.map((cell) => {
          if (
            cell.row === action.payload.row &&
            cell.col === action.payload.col
          ) {
            return { ...cell, status: 0 };
          }
          return cell;
        });
      });
      localStorage.setItem("pokeArray", JSON.stringify(updatedArray));
      // console.log("updated", updatedArray);
      return { pokeArray: updatedArray };
    case "SET_CHOSEN":
      // console.log(action.payload.row, action.payload.col);
      const newChosenArr = state.pokeArray.map((row) => {
        return row.map((cell) => {
          if (
            cell.row === action.payload.row &&
            cell.col === action.payload.col
          ) {
            return { ...cell, status: 1 };
          }
          return cell;
        });
      });
      // localStorage.setItem("pokeArray", JSON.stringify(newChosen));
      // console.log("newChosen", newChosen);
      return { pokeArray: newChosenArr };
    case "UNSET_CHOSEN":
      const newUnchosen = state.pokeArray.map((row) => {
        return row.map((cell) => {
          if (
            cell.row === action.payload.row &&
            cell.col === action.payload.col
          ) {
            return { ...cell, status: 5 };
          }
          return cell;
        });
      });
      // localStorage.setItem("pokeArray", JSON.stringify(newUnchosen));
      return { pokeArray: newUnchosen };
    case "DELETE":
      localStorage.setItem("pokeArray", JSON.stringify([]));
      return { pokeArray: [] };
    default:
      return state;
  }
};

//-------------reducer cho chosen Pokemon ---------------

const initStateChosen = {
  chosenPoke: [],
};

const reducerChosenPoke = (state = initStateChosen, action) => {
  switch (action.type) {
    case "ADD_CHOSEN":
      const newChosen = state.chosenPoke.concat(action.payload);
      // console.log("chosen! >>>", newChosen);
      return { chosenPoke: newChosen };
    case "CHECK_CHOSEN":
      return { chosenPoke: [] };
    case "DELETE_CHOSEN":
      return { chosenPoke: [] };

    default:
      return state;
  }
};

//--------------------------Root reducer---------------------------
const rootReducer = combineReducers({
  pokeData: reducerPokeArray,
  chosenData: reducerChosenPoke,
});
const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSaga);

export default store;
