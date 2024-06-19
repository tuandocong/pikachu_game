import { useEffect, useState } from "react";

export const pokeData = [
  {
    id: "001",
    img: "https://img.pokemondb.net/artwork/avif/raticate.avif",
  },
  {
    id: "002",
    img: "https://img.pokemondb.net/artwork/avif/bulbasaur.avif",
  },
  {
    id: "003",
    img: "https://img.pokemondb.net/artwork/avif/butterfree.avif",
  },
  {
    id: "004",
    img: "https://img.pokemondb.net/artwork/avif/pikachu.avif",
  },
  {
    id: "005",
    img: "https://img.pokemondb.net/artwork/avif/charmeleon.avif",
  },
  {
    id: "006",
    img: "https://img.pokemondb.net/artwork/avif/gible.avif",
  },
  {
    id: "007",
    img: "https://img.pokemondb.net/artwork/avif/mew.avif",
  },
  {
    id: "008",
    img: "https://img.pokemondb.net/artwork/avif/mawile.avif",
  },
  {
    id: "009",
    img: "https://img.pokemondb.net/artwork/avif/rayquaza.avif",
  },
  {
    id: "010",
    img: "https://img.pokemondb.net/artwork/avif/doduo.avif",
  },
  {
    id: "011",
    img: "https://img.pokemondb.net/artwork/avif/mankey.avif",
  },

  {
    id: "012",
    img: "https://img.pokemondb.net/artwork/avif/cubone.avif",
  },
  {
    id: "013",
    img: "https://img.pokemondb.net/artwork/avif/gengar.avif",
  },
  {
    id: "014",
    img: "https://img.pokemondb.net/artwork/avif/psyduck.avif",
  },
  {
    id: "015",
    img: "https://img.pokemondb.net/artwork/avif/paras.avif",
  },
  {
    id: "016",
    img: "https://img.pokemondb.net/artwork/avif/ekans.avif",
  },
  {
    id: "017",
    img: "https://img.pokemondb.net/artwork/avif/beedrill.avif",
  },
  {
    id: "018",
    img: "https://img.pokemondb.net/artwork/avif/squirtle.avif",
  },
];
const useData = () => {
  const [array, setArray] = useState([]);
  const [isRefesh, setIsRefesh] = useState(false);

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

  const refeshHandler = () => {
    setIsRefesh((prevState) => !prevState);
  };

  useEffect(() => {
    const A = [];
    const B = [];

    const data = pokeData.concat(pokeData);
    shuffle(data);

    //tao 1 mang 6x6
    for (let i = 0; i < 6; i++) {
      let index = i * 6;
      A[i] = new Array(6);

      for (let j = 0; j < 6; j++) {
        A[i][j] = { row: i + 1, col: j + 1, status: 5, data: data[index + j] };
      }
    }

    //Tao 1 mang 8x8 de tao duong bao quanh A
    for (let i = 0; i < 8; i++) {
      B[i] = new Array(8);

      for (let j = 0; j < 8; j++) {
        B[i][j] = { row: i, col: j, status: 0, data: { id: "", img: "" } };
      }
    }

    //nap gia tri tu A vao B
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        B[i + 1][j + 1] = A[i][j];
      }
    }

    setArray(B);
  }, [isRefesh]);

  return { array, refeshHandler };
};

export default useData;
