import { v4 as uuid } from "uuid";

const initialState = [
  {
    id: uuid(),
    selected: true,
    name: "Ash",
    pokemon: [
      {
        id: "1",
        name: "bulbasaur",
        image:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
      },
    ],
  },
];

let prevState = null;
let index = 0;
const reducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case "CREATE_TRAINER":
      return [
        ...state,
        { id: uuid(), selected: false, name: payload.name, pokemon: [] },
      ];

    case "SELECT_CHANGED":
      prevState = [...state];
      index = prevState.findIndex((x) => x.selected === true);
      if (index === -1) {
        return [...prevState];
      } else {
        const trainer = prevState[index];
        trainer.selected = false;
        const newArray = prevState.map((x) => {
          if (x.id === payload.id) {
            x.selected = x.selected ? false : true;
          }
        });
        return [...prevState];
      }

    case "DELETE_TRAINER":
      prevState = [...state];
      index = prevState.findIndex((x) => x.id === payload.id);
      prevState.splice(index, 1);
      return [...prevState];

    case "CATCH_POKEMON":
      prevState = [...state];
      index = prevState.findIndex((e) => e.id === payload.trainerID);
      if (prevState[index].pokemon.length >= 6) {
        alert("Out of Pokeballs! Release some Pokemon");
      } else {
        prevState[index].pokemon.push({
          id: payload.pokemon.id,
          name: payload.pokemon.name,
          image: payload.pokemon.image,
        });
      }
      return [...prevState];

    case "RELEASE_POKEMON":
      prevState = [...state];
      index = prevState.findIndex((e) => e.id === payload.trainerID);
      let findPokemonIndex = prevState[index].pokemon.findIndex(
        (e) => e.id === payload.pokemon.id
      );
      prevState[index].pokemon.splice(findPokemonIndex, 1);
      return [...prevState];

    default:
      return state;
  }
};

let exported = {
  reducer,
  initialState,
};

export default exported;
