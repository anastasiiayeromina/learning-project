import { usePokemons } from "../bus/pokemons/usePokemons";

const PokemonsComponent = (props) => {
  const {} = props;
  const { pokemons } = usePokemons();

  const pokemonsJSX = pokemons && pokemons.map(({name}) => {
    return (
      <p key={name}>{name}</p>
    );
   }
  );

  return (
    <>
      <h1>Pokemons</h1>
      {pokemonsJSX}
    </>
  );
};

export default PokemonsComponent;