import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button } from '@material-ui/core';
import Menu from './topMenu';
import './main.css';

class Main extends React.Component {
    render(){
        document.title = '메인';

        return (
            <>
            <Menu />
            <div className="wrap">
                <Box className="main">
                    <div style={{margin: '10% auto'}}>
                        <Typography variant="h2" align="center" color="textPrimary" style={{marginTop: '150px', fontWeight: 'bold', fontStyle: 'italic'}}>MY-OHMOK</Typography>
                        <Link to='/login'>
                            <Button variant="contained" size="large" style={{margin: '50px auto', display: 'block', background: 'navy', color: 'white'}}>LOGIN</Button>
                        </Link>
                    </div>
                </Box>
            </div></>
        );
    }
}

export default Main;