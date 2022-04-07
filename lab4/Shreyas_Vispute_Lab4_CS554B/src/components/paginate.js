import React from "react";
// import axios from "axios";
import { Link } from "react-router-dom";
import "../App.css";

import { Container, Row, Col } from "react-bootstrap";

const Paginate = (props) => {
  return (
    <>
      <div className="paginateDesign">
        <Row xs="auto">
          <Col sm>
            {props.prevState && (
              <Link to={`/${props.page}/page/${Number(props.pageNum) - 1}`}>
                Previous
              </Link>
            )}
          </Col>
          <Col>
            {props.currentPage} of {props.totalPages}
          </Col>
          <Col sm>
            {props.nextState && (
              <Link to={`/${props.page}/page/${Number(props.pageNum) + 1}`}>
                Next
              </Link>
            )}
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Paginate;
