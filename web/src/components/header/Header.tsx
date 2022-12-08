// React
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { useDispatch } from 'react-redux';

// // actions 
// import { ShowCreateFeedFormModal } from '../../reducers/FeedReducer';

// models
import { UserState } from '../../models/user';

// Styles
import './Header.css';

const Header = () => {
  const [menu, setMenu] = useState(false);
  const [cookies] = useCookies();
  // const user = useSelector((state: { UserState: UserState })=>state.UserState.user);
  const nav = useNavigate();
  // const dispatch = useDispatch();

  const showMenu = (event: any) => {
    if (event?.target.id !== "menu-background") {
      setMenu(true);
    }
  }

  const hideMenu1 = (event: any) => {
    if (event?.target.id === "menu-background") {
      setMenu(false);
    }
  }
  const hideMenu2 = () => {
    setMenu(false);
  }

  const handleAuth = () => {
    if(!cookies.csrftoken) {
      window.location.replace('/signin');
    } else {
      document.cookie = 'csrftoken=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      localStorage.clear();
      window.location.replace('/');
    }
  }

  const toSettingPage = () => {
    nav('/setting');
    hideMenu2();
  }

  return (
    <nav>
      <div className="nav-container">
        <div className="nav-left">
          <Link to="/">
            <img className="logo" src="logo2.png" alt="logo2.png"></img>
          </Link>
        </div>
        <div className="nav-center"></div>
        <div className="nav-right">
          <span className="nav-item">
            <Link to="/">
              <img src={window.location.pathname==="/" ? 'assets/icons/home-filled.svg' : 'assets/icons/home-outlined.svg'} alt="home icon"></img>
            </Link>
          </span>
          <span 
            className="nav-item"
            // onClick={()=>dispatch<any>(ShowCreateFeedFormModal())}
          >
            <div>
              <img src="assets/icons/add-outlined.svg" alt="add icon"></img>
            </div>
          </span>
          <span className="nav-item" onClick={showMenu}>
            {/* <img className="nav-item-profile" src={user?.profile ? user.profile : "profile.png"} alt="user profile"></img> */}
            <div className="nav-menu">
              <div className={menu ? "nav-menu-container nav-menu-container-show" : "nav-menu-container nav-menu-container-hide"}>
                <div className="nav-menu-container-tail"></div>
                <div className="nav-menu-item-list">
                  <a className="icon-label-container">
                    <img src="assets/icons/profile.svg" alt="profile icon" />
                    <span className="icon-label">프로필</span>
                  </a>
                  <div className="icon-label-container" onClick={toSettingPage}>
                    <img src="assets/icons/setting.svg" alt="setting icon" />
                    <span className="icon-label">설정</span>
                  </div>
                  <div className="icon-label-container nav-menu-logout" onClick={handleAuth}>
                    <span className="icon-label">{cookies.csrftoken ? "로그아웃" : "로그인"}</span>
                  </div>
                </div>
              </div>
              <div id="menu-background" className={menu ? "menu-background-show" : "menu-background-hide"} onClick={hideMenu1}></div>
            </div>
          </span>
        </div>
      </div>
    </nav>
  );
}

export default Header;