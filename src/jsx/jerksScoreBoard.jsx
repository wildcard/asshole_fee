var JerkScore = React.createClass({
  render : function(){
    return (<span style={ {fontSize: getSize(this.props.score)} } key={this.props.key}>💩</span>)
  }
});

var JerkRow = React.createClass({
  jerkElm: function(score, key = 0){
    var maxSize = 30;
    var step = 2;
    var minSize = 10;
    var jerkScope = [

    ];

    function getSize(score){
      var level = Math.floor(score / 10);
      //var level = score % 10;
      return minSize;
    }

    return (<span style={ {fontSize: getSize(score)} } key={key}>💩</span>);
  },

  jerkRank: function(score){
    var maxSize = 30;
    var step = 2;
    var minSize = 10;

    var jerkScoreArr = [];

    function getCount(score){
      var level = Math.floor(score / 10);
      //var level = score % 10;
      return level;
    }

    for (var i = 0; i < getCount(score); i++) {
      jerkScoreArr.push(this.jerkElm(score, i));
    }

    return (jerkScoreArr);
  },
openModal: function(){
  $('#modal1').openModal();

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
          {this.props.jerk.badrep}
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
