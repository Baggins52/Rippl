import StatsNav from './StatsNav.jsx';
import StatsBody from './StatsBody.jsx';
import StatsFoot from './StatsFoot.jsx';
import StatSpinner from './StatSpinner.jsx'

// This is the component that represents the main body of the page
class Stats extends React.Component{
  constructor(props) {
  	super(props);

    this.state = {
      query: '', //entered text
      // location: '33.517269,-86.808293',
      queryType: 'twitterHandle', //twitterHandle, topic, or location
      location: undefined,
      list: [],
      spinner: false,
      conditionalQuery: ''
    }

    this.getData = this.getData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleConditionalInputChange = this.handleConditionalInputChange.bind(this);
    this.handleSearchTypeChange = this.handleSearchTypeChange.bind(this);
    this.queryHandle = this.queryHandle.bind(this);
    this.handleQueryType = this.handleQueryType.bind(this);
    this.queryTopic = this.queryTopic.bind(this);
    this.queryLocation = this.queryLocation.bind(this);
  }

  // This function gets all the user data for user RipplMaster (default user),
  // stops the spinner animation, and if there is an error displays an error message.
  getData() {
    // console.log('getting DATA');
    var username = JSON.parse(window.localStorage.profile).screen_name;
    // console.log('32', username);
    var context = this;
    $.ajax({
      method: 'GET',
      url: 'http://localhost:3000/rippl/user/'+username,
      dataType: 'json',
      success: function(data) {
        console.log('Data retrieved (ln. 41) from getData: ',data);
        context.setState({list: data.reverse(), spinner: false, error: false});
      },
      error: function(err){
        context.setState({spinner: false, error: true});
        console.log(err);
      }
    });
  }


  // Gets persisted data in storage on mounting
  componentWillMount(){
    this.getData();
  }

  // Handles changes in the input tag
  handleChange(event) {
    this.setState({query: event.target.value});
  }

  // Handles changes in the conditionally rendered input tag (for both topic/location search)
  handleConditionalInputChange(event) {
    this.setState({conditionalQuery: event.target.value});
  }

  //handles search type change (radio button selection)
  handleSearchTypeChange(event) {
    console.log('handleSearchTypeChanged called in Stats.jsx')
    this.setState({'queryType': event.target.value});
  }


  // Acts as a switch for which query type to call based on the `queryType` state variable
  handleQueryType() {
    if (this.state.queryType === 'twitterHandle') {
      this.queryHandle();
    } else {
      this.queryTopic();
    }
  }

  // Ajax request to the server to get the data for the specified TWITTERHANDLE,
  // Also starts the spinner animation, and if there is an error, displays an error message.
  queryHandle() {
    this.setState({spinner: true, error: false});
    var context = this;
    var clientUserName = JSON.parse(window.localStorage.profile).screen_name;
    var query = {
      handle: this.state.query,
      clientUserName: clientUserName
    };
    this.setState({query: ''});
    $.ajax({
      method: 'GET',
      url: 'http://localhost:3000/analyzeUser',
      dataType: 'json',
      data: query,
      success: function(data){
        context.getData();
        console.log('queryHandle succeeded')
      },
      error: function(err){
        context.setState({spinner: false, error: true});
        console.log(err);
      }
    });
  }

  // Ajax request to the server to get the data for the specified TOPIC,
  // Also starts the spinner animation, and if there is an error, displays an error message.
  queryTopic() {
    this.setState({spinner: true, error: false});
    var clientUserName = JSON.parse(window.localStorage.profile).screen_name;
    var context = this;
    var query = {
      clientUserName: clientUserName,
    };
    if (this.state.queryType === 'location') {
      query['location'] = this.state.query,
      query['topic'] = this.state.conditionalQuery
    } else {
      query['topic'] = this.state.query
    }
    console.log('inside queryTopic ---------------')
    console.log(query);
    this.setState({query: ''});
    $.ajax({
      method: 'GET',
      url: 'http://localhost:3000/analyzeTopic',
      dataType: 'json',
      data: query,
      success: function(data){
        console.log('queryTopic successful');
        context.getData();
      },
      error: function(err){
        context.setState({spinner: false, error: true});
        console.log(err);
      }
    });
  }

  // Ajax request to the server to get the data for the specificed LOCATION,
  // Also starts the spinner animation, and if there is an error, displays an error message.
  queryLocation() {

  }

  logState() {
    console.log('logState called')
    var context = this;
    console.log(context.state);
  }

  render() {
    return(
      <div>
        <StatsNav
          error={this.state.error}
          spinner={this.state.spinner}
          formVal={this.state.query}
          conditionalformVal={this.state.conditionalQuery}
          getUserClick={this.handleQueryType}
          formChange={this.handleChange}
          conditionalFormChange={this.handleConditionalInputChange}
          handleSearchTypeChange={this.handleSearchTypeChange}
        />
        <button onClick={this.logState.bind(this)}>console.log(state)</button>
        <StatsBody
          list={this.state.list}
        />
        <StatsFoot />
      </div>
    );
  }
}
export default Stats;