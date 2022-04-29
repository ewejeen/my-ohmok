import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Typography, Button, Box, TextField } from '@material-ui/core';

import Menu from './topMenu';
import './login.css';

//function Login () {
class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            player1: '',
            player2: '',
        };
    }

    handlePlayerNameChange(e, id){
        this.setState({
            player1: id === 1 ? e.target.value : this.state.player1,
            player2: id === 2 ? e.target.value : this.state.player2,
        });
    }

    showAlert(e){
        if(!this.state.player1 && !this.state.player2){
            alert("Enter player names.");
            e.preventDefault();
            return false;
        } else{
            if(!this.state.player1){
                alert("Enter player 1.");
                e.preventDefault();
                return false;
            }
            if(!this.state.player2){
                alert("Enter player 2.");
                e.preventDefault();
                return false;
            }
        }
    }

    render(){
        document.title = '로그인';

        return (
            <>
            <Menu />
            <div className="wrap">
                <Box className="login">
                    <div style={{margin: '10% auto'}}>
                        <Typography variant="h2" align="center" color="textPrimary" style={{marginTop: '120px', fontWeight: 'bold', fontStyle: 'italic'}}>LOGIN</Typography>
                        <Typography variant="h5" align="center" color="textPrimary" style={{marginTop: '25px', fontWeight: 'bold', fontStyle: 'italic'}}>Enter names to play.</Typography>
                        <Box style={{textAlign: 'center', marginTop: '10px'}}>
                            <TextField label="Player 1" error={!this.state.player1 ? true : false} style={{display: 'inline-block', textAlign: 'center', height:'30px'}} onBlur={(e, id)=>this.handlePlayerNameChange(e, 1)}></TextField>
                        </Box>
                        <Box style={{textAlign: 'center', marginTop: '20px'}}>
                            <TextField label="Player 2" error={!this.state.player2 ? true : false} style={{display: 'inline-block', textAlign: 'center', height:'30px'}} onBlur={(e, id)=>this.handlePlayerNameChange(e, 2)}></TextField>
                        </Box>
                        <Link to="/game" onClick={(e) => this.showAlert(e)} state={{player1: this.state.player1, player2: this.state.player2}}>
                            <Button variant="contained" size="large" style={{margin: '50px auto', display: 'block', background: 'navy', color: 'white'}}>PLAY</Button>
                        </Link>
                    </div>
                </Box>
            </div></>
        );
    }
}

export default Login;