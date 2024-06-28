import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";


const Anime = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [recommendations, setRecommendations] = useState([]);


  const baseUrl = process.env.REACT_APP_URL

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      if (query !== "") {
        const response = await axios.get(
          baseUrl+`/search?query=${query}`
        );
        setResults(response.data.matching_titles);
      }
    } catch (error) {
      console.error("There was an error fetching the data!", error);
    }
  };

  const addFavourite = (anime) => {
    if (!favourites.find((fav) => fav.anime_id === anime.anime_id)) {
      setFavourites([...favourites, anime]);
    }
  };

  const RemoveFavourite = (anime) => {
   
    const updatedFavourites = favourites.filter((fav) => fav.anime_id !== anime.anime_id);
    setFavourites(updatedFavourites); 
  };

  const getRecommendations = async () => {
    try {
      let arr = favourites.map((fav) => {
        return fav.anime_id;
      });
      let reqBody = { arr: arr };
      if (favourites.length!== 0) {
        const response = await axios.post(
          baseUrl + `/recommendations`,
          reqBody
        );
        setRecommendations(response.data);
      }
    } catch (error) {
      console.error("There was an error fetching the data!", error);
    }
  };

  return (
    <div className='white-box'>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for an anime title"
        />
        <button class="btn btn-info btn-sm" type="submit">
          Search
        </button>
      </form>
      <div style={{ maxHeight: "300px", overflowY: "scroll" }}>
        {results.map((anime) => (
          <div key={anime.anime_id}>
            <strong>{anime.title}</strong>
            <button
              onClick={() => addFavourite(anime)}
              class="btn btn-outline-primary btn-sm"
            >
              Add
            </button>
          </div>
        ))}
      </div>
      <h2>Favourites:</h2>
      <ul>
        {favourites.map((fav) => (
            <div>
          <li key={fav.anime_id}>{fav.title}</li>
          <button class="btn btn-danger btn-sm" onClick={()=>RemoveFavourite(fav)}>
          Remove
        </button>                
            </div>

        ))}
      </ul>
      <button class="btn btn-success" onClick={() => getRecommendations()}>
        Get Recommendations
      </button>

      <div>
        {recommendations.length > 0 ? (
          <ul>
            {recommendations.map((anime) => (
              <li key={anime.title}>{anime.title}</li>
            ))}
          </ul>
        ) : (
          <p>No recommendations available</p>
        )}
      </div>
    </div>
  );
};

export default Anime;
