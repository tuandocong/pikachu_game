import { useState } from "react";
// import {  useEffect } from "react";

const useCheck = () => {
  const [isValidPath, setIsValidPath] = useState(false);
  const [latestPath, setLatestPath] = useState([]);

  const store = [];

  //them vao store:
  const addStore = (path) => {
    store.unshift(path);
  };

  //reset latestPath
  const resetLatestPathHandler = () => {
    setLatestPath([]);
  };

  //Check in a line
  function checkLineX(y1, y2, x, array) {
    const min = Math.min(y1, y2);
    const max = Math.max(y1, y2);
    // const x = x;
    let numberSatus = 0;
    for (let y = min; y <= max; y++) {
      // console.log("x>>", x, "y>>", y);
      numberSatus = numberSatus + array[x][y].status;
    }

    if (numberSatus <= 2) {
      // console.log("sumX", numberSatus, y1, y2, x);

      const path = [];
      for (let i = min; i <= max; i++) {
        path.push({ row: x, col: i });
      }
      // console.log("path:>>>", path);

      addStore(path);

      setIsValidPath(true);
      return true;
    }
    // console.log("sumX", numberSatus, y1, y2, x);

    return false;
  }
  function checkLineY(x1, x2, y, array) {
    const min = Math.min(x1, x2);
    const max = Math.max(x1, x2);
    // const x = x;
    let numberSatus = 0;
    for (let x = min; x <= max; x++) {
      // console.log("x>>", x, "y>>", y);
      numberSatus = numberSatus + array[x][y].status;
    }

    if (numberSatus <= 2) {
      // console.log("sumY", numberSatus, x1, x2, y);
      setIsValidPath(true);

      const path = [];
      for (let i = min; i <= max; i++) {
        path.push({ row: i, col: y });
      }
      // console.log("path:>>>", path);

      addStore(path);

      return true;
    }
    // console.log("sumY", numberSatus, x1, x2, y);

    return false;
  }
  // check in rectangle
  function checkRectX(p1, p2, array) {
    // find point have y min and max
    let pMinY;
    let pMaxY;
    if (p1.col > p2.col) {
      pMinY = p2;
      pMaxY = p1;
    } else {
      pMinY = p1;
      pMaxY = p2;
    }
    for (let y = pMinY.col; y <= pMaxY.col; y++) {
      // check three line
      if (
        checkLineX(pMinY.col, y, pMinY.row, array) &&
        checkLineY(pMinY.row, pMaxY.row, y, array) &&
        checkLineX(y, pMaxY.col, pMaxY.row, array)
      ) {
        return true;
      }
      // if three line is true return column y
    }

    // have a line in three line not true then return -1
    return false;
  }
  function checkRectY(p1, p2, array) {
    let pMinX;
    let pMaxX;

    if (p1.row > p2.row) {
      pMinX = p2;
      pMaxX = p1;
    } else {
      pMinX = p1;
      pMaxX = p2;
    }
    // find line and y begin
    for (let x = pMinX.row; x <= pMaxX.row; x++) {
      if (
        checkLineY(pMinX.row, x, pMinX.col, array) &&
        checkLineX(pMinX.col, pMaxX.col, x, array) &&
        checkLineY(x, pMaxX.row, pMaxX.col, array)
      ) {
        return true;
      }
    }
    return false;
  }

  //Check U/L line
  function checkMoreLineX(p1, p2, type, array) {
    let pMinY;
    let pMaxY;
    if (p1.col > p2.col) {
      pMinY = p2;
      pMaxY = p1;
    } else {
      pMinY = p1;
      pMaxY = p2;
    }
    let y = pMaxY.col;
    let row = pMinY.row;
    if (type === -1) {
      y = pMinY.col;
      row = pMaxY.row;
    }
    // check more
    // if (type === -1) {
    //   console.log("start with y = pMinY.col >>>>>>", y);
    // }

    if (checkLineX(pMinY.col, pMaxY.col, row, array)) {
      while (y < array[0].length && y >= 0) {
        // console.log("while with y:", y);
        if (checkLineY(pMinY.row, pMaxY.row, y, array)) {
          if (type === 1) {
            return (
              checkLineX(pMaxY.col, y, pMinY.row, array) &&
              checkLineX(pMaxY.col, y, pMaxY.row, array)
            );
          } else {
            return (
              checkLineX(pMinY.col, y, pMinY.row, array) &&
              checkLineX(pMinY.col, y, pMaxY.row, array)
            );
          }
        }
        y += type;
      }
    }

    return false;
  }
  function checkMoreLineY(p1, p2, type, array) {
    // find point have y min
    let pMinX;
    let pMaxX;
    if (p1.row > p2.row) {
      pMinX = p2;
      pMaxX = p1;
    } else {
      pMinX = p1;
      pMaxX = p2;
    }

    let x = pMaxX.row;
    let col = pMinX.col;
    if (type === -1) {
      x = pMinX.row;
      col = pMaxX.col;
    }

    //--------test-------------
    // if (type === -1) {
    //   console.log("Start with type = -1, x(0)= pMinX.row:", x);
    // } else {
    //   // console.log("Start with type = 1, x(0)=pMaxX.row:",x)
    // }

    if (checkLineY(pMinX.row, pMaxX.row, col, array)) {
      while (x >= 0 && x < array.length) {
        // console.log("while with x:", x);
        if (checkLineX(pMinX.col, pMaxX.col, x, array)) {
          if (type === 1) {
            return (
              checkLineY(pMaxX.row, x, pMinX.col, array) &&
              checkLineY(pMaxX.row, x, pMaxX.col, array)
            );
          } else {
            return (
              checkLineY(pMinX.row, x, pMinX.col, array) &&
              checkLineY(pMinX.row, x, pMaxX.col, array)
            );
          }
        }

        // console.log("khong hop le >>> tiep tuc while... ");
        x += type;
      }
    }
    return false;
  }
  //------------------Tinh toan duong di giua 2 diem co hop le khong ---------
  const checkPath = (array, poke1, poke2, type = "play") => {
    //TH 2 diem la mot (trung nhau)
    if (poke1.row === poke2.row && poke1.col === poke2.col) {
      return false;
    }

    //TH 2 diem nam tren cung 1 row
    if (poke1.row === poke2.row) {
      // return checkLineX(poke1.col, poke2.col, poke1.row, array);
      if (checkLineX(poke1.col, poke2.col, poke1.row, array)) {
        //lay cac Point cua duong di
        if (type === "play") {
          const path = store[0];
          store.splice(0, store.length);
          setLatestPath(path);
        }

        return true;
      }

      if (
        checkMoreLineY(poke1, poke2, 1, array) ||
        checkMoreLineY(poke1, poke2, -1, array)
      ) {
        //lay cac Point cua duong di
        if (type === "play") {
          const arr = [];
          const path = arr.concat(store[0], store[1], store[2], store[3]);
          store.splice(0, store.length);
          setLatestPath(path);
        }

        return true;
      }

      return false;
    }

    //TH 2 diem nam tren cung 1 col
    if (poke1.col === poke2.col) {
      // return checkLineY(poke1.row, poke2.row, poke1.col, array);
      if (checkLineY(poke1.row, poke2.row, poke1.col, array)) {
        //lay cac Point cua duong di
        if (type === "play") {
          const path = store[0];
          store.splice(0, store.length);
          setLatestPath(path);
        }

        return true;
      }
      if (
        checkMoreLineX(poke1, poke2, 1, array) ||
        checkMoreLineX(poke1, poke2, -1, array)
      ) {
        //lay cac Point cua duong di
        if (type === "play") {
          const arr = [];
          const path = arr.concat(store[0], store[1], store[2], store[3]);
          store.splice(0, store.length);
          setLatestPath(path);
        }

        return true;
      }

      return false;
    }

    // TH khac
    if (poke1.row !== poke2.row && poke1.col !== poke2.col) {
      if (checkRectX(poke1, poke2, array) || checkRectY(poke1, poke2, array)) {
        //lay cac Point cua duong di
        if (type === "play") {
          const arr = [];
          const path = arr.concat(store[0], store[1], store[2]);
          store.splice(0, store.length);
          setLatestPath(path);
        }

        return true;
      }
      if (
        checkMoreLineX(poke1, poke2, 1, array) ||
        checkMoreLineX(poke1, poke2, -1, array) ||
        checkMoreLineY(poke1, poke2, 1, array) ||
        checkMoreLineY(poke1, poke2, -1, array)
      ) {
        //lay cac Point cua duong di
        if (type === "play") {
          const arr = [];
          const path = arr.concat(store[0], store[1], store[2], store[3]);
          store.splice(0, store.length);
          setLatestPath(path);
        }

        return true;
      }
      return false;
    }
  };

  //--------- Reset path ---------
  const resetValidPath = () => {
    setIsValidPath(false);
  };

  return {
    isValidPath,
    latestPath,
    checkPath,
    resetValidPath,
    resetLatestPathHandler,
  };
};
export default useCheck;
