import './post.css'

const Post = ({ name, date, text, imageUrl, darkMode }) => (

    <div className={`post ${(darkMode) ? "dark" : ""}`}>
        <div className="top">

            <div className="left">
                <img className="profilePicture" width={100} src={imageUrl} alt="profile picture" />
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

export default Post