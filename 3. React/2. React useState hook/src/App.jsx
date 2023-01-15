import logo from './logo.svg';
import './App.css';
import { useState } from "react";


let myNum = 5;
let plus = () => {
  ++myNum;
  console.log("myNum: ", myNum);
}

function App() {

  let [data, setData] = useState(0);
  let [isLit, setLit] = useState(true);

  let changeState = () => {
    setData(data + 1);
    console.log("data: ", data)
  }

  let changeTheme = () => {
    setLit(!isLit);
  }


  return (
    <div className={!isLit ? "dark" : ""}>
      <p>
        plain variable  {myNum}
      </p>
      <button onClick={plus} >plus</button>

      <p>
        state variable  {data}
      </p>
      <button onClick={changeState} >plus</button>

      <br />
      <br />

      <div>Room is {(isLit) ? "Lit" : "Dark"}</div>
      <button onClick={changeTheme}>change theme</button>


    </div>
  );
}

export default App;
