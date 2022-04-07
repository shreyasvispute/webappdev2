import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import md5 from "blueimp-md5";
import axios from "axios";
import Paginate from "./paginate";
import NotFound from "./notfound";

import { Card, Container, Spinner, CardGroup, Row, Col } from "react-bootstrap";
import Search from "./search";

const publickey = "be3f31438c0d0dca365602ae44e1256e";
const privatekey = "943eee94a11e331175bd7a9dbab6650308c4fab6";
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const baseUrl = "https://gateway.marvel.com:443/v1/public/comics";

function Comics() {
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageError, setPageError] = useState(false);
  const [isPrev, setPrevState] = useState(false);
  const [isNext, setNextState] = useState(false);
  const [paginate, setPaginate] = useState(true);
  const [totalRecords, setTotalRecords] = useState("");
  const [pages, setPages] = useState("");
  const [originalRecords, setOriginalRecords] = useState("");

  let params = useParams();
  let card = null;

  useEffect(() => {
    const getData = async () => {
      try {
        let limit = 20;
        let page = Number(params.page);
        if (isNaN(page)) {
          setPageError(true);
          return;
        }

        if (page === 0) {
          setPrevState(false);
          page = 0;
        } else {
          setPrevState(true);
        }
        page += 1;
        let offset = limit * page - limit;
        const url = `${baseUrl}?offset=${offset}&limit=${limit}&ts=${ts}&apikey=${publickey}&hash=${hash}`;

        const { data } = await axios.get(url);
        let totalRecords = data.data.total;
        setTotalRecords(totalRecords);
        setOriginalRecords(totalRecords);

        let totalPages = Math.ceil(totalRecords / limit) - 1;
        setPages(totalPages);

        if (page - 1 === totalPages) {
          setNextState(false);
        } else {
          setNextState(true);
        }
        setApiData(data);
        setLoading(false);

        if (data.data.results.length === 0) {
          setPageError(true);
        } else {
          setPageError(false);
        }
      } catch (error) {
        setPageError(true);
      }
    };
    getData();
  }, [params.page]);

  useEffect(() => {
    async function searchCharacters(searchTerm) {
      try {
        const url = `${baseUrl}?titleStartsWith=${searchTerm}&ts=${ts}&apikey=${publickey}&hash=${hash}`;
        const { data } = await axios.get(url);
        setTotalRecords(data.data.total);

        setSearchData(data);
      } catch (error) {
        console.log(error);
      }
    }

    if (searchTerm) {
      setPaginate(false);
      searchCharacters(searchTerm);
    } else {
      let records = originalRecords;
      setTotalRecords(records);

      setPaginate(true);
    }
  }, [searchTerm]);

  const searchValue = async (value) => {
    setSearchTerm(value);
  };

  const buildCard = (data) => {
    return (
      <div key={data.id} className="col sm-4">
        <Card style={{ width: "16rem" }}>
          <Card.Img
            alt={data.title}
            variant="top"
            src={data.thumbnail.path + "." + data.thumbnail.extension}
          />
          <Card.Body>
            <Link to={`/comics/${data.id}`}>
              <Card.Title>{data.title}</Card.Title>
            </Link>

            {/* <Card.Text>{characterData.description}</Card.Text> */}
          </Card.Body>
        </Card>
      </div>
    );
  };

  if (searchTerm) {
    card =
      searchData &&
      searchData.data.results.map((comic) => {
        return buildCard(comic);
      });
  } else {
    card =
      apiData.data &&
      apiData.data.results.map((comicsData) => {
        return buildCard(comicsData);
      });
  }
  if (pageError) {
    return (
      <>
        <NotFound></NotFound>
      </>
    );
  } else {
    if (loading) {
      return (
        <div>
          <Container>
            <Spinner animation="border" variant="danger" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Container>
        </div>
      );
    } else {
      return (
        <Container>
          <Container className="headRow">
            <Row className="titleAlign">
              <h1>
                <span className="marvel">Marvel</span> Comics
              </h1>
            </Row>

            <Row>
              <Col sm>
                <Search page="comics" searchValue={searchValue}></Search>
              </Col>
              <Col sm className="makeCenter filterMargin">
                {paginate && (
                  <Paginate
                    pageNum={params.page}
                    prevState={isPrev}
                    nextState={isNext}
                    page="comics"
                    currentPage={
                      Number(params.page) < 0 ? 0 : Number(params.page)
                    }
                    totalPages={pages}
                  ></Paginate>
                )}
              </Col>
              <Col sm className="makeCenter filterMargin">
                Total Records Count: {totalRecords}
              </Col>
            </Row>
          </Container>
          <CardGroup>{card}</CardGroup>
        </Container>
      );
    }
  }
}

export default Comics;
