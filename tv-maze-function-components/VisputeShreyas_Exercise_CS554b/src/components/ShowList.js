import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SearchShows from "./SearchShows";
import noImage from "../img/download.jpeg";
import Paginate from "./Paginate";

import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  makeStyles,
} from "@material-ui/core";

import "../App.css";
const useStyles = makeStyles({
  card: {
    maxWidth: 250,
    height: "auto",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 5,
    border: "1px solid #1e8678",
    boxShadow: "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
  },
  titleHead: {
    borderBottom: "1px solid #1e8678",
    fontWeight: "bold",
  },
  grid: {
    flexGrow: 1,
    flexDirection: "row",
  },
  media: {
    height: "100%",
    width: "100%",
  },
  button: {
    color: "#1e8678",
    fontWeight: "bold",
    fontSize: 12,
  },
});
const ShowList = (props) => {
  const regex = /(<([^>]+)>)/gi;
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState(undefined);
  const [showsData, setShowsData] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPrev, setPrevState] = useState(false);
  const [isNext, setNextState] = useState(false);
  const [errorDiv, setError] = useState(false);
  const [paginate, setPaginate] = useState(false);

  let card = null;

  useEffect(() => {
    console.log("on load useeffect");
    async function fetchData() {
      try {
        if (props.match.params.pageNum >= 1) {
          setPrevState(true);
        } else {
          setPrevState(false);
        }

        const { data } = await axios.get(
          `http://api.tvmaze.com/shows?page=${props.match.params.pageNum}`
        );
        try {
          const { data: nextPage } = await axios.get(
            `http://api.tvmaze.com/shows?page=${
              Number(props.match.params.pageNum) + 1
            }`
          );
          if (nextPage) setNextState(true);
        } catch (error) {
          setNextState(false);
        }

        setShowsData(data);
        setLoading(false);
      } catch (e) {
        console.log(e);
        setError(true);
      }
    }
    fetchData();
  }, [props.match.params.pageNum]);

  useEffect(() => {
    console.log("search useEffect fired");
    async function fetchData() {
      try {
        console.log(`in fetch searchTerm: ${searchTerm}`);
        const { data } = await axios.get(
          "http://api.tvmaze.com/search/shows?q=" + searchTerm
        );
        setSearchData(data);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
    if (searchTerm) {
      console.log("searchTerm is set");
      setPaginate(true);

      fetchData();
    } else {
      setPaginate(false);
    }
  }, [searchTerm]);

  const searchValue = async (value) => {
    setSearchTerm(value);
  };
  const buildCard = (show) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={show.id}>
        <Card className={classes.card} variant="outlined">
          <CardActionArea>
            <Link to={`/shows/${show.id}`}>
              <CardMedia
                className={classes.media}
                component="img"
                image={
                  show.image && show.image.original
                    ? show.image.original
                    : noImage
                }
                title="show image"
              />

              <CardContent>
                <Typography
                  className={classes.titleHead}
                  gutterBottom
                  variant="h6"
                  component="h3"
                >
                  {show.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {show.summary
                    ? show.summary.replace(regex, "").substring(0, 139) + "..."
                    : "No Summary"}
                  <span>More Info</span>
                </Typography>
              </CardContent>
            </Link>
          </CardActionArea>
        </Card>
      </Grid>
    );
  };

  if (searchTerm) {
    card =
      searchData &&
      searchData.map((shows) => {
        let { show } = shows;
        return buildCard(show);
      });
  } else {
    card =
      showsData &&
      showsData.map((show) => {
        return buildCard(show);
      });
  }
  if (errorDiv) {
    return (
      <>
        <p>No Data Found</p>
      </>
    );
  } else {
    if (loading) {
      return (
        <div>
          <h2>Loading....</h2>
        </div>
      );
    } else {
      if (paginate) {
        return (
          <div>
            <SearchShows searchValue={searchValue} />
            <br />
            <br />
            <Grid container className={classes.grid} spacing={5}>
              {card}
            </Grid>
          </div>
        );
      } else {
        return (
          <div>
            <SearchShows searchValue={searchValue} />
            <br />
            <br />
            <Paginate
              pageNum={props.match.params.pageNum}
              prevState={isPrev}
              nextState={isNext}
            ></Paginate>
            <Grid container className={classes.grid} spacing={5}>
              {card}
            </Grid>
          </div>
        );
      }
    }
  }
};

export default ShowList;
