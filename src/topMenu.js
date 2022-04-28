import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import './topMenu.css';

class Menu extends React.Component {
    render(){
        return (
            <div className="top-menu" style={{textAlign:'center', height:'15vh', display:'flex', alignItems:'center', justifyContent:'center', position:'relative'}}>
                <Link to="/"><Button variant="outlined" style={{padding:'0 100px'}}>MAIN</Button></Link>
                <Link to="/login"><Button variant="outlined" style={{padding:'0 100px',margin:'0 50px'}}>LOGIN</Button></Link>
                <Link to="/game"><Button variant="outlined" style={{padding:'0 100px'}}>GAME</Button></Link>
            </div>
        );
    }
}

export default Menu;