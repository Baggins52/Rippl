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
        console.log('48', err);
      }
    });
  }

  //converts location name to GPS coordinate string
  geoCode(callback){
    $.ajax({
      method: 'GET',
      url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + this.state.query,
      dataType: 'json',
      success: function(data) {
        console.log('geoCode success');
        var coordinates = data.results[0].geometry.location
        var coordinateString = coordinates.lat + ',' + coordinates.lng;
        console.log(coordinateString)
        callback(coordinateString);
      },
      error: function(err) {
        console.error('geoCode error');
      }
    })
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
    return this.state.queryType === 'twitterHandle'
      ? this.queryHandle()
      : this.queryTopic();
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
        console.log('107', err);
      }
    });
  }

  // Ajax request to the server to get the data for the specified TOPIC,
  // Also starts the spinner animation, and if there is an error, displays an error message.
  queryTopic() {
    this.setState({spinner: true, error: false});
    var clientUserName = JSON.parse(window.localStorage.profile).screen_name;
    var context = this;

    this.geoCode(function(geoString) {
      console.log(JSON.parse(window.localStorage.profile).screen_name)
      context.setState({spinner: true, error: false});
      var clientUserName = JSON.parse(window.localStorage.profile).screen_name;
      var query = {
        clientUserName: clientUserName,
      };
      if (context.state.queryType === 'location') {
        query['location'] = context.state.query,
        query['topic'] = context.state.conditionalQuery,
        query['coordinates'] = geoString,
        console.log('location')
        console.log(query);
      } else {
        query['topic'] = context.state.query
      }
      console.log('inside queryTopic ---------------')
      console.log(query);
      context.setState({query: ''});
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
    });
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
        <StatsBody
          list={this.state.list}
        />
        <StatsFoot />
      </div>
    );
  }
}
export default Stats;