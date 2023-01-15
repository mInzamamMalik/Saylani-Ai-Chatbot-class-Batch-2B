import './home.css';
import { useState, useEffect } from "react";
import axios from "axios";


function Home() {
    const [data, setData] = useState([])

    useEffect(() => {

        const getAllProducts = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/products`)
                console.log(response);
                setData(response.data.data);
            } catch (error) {
                console.log("Error getting products: ", error);
            }
        }
        getAllProducts();

    }, [])


    return <div>

        <h1>
            E-commerce CRUD operation
        </h1>


        {data.map((eachProduct, index) => {

            return <div key={index} className='product'>
                <h2>{eachProduct?.name}</h2>
                <span>{eachProduct?.category}</span>
                <span>{eachProduct?.price}</span>
                <p>{eachProduct?.description}</p>
            </div>

        })}


    </div>
}

export default Home
