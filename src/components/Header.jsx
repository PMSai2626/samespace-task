import logo from '/spotify.png'
import { Link } from 'react-router-dom'
import "../index.css"

const Header = ({backgroundColor}) => {
  return (
    <div style={{ background: backgroundColor}}>
      <nav className='navbar' style={{ background: backgroundColor}}>
        <div className='first-child'>
       <Link to='/'> <img className='logo-image' src={logo} alt='logo'  /> </Link>
        <h2 className='logo-name'>Spotify</h2>
        </div>

        <div className='last-child'>
            <Link to='/'><h3 className='foryou'>For You</h3></Link>
            <Link to='/top' ><h3 className='foryou'>Top Tracks </h3></Link>

        </div>
       
      </nav>
    </div>
  )
}

export default Header
