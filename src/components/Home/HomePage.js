// import "./HomePage.css";
import classes from "./HomePage.module.css";
import Item from "../Item/Item";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import useData from "../../hooks/useData";
import useCheck from "../../hooks/useCheck";

const HomePage = () => {
  const pokeChoose = useSelector((state) => state.chosenData.chosenPoke);
  const dispatch = useDispatch();
  const [isWin, setIsWin] = useState(false);
  const Arr = useSelector((state) => state.pokeData.pokeArray);
  const { array, refeshHandler } = useData();
  const { latestPath, checkPath, resetValidPath, resetLatestPathHandler } =
    useCheck();

  //Xu ly loi Animation path khong chay lai khi 1 Point da nam trong Path truoc do:
  const [pathName, setPathName] = useState(true);

  useEffect(() => {
    setPathName((prevState) => !prevState);
  }, [latestPath]);

  //Kiem tra duong di:
  const checkHandler = useCallback(() => {
    if (pokeChoose.length === 2) {
      //kiem tra img co giong nhau?
      if (pokeChoose[0].data.img === pokeChoose[1].data.img) {
        //kiem tra tinh hop le cua duong di
        const isValid = checkPath(Arr, pokeChoose[0], pokeChoose[1]);

        if (isValid) {
          // console.log("duong di hop le");
          dispatch({
            type: "UPDATE",
            payload: { row: pokeChoose[0].row, col: pokeChoose[0].col },
          });
          dispatch({
            type: "UPDATE",
            payload: { row: pokeChoose[1].row, col: pokeChoose[1].col },
          });
          resetValidPath();
        } else {
          // console.log("duong di khong hop le");
          // console.log("bo chon");
          dispatch({ type: "UNSET_CHOSEN", payload: pokeChoose[0] });
          dispatch({ type: "UNSET_CHOSEN", payload: pokeChoose[1] });
        }
      } else {
        // img khong giong nhau
        // console.log("bo chon");
        dispatch({ type: "UNSET_CHOSEN", payload: pokeChoose[0] });
        dispatch({ type: "UNSET_CHOSEN", payload: pokeChoose[1] });
      }

      // Xoa cac chosen poke:
      dispatch({ type: "DELETE_CHOSEN" });
    }
    // const isVali = useCheck(pokeChoose)
  }, [pokeChoose, dispatch, Arr, checkPath, resetValidPath]);
  useEffect(() => {
    checkHandler();
  }, [pokeChoose, checkHandler]);

  //Ham chon khi click vao img
  const choosseHandler = (poke) => {
    dispatch({ type: "SET_CHOSEN", payload: poke });
    dispatch({ type: "ADD_CHOSEN", payload: [poke] });
  };

  //ham click RESTART btn
  const restartHandler = () => {
    //xoa cac gia tri trong chosen Arr

    if (pokeChoose.length === 2) {
      dispatch({ type: "UNSET_CHOSEN", payload: pokeChoose[0] });
      dispatch({ type: "UNSET_CHOSEN", payload: pokeChoose[1] });
    }
    if (pokeChoose.length === 1) {
      dispatch({ type: "UNSET_CHOSEN", payload: pokeChoose[0] });
    }
    dispatch({ type: "DELETE_CHOSEN" });

    //reset lai hien thi Path
    resetLatestPathHandler();

    //lam moi lai data array
    refeshHandler();
    dispatch({ type: "CREATE", payload: array });
  };

  //ham click SHUFFLE btn
  const shuffleHandler = () => {
    // reset lai bang poke chon
    if (pokeChoose.length === 2) {
      dispatch({ type: "UNSET_CHOSEN", payload: pokeChoose[0] });
      dispatch({ type: "UNSET_CHOSEN", payload: pokeChoose[1] });
    }
    if (pokeChoose.length === 1) {
      dispatch({ type: "UNSET_CHOSEN", payload: pokeChoose[0] });
    }

    dispatch({ type: "DELETE_CHOSEN" });
    //reset lai hien thi Path
    resetLatestPathHandler();

    //chay shuffle
    dispatch({ type: "SHUFFLE_NOT_ZERO" });
  };

  //ham exit modal
  const exitModalHandler = () => {
    setIsWin(false);
  };

  //kiem tra co phai 1 Point trong Path khong
  const checkPathNode = (row, col) => {
    const filterArr = latestPath.filter((i) => i.row === row && i.col === col);

    //TH diem can xet co trong latestPath Array:
    if (filterArr.length > 0) {
      return true;
    }

    return false;
  };

  const checkCanMoveHandler = () => {
    const curArr = localStorage.getItem("pokeArray")
      ? JSON.parse(localStorage.getItem("pokeArray"))
      : [];

    const A = [];
    const B = [];
    curArr.forEach((row) => {
      row.forEach((cell) => {
        if (cell.status !== 0) {
          A.push(cell);
          B.push(cell);
        }
      });
    });

    const couplePoints = A.map((point) => {
      const sameImgPointIndex = B.findIndex(
        (p) =>
          p.data.img === point.data.img &&
          (p.row !== point.row || p.col !== point.col)
      );

      if (sameImgPointIndex >= 0) {
        return [point, B[sameImgPointIndex]];
      }
      return [];
    });

    let check = false;
    for (let i = 0; i < couplePoints.length; i++) {
      //thay doi status cu cap diem dang xet:
      const newArray = curArr.map((row) => {
        return row.map((cell) => {
          if (
            cell.row === couplePoints[i][0].row &&
            cell.col === couplePoints[i][0].col
          ) {
            return { ...cell, status: 1 };
          }

          if (
            cell.row === couplePoints[i][1].row &&
            cell.col === couplePoints[i][1].col
          ) {
            return { ...cell, status: 1 };
          }

          return cell;
        });
      });

      if (
        checkPath(newArray, couplePoints[i][0], couplePoints[i][1], "check")
      ) {
        alert("Còn ít nhất 1 cặp ảnh có thể chọn.");
        check = true;
        break;
      }
    }
    if (!check) {
      shuffleHandler();
    }
  };
  //TU DONG :kiem tra co it  nhat 1 path hop le trong arr hien tai?
  // const checkCanMoveHandler = useCallback(() => {
  //   const curArr = localStorage.getItem("pokeArray")
  //     ? JSON.parse(localStorage.getItem("pokeArray"))
  //     : [];

  //   const A = [];
  //   const B = [];
  //   curArr.forEach((row) => {
  //     row.forEach((cell) => {
  //       if (cell.status !== 0) {
  //         A.push(cell);
  //         B.push(cell);
  //       }
  //     });
  //   });

  //   const couplePoints = A.map((point) => {
  //     const sameImgPointIndex = B.findIndex(
  //       (p) =>
  //         p.data.img === point.data.img &&
  //         (p.row !== point.row || p.col !== point.col)
  //     );

  //     if (sameImgPointIndex >= 0) {
  //       return [point, B[sameImgPointIndex]];
  //     }
  //     return [];
  //   });

  //   let check = false;
  //   for (let i = 0; i < couplePoints.length; i++) {
  //     //thay doi status cu cap diem dang xet:
  //     const newArray = curArr.map((row) => {
  //       return row.map((cell) => {
  //         if (
  //           cell.row === couplePoints[i][0].row &&
  //           cell.col === couplePoints[i][0].col
  //         ) {
  //           return { ...cell, status: 1 };
  //         }

  //         if (
  //           cell.row === couplePoints[i][1].row &&
  //           cell.col === couplePoints[i][1].col
  //         ) {
  //           return { ...cell, status: 1 };
  //         }

  //         return cell;
  //       });
  //     });

  //     if (
  //       checkPath(newArray, couplePoints[i][0], couplePoints[i][1], "check")
  //     ) {
  //       console.log("co it nhat 1 path hop le trong mang hien tai");
  //       check = true;
  //       break;
  //     }
  //   }
  //   if (!check) {
  //     shuffleHandler();
  //   }
  // }, []);

  //Kiem tra dieu kien thang va dieu kien tiep tuc cua Arr
  useEffect(() => {
    let total = 0;
    Arr.map((row) => {
      return row.map((cell) => (total = total + cell.status));
    });
    if (total === 0) {
      setIsWin(true);
    } else {
      // checkCanMoveHandler();  //=> tu dong kiem tra TH cannot move
    }
  }, [Arr]);
  return (
    <div className={classes.center}>
      {isWin && (
        <div className={classes["modal-win"]}>
          <div className={classes["context-win"]}>
            <h1>YOU WIN!</h1>
            <button className={classes["btn-modal"]} onClick={exitModalHandler}>
              Continute
            </button>
          </div>
        </div>
      )}

      <div className={classes.nav}>
        <button className="btn btn-warning" onClick={restartHandler}>
          RESTART
        </button>
        <button className="btn btn-warning" onClick={shuffleHandler}>
          SHUFFLE
        </button>
        <button className="btn btn-warning" onClick={checkCanMoveHandler}>
          CHECK
        </button>
      </div>
      <div className={classes["play-table"]}>
        {Arr.map((row, index) => (
          <div key={index} className={classes["row-table"]}>
            {row.map((item, i) => (
              <div
                key={`${i} ${pathName}`}
                className={`${classes["cell-table"]} ${
                  checkPathNode(item.row, item.col) ? classes.path : ""
                }`}
              >
                <Item item={item} handler={choosseHandler} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
