import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Typography, Button, Box, TextField, Select, MenuItem, InputLabel, FormControl } from '@material-ui/core';

import Menu from './topMenu';
import './login.css';

//function Login () {
class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            player1: '',
            player2: '',
            level: 5,
        };
    }

    handlePlayerNameChange(e, id){
        this.setState({
            player1: id === 1 ? e.target.value : this.state.player1,
            player2: id === 2 ? e.target.value : this.state.player2,
        });
    }

    handleLevelChange(e){
        console.log(e.target.value)
        this.setState({
            level: e.target.value
        })
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
                    <div style={{margin: '7% auto'}}>
                        <Typography variant="h2" align="center" color="textPrimary" style={{marginTop: '60px', fontWeight: 'bold', fontStyle: 'italic'}}>LOGIN</Typography>
                        <Typography variant="h5" align="center" color="textPrimary" style={{marginTop: '25px', fontWeight: 'bold', fontStyle: 'italic'}}>Enter names and select level to play.</Typography>
                        <Box style={{textAlign: 'center', marginTop: '10px'}}>
                            <TextField label="Player 1" error={!this.state.player1 ? true : false} style={{display: 'inline-block', textAlign: 'center', height:'30px'}} onBlur={(e, id)=>this.handlePlayerNameChange(e, 1)}></TextField>
                            <TextField label="Player 2" error={!this.state.player2 ? true : false} style={{display: 'inline-block', textAlign: 'center', height:'30px', marginLeft:'20px'}} onBlur={(e, id)=>this.handlePlayerNameChange(e, 2)}></TextField>
                        </Box>
                        <Box style={{textAlign: 'center', marginTop: '50px'}}>
                            <FormControl variant="standard" sx={{ minWidth: 200, width: 300 }}>
                                <InputLabel id="levelLabel">Level</InputLabel>
                                <Select labelId="levelLabel" id="levelSelect" style={{width: '100px'}}
                                    value={this.state.level ? this.state.level : 5}
                                    onChange={(e)=>this.handleLevelChange(e)} label="Level">
                                    <MenuItem value={5} >5 x 5</MenuItem>
                                    <MenuItem value={10}>10 x 10</MenuItem>
                                    <MenuItem value={15}>15 x 15</MenuItem>
                                    <MenuItem value={20}>20 x 20</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Box style={{textAlign: 'center', marginTop: '50px'}}>
                            <Link to="/game" onClick={(e) => this.showAlert(e)} state={{player1: this.state.player1, player2: this.state.player2, level: this.state.level}} style={{display: 'block', width: '200px', margin: '0 auto'}}>
                                <Button variant="contained" size="large" style={{margin: '40px auto', display: 'block', background: 'navy', color: 'white', width: '100%'}}>PLAY</Button>
                            </Link>
                        </Box>
                    </div>
                </Box>
            </div></>
        );
    }
}

export default Login;