import React from "react";
// import axios from "axios";
import { Link } from "react-router-dom";

import "../App.css";

const Paginate = (props) => {
  console.log("prev" + props.prevState);
  console.log("next" + props.nextState);
  return (
    <>
      <div className="pagination">
        {props.prevState && (
          <Link to={`/shows/page/${Number(props.pageNum) - 1}`}>Previous</Link>
        )}
        {props.nextState && (
          <Link to={`/shows/page/${Number(props.pageNum) + 1}`}>Next</Link>
        )}
      </div>
    </>
  );
};
export default Paginate;
