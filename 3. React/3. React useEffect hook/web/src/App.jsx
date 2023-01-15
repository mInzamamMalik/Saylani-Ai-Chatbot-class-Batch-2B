import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from "react";
import axios from "axios";
import { Link, Routes, Route, Navigate } from 'react-router-dom'

import Home from "./components/home/";
import Gallery from "./components/gallery/";
import Contact from "./components/contact/";
import About from "./components/about/";


const App = () => (

    <div>
        <nav>
            <ul>
                <li>
                    <Link to={'/'}>Home</Link>
                </li>
                <li>
                    <Link to={'/gallery'}>Gallery</Link>
                </li>
                <li>
                    <Link to={'/contact'}>Contact</Link>
                </li>
                <li>
                    <Link to={'/about'}>About</Link>
                </li>
            </ul>
        </nav>

        <Routes>
            <Route
                path="/"
                element={<Home />}
            />
            <Route
                path="/gallery"
                element={<Gallery />}
            />
            <Route
                path="/contact"
                element={<Contact />}
            />
            <Route
                path="/about"
                element={<About />}
            />
            <Route
                path="*"
                element={<Navigate to={'/'} />}
            />
        </Routes>


    </div>
)

export default App;

