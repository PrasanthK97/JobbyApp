import {Link} from 'react-router-dom'

import Header from '../Header'
import './index.css'

const Home = () => (
  <div className="home-grand-bg">
    <Header />
    <div className="content-container">
      <h1>Find The Job That Fits Your Life</h1>
      <p className="home-heading">Millions of people are searching for jobs</p>
      <Link to="/jobs">
        <button className="find-job-button">Find Jobs</button>
      </Link>
    </div>
  </div>
)

export default Home
