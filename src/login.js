import React from 'react';
import { Link } from 'react-router-dom';
import Menu from './topMenu';
import './login.css';

class Login extends React.Component {
    render(){
        document.title = '로그인';

        return (
            <>
            <Menu />
            <div className="wrap">
                <div className="login">
                    Login
                    <ul>
                        <Link to="/game"><li>게임하기</li></Link>
                        <Link to="/"><li>메인페이지</li></Link>
                    </ul>
                </div>
            </div>
            </>
            );
    }
}

export default Login;