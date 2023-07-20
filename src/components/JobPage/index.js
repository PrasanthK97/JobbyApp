import Cookies from 'js-cookie'
import {GoLocation} from 'react-icons/go'
import {BsBriefcaseFill} from 'react-icons/bs'
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  progress: 'PROGRESS',
  failure: 'FAILURE',
}

class JobPage extends Component {
  state = {
    apiStatus: apiStatusConstants.progress,
    companyLogoUrl: '',
    companyWebsiteUrl: '',
    employmentType: '',
    JobDetailsId: '',
    jobDescription: '',

    companyDescription: '',
    lifeAtCompanyImageUrl: '',
    location: '',
    packagePerAnnum: '',
    rating: '',
    skillList: [],
    title: '',
    similarJobsList: [],
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    const ccc = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log(id, 'ccc', ccc)
    const jobPageUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {Authorization: `Bearer ${ccc}`},
      method: 'GET',
    }
    const getDetails = await fetch(jobPageUrl, options)
    const data1 = await getDetails.json()
    if (getDetails.ok === true) {
      const jobDetails = data1.job_details
      const skillsListRaw = jobDetails.skills
      const skillsList = skillsListRaw.map(each => ({
        name: each.name,
        imageUrl: each.image_url,
      }))
      const similarJobs = data1.similar_jobs
      const similarList = similarJobs.map(items => ({
        companyLogoUrlSimilar: items.company_logo_url,
        employmentTypeSimilar: items.employment_type,
        id: items.id,
        jobDescriptionSimilar: items.job_description,
        locationSimilar: items.location,
        ratingSimilar: items.rating,
        titleSimilar: items.title,
      }))
      console.log(skillsList)

      this.setState({
        companyLogoUrl: jobDetails.company_logo_url,
        companyWebsiteUrl: jobDetails.company_website_url,
        employmentType: jobDetails.employment_type,
        JobDetailsId: jobDetails.id,
        jobDescription: jobDetails.job_description,

        companyDescription: jobDetails.life_at_company.description,
        lifeAtCompanyImageUrl: jobDetails.life_at_company.image_url,
        location: jobDetails.location,
        packagePerAnnum: jobDetails.package_per_annum,
        rating: jobDetails.rating,
        skillList: skillsList,
        title: jobDetails.title,
        apiStatus: apiStatusConstants.success,
        similarJobsList: similarList,
      })

      console.log(data1)
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickRetry = () => {
    console.log('retry')
    this.getJobDetails()
  }

  renderSuccessView = () => {
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      JobDetailsId,
      jobDescription,
      lifeAtCompany,
      companyDescription,
      lifeAtCompanyImageUrl,
      location,
      packagePerAnnum,
      rating,
      skillList,
      title,
      similarJobsList,
    } = this.state

    const {
      companyLogoUrlSimilar,
      employmentTypeSimilar,
      id,
      jobDescriptionSimilar,
      locationSimilar,
      ratingSimilar,
      titleSimilar,
    } = similarJobsList
    console.log('similar', companyLogoUrlSimilar)

    return (
      <div className="jobPage-bg">
        <div className="job-card-container">
          <div className="top-layer">
            <div>
              <img
                alt="job details company logo"
                className="logo"
                src={companyLogoUrl}
              />
            </div>
            <div className="sub-top-layer">
              <p id="title">{title}</p>
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
          <h1>Skills</h1>

          <ul className="skill-container">
            {skillList.map(item => (
              <li>
                <div className="skill-card">
                  <img
                    alt={item.name}
                    className="skill-logo"
                    src={item.imageUrl}
                  />
                  <p>{item.name}</p>
                </div>
              </li>
            ))}
          </ul>
          <h1>Life At Company</h1>

          <div className="life-at-company-container">
            <p>{companyDescription}</p>
            <img
              alt="life at company"
              className="life-at-company-image"
              src={lifeAtCompanyImageUrl}
            />
          </div>
          <h1>Similar Jobs</h1>

          <ul className="similar-grand-container">
            {similarJobsList.map(items => (
              <li>
                <div className="similar-card-container">
                  <div className="similar-jobs-header">
                    <div>
                      <img
                        className="logo"
                        src={items.companyLogoUrlSimilar}
                        alt="similar job company logo"
                      />
                    </div>
                    <div className="footer">
                      <h1 id="title">{items.titleSimilar}</h1>
                      <p>{items.ratingSimilar}</p>
                    </div>
                  </div>

                  <h1>Description</h1>
                  <p>{items.jobDescriptionSimilar}</p>
                  <div className="icon-card">
                    <div className="icon-container">
                      <GoLocation />
                      <p>{items.locationSimilar}</p>
                    </div>
                    <div className="icon-container">
                      <BsBriefcaseFill />
                      <p>{items.employmentTypeSimilar}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="profile-loader-container">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button onClick={this.onClickRetry} type="button">
        Retry
      </button>
    </div>
  )

  renderJobViews = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()

      case apiStatusConstants.progress:
        return this.renderLoadingView()

      case apiStatusConstants.failure:
        return this.renderFailureView()

      default:
        return null
    }
  }

  render() {
    const {apiStatus} = this.state
    console.log('api', apiStatus)
    return (
      <>
        <Header />
        {this.renderJobViews()}
      </>
    )
  }
}

export default JobPage
