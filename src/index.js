import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import './index.css';
import Game from './game';

ReactDOM.render(
    <BrowserRouter>
        <Game />
    </BrowserRouter>,
    document.getElementById('root')
);