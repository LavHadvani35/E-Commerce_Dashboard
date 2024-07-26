import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';

const UpdateProduct = () => {

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [company, setCompany] = useState('');
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        getProductDetails();
    }, [])

    const getProductDetails = async () => {
        console.log(params);
        let result = await fetch(`http://localhost:8080/products/${params.id}`);
        result = await result.json();
        setName(result.name);
        setPrice(result.price);
        setCategory(result.category);
        setCompany(result.company);
    }

    const updateData = async () => {
        console.log(name, price, category, company);
        let result = await fetch(`http://localhost:8080/products/${params.id}`, {
            method: 'PUT',
            body: JSON.stringify({ name, price, category, company }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });
        result = await result.json();
        console.log(result);
        navigate('/')
    }

    return (
        <div className="product">
            <h1> Update Product </h1>
            <input
                type="text"
                className="inputBox"
                placeholder="Enter Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <input
                type="text"
                className="inputBox"
                placeholder="Enter Product Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
            />

            <input
                type="text"
                className="inputBox"
                placeholder="Enter Product Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            />

            <input
                type="text"
                className="inputBox"
                placeholder="Enter Product Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
            />

            <button onClick={updateData} type="button" className="btn">
                Update Product </button>
        </div>
    )
}

export default UpdateProduct;