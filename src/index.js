import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import Main from './main';
import Game from './game';
import Login from './login';

ReactDOM.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Main />}></Route>
            <Route path="/game" element={<Game />}></Route>
            <Route path="/login" element={<Login />}></Route>
        </Routes>
    </BrowserRouter>,
    document.getElementById('root')
);