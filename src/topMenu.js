import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import './topMenu.css';

const Menu = () => {
    const location = useLocation();
    const pathname = location.pathname;
    const state = location.state;
    const p1 = state ? state.player1 : '';
    const p2 = state ? state.player2 : '';

    return (
        <div className="top-menu" style={{textAlign:'center', height:'15vh', display:'flex', alignItems:'center', justifyContent:'center', position:'relative'}}>
            <Link to="/"><Button variant="outlined" style={{padding:'0 100px'}}>MAIN</Button></Link>
            
            {pathname === '/game' ?
                <Link to="/login"><Button variant="outlined" style={{padding:'0 100px',margin:'0 50px'}}>LOGOUT</Button></Link> :
                <Link to="/login"><Button variant="outlined" style={{padding:'0 100px',margin:'0 50px'}}>LOGIN</Button></Link>
            }

            {p1 && p2 && pathname !== '/game'?
                <Link to="/game"><Button variant="outlined" style={{padding:'0 100px'}}>GAME</Button></Link> : ''
            }
        </div>
    )
}

export default Menu;