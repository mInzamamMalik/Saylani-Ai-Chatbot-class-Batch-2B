import './home.css';
import { useState, useEffect, useRef } from "react";
import axios from "axios";

function Home() {
    const [data, setData] = useState([])
    const [cat, setCat] = useState("")
    const description = useRef("");
    const result = useRef("");

    const getAllProducts = async () => {
        try {
            const response = await axios.get(`http://localhost:5001/products`)
            console.log(response);
            setData(response.data.data);
        } catch (error) {
            console.log("Error getting products: ", error);
        }
    }
    useEffect(() => {
        getAllProducts();
    }, [])


    const addProduct = async () => {
        try {
            const name = document.getElementById('name').value;
            const price = document.querySelector('#price').value;
            // cat
            const desc = description.current.value
            console.log(name, price, cat, desc);

            const response = await axios.post(`http://localhost:5001/product`, {
                name: name,
                price: price,
                category: cat,
                description: desc
            })
            // handle success
            console.log("response is success");
            console.log(response.data);

            result.current = response.data.message

            getAllProducts();
        } catch (error) {
            // handle error
            console.log(error);
            result.current = error.data.message
        }
    }

    const deleteProduct = async (id) => {

        if (!window.confirm('Are you sure you want to delete this product')) return;

        const response = await axios.delete(`http://localhost:5001/product/${id}`)

        console.log("response is success");
        console.log(response.data);

        result.current = response.data.message
        getAllProducts();
    }


    return <div>

        <h1>
            E-commerce CRUD operation
        </h1>

        <form onSubmit={addProduct}>

            Name:
            <input type="text" id="name" /> <br />

            Price:
            <input type="number" id="price" /> <br />

            Category:
            <input
                type="text"
                id="cat"
                onChange={(e) => setCat(e.target.value)}
            /> <br />

            Description: <input type="text" id="desc" ref={description} /> <br />
            <button type="submit">Add Product</button>

        </form>

        {result.current}


        {data.map((eachProduct, index) => {

            return <div key={index} className='product'>
                <h2>
                    {eachProduct?.name}
                    <button onClick={() => deleteProduct(eachProduct._id)}>Delete</button>
                </h2>
                <span>{eachProduct?.category}</span>
                <span>{eachProduct?.price}</span>
                <p>{eachProduct?.description}</p>

            </div>

        })}

        { }


    </div>
}

export default Home
