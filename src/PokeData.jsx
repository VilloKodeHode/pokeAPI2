import { useEffect, useState } from "react";

export default function PokeData() {
  const [pokemon, setPokemon] = useState(null);
  const [searchQuery, setSearchQuary] = useState("");
  const [pokeList, setPokeList] = useState(null);

  useEffect(() => {
    async function fetchEmAll() {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon/?limit=386"
      );
      const data = await response.json();
      const pokeImages = data.results.map((pokemon) => ({
        ...pokemon,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.url
          .match(/\/\d+\/$/)[0]
          .slice(1, -1)}.png`,
      }));

      setPokeList(pokeImages);
      console.log("pokeList:", data);
      console.log("pokeImages:", pokeImages);
    }
    fetchEmAll();
  }, []);

  async function FetchOne(name) {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`
    );
    const pokeData = await response.json();
    setPokemon(pokeData);
    console.log("pokeData:", pokeData);
    //do another fetch here to get flavortext (look at line 34 in the other PokeAPI i made)
  }
  function findOne(event) {
    setSearchQuary(event.target.value);
  }
  function clickOne(name) {
    setSearchQuary(name);
    FetchOne(name);
  }

  return (
    <div className="grid grid-cols-2 w-[100vw] bg-orange-300 p-8">
      <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 p-4 border">
        <h2 className="col-span-full text-3xl">List of all pokemon:</h2>
        {pokeList?.map((pokemon) => (
          <div className="grid w-36 justify-center border p-1 shadow-md">
            <button
              key={pokemon.name}
              onClick={() => clickOne(pokemon.name)}
              className="text-xl bg-slate-50 p-1 shadow-md my-2"
            >
              {pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}
            </button>
            <img
              className="m-auto h-16"
              src={pokemon.image}
              alt={`${pokemon.name} sprite`}
            />
          </div>
        ))}
      </div>
      <div className="flex flex-col justify-start items-center gap-4">
        <h1>PokeAPI</h1>
        <form
          className="grid justify-around items-center gap-12 sticky top-[10%]"
          onSubmit={FetchOne}
        >
          <label htmlFor="search" className="text-xl">
            Search for a Pokemon:
          </label>
          <input
            className="border p-2"
            type="text"
            id="search"
            value={searchQuery}
            onChange={findOne}
          />
          <button className="shadow-xl bg-slate-50" type="submit">
            Search
          </button>
        </form>
        {pokemon && (
          <div className="sticky top-1/3 border-8 rounded-sm border-yellow-200">
            <ul className="grid bg-red-500 gap-4 p-8 rounded-sm">
              <li
                key={pokemon.name}
                className="text-5xl bg-red-700 shadow-inner shadow-red-900 text-white p-2 rounded-md"
              >
                {pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}
              </li>
              <img
                src={pokemon.sprites.front_default}
                className="h-56 bg-red-100 m-auto rounded-md shadow-inner shadow-red-900"
              />
              <div className=" bg-red-700 text-white p-2 rounded-md shadow-inner shadow-red-900">
                <li key={pokemon.types}>
                  <span className="text-xl">Types:</span>{" "}
                  {pokemon.types.map((type) => type.type.name).join(", ")}
                </li>
                <li>
                  <span className="text-xl">Abilities:</span>{" "}
                  {pokemon.abilities
                    .map((ability) => ability.ability.name)
                    .join(", ")}
                </li>
              </div>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
