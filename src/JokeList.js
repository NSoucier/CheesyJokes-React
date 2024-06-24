import { React, useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */

function JokeList(props) {
  const [jokes, setJokes] = useState([]);
  const [loading, setLoading] = useState(true);

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     jokes: [],
  //     isLoading: true
  //   };

  //   this.generateNewJokes = this.generateNewJokes.bind(this);
  //   this.vote = this.vote.bind(this);
  // }

  /* at mount, get jokes */

  useEffect(function () {
    /* retrieve jokes from API */
    async function getJokes() {
      try {
        // load jokes one at a time, adding not-yet-seen jokes
        let jokes = [];
        let seenJokes = new Set();

        while (jokes.length < props.numJokesToGet) {
          let res = await axios.get("https://icanhazdadjoke.com", {
            headers: { Accept: "application/json" },
          });
          let { ...joke } = res.data;

          if (!seenJokes.has(joke.id)) {
            seenJokes.add(joke.id);
            jokes.push({ ...joke, votes: 0 });
          } else {
            console.log("duplicate found!");
          }
        }

        setJokes(jokes);
        setLoading(false);
        // this.setState({ jokes, isLoading: false });
      } catch (err) {
        console.error(err);
      }
    }

    getJokes();
  }, [loading]);

  // componentDidMount() {
  //   this.getJokes();
  // }

  /* retrieve jokes from API */

  // async getJokes() {
  //   try {
  //     // load jokes one at a time, adding not-yet-seen jokes
  //     let jokes = [];
  //     let seenJokes = new Set();

  //     while (jokes.length < this.props.numJokesToGet) {
  //       let res = await axios.get("https://icanhazdadjoke.com", {
  //         headers: { Accept: "application/json" }
  //       });
  //       let { ...joke } = res.data;

  //       if (!seenJokes.has(joke.id)) {
  //         seenJokes.add(joke.id);
  //         jokes.push({ ...joke, votes: 0 });
  //       } else {
  //         console.log("duplicate found!");
  //       }
  //     }

  //     this.setState({ jokes, isLoading: false });
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  /* empty joke list, set to loading state, and then call getJokes */

  const generateNewJokes = () => {
    setLoading(true);
    // this.setState({ isLoading: true});
    // this.getJokes();
  };

  /* change vote for this id by delta (+1 or -1) */

  const vote = (id, delta) => {
    setJokes(
      jokes.map((j) => (j.id === id ? { ...j, votes: j.votes + delta } : j))
    );
    // this.setState(st => ({
    //   jokes: st.jokes.map(j =>
    //     j.id === id ? { ...j, votes: j.votes + delta } : j
    //   )
    // }));
  };

  /* render: either loading spinner or list of sorted jokes. */

  let sortedJokes = jokes.sort((a, b) => b.votes - a.votes);
  if (loading) {
    return (
      <div className="loading">
        <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
    );
  }

  return (
    <div className="JokeList">
      <button className="JokeList-getmore" onClick={generateNewJokes}>
        Get New Jokes
      </button>

      {sortedJokes.map((j) => (
        <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={vote} />
      ))}
    </div>
  );
}

JokeList.defaultProps = {
  numJokesToGet: 5,
};

export default JokeList;
