import React from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@material-ui/core';
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
                        메인
                        <ul>
                            <Link to="/game"><li>게임하기</li></Link>
                            <Link to="/login"><li>로그인</li></Link>
                        </ul>
                    </Box>
                </div></>
            
            );
    }
}

export default Main;