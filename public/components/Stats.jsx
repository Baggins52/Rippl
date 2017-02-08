import StatsNav from './StatsNav.jsx';
import StatsBody from './StatsBody.jsx';
import StatsFoot from './StatsFoot.jsx';
import StatSpinner from './StatSpinner.jsx'

// This is the component that represents the main body of the page
class Stats extends React.Component{
  constructor(props){
  	super(props);

    this.state = {
      query: '',
      list: [],
      spinner: false
    }


    this.getData = this.getData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.queryUser = this.queryUser.bind(this);
  }


  // This function gets all the user data for user RipplMaster (default user),
  // stops the spinner animation, and if there is an error displays an error message.
  getData() {
    console.log('getting DATA');
    var that = this;
    $.ajax({
      method: 'GET',
      url: 'http://localhost:3000/rippl/user/RipplMaster',
      dataType: 'json',
      success: function(data) {
        console.log('success! ' + {data});
        that.setState({list: data.reverse(), spinner: false, error: false});
      },
      error: function(err){
        that.setState({spinner: false, error: true});
        console.log(err);
        console.log('didnt work');
      }
    });
  }


  // Gets the data on mounting
  componentWillMount(){
    this.getData();
  }

  // Handles changes in the input tag
  handleChange(event) {
    console.log('53', event.target.value);
    this.setState({query: event.target.value});
  }


  // This function gets tells the server to get the data for the a specified user,
  // starts the spinner animation, and if there is an error displays an error message.
  queryUser() {
    this.setState({spinner: true, error: false});
    console.log('querying USER')
    var that = this;
    var query = {
      handle: this.state.query
    };
    this.setState({query: ''});
    $.ajax({
      method: 'GET',
      url: 'http://localhost:3000/analyze',
      dataType: 'json',
      data: query,
      success: function(data){
        that.getData();
        console.log('success! ' + {data});
      },
      error: function(err){
        that.setState({spinner: false, error: true});
        console.log(err);
        console.log('didnt work');
      }
    });
  }

    render() {
      return(
        <div>
          <StatsNav error={this.state.error} spinner={this.state.spinner} formVal={this.state.query} getUserClick={this.queryUser} formChange={this.handleChange}/>
          <StatsBody list={this.state.list}/>
          <StatsFoot />
        </div>
      );
    }
}
export default Stats;