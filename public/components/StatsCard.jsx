import StatsBox from './StatsBox.jsx'
import { Col, Card } from 'react-materialize';


// This is the component that represents the cards holding data on each user
class StatsCard extends React.Component{
  constructor(props){
    super(props);

    this.getTitle = this.getTitle.bind(this);
    this.getTwitterLink = this.getTwitterLink.bind(this);
    this.getScoreColor = this.getScoreColor.bind(this);
  }

  getTitle() {
    //create a capitalization prettifier for titles
    var capitalizer = str => {
      return str[0].toUpperCase() + str.slice(1).toLowerCase();
    }

    //if the sentiment score is for a user
    if (this.props.user.twitterHandle) {
      return '@' + capitalizer(this.props.user.twitterHandle);
    //if the sentiment score is for a topic
    } else if (this.props.user.topic) {
      return this.props.user.location
        ? '#' + capitalizer(this.props.user.topic) + ` (${this.props.user.location})`
        : '#' + capitalizer(this.props.user.topic);
    }
  }

  getTwitterLink() {
    //if the sentiment score is for a user
    if (this.props.user.twitterHandle) {
      return 'https://twitter.com/' + this.props.user.twitterHandle;
    //if the sentiment score is for a topic
    } else if (this.props.user.topic) {
      return 'https://twitter.com/search?q='
        + this.props.user.topic
        + '&src=typd';
    //else the sentiment score must be for a location
    } else {
      https://twitter.com/search?q=san%20francisco&src=typd
      return 'https://twitter.com/search?q='
        //IIFE to convert space delimited city names to '%20' delimited strings
        + (()=>this.props.user.location.split(' ').join('%20'))()
        + '&src=typd'
    }
  }

  getScoreColor() {
    let score = this.props.user.sentimentScore;

    //high color = green
    if (score * 1000 >= 600) {
      return '#1fff00';
    //medium color = yellow
    } else if (score < 600 && score > 0) {
      return 'yellow';
    //if score couldn't be retrieved or yielded no rating color = white
    } else if (score === 0) {
      return 'white';
    //else color = red
    } else {
      return 'red';
    }
  }

  handleRemoveEntry(event) {
    console.log('event: ', event.target);
    var id = event.target.className;
    document.getElementById(id).style.display = "none";
  }

  render(){
    // console.log('StatsCard');
  	return (
      <Col m={6} s={12}>
        <Card
          className='blue-grey darken-1 white-text'
          id={this.props.user.createdAt}
          textClassName='white-text'
          title={this.getTitle()}
          actions={[<a href={this.getTwitterLink()}>To Twitter</a>,
                    <a href="#" 
                       className={this.props.user.createdAt} 
                       onClick={this.handleRemoveEntry.bind(this)}
                       style={{color:'black',
                               'height':'50px',
                               'position':'relative',
                               'top': '-120px',
                               'left':'1515px',
                               'transform':'translateY(17%)',
                               'transform':'translateX(17%)'}}>X</a>
          ]}
        >
          <StatsBox
            score={this.props.user.sentimentScore}
            retweet={this.props.user.retweetCount}
            color={this.getScoreColor()}
            user={this.props.user}
          />
        </Card>
      </Col>
    );
   //  		<Card className='blue-grey darken-1 white-text' textClassName='white-text' title={this.props.user.twitterHandle} actions={[<a href={'http://twitter.com/' + this.props.user.twitterHandle}>To Twitter</a>]}>
   //  			<StatsBox score={this.props.user.sentimentScore} retweet={this.props.user.retweetCount} color={this.getScoreColor()} />
   //  		</Card>
			// </Col>
  	// );
  }
}

export default StatsCard;