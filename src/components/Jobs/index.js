import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import {Component} from 'react'

import {GoSearch} from 'react-icons/go'

import JobCards from '../JobCards'

import Header from '../Header'

import './index.css'

const apiStatusJobs = {
  initial: 'INITIAL',
  progress: 'PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const empList = ['Full Time', 'Part Time', 'Freelance', 'Internship']

class Jobs extends Component {
  state = {
    jobsList: [],
    inputSearch: '',
    inputType1: ['FULLTIME', 'PARTTIME', 'FREELANCE', 'INTERNSHIP'],
    inputType: [],
    apiStatus: apiStatusJobs.progress,
    emplType: '',
    salaryRange: '',
    profile: {},
  }

  componentDidMount() {
    this.tt()
    this.profileApi()
  }

  jobSearch = event => {
    this.setState({inputSearch: event.target.value})
    console.log(event.target.value.toLowerCase())
  }

  typeSelect = async event => {
    console.log(event.target.checked)
    this.setState({inputType: []})

    const {inputType, salaryRange} = this.state
    console.log('ts', inputType)
    let updatedList = [...inputType]
    const listItem = event.target.value

    if (event.target.checked) {
      updatedList = [...inputType, event.target.value]
    } else {
      updatedList.splice(inputType.indexOf(event.target.value), 1)
    }
    await this.setState({inputType: updatedList})
    this.tt()
  }

  tt = async () => {
    const {inputType, salaryRange, inputSearch} = this.state
    const cc = Cookies.get('jwt_token')
    console.log('join', inputType.join())
    const jobsUrl = `https://apis.ccbp.in/jobs?employment_type=${inputType.join()}&minimum_package=${salaryRange}&search=${inputSearch}`
    const jobsOptions = {
      headers: {Authorization: `Bearer ${cc}`},
      method: 'GET',
    }
    const jobsResponse = await fetch(jobsUrl, jobsOptions)
    const jobsData = await jobsResponse.json()
    if (jobsResponse.ok === true) {
      const jobsInJobsData = jobsData.jobs
      const formattedJobsData = jobsInJobsData.map(each => ({
        id: each.id,
        rating: each.rating,
        title: each.title,
        location: each.location,
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        jobDescription: each.job_description,
        packagePerAnnum: each.package_per_annum,
      }))
      console.log('jobs', formattedJobsData)
      this.setState({
        jobsList: formattedJobsData,
        apiStatus: apiStatusJobs.success,
      })
    } else {
      this.setState({apiStatus: apiStatusJobs.failure})
    }
  }

  profileApi = async () => {
    const {inputType, salaryRange, inputSearch} = this.state
    const cc = Cookies.get('jwt_token')
    const profileUrl = 'https://apis.ccbp.in/profile'
    const profileOptions = {
      headers: {Authorization: `Bearer ${cc}`},
      method: 'GET',
    }
    const profileResponse = await fetch(profileUrl, profileOptions)
    const profileApiData = await profileResponse.json()
    if (profileResponse.ok === true) {
      const profileData = {
        name: profileApiData.profile_details.name,
        profileImageUrl: profileApiData.profile_details.profile_image_url,
        shortBio: profileApiData.profile_details.short_bio,
      }
      this.setState({profile: profileData})
      console.log(profileData)
    } else {
      this.setState({apiStatus: apiStatusJobs.failure})
    }
  }

  retry = () => {
    this.tt()
    this.profileApi()
  }

  loadingView = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="Oval" color="#ffffff" height="50" />
    </div>
  )

  renderingSuccessView = () => {
    const {jobsList, inputSearch, inputType, profile} = this.state

    const filteredList1 = jobsList.filter(each =>
      each.title.toLowerCase().includes(inputSearch),
    )
    const filteredList2 = filteredList1.filter(
      listItem => inputType.indexOf(listItem.employmentType) > -1,
    )
    console.log('ssv', inputType)
    const filteredList = filteredList1

    return (
      <>
        <div className="jobs-bg">
          <div className="left-panel">
            <div className="profile-container">
              <img alt="profile" src={profile.profileImageUrl} />
              <h1>{profile.name}</h1>
              <p>{profile.shortBio}</p>
            </div>
            <h1>Type of Employment</h1>
            <>
              <ul>
                <input
                  onChange={this.typeSelect}
                  value="FULLTIME"
                  id="Full Time"
                  type="checkbox"
                />
                <label htmlFor="Full Time">Full Time</label>
                <input
                  onChange={this.typeSelect}
                  value="PARTTIME"
                  id="Part Time"
                  type="checkbox"
                />
                <label htmlFor="Part Time">Part Time</label>
                <input
                  onChange={this.typeSelect}
                  value="FREELANCE"
                  id="Freelance"
                  type="checkbox"
                />
                <label htmlFor="Freelance">Freelance</label>
                <input
                  onChange={this.typeSelect}
                  value="INTERNSHIP"
                  id="Internship"
                  type="checkbox"
                />
                <label htmlFor="Internship">Internship</label>
              </ul>
            </>

            <>
              <ul>
                <h1>Salary Range</h1>
                <input
                  type="radio"
                  id="10LPA"
                  name="salary"
                  value="10 LPA and above"
                />
                <label htmlFor="10LPA">10 LPA and above</label>
                <br />
                <input
                  type="radio"
                  id="20LPA"
                  name="salary"
                  value="20 LPA and above"
                />
                <label htmlFor="20LPA">20 LPA and above</label>
                <br />
                <input
                  type="radio"
                  id="30LPA"
                  name="salary"
                  value="30 LPA and above"
                />
                <label htmlFor="30LPA">30 LPA and above</label>
                <br />
                <input
                  type="radio"
                  id="40LPA"
                  name="salary"
                  value="40 LPA and above"
                />
                <label htmlFor="40LPA">40 LPA and above</label>
                <br />
              </ul>
            </>
          </div>

          <div className="right-panel">
            <input
              className="search-box"
              type="search"
              onChange={this.jobSearch}
            />
            <button data-testid="searchButton" type="button">
              <GoSearch />
            </button>
            {filteredList.length > 0 ? (
              <ul>
                {filteredList.map(eachItem => (
                  <li>
                    <JobCards jobDetails={eachItem} />
                  </li>
                ))}
              </ul>
            ) : (
              <>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
                  alt="no jobs"
                />
                <h1>No Jobs Found</h1>
                <p>We could not find any jobs. Try other filters</p>
              </>
            )}
          </div>
        </div>
      </>
    )
  }

  renderingFailureView = () => (
    <>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button onClick={this.retry} type="button">
        Retry
      </button>
    </>
  )

  apiSwitch = () => {
    const {apiStatus} = this.state
    console.log('fjdnfj', apiStatus)
    switch (apiStatus) {
      case apiStatusJobs.success:
        console.log('gnj')
        return this.renderingSuccessView()
      case apiStatusJobs.failure:
        return this.renderingFailureView()
      case apiStatusJobs.progress:
        return this.loadingView()
      default:
        return <p>dsfk</p>
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.apiSwitch()}
      </>
    )
  }
}

export default Jobs
