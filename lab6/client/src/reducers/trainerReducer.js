import { v4 as uuid } from "uuid";

const initialState = [
  {
    id: uuid(),
    selected: true,
    name: "Team Ash",
    pokemon: [
      //   {
      //     id: "1",
      //     name: "bulbasaur",
      //   },
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
        console.log(...prevState);
        return [...prevState];
      }
    case "DELETE_TRAINER":
      prevState = [...state];
      index = prevState.findIndex((x) => x.id === payload.id);
      prevState.splice(index, 1);
      return [...prevState];
    case "CATCH_POKEMON":
    case "RELEASE_POKEMON":
    default:
      return state;
  }
};

let exported = {
  reducer,
  initialState,
};

export default exported;
