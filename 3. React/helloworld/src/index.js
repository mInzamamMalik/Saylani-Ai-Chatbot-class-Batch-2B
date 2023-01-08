import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Hi() {
  return (
    <div>
      <strong> Hello Malik! </strong>
      <div className="red"> this is some more html</div>
      <img
        width="200px"
        src="https://www.simplilearn.com/ice9/free_resources_article_thumb/what_is_image_Processing.jpg"
        alt=""
      />

      <br />
      {5 + 2 + 2}
    </div>
  );
}

ReactDOM.render(<Hi />, document.querySelector("#root"));
