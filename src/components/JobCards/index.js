import './index.css'
import {Link} from 'react-router-dom'

const JobCards = props => {
  const {jobDetails} = props
  const {
    id,
    rating,
    title,
    location,
    companyLogoUrl,
    employmentType,
    jobDescription,
    packagePerAnnum,
  } = jobDetails

  return (
    <Link to={`/jobs/${id}`}>
      <div className="card-container">
        <div className="top-layer">
          <div>
            <img alt="company logo" className="logo" src={companyLogoUrl} />
          </div>
          <div className="sub-top-layer">
            <h1 id="title">{title}</h1>
            <p>{rating}</p>
          </div>
        </div>
        <div className="middle-layer">
          <div className="sub-middle-layer">
            <p>{location}</p>
            <p id="type">{employmentType}</p>
          </div>
          <div>
            <p>{packagePerAnnum}</p>
          </div>
        </div>
        <hr />
        <h1>Description</h1>
        <p>{jobDescription}</p>
      </div>
    </Link>
  )
}

export default JobCards
