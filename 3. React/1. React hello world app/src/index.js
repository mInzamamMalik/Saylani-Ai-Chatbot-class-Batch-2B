import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import profilePicture from "./img/profile.jpg"

const Post = ({ name, date, text, imageUrl, darkMode }) => (

  <div className={`post ${(darkMode) ? "dark" : ""}`}>
    <div className="top">

      <div className="left">
        <img className="profilePicture" width={100} src={profilePicture} alt="profile picture" />
      </div>
      <div className="right">
        <h2>{name}</h2>
        <span>{date}</span>
      </div>

    </div>

    <br />
    <p>{text}</p>
    <img
      width="300px"
      src={imageUrl}
      alt=""
    />
    <br />
    <button>Like</button>
    <button>Comment</button>
    <button>Share</button>
  </div>
)

ReactDOM.render(<div className="parent">
  <Post
    darkMode={false}
    name="John"
    date="1 january 2022"
    imageUrl="https://blogs.windows.com/wp-content/uploads/prod/2020/08/windows-logo-social.png"
    text="Windows is a group of several proprietary graphical operating system families developed and marketed by Microsoft. Each family caters to a certain sector of the computing industry. For example, Windows NT for consumers, Windows Server for servers, and Windows IoT for embedded systems. Defunct Windows families include Windows 9x, Windows Mobile, and Windows Phone."
  />
  <Post
    darkMode={true}
    name="Alice"
    date="1 january 2022"
    imageUrl="https://www.simplilearn.com/ice9/free_resources_article_thumb/what_is_image_Processing.jpg"
    text="The first version of Windows was released on November 20, 1985, as a graphical operating system shell for MS-DOS in response to the growing interest in graphical user interfaces (GUIs).[7]"
  />
  <Post
    name="Bob"
    date="1 january 2022"
    text="The first version of Windows was released on November 20, 1985, as a graphical operating system shell for MS-DOS in response to the growing interest in graphical user interfaces (GUIs).[7]"
    imageUrl="https://www.simplilearn.com/ice9/free_resources_article_thumb/what_is_image_Processing.jpg"

  />
</div>, document.querySelector("#root"));
