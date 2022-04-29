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
            <Route exact path="/" element={<Main />}></Route>
            <Route exact path="/game" element={<Game />}></Route>
            <Route exact path="/login" element={<Login />}></Route>
        </Routes>
    </BrowserRouter>,
    document.getElementById('root')
);