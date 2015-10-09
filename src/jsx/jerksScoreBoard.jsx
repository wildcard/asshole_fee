var JerkScore = React.createClass({
  render : function(){
    return (<span key={this.props.key}>💩</span>);
  }
});

var JerkRank = React.createClass({
  getCount: function(score){
return score;

  },
  render : function(){
    var score = this.props.score;

    var indents = [];
    for (var i = 0; i < this.getCount(score); i++) {
      indents.push(<JerkScore key={i}/>);
    }
    return (
       <div>
        {indents}
       </div>
    );
  }
});

var JerkRow = React.createClass({
openModal: function(){
  $('#modal1').openModal();
  $('#payment-form').val(this.props.jerk.licensePlate);
},
  render: function() {
    return (
      <tr>
        <td>
          <div className="card-panel btn amber">
            <span>{this.props.jerk.licensePlate}</span>
          </div>
        </td>
        <td>
          <ul>
            <JerkRank score={this.props.jerk.badrep} />
          </ul>
        </td>
        <td>
          <button className="btn waves-effect waves-light modal-trigger" href="#modal1" onClick={this.openModal}>
            Redeem yourself 🙏
          </button>
        </td>
      </tr>
    );
  }
});

var JerksTable = React.createClass({
  render: function() {
    var rows = [];
    this.props.jerks.forEach(function(jerk) {
        rows.push(<JerkRow jerk={jerk} key={jerk.licensePlate} />);
      });

    return (
      <table className="centered">
        <thead>
          <tr>
            <th data-field="lp">License plate</th>
            <th data-field="bad rep">bad rep 😈</th>
            <th data-field="pay">fix your reputation maybe? 💩</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
});

var JerksScoreBoard = React.createClass({
  getInitialState: function() {
    return {
      data : []
    }
  },
  loadFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {

        this.setState({
          data: this.parseDataToJerks(data)
          //data: data
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }
    });
  },
  parseDataToJerks: function(data) {
    var jerks_arr = [];

    $.each(data, function(key, value) {
        jerks_arr.push({
          licensePlate: key,
          badrep: value
        });
      });

      return jerks_arr;
  },
  componentDidMount: function() {
    this.loadFromServer();
    var self = this;
    // sub to pusher
    var channel = window.pusher.subscribe('test_channel');
			channel.bind('a_jerk', function(data) {
      console.log(data);

      var newState = [];
        var itemIndex = _.findIndex(self.state.data, function(obj) { return obj.licensePlate === data.jerkId  });

      if(itemIndex > 0){
        //var item = _.find(self.state.data, function(o){ retrun data.jerkId === o.licensePlate });
        console.log("returning jerk", itemIndex);
        var updatedJerk = self.state.data[itemIndex] = { licensePlate: data.jerkId, badrep: data.score };

        newState = { data: self.state.data };
        console.log(self.state);
      } else {
        newState = React.addons.update(self.state, {
              data : {
                $push : [{
                  licensePlate: data.jerkId,
                  badrep: data.score}]
              }
          });
      }

        self.setState(newState);
		});
  },
render: function(){
    //var jerksData = this.parseDataToJerks(this.state.data);
    var jerksData = this.state.data;
    return(<JerksTable jerks = { jerksData } />);
  }
});

ReactDOM.render(<JerksScoreBoard url="/list" />, document.getElementById('shame-score'));
